import { Plus } from 'lucide-react';

export default function SectionHeader({ title, description, onAdd, addLabel = 'Add Entry', children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-cream-800">{title}</h2>
        {description && (
          <p className="text-sm text-cream-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {children}
        {onAdd && (
          <button onClick={onAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
