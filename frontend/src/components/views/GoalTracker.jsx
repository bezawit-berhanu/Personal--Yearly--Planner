import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

function priorityColor(p = '') {
  if (p === 'High') return 'border-l-rose-400';
  if (p === 'Medium') return 'border-l-amber-400';
  return 'border-l-cream-300';
}

function statusBadge(s = '') {
  const v = s.toLowerCase();
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
    <div className="space-y-6 animate-fadeIn">
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

      {/* Goal cards */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className={`bg-white border border-cream-200 border-l-4 ${priorityColor(goal.priority)} rounded-2xl p-5 shadow-subtle group`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <input
                  className="cell-input font-semibold text-cream-800 text-base w-full"
                  value={goal.title || ''}
                  onChange={(e) => updateField('goals', goal.id, 'title', e.target.value)}
                  placeholder="Goal title..."
                />
                {goal.why && (
                  <p className="text-xs text-cream-500 mt-1 px-2 italic truncate">Why: {goal.why}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={statusBadge(goal.status)}>{goal.status || 'Not Started'}</span>
                <button onClick={() => deleteItem('goals', goal.id)} className="btn-danger opacity-0 group-hover:opacity-100">×</button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-cream-500 mb-1">
                <span>Progress</span>
                <span className="font-bold text-cream-700">{goal.progress || 0}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-cream-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cream-700 transition-all duration-500"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0} max={100}
                  value={goal.progress || 0}
                  onChange={(e) => updateField('goals', goal.id, 'progress', Number(e.target.value))}
                  className="w-24 accent-cream-600"
                />
              </div>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <label className="flex flex-col gap-0.5">
                <span className="text-cream-400 uppercase tracking-wide font-semibold">Category</span>
                <select className="cell-select text-xs" value={goal.category||''} onChange={e=>updateField('goals',goal.id,'category',e.target.value)}>
                  <option value="">—</option>
                  {['Career & Business','Health & Wellness','Finance','Learning','Relationships','Personal Growth','Creativity'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-cream-400 uppercase tracking-wide font-semibold">Priority</span>
                <select className="cell-select text-xs" value={goal.priority||''} onChange={e=>updateField('goals',goal.id,'priority',e.target.value)}>
                  {['High','Medium','Low'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-cream-400 uppercase tracking-wide font-semibold">Status</span>
                <select className="cell-select text-xs" value={goal.status||''} onChange={e=>updateField('goals',goal.id,'status',e.target.value)}>
                  {['Not Started','In Progress','Completed','On Hold','Abandoned'].map(o=><option key={o}>{o}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-0.5">
                <span className="text-cream-400 uppercase tracking-wide font-semibold">Deadline</span>
                <input type="date" className="cell-input text-xs" value={goal.deadline||''} onChange={e=>updateField('goals',goal.id,'deadline',e.target.value)} />
              </label>
            </div>

            {/* Next action */}
            <div className="mt-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-cream-400">Next Action →</span>
              <input
                className="cell-input text-sm mt-0.5"
                value={goal.next || ''}
                onChange={(e) => updateField('goals', goal.id, 'next', e.target.value)}
                placeholder="What is your next step?"
              />
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="text-center py-14 text-cream-400 italic">
            No goals yet — click <strong>Add Entry</strong> to set your first goal.
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
