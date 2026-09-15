import { Plus } from 'lucide-react';

export default function SectionHeader({ title, description, onAdd, addLabel = 'Add Entry', children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#C5A059]/30 mb-6">
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#3B0D18] tracking-tight leading-none">{title}</h2>
        {description && (
          <p className="text-xs text-[#6B1D2F]/70 font-medium mt-1.5 tracking-wide">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary rounded-none px-4 py-2 text-xs uppercase tracking-wider font-bold shadow-sm">
            <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
