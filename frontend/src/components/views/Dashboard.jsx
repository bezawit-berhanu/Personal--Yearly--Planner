import { useState, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import StatCard from '../shared/StatCard';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Plus, Clock, Sparkles, Send, Trash2, ArrowRight, Upload, Palette,
  Calendar, Target, Flame, DollarSign, BarChart2, Folder, TrendingUp
} from 'lucide-react';

function safeString(val, fallback = '') {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') return val.message || JSON.stringify(val);
  return String(val);
}

export default function Dashboard() {
  const { user } = useAuth();
  const { db, navigateTo } = usePlannerContext();

  const [logContent, setLogContent] = useState('');
  const [logCategory, setLogCategory] = useState('dailyPlanner');
  const [quickLogs, setQuickLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logging, setLogging] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    async function fetchQuickLogs() {
      try {
        const res = await api.get('/quick-logs');
        setQuickLogs(res.data.logs || []);
      } catch (err) {
        console.error('Failed to load quick logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchQuickLogs();
  }, []);

  const habits = db.habits || [];
  const goals = db.goals || [];
  const goalsCompleted = goals.filter(g => g.status === 'Completed').length;
  const goalsInProgress = goals.filter(g => g.status === 'In Progress').length;

  const overviewChartData = [
    { name: 'Completed Goals', count: goalsCompleted, color: '#6B1D2F' },
    { name: 'Goals In Progress', count: goalsInProgress, color: '#C5A059' },
    { name: 'Tracked Habits', count: habits.length, color: '#7A1C31' },
    { name: 'Recent Quick Logs', count: quickLogs.length, color: '#D4AF37' },
  ];

  const handleQuickLog = async (e) => {
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

  const confirmDeleteLog = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/quick-logs/${deleteTargetId}`);
      setQuickLogs(quickLogs.filter(l => l.id !== deleteTargetId));
    } catch (err) {
      console.error('Failed to delete log:', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const allCategoryOptions = NAV_GROUPS.flatMap(g => g.items);

  const shortcutCards = [
    { id: 'dailyPlanner', Icon: Calendar, label: 'Daily Planner', color: 'text-[#6B1D2F]' },
    { id: 'goals', Icon: Target, label: 'Goals Tracker', color: 'text-[#7A1C31]' },
    { id: 'habits', Icon: Flame, label: 'Habits Tracker', color: 'text-[#C5A059]' },
    { id: 'financeCashflow', Icon: DollarSign, label: 'Cashflow Statement', color: 'text-[#2D6A4F]' },
    { id: 'financeBudget', Icon: BarChart2, label: 'Monthly Budget', color: 'text-[#6B1D2F]' },
    { id: 'files', Icon: Folder, label: 'Files & Scans', color: 'text-[#8B263E]' },
  ];

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-[#6B1D2F]/15">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B1D2F] bg-[#FDF8EB] border border-[#C5A059]/30 px-3 py-1 rounded-md">
            {user?.name ? `${user.name}'s` : 'Personal'} 2027 Royal Planner
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#3B0D18] mt-2 flex items-center gap-2">
            Welcome back, {user?.name || 'User'}
            <Sparkles className="w-6 h-6 text-[#C5A059]" />
          </h1>
          <p className="text-xs font-semibold text-[#7A5C63] mt-1">
            Instant sync across all planner views
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => navigateTo('files')} className="btn-secondary rounded-md px-4 py-2 text-xs">
            <Upload className="w-3.5 h-3.5" /> Upload Files
          </button>
          <button onClick={() => navigateTo('appearance')} className="btn-primary rounded-md px-4 py-2 text-xs">
            <Palette className="w-3.5 h-3.5 text-[#E6C687]" /> Theme Settings
          </button>
        </div>
      </div>

      {/* QUICK LOG ANYTHING SECTION - OPEN EDITORIAL STYLE */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <h3 className="font-serif text-lg font-bold text-[#3B0D18]">Quick Log Anything</h3>
          <span className="text-xs text-[#7A5C63] font-medium">— Capture thoughts, tasks, or entries instantly</span>
        </div>

        <form onSubmit={handleQuickLog} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="modal-input flex-1 font-semibold text-sm py-2.5"
            placeholder="Type anything to log (e.g., 'Paid $45 for Internet', 'Idea for Substack')..."
            value={logContent}
            onChange={(e) => setSearchContent ? setLogContent(e.target.value) : setLogContent(e.target.value)}
          />
          <select
            className="modal-select sm:w-56 font-semibold text-xs py-2.5"
            value={logCategory}
            onChange={(e) => setLogCategory(e.target.value)}
          >
            {allCategoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Category: {opt.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={logging || !logContent.trim()}
            className="btn-primary rounded-md px-5 py-2.5 text-xs whitespace-nowrap justify-center"
          >
            <Send className="w-3.5 h-3.5 text-[#E6C687]" />
            Log Entry
          </button>
        </form>

        {/* Quick Log History - Open Row List */}
        {Array.isArray(quickLogs) && quickLogs.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="font-serif text-[11px] font-bold uppercase tracking-widest text-[#6B1D2F] block mb-1">
              Recent Log Entries
            </span>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {quickLogs.map((log) => {
                const targetNav = allCategoryOptions.find(o => o.id === log.category);
                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2 px-3 hover:bg-[#F8F3EC]/80 rounded-md transition-colors border border-transparent hover:border-[#6B1D2F]/10 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span className="text-[#3B0D18] text-xs font-semibold truncate">{safeString(log.content)}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigateTo(log.category)}
                        className="text-[11px] font-bold text-[#6B1D2F] hover:text-[#5B1425] flex items-center gap-1 cursor-pointer"
                      >
                        <span>{targetNav ? targetNav.label : safeString(log.category)}</span>
                        <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(log.id)}
                        className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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

      {/* Overview Analytics Visual Graph */}
      <div className="p-6 rounded-md bg-[#FFFDF7]/90 backdrop-blur-md border border-[#6B1D2F]/15 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-bold text-[#3B0D18] flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#C5A059]" />
              Planner Overview & Productivity Analytics
            </h3>
            <p className="text-xs text-[#7A5C63] font-medium">Real-time status breakdown across goals, habits, and activity logs</p>
          </div>
          <span className="badge badge-gold">
            Live Sync
          </span>
        </div>

        <div className="pt-2">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={overviewChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 29, 47, 0.12)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3B0D18', fontWeight: 'bold' }} />
              <YAxis tick={{ fontSize: 11, fill: '#3B0D18', fontWeight: 'bold' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#FFFDF7', border: '1px solid rgba(197, 160, 89, 0.5)', borderRadius: '6px', fontSize: '12px', color: '#3B0D18' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                {overviewChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Navigation Shortcuts - Open Editorial Row */}
      <div className="pt-4 border-t border-pink-100/50">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">Planner Shortcuts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {shortcutCards.map(({ id, Icon, label, color }) => (
            <button
              key={id}
              onClick={() => navigateTo(id)}
              className="py-3 px-3 text-left transition-all cursor-pointer group hover:bg-pink-50/50 rounded-sm"
            >
              <div className="mb-2">
                <Icon className={`w-5 h-5 ${color} transition-transform group-hover:scale-110`} />
              </div>
              <div className="text-xs font-bold text-slate-900">{label}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Jump to section →</div>
            </button>
          ))}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDeleteLog}
        title="Delete Quick Log"
        message="Are you sure you want to delete this log entry? This action cannot be undone."
      />
    </div>
  );
}
