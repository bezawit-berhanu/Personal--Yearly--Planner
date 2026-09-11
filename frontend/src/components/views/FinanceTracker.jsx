import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

const COLORS = { Income: '#6B8E7B', Expense: '#C07070', Savings: '#3D5A80', Investment: '#C5A059' };
const PIE_COLORS = ['#8A6953', '#C5A059', '#6B8E7B', '#3D5A80', '#C07070', '#D6C0B0', '#B89E8D'];

const TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-cream-200 rounded-xl px-3 py-2 shadow-card text-sm text-cream-700">
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: <strong>${Number(p.value).toLocaleString()}</strong></p>)}
    </div>
  );
};

export default function FinanceTracker() {
  const { db, addItem } = usePlannerContext();
  const [modal, setModal] = useState(false);
  const config = SECTION_CONFIGS.financeTracker;
  const items  = db.financeTracker || [];

  const income  = items.filter(i=>i.category==='Income').reduce((s,i)=>s+(Number(i.amount)||0),0);
  const expense = items.filter(i=>i.category==='Expense').reduce((s,i)=>s+(Number(i.amount)||0),0);
  const savings = items.filter(i=>i.category==='Savings').reduce((s,i)=>s+(Number(i.amount)||0),0);
  const invest  = items.filter(i=>i.category==='Investment').reduce((s,i)=>s+(Number(i.amount)||0),0);
  const net     = income - expense - savings - invest;

  // Bar chart: category totals
  const barData = [
    { name: 'Income', value: income },
    { name: 'Expense', value: expense },
    { name: 'Savings', value: savings },
    ...(invest > 0 ? [{ name: 'Investment', value: invest }] : []),
  ];

  // Expense pie by source
  const expensePieData = items
    .filter(i=>i.category==='Expense')
    .reduce((acc, i) => {
      const found = acc.find(a=>a.name===i.source);
      if (found) found.value += Number(i.amount)||0;
      else acc.push({ name: i.source || 'Other', value: Number(i.amount)||0 });
      return acc;
    }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Finance Tracker"
        description="Track income, expenses, savings & investments. All calculations are automatic."
        onAdd={() => setModal(true)}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Income"   value={`$${income.toLocaleString()}`}  color="green" />
        <StatCard label="Total Expenses" value={`$${expense.toLocaleString()}`} color="red" />
        <StatCard label="Savings"        value={`$${savings.toLocaleString()}`} color="blue" />
        <StatCard label="Net Balance"    value={`$${net.toLocaleString()}`}     color={net >= 0 ? 'green' : 'red'} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-sm p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(236, 72, 153, 0.15)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 'bold' }} />
              <YAxis tick={{ fontSize: 11, fill: '#334155', fontWeight: 'bold' }} tickFormatter={v=>`$${v}`} />
              <Tooltip content={<TOOLTIP />} />
              <Bar dataKey="value" radius={[4,4,0,0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.name] || '#EC4899'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-sm p-6 shadow-sm">
          <h3 className="font-serif text-base font-bold text-slate-900 mb-4">Expense Breakdown</h3>
          {expensePieData.length === 0 ? (
            <p className="text-slate-400 text-sm italic text-center py-8">No expenses recorded yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={expensePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                  {expensePieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<TOOLTIP />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Editable table */}
      <EditableTable config={config} items={items} dataKey="financeTracker" />

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem('financeTracker', data); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
