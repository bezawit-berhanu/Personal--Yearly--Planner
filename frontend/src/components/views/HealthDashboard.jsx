import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

function statusColor(s = '') {
  const v = s.toLowerCase();
  if (v === 'optimal') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (v === 'good') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (v === 'on track') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (v === 'needs work') return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

export default function HealthDashboard() {
  const { db, addItem } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const config = SECTION_CONFIGS.healthDashboard;
  const items  = db.healthDashboard || [];

  const optimal  = items.filter(i=>i.status==='Optimal').length;
  const good     = items.filter(i=>['Good','On Track'].includes(i.status)).length;
  const needsWork= items.filter(i=>i.status==='Needs Work' || i.status==='Critical').length;

  // Bar chart: value vs target per metric
  const chartData = items.map(m => ({
    name: m.metric,
    current: Number(m.value) || 0,
    target: Number(m.target) || 0,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Health Dashboard"
        description="Track your key health metrics and compare to your targets."
        onAdd={() => setModal(true)}
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Metrics Tracked" value={items.length} />
        <StatCard label="Optimal"         value={optimal}     color="green" />
        <StatCard label="Needs Work"      value={needsWork}   color={needsWork > 0 ? 'red' : 'default'} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => {
          const pct = m.target > 0 ? Math.min(100, Math.round((Number(m.value) / Number(m.target)) * 100)) : null;
          return (
            <div key={m.id} className="bg-white border border-cream-200 rounded-2xl p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-cream-700 text-sm">{m.metric}</h4>
                <span className={`badge text-xs border ${statusColor(m.status)}`}>{m.status}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-serif text-3xl font-bold text-cream-800">{m.value}</span>
                <span className="text-cream-500 text-sm mb-1">{m.unit}</span>
                {m.target && <span className="text-xs text-cream-400 mb-1">/ {m.target} target</span>}
              </div>
              {pct !== null && (
                <div className="w-full bg-cream-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`}
                    style={{ width: `${Math.min(100,pct)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chart: value vs target */}
      {chartData.length > 0 && (
        <div className="bg-white border border-cream-200 rounded-2xl p-6 shadow-subtle">
          <h3 className="font-serif text-base font-semibold text-cream-700 mb-4">Current vs Target</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F5ECE4" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8A6953' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8A6953' }} />
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid #EADCD0', borderRadius:12, fontSize:12, color:'#594030' }} />
              <Bar dataKey="current" fill="#6B8E7B" radius={[4,4,0,0]} name="Current" />
              <Bar dataKey="target"  fill="#EADCD0" radius={[4,4,0,0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Full editable table */}
      <EditableTable config={config} items={items} dataKey="healthDashboard" />

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('healthDashboard', data); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
