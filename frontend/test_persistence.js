import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_BASE = 'http://localhost:3001/api';

async function runPersistenceTests() {
  console.log('=== STARTING DATABASE PERSISTENCE END-TO-END VERIFICATION ===\n');

  // Direct DB Connection for independent verification
  const dbConn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  console.log('✔ Direct TiDB Cloud Connection established.');

  // Test User Login / Auth
  const testEmail = `test_persistence_${Date.now()}@example.com`;
  let token = '';
  let userId = null;

  try {
    const regRes = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Persistence Tester',
      email: testEmail,
      password: 'password123'
    });
    token = regRes.data.token;
    userId = regRes.data.user.id;
    console.log(`✔ Auth Register successful. Test User ID: ${userId}`);
  } catch (err) {
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    token = loginRes.data.token;
    userId = loginRes.data.user.id;
    console.log(`✔ Auth Login successful. Test User ID: ${userId}`);
  }

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // ── TEST 1: Generic Planner Section (e.g. Goals & Tasks) ───────────────────
  console.log('\n--- TEST 1: PLANNER SECTION PERSISTENCE (goals) ---');
  const initialGoals = [
    { id: 101, title: 'Master AI Agentic Coding', status: 'In Progress', progress: 85, category: 'Career', priority: 'High', deadline: '2027-12-31' },
    { id: 102, title: 'Build Scalable SaaS App', status: 'Not Started', progress: 0, category: 'Business', priority: 'High', deadline: '2027-06-30' }
  ];

  // 1. Save Section
  await axios.post(`${API_BASE}/sections/goals`, { data: initialGoals }, authHeaders);
  console.log('✔ Frontend POST /api/sections/goals sent successfully.');

  // 2. Direct DB verification
  const [dbGoalRows] = await dbConn.execute(
    'SELECT data FROM planner_sections WHERE user_id = ? AND section_id = ?',
    [userId, 'goals']
  );
  if (dbGoalRows.length === 0) throw new Error('❌ FAILED: goals section not found in TiDB Cloud database!');
  const savedData = typeof dbGoalRows[0].data === 'string' ? JSON.parse(dbGoalRows[0].data) : dbGoalRows[0].data;
  console.log(`✔ DB VERIFICATION: Found ${savedData.length} goals in TiDB Cloud planner_sections table.`);

  // 3. Reload Test (GET from API)
  const getGoalsRes = await axios.get(`${API_BASE}/sections/goals`, authHeaders);
  console.log(`✔ RELOAD TEST: GET /api/sections/goals returned ${getGoalsRes.data.data.length} items.`);

  // 4. Update Section (Update field)
  const updatedGoals = savedData.map(g => g.id === 101 ? { ...g, progress: 95, status: 'Completed' } : g);
  await axios.post(`${API_BASE}/sections/goals`, { data: updatedGoals }, authHeaders);

  const [dbGoalUpdated] = await dbConn.execute(
    'SELECT data FROM planner_sections WHERE user_id = ? AND section_id = ?',
    [userId, 'goals']
  );
  const updatedData = typeof dbGoalUpdated[0].data === 'string' ? JSON.parse(dbGoalUpdated[0].data) : dbGoalUpdated[0].data;
  const updatedGoalItem = updatedData.find(g => g.id === 101);
  if (updatedGoalItem.progress !== 95) throw new Error('❌ FAILED: Updated goal progress not persisted in TiDB Cloud!');
  console.log(`✔ UPDATE VERIFICATION: Goal #101 updated to progress=${updatedGoalItem.progress} in TiDB Cloud.`);

  // ── TEST 2: Quick Logs ──────────────────────────────────────────────────────
  console.log('\n--- TEST 2: QUICK LOGS PERSISTENCE ---');
  const logContent = `Automated persistence check at ${new Date().toISOString()}`;
  const createLogRes = await axios.post(`${API_BASE}/quick-logs`, { content: logContent, category: 'dashboard' }, authHeaders);
  const logId = createLogRes.data.id;
  console.log(`✔ Created Quick Log. ID: ${logId}`);

  // DB verify
  const [logRows] = await dbConn.execute('SELECT * FROM quick_logs WHERE id = ?', [logId]);
  if (logRows.length === 0) throw new Error('❌ FAILED: Quick log record not found in TiDB Cloud database!');
  console.log(`✔ DB VERIFICATION: Quick log record #${logId} exists in TiDB Cloud quick_logs table.`);

  // Delete log test
  await axios.delete(`${API_BASE}/quick-logs/${logId}`, authHeaders);
  const [deletedLogRows] = await dbConn.execute('SELECT * FROM quick_logs WHERE id = ?', [logId]);
  if (deletedLogRows.length !== 0) throw new Error('❌ FAILED: Quick log was not deleted from TiDB Cloud database!');
  console.log(`✔ DELETE VERIFICATION: Quick log #${logId} successfully deleted from TiDB Cloud.`);

  // ── TEST 3: Cashflow Financial Statements ──────────────────────────────────
  console.log('\n--- TEST 3: CASHFLOW ENTRIES PERSISTENCE ---');
  const cashflowRes = await axios.post(`${API_BASE}/finance/cashflow`, {
    entry_type: 'Asset',
    name: 'Real Estate Investment',
    amount: 150000.00,
    category: 'Real Estate',
    notes: 'Primary residential property asset'
  }, authHeaders);
  const cashflowId = cashflowRes.data.id;
  console.log(`✔ Created Cashflow Entry. ID: ${cashflowId}`);

  const [cashflowRows] = await dbConn.execute('SELECT * FROM cashflow_entries WHERE id = ?', [cashflowId]);
  if (cashflowRows.length === 0) throw new Error('❌ FAILED: Cashflow record not found in TiDB Cloud!');
  console.log(`✔ DB VERIFICATION: Cashflow record #${cashflowId} exists with amount $${cashflowRows[0].amount}.`);

  await axios.delete(`${API_BASE}/finance/cashflow/${cashflowId}`, authHeaders);
  const [delCashflowRows] = await dbConn.execute('SELECT * FROM cashflow_entries WHERE id = ?', [cashflowId]);
  if (delCashflowRows.length !== 0) throw new Error('❌ FAILED: Cashflow record was not deleted!');
  console.log(`✔ DELETE VERIFICATION: Cashflow entry #${cashflowId} deleted from TiDB Cloud.`);

  // ── TEST 4: Monthly Budget Log ─────────────────────────────────────────────
  console.log('\n--- TEST 4: BUDGET ENTRIES PERSISTENCE ---');
  const monthKey = '2027-03';
  const budgetRes = await axios.post(`${API_BASE}/finance/budget`, {
    month_key: monthKey,
    entry_type: 'Expense',
    category: 'Utilities & Bills',
    description: 'High-speed Fiber Internet',
    amount: 65.00
  }, authHeaders);
  const budgetId = budgetRes.data.id;
  console.log(`✔ Created Budget Entry. ID: ${budgetId}`);

  const [budgetRows] = await dbConn.execute('SELECT * FROM budget_entries WHERE id = ?', [budgetId]);
  if (budgetRows.length === 0) throw new Error('❌ FAILED: Budget entry not found in TiDB Cloud!');
  console.log(`✔ DB VERIFICATION: Budget entry #${budgetId} exists in month ${budgetRows[0].month_key}.`);

  await axios.delete(`${API_BASE}/finance/budget/${budgetId}`, authHeaders);
  const [delBudgetRows] = await dbConn.execute('SELECT * FROM budget_entries WHERE id = ?', [budgetId]);
  if (delBudgetRows.length !== 0) throw new Error('❌ FAILED: Budget entry was not deleted!');
  console.log(`✔ DELETE VERIFICATION: Budget entry #${budgetId} deleted from TiDB Cloud.`);

  // ── TEST 5: User Theme Settings ─────────────────────────────────────────────
  console.log('\n--- TEST 5: USER THEME PERSISTENCE ---');
  await axios.post(`${API_BASE}/theme`, {
    bg_wallpaper: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    bg_color: '#FDFBF7',
    text_color: '#111827',
    font_family: 'Playfair Display',
    accent_color: '#EC4899',
    custom_theme_json: { blur_intensity: '12px', transparency: '0.85' }
  }, authHeaders);
  console.log('✔ POST /api/theme updated theme settings.');

  const [themeRows] = await dbConn.execute('SELECT * FROM user_themes WHERE user_id = ?', [userId]);
  if (themeRows.length === 0) throw new Error('❌ FAILED: User theme record not found in TiDB Cloud!');
  console.log(`✔ DB VERIFICATION: User theme recorded in TiDB Cloud with font "${themeRows[0].font_family}".`);

  await dbConn.end();
  console.log('\n=============================================================');
  console.log('🎉 ALL DATABASE PERSISTENCE VERIFICATION TESTS PASSED 100%! 🎉');
  console.log('=============================================================\n');
}

runPersistenceTests().catch(err => {
  console.error('\n❌ PERSISTENCE TEST ERROR:', err.response?.data || err.message || err);
  process.exit(1);
});
