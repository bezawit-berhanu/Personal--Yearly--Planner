import { useState, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import api from '../../api/client';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';
import { BarChart2, Calendar, RotateCcw, Award, Flame, Trash2, Check, X } from 'lucide-react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitTracker() {
  const { db, addItem, updateField, deleteItem, saveSection } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const config = SECTION_CONFIGS.habits;
  const habits = db.habits || [];

  // Fetch past habit reports
  const fetchReports = async () => {
    try {
      const res = await api.get('/habits/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Failed to load habit reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // AUTO RESET AFTER WEEK ENDS (Requirement 8)
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const getWeekKey = (d) => {
      const date = new Date(d);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
      return `${date.getFullYear()}-W${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
    };

    const currentWeekKey = getWeekKey(new Date());
    const storedWeekKey = localStorage.getItem('bezawit_planner_current_habit_week');

    if (storedWeekKey && storedWeekKey !== currentWeekKey) {
      // Week has ended! Save report for past week & reset habit history
      const totalChecks = habits.reduce((acc, h) => acc + (h.history || []).filter(Boolean).length, 0);
      const totalPossible = habits.length * 7;
      const rate = totalPossible > 0 ? Math.round((totalChecks / totalPossible) * 100) : 0;

      api.post('/habits/reports', {
        report_type: 'weekly',
        period_key: storedWeekKey,
        summary_json: {
          week: storedWeekKey,
          completion_rate: `${rate}%`,
          total_habits: habits.length,
          best_streak: habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0
        }
      }).catch(console.error);

      // Reset habits for new week
      const resetHabits = habits.map(h => ({
        ...h,
        history: [0, 0, 0, 0, 0, 0, 0]
      }));

      saveSection('habits', resetHabits);
      localStorage.setItem('bezawit_planner_current_habit_week', currentWeekKey);
      fetchReports();
    } else if (!storedWeekKey) {
      localStorage.setItem('bezawit_planner_current_habit_week', currentWeekKey);
    }
  }, [habits, saveSection]);

  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0;
  const avgStreak = habits.length ? Math.round(habits.reduce((s, h) => s + (h.streak || 0), 0) / habits.length) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Habit Tracker & Automated Weekly Reports"
        description="Tracks daily streaks. Resets checkmarks automatically at week's end & generates reports."
        onAdd={() => setModal(true)}
      >
        <button onClick={() => setShowReportsModal(true)} className="btn-secondary text-xs">
          <Award className="w-3.5 h-3.5" /> View Past Reports ({reports.length})
        </button>
      </SectionHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Habits Tracked" value={habits.length} />
        <StatCard label="Best Streak" value={`${bestStreak} days`} color="green" />
        <StatCard label="Average Streak" value={`${avgStreak} days`} color="amber" />
      </div>

      {/* Habit List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const history = habit.history || [0, 0, 0, 0, 0, 0, 0];
          const consistency = Math.round((history.filter(Boolean).length / 7) * 100);

          return (
            <div key={habit.id} className="glass-card p-5 rounded-sm shadow-xs group">
              <div className="flex items-center justify-between mb-3">
                <input
                  className="cell-input font-bold text-slate-800 text-base"
                  value={habit.name || ''}
                  onChange={(e) => updateField('habits', habit.id, 'name', e.target.value)}
                />
                <div className="flex items-center gap-3 shrink-0">
                  <span className="badge badge-pink flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-pink-600" />
                    <span>{habit.streak || 0} day streak</span>
                  </span>
                  <button
                    onClick={() => deleteItem('habits', habit.id)}
                    className="btn-danger p-1 flex items-center justify-center"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 7-day heatmap */}
              <div className="flex items-center gap-2 mb-2">
                {DAY_LABELS.map((day, i) => {
                  const done = history[i] === 1;
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => {
                          const newHist = [...history];
                          newHist[i] = done ? 0 : 1;
                          updateField('habits', habit.id, 'history', newHist);
                          if (!done) updateField('habits', habit.id, 'streak', (habit.streak || 0) + 1);
                        }}
                        className={`w-9 h-9 text-xs font-bold transition-all border rounded-sm flex items-center justify-center ${
                          done ? 'bg-pink-500 text-white border-pink-500' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        {done ? <Check className="w-4 h-4 text-white" /> : null}
                      </button>
                      <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                    </div>
                  );
                })}

                <div className="ml-auto text-right border-l border-slate-100 pl-4">
                  <div className="text-xl font-bold text-slate-800 font-serif">{consistency}%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Weekly Consistency</div>
                </div>
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-12 text-slate-400 italic text-sm">
            No habits logged yet. Click "Add Entry" to build your daily routine.
          </div>
        )}
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-pink-200 p-6 rounded-sm max-w-lg w-full shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-500" /> Weekly & Monthly Reports
              </h3>
              <button onClick={() => setShowReportsModal(false)} className="btn-ghost p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No automated reports archived yet. Reports generate automatically at the end of each week.
                </p>
              ) : (
                reports.map((rep) => {
                  const data = typeof rep.summary_json === 'string' ? JSON.parse(rep.summary_json) : rep.summary_json;
                  return (
                    <div key={rep.id} className="border border-slate-200 p-3 rounded-sm bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="badge badge-pink mb-1">{rep.report_type} Report</span>
                        <div className="font-bold text-slate-800">Period: {rep.period_key}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-700">{data?.completion_rate} Done</div>
                        <div className="text-[10px] text-slate-400">{data?.total_habits} Habits Tracked</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-right pt-2 border-t border-slate-100">
              <button onClick={() => setShowReportsModal(false)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('habits', { ...data, history: [0, 0, 0, 0, 0, 0, 0] }); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
