import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import { query } from './api/lib/db.js';
import { ensureTablesExist } from './api/lib/initSchema.js';
import { generateToken, extractAuthUser } from './api/lib/authHelpers.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Middleware: Normalize URL path for Vercel serverless & local routes
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/favicon.ico')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Ensure database tables exist
ensureTablesExist().catch(console.error);

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'p0lfuced',
  api_key: process.env.CLOUDINARY_API_KEY || '815187973111287',
  api_secret: process.env.CLOUDINARY_API_SECRET || '7BogullHcPNTBEedtYfTIAk_g5g'
});

// Middleware: Require Auth
function requireAuth(req, res, next) {
  const user = extractAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  req.user = user;
  next();
}

// ── Auth Endpoints ─────────────────────────────────────────────────────────

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const newUser = { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() };
    const token = generateToken(newUser);

    res.json({ token, user: newUser });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userData = { id: user.id, name: user.name, email: user.email };
    const token = generateToken(userData);

    res.json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// ── Generic Section Storage Endpoints ─────────────────────────────────────

app.get('/api/sections/:sectionId', requireAuth, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const rows = await query(
      'SELECT data FROM planner_sections WHERE user_id = ? AND section_id = ?',
      [req.user.userId, sectionId]
    );
    if (rows.length === 0) {
      return res.json({ data: null });
    }
    const parsedData = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
    res.json({ data: parsedData });
  } catch (err) {
    console.error('Get section error:', err);
    res.status(500).json({ error: 'Failed to fetch section data.' });
  }
});

app.post('/api/sections/:sectionId', requireAuth, async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { data } = req.body;
    const jsonStr = JSON.stringify(data || []);

    const existing = await query(
      'SELECT id FROM planner_sections WHERE user_id = ? AND section_id = ?',
      [req.user.userId, sectionId]
    );

    if (existing.length > 0) {
      await query(
        'UPDATE planner_sections SET data = ? WHERE user_id = ? AND section_id = ?',
        [jsonStr, req.user.userId, sectionId]
      );
    } else {
      await query(
        'INSERT INTO planner_sections (user_id, section_id, data) VALUES (?, ?, ?)',
        [req.user.userId, sectionId, jsonStr]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Save section error:', err);
    res.status(500).json({ error: 'Failed to save section data.' });
  }
});

// ── Quick Logs Endpoints ───────────────────────────────────────────────────

app.get('/api/quick-logs', requireAuth, async (req, res) => {
  try {
    const logs = await query(
      'SELECT * FROM quick_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    res.json({ logs });
  } catch (err) {
    console.error('Quick log fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch quick logs.' });
  }
});

app.post('/api/quick-logs', requireAuth, async (req, res) => {
  try {
    const { content, category } = req.body;
    if (!content) return res.status(400).json({ error: 'Log content is required.' });

    const result = await query(
      'INSERT INTO quick_logs (user_id, content, category) VALUES (?, ?, ?)',
      [req.user.userId, content, category || 'General']
    );

    res.json({ id: result.insertId, content, category: category || 'General', created_at: new Date() });
  } catch (err) {
    console.error('Quick log create error:', err);
    res.status(500).json({ error: 'Failed to create quick log.' });
  }
});

app.delete('/api/quick-logs/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM quick_logs WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete log.' });
  }
});

// ── Files & Cloudinary Upload Endpoints ───────────────────────────────────

app.get('/api/files', requireAuth, async (req, res) => {
  try {
    const files = await query(
      'SELECT * FROM uploaded_files WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch files.' });
  }
});

app.post('/api/files/upload', requireAuth, async (req, res) => {
  try {
    const { file_base64, file_name, section_category, notes } = req.body;
    if (!file_base64) return res.status(400).json({ error: 'File data is required.' });

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(file_base64, {
      folder: `bezawit_planner/${req.user.userId}`,
      resource_type: 'auto'
    });

    const result = await query(
      `INSERT INTO uploaded_files (user_id, file_name, file_url, file_type, size_bytes, section_category, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        file_name || uploadRes.original_filename || 'Uploaded File',
        uploadRes.secure_url,
        uploadRes.resource_type || 'image',
        uploadRes.bytes || 0,
        section_category || 'General',
        notes || ''
      ]
    );

    res.json({
      id: result.insertId,
      file_name: file_name || 'Uploaded File',
      file_url: uploadRes.secure_url,
      file_type: uploadRes.resource_type || 'image',
      section_category: section_category || 'General',
      notes: notes || ''
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ error: err.message || 'File upload failed.' });
  }
});

app.delete('/api/files/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM uploaded_files WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file.' });
  }
});

// ── Finance: Cashflow Endpoints ─────────────────────────────────────────────

app.get('/api/finance/cashflow', requireAuth, async (req, res) => {
  try {
    const entries = await query(
      'SELECT * FROM cashflow_entries WHERE user_id = ? ORDER BY date DESC, created_at DESC',
      [req.user.userId]
    );
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cashflow entries.' });
  }
});

app.post('/api/finance/cashflow', requireAuth, async (req, res) => {
  try {
    const { id, entry_type, name, amount, category, date, notes } = req.body;
    if (!entry_type || !name) return res.status(400).json({ error: 'Type and name are required.' });

    if (id) {
      await query(
        `UPDATE cashflow_entries
         SET entry_type = ?, name = ?, amount = ?, category = ?, date = ?, notes = ?
         WHERE id = ? AND user_id = ?`,
        [entry_type, name, Number(amount) || 0, category || 'General', date || null, notes || '', id, req.user.userId]
      );
      res.json({ id, entry_type, name, amount: Number(amount) || 0, category, date, notes });
    } else {
      const result = await query(
        `INSERT INTO cashflow_entries (user_id, entry_type, name, amount, category, date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.userId, entry_type, name, Number(amount) || 0, category || 'General', date || null, notes || '']
      );
      res.json({ id: result.insertId, entry_type, name, amount: Number(amount) || 0, category, date, notes });
    }
  } catch (err) {
    console.error('Save cashflow error:', err);
    res.status(500).json({ error: 'Failed to save cashflow entry.' });
  }
});

