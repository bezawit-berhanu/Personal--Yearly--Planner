import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let pool;
let useLocalFallback = false;
const LOCAL_DB_PATH = path.resolve('api/lib/local_db.json');

function readLocalDb() {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8'));
    }
  } catch (e) {}
  return {
    users: [],
    planner_sections: [],
    quick_logs: [],
    uploaded_files: [],
    cashflow_entries: [],
    budget_entries: [],
    habit_reports: [],
    user_themes: []
  };
}

function writeLocalDb(data) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write local db fallback:', e);
  }
}

export function getPool() {
  if (!pool) {
    let targetDb = process.env.TIDB_DATABASE ? process.env.TIDB_DATABASE.trim() : '';
    if (!targetDb || targetDb === 'sys' || targetDb === 'information_schema') {
      targetDb = 'bezawit_planner';
    }

    pool = mysql.createPool({
      host: (process.env.TIDB_HOST && process.env.TIDB_HOST.trim()) || 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
      port: Number(process.env.TIDB_PORT) || 4000,
      user: (process.env.TIDB_USER && process.env.TIDB_USER.trim()) || '31FwaATgxkvo1q9.root',
      password: (process.env.TIDB_PASSWORD && process.env.TIDB_PASSWORD.trim()) || 'pPtt3fgQ7zow5INT',
      database: targetDb,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000
    });
  }
  return pool;
}

export async function query(sql, params = [], isRetry = false) {
  try {
    const dbPool = getPool();
    const [results] = await dbPool.execute(sql, params);
    return results;
  } catch (err) {
    if (!isRetry && (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST')) {
      console.warn(`[DB Connection Warmup] TiDB Cloud transient issue (${err.code}). Retrying in 1s...`);
      await new Promise(res => setTimeout(res, 1000));
      return query(sql, params, true);
    }
    console.error(`[Database Error] Code: ${err.code || 'UNKNOWN'}, Message: ${err.message}. Query: "${sql.slice(0, 80)}..."`);
    if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.warn(`[DB Fallback Notice] TiDB Cloud connection issue (${err.code}). Using local fallback.`);
      return localQueryFallback(sql, params);
    }
    throw err;
  }
}

