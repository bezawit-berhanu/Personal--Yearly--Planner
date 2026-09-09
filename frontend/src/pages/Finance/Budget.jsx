import { useState, useEffect } from 'react';
import api from '../../api/client';
import SectionHeader from '../../components/shared/SectionHeader';
import StatCard from '../../components/shared/StatCard';
import { Calendar, Plus, Trash2, PieChart, BarChart2 } from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Budget() {
  const currentYear = new Date().getFullYear();
  const currentMonthStr = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [entries, setEntries] = useState([]);
  const [yearReport, setYearReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [entryType, setEntryType] = useState('Expense');
  const [category, setCategory] = useState('Housing');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const fetchMonthBudget = async (monthKey) => {
    try {
      const res = await api.get(`/finance/budget?month=${monthKey}`);
      setEntries(res.data.entries || []);
    } catch (err) {
      console.error('Failed to load budget:', err);
    }
  };

  const fetchYearReport = async () => {
    try {
      const res = await api.get(`/finance/budget/year-report?year=${currentYear}`);
      setYearReport(res.data.report || []);
    } catch (err) {
      console.error('Failed to load year report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthBudget(selectedMonth);
    fetchYearReport();
  }, [selectedMonth]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    try {
      await api.post('/finance/budget', {
        month_key: selectedMonth,
        entry_type: entryType,
        category,
        description,
        amount: Number(amount)
      });

      setDescription('');
      setAmount('');
      setShowModal(false);
      fetchMonthBudget(selectedMonth);
      fetchYearReport();
    } catch (err) {
      console.error('Failed to save budget entry:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/finance/budget/${id}`);
      setEntries(entries.filter(e => e.id !== id));
      fetchYearReport();
    } catch (err) {
      console.error('Failed to delete budget entry:', err);
    }
  };

  const income = entries.filter(e => e.entry_type === 'Income').reduce((s, e) => s + Number(e.amount || 0), 0);
  const expense = entries.filter(e => e.entry_type === 'Expense').reduce((s, e) => s + Number(e.amount || 0), 0);
  const savings = entries.filter(e => e.entry_type === 'Savings').reduce((s, e) => s + Number(e.amount || 0), 0);
  const investments = entries.filter(e => e.entry_type === 'Investment').reduce((s, e) => s + Number(e.amount || 0), 0);

  const netRemaining = income - expense - savings - investments;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Monthly Budget & Year-End Reporting"
        description="Plan and log your monthly income, user-written expenses, savings, and investments."
        onAdd={() => setShowModal(true)}
        addLabel="Add Budget Log"
      />

      {/* Month Selector & Controls */}
      <div className="bg-white border border-pink-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Month:</span>
          <input
            type="month"
            className="modal-input w-auto py-1 font-semibold text-xs"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>

        <div className="flex gap-2 text-xs">
          <span className="badge badge-pink font-semibold">Active Month: {selectedMonth}</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Income" value={`$${income.toLocaleString()}`} color="green" />
        <StatCard label="User Expenses Logged" value={`$${expense.toLocaleString()}`} color="red" />
        <StatCard label="Savings" value={`$${savings.toLocaleString()}`} color="blue" />
        <StatCard label="Investments" value={`$${investments.toLocaleString()}`} color="amber" />
      </div>

      {/* Budget Table */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-serif text-sm font-bold text-slate-800">
            Budget Table — {selectedMonth} ({entries.length} items)
          </h4>
          <span className={`text-xs font-bold ${netRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Unallocated / Net Balance: ${netRemaining.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Description / Written Expense</th>
                <th className="p-2.5 text-right">Amount ($)</th>
                <th className="p-2.5 text-right w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                    No budget entries logged for {selectedMonth}. Click "Add Budget Log" to start.
                  </td>
                </tr>
              ) : (
                entries.map((item) => (
                  <tr key={item.id} className="hover:bg-pink-50/20">
                    <td className="p-2.5">
                      <span className={`badge ${
                        item.entry_type === 'Income' ? 'badge-green' :
                        item.entry_type === 'Expense' ? 'badge-red' :
                        item.entry_type === 'Savings' ? 'badge-blue' : 'badge-amber'
                      }`}>
                        {item.entry_type}
                      </span>
                    </td>
                    <td className="p-2.5 font-medium text-slate-700">{item.category}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{item.description}</td>
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      ${Number(item.amount).toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right">
                      <button onClick={() => handleDelete(item.id)} className="btn-danger p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year-End Report Summary */}
      <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
        <h3 className="font-serif text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-pink-500" />
          Year-End Financial Overview ({currentYear})
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {MONTH_NAMES.map((mName, idx) => {
            const mKey = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
            const mEntries = yearReport.filter(r => r.month_key === mKey);
            const mIncome = mEntries.filter(r => r.entry_type === 'Income').reduce((s, r) => s + Number(r.total || 0), 0);
            const mExpense = mEntries.filter(r => r.entry_type === 'Expense').reduce((s, r) => s + Number(r.total || 0), 0);

            return (
              <div key={mKey} className="border border-slate-200 p-3 rounded-sm text-xs text-center bg-slate-50">
                <div className="font-bold text-slate-800 mb-1">{mName}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">+${mIncome.toLocaleString()}</div>
                <div className="text-[10px] text-rose-600 font-semibold">-${mExpense.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-pink-200 p-6 rounded-sm max-w-md w-full shadow-md space-y-4">
            <h3 className="font-serif text-lg font-bold text-slate-800">Add Budget Entry</h3>

            <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Target Month</label>
                <input type="month" className="modal-input font-semibold" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Budget Type</label>
                <select className="modal-select" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
                  <option value="Expense">Expense (User Written Log)</option>
                  <option value="Income">Income Source</option>
                  <option value="Savings">Savings Allocation</option>
                  <option value="Investment">Investment Allocation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Category</label>
                <select className="modal-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Utilities & Bills">Utilities & Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping & Tech">Shopping & Tech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Emergency Fund">Emergency Fund</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Description / Written Expense</label>
                <input type="text" required className="modal-input" placeholder="e.g. Grocery restock, Monthly Substack sub..." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-600 mb-1">Amount ($)</label>
                <input type="number" step="0.01" required className="modal-input" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Budget Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