app.delete('/api/finance/cashflow/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM cashflow_entries WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cashflow entry.' });
  }
});

// ── Finance: Budget Endpoints ───────────────────────────────────────────────

app.get('/api/finance/budget', requireAuth, async (req, res) => {
  try {
    const monthKey = req.query.month || new Date().toISOString().substring(0, 7);
    const entries = await query(
      'SELECT * FROM budget_entries WHERE user_id = ? AND month_key = ? ORDER BY created_at ASC',
      [req.user.userId, monthKey]
    );
    res.json({ entries, monthKey });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch budget entries.' });
  }
});

app.post('/api/finance/budget', requireAuth, async (req, res) => {
  try {
    const { month_key, entry_type, category, description, amount } = req.body;
    if (!month_key || !entry_type || !description) {
      return res.status(400).json({ error: 'Month, type, and description are required.' });
    }

    const result = await query(
      `INSERT INTO budget_entries (user_id, month_key, entry_type, category, description, amount)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [req.user.userId, month_key, entry_type, category || 'General', description, Number(amount) || 0]
    );

    res.json({ id: result.insertId, month_key, entry_type, category, description, amount: Number(amount) || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save budget entry.' });
  }
});

app.delete('/api/finance/budget/:id', requireAuth, async (req, res) => {
  try {
    await query('DELETE FROM budget_entries WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete budget entry.' });
  }
});

app.get('/api/finance/budget/year-report', requireAuth, async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const rows = await query(
      `SELECT month_key, entry_type, SUM(amount) as total
       FROM budget_entries
       WHERE user_id = ? AND month_key LIKE ?
       GROUP BY month_key, entry_type`,
      [req.user.userId, `${year}-%`]
    );
    res.json({ report: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate budget report.' });
  }
});

// ── Habit Reports Endpoints ─────────────────────────────────────────────────

app.get('/api/habits/reports', requireAuth, async (req, res) => {
  try {
    const reports = await query(
      'SELECT * FROM habit_reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
      [req.user.userId]
    );
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch habit reports.' });
  }
});

app.post('/api/habits/reports', requireAuth, async (req, res) => {
  try {
    const { report_type, period_key, summary_json } = req.body;
    const result = await query(
      'INSERT INTO habit_reports (user_id, report_type, period_key, summary_json) VALUES (?, ?, ?, ?)',
      [req.user.userId, report_type || 'weekly', period_key, JSON.stringify(summary_json || {})]
    );
    res.json({ id: result.insertId, success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save habit report.' });
  }
});

// ── User Theme Endpoints ─────────────────────────────────────────────────────

app.get('/api/theme', requireAuth, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM user_themes WHERE user_id = ?', [req.user.userId]);
    if (rows.length === 0) {
      return res.json({
        theme: {
          bg_wallpaper: '',
          bg_color: '#FFFFFF',
          text_color: '#1A1A2E',
          font_family: 'Inter',
          accent_color: '#F9A8C9',
          custom_theme_json: {}
        }
      });
    }
    res.json({ theme: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch theme.' });
  }
});

app.post('/api/theme', requireAuth, async (req, res) => {
  try {
    const { bg_wallpaper, bg_color, text_color, font_family, accent_color, custom_theme_json } = req.body;
    const jsonStr = JSON.stringify(custom_theme_json || {});

    const existing = await query('SELECT id FROM user_themes WHERE user_id = ?', [req.user.userId]);
    if (existing.length > 0) {
      await query(
        `UPDATE user_themes
         SET bg_wallpaper = ?, bg_color = ?, text_color = ?, font_family = ?, accent_color = ?, custom_theme_json = ?
         WHERE user_id = ?`,
        [bg_wallpaper || '', bg_color || '#FFFFFF', text_color || '#1A1A2E', font_family || 'Inter', accent_color || '#F9A8C9', jsonStr, req.user.userId]
      );
    } else {
      await query(
        `INSERT INTO user_themes (user_id, bg_wallpaper, bg_color, text_color, font_family, accent_color, custom_theme_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.userId, bg_wallpaper || '', bg_color || '#FFFFFF', text_color || '#1A1A2E', font_family || 'Inter', accent_color || '#F9A8C9', jsonStr]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Save theme error:', err);
    res.status(500).json({ error: 'Failed to save theme.' });
  }
});

// Start local listener only when not running in Vercel Serverless environment
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Backend Express server running on port ${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Notice] Port ${PORT} is already active/in use. Reusing existing running backend.`);
    } else {
      console.error('Server error:', err);
    }
  });
}

export default app;