function localQueryFallback(sql, params = []) {
  const db = readLocalDb();
  const lowerSql = sql.trim().toLowerCase();

  // 1. SELECT users WHERE email = ?
  if (lowerSql.startsWith('select * from users where email')) {
    const email = String(params[0] || '').toLowerCase().trim();
    return db.users.filter(u => u.email === email);
  }
  if (lowerSql.startsWith('select id from users where email')) {
    const email = String(params[0] || '').toLowerCase().trim();
    return db.users.filter(u => u.email === email).map(u => ({ id: u.id }));
  }

  // 2. INSERT INTO users
  if (lowerSql.startsWith('insert into users')) {
    const id = Date.now();
    const newUser = { id, name: params[0], email: params[1], password_hash: params[2], created_at: new Date() };
    db.users.push(newUser);
    writeLocalDb(db);
    return { insertId: id };
  }

  // 3. SELECT data FROM planner_sections
  if (lowerSql.startsWith('select data from planner_sections')) {
    const userId = params[0];
    const sectionId = params[1];
    const item = db.planner_sections.find(s => s.user_id === userId && s.section_id === sectionId);
    return item ? [{ data: item.data }] : [];
  }
  if (lowerSql.startsWith('select id from planner_sections')) {
    const userId = params[0];
    const sectionId = params[1];
    return db.planner_sections.filter(s => s.user_id === userId && s.section_id === sectionId).map(s => ({ id: s.id }));
  }
  if (lowerSql.startsWith('insert into planner_sections')) {
    const id = Date.now();
    db.planner_sections.push({ id, user_id: params[0], section_id: params[1], data: params[2] });
    writeLocalDb(db);
    return { insertId: id };
  }
  if (lowerSql.startsWith('update planner_sections')) {
    const userId = params[1];
    const sectionId = params[2];
    const item = db.planner_sections.find(s => s.user_id === userId && s.section_id === sectionId);
    if (item) item.data = params[0];
    else db.planner_sections.push({ id: Date.now(), user_id: userId, section_id: sectionId, data: params[0] });
    writeLocalDb(db);
    return { affectedRows: 1 };
  }

  // 4. Quick logs
  if (lowerSql.startsWith('select * from quick_logs')) {
    return db.quick_logs.filter(l => l.user_id === params[0]);
  }
  if (lowerSql.startsWith('insert into quick_logs')) {
    const id = Date.now();
    db.quick_logs.unshift({ id, user_id: params[0], content: params[1], category: params[2], created_at: new Date() });
    writeLocalDb(db);
    return { insertId: id };
  }
  if (lowerSql.startsWith('delete from quick_logs')) {
    db.quick_logs = db.quick_logs.filter(l => !(l.id == params[0] && l.user_id == params[1]));
    writeLocalDb(db);
    return { affectedRows: 1 };
  }

  // 5. Uploaded files
  if (lowerSql.startsWith('select * from uploaded_files')) {
    return db.uploaded_files.filter(f => f.user_id === params[0]);
  }
  if (lowerSql.startsWith('insert into uploaded_files')) {
    const id = Date.now();
    const newFile = {
      id, user_id: params[0], file_name: params[1], file_url: params[2],
      file_type: params[3], size_bytes: params[4], section_category: params[5],
      notes: params[6], created_at: new Date()
    };
    db.uploaded_files.unshift(newFile);
    writeLocalDb(db);
    return { insertId: id };
  }
  if (lowerSql.startsWith('delete from uploaded_files')) {
    db.uploaded_files = db.uploaded_files.filter(f => !(f.id == params[0] && f.user_id == params[1]));
    writeLocalDb(db);
    return { affectedRows: 1 };
  }

  // 6. Cashflow entries
  if (lowerSql.startsWith('select * from cashflow_entries')) {
    return db.cashflow_entries.filter(c => c.user_id === params[0]);
  }
  if (lowerSql.startsWith('insert into cashflow_entries')) {
    const id = Date.now();
    db.cashflow_entries.unshift({
      id, user_id: params[0], entry_type: params[1], name: params[2],
      amount: params[3], category: params[4], date: params[5], notes: params[6],
      created_at: new Date()
    });
    writeLocalDb(db);
    return { insertId: id };
  }
  if (lowerSql.startsWith('delete from cashflow_entries')) {
    db.cashflow_entries = db.cashflow_entries.filter(c => !(c.id == params[0] && c.user_id == params[1]));
    writeLocalDb(db);
    return { affectedRows: 1 };
  }

  // 7. Budget entries
  if (lowerSql.startsWith('select * from budget_entries')) {
    return db.budget_entries.filter(b => b.user_id === params[0] && b.month_key === params[1]);
  }
  if (lowerSql.startsWith('insert into budget_entries')) {
    const id = Date.now();
    db.budget_entries.push({
      id, user_id: params[0], month_key: params[1], entry_type: params[2],
      category: params[3], description: params[4], amount: params[5], created_at: new Date()
    });
    writeLocalDb(db);
    return { insertId: id };
  }
  if (lowerSql.startsWith('delete from budget_entries')) {
    db.budget_entries = db.budget_entries.filter(b => !(b.id == params[0] && b.user_id == params[1]));
    writeLocalDb(db);
    return { affectedRows: 1 };
  }

  // 8. Habit reports & Themes
  if (lowerSql.startsWith('select * from user_themes')) {
    return db.user_themes.filter(t => t.user_id === params[0]);
  }
  if (lowerSql.startsWith('insert into user_themes') || lowerSql.startsWith('update user_themes')) {
    const userId = params[0] || params[6];
    let theme = db.user_themes.find(t => t.user_id === userId);
    if (!theme) {
      theme = { id: Date.now(), user_id: userId };
      db.user_themes.push(theme);
    }
    theme.bg_wallpaper = params[0];
    theme.bg_color = params[1];
    theme.text_color = params[2];
    theme.font_family = params[3];
    theme.accent_color = params[4];
    theme.custom_theme_json = params[5];
    writeLocalDb(db);
    return { insertId: theme.id };
  }

  return [];
}
