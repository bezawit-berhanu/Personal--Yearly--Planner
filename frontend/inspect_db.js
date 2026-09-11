import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function inspect() {
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: false }
  });

  const tables = ['users', 'planner_sections', 'quick_logs', 'uploaded_files', 'cashflow_entries', 'budget_entries', 'habit_reports', 'user_themes'];

  console.log('--- DATABASE TABLES & COUNT ---');
  for (const t of tables) {
    const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM ${t}`);
    console.log(`${t}: ${rows[0].count} rows`);
  }

  console.log('\n--- USERS ---');
  const [users] = await conn.execute('SELECT id, name, email, created_at FROM users');
  console.log(users);

  console.log('\n--- PLANNER SECTIONS ---');
  const [sections] = await conn.execute('SELECT id, user_id, section_id, CHAR_LENGTH(data) as data_len, created_at, updated_at FROM planner_sections');
  console.log(sections);

  console.log('\n--- QUICK LOGS ---');
  const [logs] = await conn.execute('SELECT * FROM quick_logs LIMIT 10');
  console.log(logs);

  console.log('\n--- FILES ---');
  const [files] = await conn.execute('SELECT id, user_id, file_name, created_at FROM uploaded_files LIMIT 10');
  console.log(files);

  await conn.end();
}

inspect().catch(console.error);
