import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

function statusColor(s = '') {
  const v = (s || '').toLowerCase();
  if (v === 'optimal') return 'badge badge-green';
  if (v === 'good' || v === 'on track') return 'badge badge-blue';
  if (v === 'needs work') return 'badge badge-amber';
  return 'badge badge-red';
}

export default function HealthDashboard() {
  const { db, addItem } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const config = SECTION_CONFIGS.healthDashboard;
  const items  = db.healthDashboard || [];

  const optimal  = items.filter(i=>i.status==='Optimal').length;
  const needsWork= items.filter(i=>i.status==='Needs Work' || i.status==='Critical').length;

  const chartData = items.map(m => ({
    name: m.metric,
    current: Number(m.value) || 0,
    target: Number(m.target) || 0,
  }));

  return (
    <div className="space-y-6">
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
            <div key={m.id} className="glass-card rounded-sm p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm">{m.metric}</h4>
                <span className={statusColor(m.status)}>{m.status}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-serif text-3xl font-bold text-slate-900">{m.value}</span>
                <span className="text-slate-700 font-bold text-xs mb-1">{m.unit}</span>
                {m.target && <span className="text-xs text-slate-600 font-semibold mb-1">/ {m.target} target</span>}
              </div>
              {pct !== null && (
                <div className="w-full bg-slate-200 rounded-sm h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-sm transition-all ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-rose-500'}`}
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
        <div className="glass-card rounded-sm p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Current vs Target</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#1A1A2E', fontWeight: 'bold' }} />
              <YAxis tick={{ fontSize: 11, fill: '#1A1A2E', fontWeight: 'bold' }} />
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid #CBD5E1', borderRadius:4, fontSize:12, color:'#1A1A2E' }} />
              <Bar dataKey="current" fill="#E879A0" radius={[2,2,0,0]} name="Current" />
              <Bar dataKey="target"  fill="#CBD5E1" radius={[2,2,0,0]} name="Target" />
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
