import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

const COLOR_GOOD = '#10B981';
const COLOR_MID  = '#F59E0B';
const COLOR_BAD  = '#F43F5E';

function completionColor(pct) {
  if (pct >= 80) return COLOR_GOOD;
  if (pct >= 50) return COLOR_MID;
  return COLOR_BAD;
}

export default function KpiDashboard() {
  const { db, addItem } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const config = SECTION_CONFIGS.kpiDashboard;
  const items  = db.kpiDashboard || [];

  const completions = items.map(k => k.target > 0 ? Math.round((k.value/k.target)*100) : 0);
  const avgCompletion = completions.length ? Math.round(completions.reduce((a,b)=>a+b,0)/completions.length) : 0;
  const onTarget  = completions.filter(p=>p>=80).length;
  const offTarget = completions.filter(p=>p<80).length;

  const chartData = items.map((k,i) => ({
    name: k.kpi,
    completion: completions[i],
    current: k.value,
    target: k.target,
    unit: k.unit || '',
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="KPI Dashboard"
        description="Key Performance Indicators — track progress against your targets."
        onAdd={() => setModal(true)}
      />

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total KPIs"       value={items.length} />
        <StatCard label="Avg Completion"   value={`${avgCompletion}%`}  color="blue" />
        <StatCard label="On Target (≥80%)" value={onTarget}             color="green" />
        <StatCard label="Below Target"     value={offTarget}            color={offTarget > 0 ? 'red' : 'default'} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((kpi, i) => {
          const pct = completions[i];
          const col = completionColor(pct);
          return (
            <div key={kpi.id} className="glass-card rounded-sm p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-slate-900 text-sm leading-tight">{kpi.kpi}</h4>
                <span className="badge badge-pink shrink-0 ml-2">{kpi.category}</span>
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="font-serif text-3xl font-bold text-slate-900">{kpi.value}</span>
                <span className="text-slate-700 font-bold text-xs mb-1">{kpi.unit}</span>
                <span className="text-xs text-slate-600 font-semibold mb-1 ml-1">/ {kpi.target} {kpi.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 rounded-sm h-2 overflow-hidden">
                  <div className="h-full rounded-sm transition-all" style={{ width:`${Math.min(100,pct)}%`, background: col }} />
                </div>
                <span className="text-xs font-bold" style={{ color: col }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion bar chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-sm p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Completion Rate by KPI</h3>
          <ResponsiveContainer width="100%" height={Math.max(180, chartData.length * 45)}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" horizontal={false} />
              <XAxis type="number" domain={[0,100]} tick={{ fontSize: 11, fill: '#1A1A2E', fontWeight: 'bold' }} tickFormatter={v=>`${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#1A1A2E', fontWeight: 'bold' }} width={160} />
              <Tooltip
                contentStyle={{ background:'#fff', border:'1px solid #CBD5E1', borderRadius:4, fontSize:12, color:'#1A1A2E' }}
                formatter={(v, _, props) => [`${v}% (${props.payload.current}/${props.payload.target} ${props.payload.unit})`, 'Completion']}
              />
              <Bar dataKey="completion" radius={[0,2,2,0]} name="Completion %">
                {chartData.map((_, i) => <Cell key={i} fill={completionColor(completions[i])} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Editable table */}
      <EditableTable config={config} items={items} dataKey="kpiDashboard" />

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('kpiDashboard', data); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
