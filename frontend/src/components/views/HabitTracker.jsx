import { useState, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import api from '../../api/client';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import AddEntryModal from '../shared/AddEntryModal';
import ConfirmDeleteModal from '../shared/ConfirmDeleteModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';
import { BarChart2, Calendar, RotateCcw, Award, Flame, Trash2, Check, X, Target } from 'lucide-react';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HabitTracker() {
  const { db, addItem, updateField, deleteItem, saveSection } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const [reports, setReports] = useState([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

  // AUTO RESET AFTER WEEK ENDS
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

      // Save week progress to cumulative total_completed_days and reset week history
      const resetHabits = habits.map(h => {
        const weekDoneCount = (h.history || []).filter(Boolean).length;
        return {
          ...h,
          total_completed_days: (h.total_completed_days || 0) + weekDoneCount,
          history: [0, 0, 0, 0, 0, 0, 0]
        };
      });

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
    <div className="space-y-8">
      <SectionHeader
        title="Habit Tracker"
        description="Build consistency with weekly refreshable tracking, customizable target days (e.g. 100 to 1000 days), and dynamic streak math."
        onAdd={() => setModal(true)}
      >
        <button onClick={() => setShowReportsModal(true)} className="btn-secondary rounded-full px-4 py-2 text-xs">
          <Award className="w-3.5 h-3.5 text-amber-500" /> Past Reports ({reports.length})
        </button>
      </SectionHeader>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Habits Tracked" value={habits.length} />
        <StatCard label="Best Streak" value={`${bestStreak} days`} color="green" />
        <StatCard label="Average Streak" value={`${avgStreak} days`} color="amber" />
      </div>

      {/* Habit Open Editorial Rows */}
      <div className="space-y-6">
        {habits.map((habit) => {
          const history = habit.history || [0, 0, 0, 0, 0, 0, 0];
          const weekDoneCount = history.filter(Boolean).length;
          const targetDays = habit.target_days || 100;
          const totalCompleted = (habit.total_completed_days || 0) + weekDoneCount;
          const overallProgress = Math.min(100, Math.round((totalCompleted / targetDays) * 100));

          return (
            <div key={habit.id} className="pb-6 border-b border-pink-100/50 space-y-4 group">
              
              {/* Header: Title & Target Days Input */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <input
                    className="cell-input font-serif font-bold text-slate-900 text-lg md:text-xl w-full p-0"
                    value={habit.name || ''}
                    onChange={(e) => updateField('habits', habit.id, 'name', e.target.value)}
                    placeholder="Habit name..."
                  />
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-pink-500" />
                      <strong className="text-slate-900 font-bold">{habit.streak || 0}</strong> day current streak
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-slate-400" />
                      <strong className="text-slate-900 font-bold">{totalCompleted}</strong> / 
                      <input
                        type="number"
                        min={1}
                        className="cell-input w-14 font-bold text-slate-900 text-xs py-0 px-1 hover:bg-pink-50"
                        value={habit.target_days || 100}
                        onChange={(e) => updateField('habits', habit.id, 'target_days', Math.max(1, Number(e.target.value)))}
                        title="Click to edit total target days (e.g. 100, 365, 1000)"
                      />
                      target days ({overallProgress}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setDeleteTargetId(habit.id)}
                    className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="bg-pink-100/30 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {/* 7-day Weekly Checkbox Heatmap & Dynamic Streak Math on Untick */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {DAY_LABELS.map((day, i) => {
                    const done = history[i] === 1;
                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => {
                            const newHist = [...history];
                            let newStreak = habit.streak || 0;

                            if (done) {
                              // UNTICK ACTION: Recalculate streak backwards!
                              newHist[i] = 0;
                              newStreak = Math.max(0, newStreak - 1);
                            } else {
                              // TICK ACTION: Increment streak!
                              newHist[i] = 1;
                              newStreak = newStreak + 1;
                            }

                            updateField('habits', habit.id, 'history', newHist);
                            updateField('habits', habit.id, 'streak', newStreak);
                          }}
                          className={`w-9 h-9 text-xs font-bold transition-all rounded-md flex items-center justify-center cursor-pointer ${
                            done ? 'bg-pink-500 text-white shadow-xs' : 'bg-slate-100/80 text-slate-400 hover:bg-pink-100/60'
                          }`}
                          title={`${day}: Click to toggle completion`}
                        >
                          {done ? <Check className="w-4 h-4 text-white" /> : null}
                        </button>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{day}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-right pl-4">
                  <div className="text-xl font-bold text-slate-900 font-serif">{weekDoneCount}/7</div>
                  <div className="text-[9px] uppercase font-bold tracking-widest text-slate-400">This Week</div>
                </div>
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-14 text-slate-400 font-medium italic text-sm">
            No habits logged yet. Click <strong>Add Entry</strong> to build your daily routine.
          </div>
        )}
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[10000]">
          <div className="glass-modal p-6 rounded-sm max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100/50">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" /> Weekly & Monthly Habit Reports
              </h3>
              <button onClick={() => setShowReportsModal(false)} className="text-slate-400 hover:text-slate-600">
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
                    <div key={rep.id} className="p-3 rounded-sm bg-pink-50/50 flex items-center justify-between text-xs">
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

            <div className="text-right pt-2 border-t border-pink-100/50">
              <button onClick={() => setShowReportsModal(false)} className="btn-secondary text-xs rounded-full px-4 py-1.5">Close</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('habits', { ...data, target_days: data.target_days || 100, total_completed_days: 0, history: [0, 0, 0, 0, 0, 0, 0] }); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        title="Delete Habit"
        message="Are you sure you want to delete this habit? All associated streak history will be removed."
        onConfirm={() => {
          if (deleteTargetId !== null) {
            deleteItem('habits', deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
