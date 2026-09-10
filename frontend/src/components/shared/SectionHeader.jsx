import { Plus } from 'lucide-react';

export default function SectionHeader({ title, description, onAdd, addLabel = 'Add Entry', children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-pink-100/50 mb-6">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none">{title}</h2>
        {description && (
          <p className="text-xs text-slate-500 font-medium mt-1.5 tracking-wide">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary rounded-full px-4 py-2 text-xs uppercase tracking-wider font-bold shadow-xs">
            <Plus className="w-3.5 h-3.5" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
