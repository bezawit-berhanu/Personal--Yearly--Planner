import { query } from './db.js';

let initialized = false;

export async function ensureTablesExist() {
  if (initialized) return;

  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS planner_sections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      section_id VARCHAR(100) NOT NULL,
      data JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_section (user_id, section_id)
    )`,

    `CREATE TABLE IF NOT EXISTS quick_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_logs (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS uploaded_files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      file_name VARCHAR(255) NOT NULL,
      file_url TEXT NOT NULL,
      file_type VARCHAR(100) DEFAULT 'other',
      size_bytes INT DEFAULT 0,
      section_category VARCHAR(100) DEFAULT 'General',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_files (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS cashflow_entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      entry_type ENUM('Asset', 'Liability', 'Income', 'Expense') NOT NULL,
      name VARCHAR(255) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      category VARCHAR(100) DEFAULT 'General',
      date DATE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_cashflow (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS budget_entries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      month_key CHAR(7) NOT NULL,
      entry_type ENUM('Income', 'Expense', 'Savings', 'Investment') NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      description VARCHAR(255) NOT NULL,
      amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_budget (user_id, month_key)
    )`,

    `CREATE TABLE IF NOT EXISTS habit_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      report_type ENUM('weekly', 'monthly') NOT NULL,
      period_key VARCHAR(50) NOT NULL,
      summary_json JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_habit_reports (user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS user_themes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      bg_wallpaper TEXT,
      bg_color VARCHAR(50) DEFAULT '#FFFFFF',
      text_color VARCHAR(50) DEFAULT '#1A1A2E',
      font_family VARCHAR(100) DEFAULT 'Inter',
      accent_color VARCHAR(50) DEFAULT '#F9A8C9',
      custom_theme_json JSON,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  ];

  for (const statement of tables) {
    try {
      await query(statement);
    } catch (err) {
      // Handled in query wrapper
    }
  }

  initialized = true;
}
