import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';
import { Trash2, ArrowRight } from 'lucide-react';

function priorityColor(p = '') {
  if (p === 'High') return 'border-l-rose-500';
  if (p === 'Medium') return 'border-l-amber-500';
  return 'border-l-pink-400';
}

function statusBadge(s = '') {
  const v = (s || '').toLowerCase();
  if (v.includes('complet')) return 'badge badge-green';
  if (v.includes('progress')) return 'badge badge-amber';
  if (v.includes('hold') || v.includes('abandon')) return 'badge badge-red';
  return 'badge badge-gray';
}

export default function GoalTracker() {
  const { db, addItem, updateField, deleteItem } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const config = SECTION_CONFIGS.goals;
  const goals  = db.goals || [];

  const completed = goals.filter(g=>g.status==='Completed').length;
  const inProgress = goals.filter(g=>g.status==='In Progress').length;
  const avgProgress = goals.length ? Math.round(goals.reduce((s,g)=>s+(g.progress||0),0)/goals.length) : 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Goal Tracker"
        description="Set, track, and achieve your 2027 goals."
        onAdd={() => setModal(true)}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Goals"   value={goals.length} />
        <StatCard label="In Progress"   value={inProgress}   color="amber" />
        <StatCard label="Completed"     value={completed}    color="green" />
        <StatCard label="Avg Progress"  value={`${avgProgress}%`} color="blue" />
      </div>

      {/* Goal Items — Open Editorial Rows */}
      <div className="space-y-8">
        {goals.map((goal) => (
          <div key={goal.id} className="pb-6 border-b border-pink-100/50 group space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <input
                  className="cell-input font-serif font-bold text-slate-900 text-lg md:text-xl w-full p-0"
                  value={goal.title || ''}
                  onChange={(e) => updateField('goals', goal.id, 'title', e.target.value)}
                  placeholder="Goal title..."
                />
                {goal.why && (
                  <p className="text-xs text-slate-500 font-medium mt-1 italic">Why: {goal.why}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={statusBadge(goal.status)}>{goal.status || 'Not Started'}</span>
                <button onClick={() => deleteItem('goals', goal.id)} className="btn-danger opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1">
                <span className="text-[10px] uppercase tracking-widest text-slate-500">Progress</span>
                <span className="font-bold text-slate-900">{goal.progress || 0}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-pink-100/40 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-500 transition-all duration-300"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0} max={100}
                  value={goal.progress || 0}
                  onChange={(e) => updateField('goals', goal.id, 'progress', Number(e.target.value))}
                  className="w-24 accent-pink-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
              <label className="flex flex-col gap-0.5">
                <span className="text-slate-400 uppercase tracking-widest font-bold text-[9px]">Category</span>
                <select className="cell-select text-xs font-bold text-slate-800 p-0" value={goal.category||''} onChange={e=>updateField('goals',goal.id,'category',e.target.value)}>
                  <option value="">—</option>
                  {['Career & Business','Health & Wellness','Finance','Learning','Relationships','Personal Growth','Creativity'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-slate-400 uppercase tracking-widest font-bold text-[9px]">Priority</span>
                <select className="cell-select text-xs font-bold text-slate-800 p-0" value={goal.priority||''} onChange={e=>updateField('goals',goal.id,'priority',e.target.value)}>
                  {['High','Medium','Low'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-slate-400 uppercase tracking-widest font-bold text-[9px]">Status</span>
                <select className="cell-select text-xs font-bold text-slate-800 p-0" value={goal.status||''} onChange={e=>updateField('goals',goal.id,'status',e.target.value)}>
                  {['Not Started','In Progress','Completed','On Hold','Abandoned'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-slate-400 uppercase tracking-widest font-bold text-[9px]">Deadline</span>
                <input type="date" className="cell-input text-xs font-bold text-slate-800 p-0" value={goal.deadline||''} onChange={e=>updateField('goals',goal.id,'deadline',e.target.value)} />
              </label>
            </div>

            {/* Next action */}
            <div className="pt-1">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Next Action <ArrowRight className="w-3 h-3" />
              </span>
              <input
                className="cell-input text-xs font-semibold text-slate-800 p-0 mt-0.5"
                value={goal.next || ''}
                onChange={(e) => updateField('goals', goal.id, 'next', e.target.value)}
                placeholder="What is your next step?"
              />
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="text-center py-14 text-slate-400 font-medium italic text-sm">
            No goals recorded yet — click <strong>Add Entry</strong> to set your first goal.
          </div>
        )}
      </div>

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('goals', data); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
