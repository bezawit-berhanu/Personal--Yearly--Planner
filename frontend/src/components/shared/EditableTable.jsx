import { useState } from 'react';
import { Trash2, Eye, EyeOff, Copy, Check, Phone, Mail } from 'lucide-react';
import { usePlannerContext } from '../../context/PlannerContext';

/* ─── Status badge helper ─────────────────────────────────────────────────── */
function statusClass(val = '') {
  const v = String(val).toLowerCase();
  if (['completed', 'active', 'optimal', 'connected', 'accepted', 'won', 'subscribed', 'purchased', 'given'].some(s => v.includes(s)))
    return 'badge badge-green';
  if (['progress', 'drafting', 'reviewing', 'evaluating', 'pursuing', 'warm', 'on track', 'reading', 'good'].some(s => v.includes(s)))
    return 'badge badge-amber';
  if (['blocked', 'critical', 'rejected', 'abandoned', 'disputed'].some(s => v.includes(s)))
    return 'badge badge-red';
  if (['planned', 'to read', 'to connect', 'to buy', 'wishlist', 'researching'].some(s => v.includes(s)))
    return 'badge badge-blue';
  return 'badge badge-gray';
}

/* ─── Secret Password Cell Renderer ───────────────────────────────────────── */
function SecretPasswordCell({ value, onChange }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1 min-w-[140px]">
      <input
        type={show ? 'text' : 'password'}
        className="cell-input flex-1 font-mono text-xs"
        value={value || ''}
        placeholder="Enter password..."
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="text-slate-400 hover:text-pink-600 p-1 cursor-pointer"
        title={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
      <button
        type="button"
        onClick={copyToClipboard}
        className="text-slate-400 hover:text-emerald-600 p-1 cursor-pointer"
        title="Copy password"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

/* ─── Editable Cell Component ────────────────────────────────────────────── */
function EditableCell({ field, value, onChange }) {
  if (!field) return <span className="text-xs text-slate-600">{String(value ?? '')}</span>;

  if (field.type === 'password') {
    return <SecretPasswordCell value={value} onChange={onChange} />;
  }

  switch (field.type) {
    case 'select':
      return (
        <select
          className="cell-select"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );

    case 'number':
      return (
        <input
          type="number"
          className="cell-input w-24"
          value={value ?? ''}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          className="cell-input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case 'rating':
      return (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={`text-sm leading-none transition-transform hover:scale-110 ${s <= (value || 0) ? 'text-amber-400' : 'text-slate-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      );

    case 'progress':
      return (
        <div className="flex items-center gap-2 min-w-[120px]">
          <div className="relative flex-1 h-2 bg-slate-100 rounded-sm overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-pink-500 rounded-sm transition-all"
              style={{ width: `${Math.min(100, value || 0)}%` }}
            />
          </div>
          <input
            type="number"
            min={0}
            max={100}
            className="cell-input w-12 text-xs"
            value={value ?? 0}
            onChange={(e) => onChange(Math.min(100, Math.max(0, Number(e.target.value))))}
          />
          <span className="text-xs text-slate-500">%</span>
        </div>
      );

    case 'textarea':
      return (
        <textarea
          className="cell-textarea"
          rows={2}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default: // text
      return (
        <input
          type="text"
          className="cell-input"
          value={value ?? ''}
          placeholder={field.placeholder || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

/* ─── Main EditableTable ──────────────────────────────────────────────────── */
export default function EditableTable({ config, items, dataKey }) {
  const { updateField, deleteItem } = usePlannerContext();

  const tableFields = config.tableFields || [];
  const fieldMap    = Object.fromEntries((config.fields || []).map((f) => [f.key, f]));

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-max border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {tableFields.map((fk) => (
                <th key={fk} className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 whitespace-nowrap">
                  {fieldMap[fk]?.label ?? fk}
                </th>
              ))}
              <th className="px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider text-slate-600 w-12">
                Del
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={tableFields.length + 1} className="px-6 py-12 text-center text-slate-400 italic text-xs">
                  No entries recorded yet. Click <strong>Add Entry</strong> to start logging.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-pink-50/20 transition-colors group">
                  {tableFields.map((fk) => {
                    const field = fieldMap[fk];
                    return (
                      <td key={fk} className="px-2 py-1.5 align-middle">
                        <EditableCell
                          field={field}
                          value={item[fk]}
                          onChange={(val) => updateField(dataKey, item.id, fk, val)}
                        />
                      </td>
                    );
                  })}
                  <td className="px-2 py-1.5 text-right align-middle">
                    <button
                      onClick={() => deleteItem(dataKey, item.id)}
                      className="btn-danger opacity-0 group-hover:opacity-100"
                      title="Delete row"
                    >
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
}
