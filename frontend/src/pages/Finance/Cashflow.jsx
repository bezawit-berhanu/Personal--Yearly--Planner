import { useState, useEffect } from 'react';
import api from '../../api/client';
import SectionHeader from '../../components/shared/SectionHeader';
import StatCard from '../../components/shared/StatCard';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Shield } from 'lucide-react';

export default function Cashflow() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [entryType, setEntryType] = useState('Asset');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [notes, setNotes] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchCashflow = async () => {
    try {
      const res = await api.get('/finance/cashflow');
      setEntries(res.data.entries || []);
    } catch (err) {
      console.error('Failed to load cashflow:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashflow();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;

    try {
      await api.post('/finance/cashflow', {
        entry_type: entryType,
        name,
        amount: Number(amount),
        category,
        notes
      });

      setName('');
      setAmount('');
      setNotes('');
      setShowModal(false);
      fetchCashflow();
    } catch (err) {
      console.error('Failed to add cashflow entry:', err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.delete(`/finance/cashflow/${deleteTargetId}`);
      setEntries(entries.filter(e => e.id !== deleteTargetId));
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setDeleteTargetId(null);
    }
  };

  const assets = entries.filter(e => e.entry_type === 'Asset');
  const liabilities = entries.filter(e => e.entry_type === 'Liability');
  const income = entries.filter(e => e.entry_type === 'Income');
  const expenses = entries.filter(e => e.entry_type === 'Expense');

  const totalAssets = assets.reduce((s, a) => s + Number(a.amount || 0), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + Number(l.amount || 0), 0);
  const totalIncome = income.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const netWorth = totalAssets - totalLiabilities;
  const netCashflow = totalIncome - totalExpenses;

  const renderTable = (title, items, type, badgeColor) => (
    <div className="rounded-sm bg-white/40 backdrop-blur-md border-b border-pink-100/50 overflow-hidden mb-6">
      <div className="px-4 py-3 bg-pink-50/50 border-b border-pink-100/60 flex items-center justify-between">
        <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className={`badge ${badgeColor}`}>{type}</span>
          {title}
        </h4>
        <span className="font-serif text-sm font-bold text-slate-900">
          Total: ${items.reduce((s, i) => s + Number(i.amount || 0), 0).toLocaleString()}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-pink-100/80 bg-white/60 text-slate-800 font-bold uppercase tracking-wider">
              <th className="p-2.5 table-col-divider">Name / Description</th>
              <th className="p-2.5 table-col-divider">Category</th>
              <th className="p-2.5 table-col-divider text-right">Amount ($)</th>
              <th className="p-2.5 table-col-divider">Notes</th>
              <th className="p-2.5 text-right w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100/40">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500 font-medium italic">
                  No {type.toLowerCase()} items recorded. Click "Add Cashflow Entry" to log.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-pink-50/40">
                  <td className="p-2.5 table-col-divider font-bold text-slate-900">{item.name}</td>
                  <td className="p-2.5 table-col-divider"><span className="badge badge-gray">{item.category}</span></td>
                  <td className="p-2.5 table-col-divider text-right font-bold text-slate-900">
                    ${Number(item.amount).toLocaleString()}
                  </td>
                  <td className="p-2.5 table-col-divider font-semibold text-slate-700">{item.notes || '—'}</td>
                  <td className="p-2.5 text-right">
                    <button onClick={() => setDeleteTargetId(item.id)} className="btn-danger p-1 cursor-pointer">
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
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cashflow & Balance Statement"
        description="Track your Assets, Liabilities, Incomes, and Expenses to monitor Net Worth and Cashflow."
        onAdd={() => setShowModal(true)}
        addLabel="Add Cashflow Entry"
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={`$${totalAssets.toLocaleString()}`} color="green" />
        <StatCard label="Total Liabilities" value={`$${totalLiabilities.toLocaleString()}`} color="red" />
        <StatCard label="Net Worth" value={`$${netWorth.toLocaleString()}`} color={netWorth >= 0 ? 'blue' : 'red'} />
        <StatCard label="Monthly Cashflow" value={`$${netCashflow.toLocaleString()}`} color={netCashflow >= 0 ? 'green' : 'red'} />
      </div>

      {/* 4 Statement Tables */}
      {renderTable('Assets (What You Own)', assets, 'Asset', 'badge-green')}
      {renderTable('Liabilities (What You Owe)', liabilities, 'Liability', 'badge-red')}
      {renderTable('Incomes (Money Coming In)', income, 'Income', 'badge-blue')}
      {renderTable('Expenses (Money Going Out)', expenses, 'Expense', 'badge-amber')}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-pink-200 p-6 rounded-sm max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-serif text-lg font-bold text-slate-900">Add Cashflow Item</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <Trash2 className="hidden" /> {/* import X if needed or simple char */}
                <span className="text-sm font-bold text-slate-500 hover:text-slate-800">✕</span>
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold uppercase text-slate-700 mb-1">Entry Type</label>
                <select className="modal-select font-semibold" value={entryType} onChange={(e) => setEntryType(e.target.value)}>
                  <option value="Asset">Asset (Real Estate, Stock, Cash...)</option>
                  <option value="Liability">Liability (Mortgage, Debt, Loan...)</option>
                  <option value="Income">Income (Salary, Business, Dividend...)</option>
                  <option value="Expense">Expense (Rent, Utilities, Food...)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-700 mb-1">Item Name</label>
                <input type="text" required className="modal-input font-semibold" placeholder="e.g. Primary Residence, Tech Salary" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-700 mb-1">Amount ($)</label>
                <input type="number" step="0.01" required className="modal-input font-bold" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-700 mb-1">Category</label>
                <input type="text" className="modal-input font-semibold" placeholder="General, Real Estate, Work..." value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>

              <div>
                <label className="block font-semibold uppercase text-slate-700 mb-1">Notes</label>
                <input type="text" className="modal-input font-semibold" placeholder="Additional info..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Cashflow Entry"
        message="Are you sure you want to delete this cashflow entry? This action cannot be undone."
      />
    </div>
  );
}
