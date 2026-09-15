import { useState, useEffect, useRef } from 'react';
import { X, Check, Star } from 'lucide-react';

/* ─── Field input renderers for the modal ─────────────────────────────────── */
function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case 'password':
      return (
        <input
          type="password"
          className="modal-input font-mono"
          value={value ?? ''}
          placeholder={field.placeholder ?? 'Enter password...'}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'textarea':
      return (
        <textarea
          className="modal-input resize-none"
          rows={3}
          value={value ?? ''}
          placeholder={field.placeholder ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'select':
      return (
        <select
          className="modal-select"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Select {field.label}…</option>
          {(field.options || []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      );

    case 'number':
      return (
        <input
          type="number"
          className="modal-input"
          value={value ?? ''}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder ?? '0'}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          required={field.required}
        />
      );

    case 'date':
      return (
        <input
          type="date"
          className="modal-input"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );

    case 'rating':
      return (
        <div className="flex gap-1 py-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s === value ? 0 : s)}
              className="p-1 cursor-pointer focus:outline-none"
              title={`Rate ${s} stars`}
            >
              <Star className={`w-5 h-5 transition-all hover:scale-110 ${s <= (value || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
            </button>
          ))}
        </div>
      );

    case 'progress':
      return (
        <div className="flex items-center gap-3">
          <input
            type="range"
            className="flex-1 accent-[#6B1D2F]"
            min={0}
            max={100}
            value={value ?? 0}
            onChange={(e) => onChange(Number(e.target.value))}
          />
          <span className="text-xs font-bold text-[#3B0D18] w-10 text-right">{value ?? 0}%</span>
        </div>
      );

    default: // text
      return (
        <input
          type="text"
          className="modal-input"
          placeholder={field.placeholder || ''}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

export default function AddEntryModal({ isOpen, onClose, onSave, config }) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const allFields = config?.fields || DEFAULT_FIELDS;

  useEffect(() => {
    const init = {};
    allFields.forEach((f) => {
      init[f.key] = f.default !== undefined ? f.default : '';
    });
    setForm(init);
    setErrors({});
  }, [config, isOpen]);

  if (!isOpen || !config) return null;

  function handleChange(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: false }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    allFields.forEach((f) => {
      if (f.required && (form[f.key] === undefined || form[f.key] === '')) {
        newErrors[f.key] = true;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 150));
    onSave(form);
    setSaving(false);
  }

  const gridFields = allFields.filter((f) => f.type !== 'textarea');
  const wideFields = allFields.filter((f) => f.type === 'textarea');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-modal rounded-none shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col border border-[#C5A059]/40 bg-[#FFFDF7]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C5A059]/30 bg-[#FDFBF5]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B1D2F]">Add New Entry</span>
            <h3 className="font-serif text-lg font-bold text-[#3B0D18]">{config.title}</h3>
          </div>
          <button onClick={onClose} className="btn-ghost p-1 text-[#6B1D2F]/60 hover:text-[#6B1D2F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body & Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {gridFields.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gridFields.map((field) => (
                  <div key={field.key} className={field.type === 'progress' || field.type === 'rating' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold uppercase text-[#6B1D2F]/80 mb-1">
                      {field.label} {field.required && <span className="text-rose-600">*</span>}
                    </label>
                    <FieldInput field={field} value={form[field.key]} onChange={(v) => handleChange(field.key, v)} />
                    {errors[field.key] && (
                      <p className="text-rose-600 text-[11px] mt-0.5">Required field</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {wideFields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-semibold uppercase text-[#6B1D2F]/80 mb-1">
                  {field.label} {field.required && <span className="text-rose-600">*</span>}
                </label>
                <FieldInput field={field} value={form[field.key]} onChange={(v) => handleChange(field.key, v)} />
                {errors[field.key] && (
                  <p className="text-rose-600 text-[11px] mt-0.5">Required field</p>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#C5A059]/30 bg-[#FDFBF5] shrink-0">
            <span className="text-[11px] text-[#6B1D2F]/60">* Required fields</span>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="btn-secondary text-xs">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary text-xs">
                {saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
