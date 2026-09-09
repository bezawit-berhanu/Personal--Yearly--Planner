import { useState, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import StatCard from '../shared/StatCard';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import { Plus, Clock, Sparkles, Send, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { db, navigateTo } = usePlannerContext();

  const [logContent, setLogContent] = useState('');
  const [logCategory, setLogCategory] = useState('dailyPlanner');
  const [quickLogs, setQuickLogs] = useState([]);
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    api.get('/quick-logs')
      .then(res => setQuickLogs(res.data.logs || []))
      .catch(console.error);
  }, []);

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!logContent.trim()) return;
    setLogging(true);
    try {
      const res = await api.post('/quick-logs', {
        content: logContent.trim(),
        category: logCategory
      });
      setQuickLogs([res.data, ...quickLogs]);
      setLogContent('');
    } catch (err) {
      console.error('Failed to log entry:', err);
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.delete(`/quick-logs/${id}`);
      setQuickLogs(quickLogs.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete log:', err);
    }
  };

  const allCategoryOptions = NAV_GROUPS.flatMap(g => g.items);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-pink-700 bg-pink-50/90 border border-pink-200 px-2 py-0.5 rounded-sm">
            Full-Stack TiDB System
          </span>
          <h2 className="font-serif text-2xl font-bold text-slate-900 mt-2">
            Welcome back, {user?.name || 'Bezawit'} 👋
          </h2>
          <p className="text-xs font-semibold text-slate-700 mt-0.5">
            Log anything quickly below or navigate to any section. All data is backed up to your TiDB database.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => navigateTo('files')} className="btn-secondary text-xs">
            📄 Upload Files / Scans
          </button>
          <button onClick={() => navigateTo('appearance')} className="btn-primary text-xs">
            ✨ Change Theme
          </button>
        </div>
      </div>

      {/* QUICK LOG ANYTHING SECTION */}
      <div className="glass-card p-5 rounded-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <h3 className="font-serif text-base font-bold text-slate-900">Quick Log Anything</h3>
          <span className="text-xs font-semibold text-slate-600">— Log thoughts, expenses, tasks, or notes & categorize instantly</span>
        </div>

        <form onSubmit={handleAddLog} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="modal-input flex-1 font-semibold"
            placeholder="Type anything to log (e.g., 'Paid $45 for Internet', 'Completed 3km run', 'Idea for Substack')..."
            value={logContent}
            onChange={(e) => setLogContent(e.target.value)}
          />
          <select
            className="modal-select sm:w-56 font-semibold"
            value={logCategory}
            onChange={(e) => setLogCategory(e.target.value)}
          >
            {allCategoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Categorize to: {opt.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={logging || !logContent.trim()}
            className="btn-primary text-xs whitespace-nowrap justify-center"
          >
            <Send className="w-3.5 h-3.5" />
            Log Entry
          </button>
        </form>

        {/* Quick Log History */}
        {quickLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
              Recent Log History ({quickLogs.length})
            </span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {quickLogs.map((log) => {
                const targetNav = allCategoryOptions.find(o => o.id === log.category);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between bg-white/70 backdrop-blur-xs border border-slate-200 px-3 py-2 text-xs rounded-sm group hover:border-pink-400 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-900 font-bold truncate">{log.content}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigateTo(log.category)}
                        className="badge badge-pink hover:bg-pink-100 cursor-pointer"
                      >
                        → {targetNav ? targetNav.label : log.category}
                      </button>
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="font-serif text-base font-bold text-slate-900 mb-3">Planner Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'dailyPlanner', emoji: '📅', label: 'Daily Planner' },
            { id: 'goals', emoji: '🎯', label: 'Goals Tracker' },
            { id: 'habits', emoji: '🔥', label: 'Habits Tracker' },
            { id: 'financeCashflow', emoji: '💰', label: 'Cashflow Statement' },
            { id: 'financeBudget', emoji: '📊', label: 'Monthly Budget' },
            { id: 'files', emoji: '📁', label: 'Files & Scans' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => navigateTo(c.id)}
              className="glass-card p-4 text-left rounded-sm hover:border-pink-400 hover:bg-white/95 transition-all cursor-pointer"
            >
              <div className="text-2xl mb-1.5">{c.emoji}</div>
              <div className="text-xs font-bold text-slate-900">{c.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
