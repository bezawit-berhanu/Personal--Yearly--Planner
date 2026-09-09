import { useState } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import StatCard from '../shared/StatCard';
import SectionHeader from '../shared/SectionHeader';
import EditableTable from '../shared/EditableTable';
import AddEntryModal from '../shared/AddEntryModal';
import { SECTION_CONFIGS } from '../../data/sectionConfigs';

export default function GenericSection({ sectionId }) {
  const { db, addItem } = usePlannerContext();
  const [modal, setModal] = useState(false);

  const config = SECTION_CONFIGS[sectionId];
  if (!config) {
    return (
      <div className="flex items-center justify-center h-48 text-cream-400 italic">
        Section "{sectionId}" not configured yet.
      </div>
    );
  }

  const items   = db[config.dataKey] || [];
  const summary = config.summary ? config.summary(items) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title={config.title}
        description="Every field is fully editable — click any cell to edit. Changes save automatically."
        onAdd={() => setModal(true)}
      />

      {/* Auto-calculated summary cards */}
      {summary.length > 0 && (
        <div className={`grid gap-4 ${summary.length <= 2 ? 'grid-cols-2' : summary.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
          {summary.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
          ))}
        </div>
      )}

      {/* Editable table */}
      <EditableTable config={config} items={items} dataKey={config.dataKey} />

      {modal && (
        <AddEntryModal
          config={config}
          onSave={(data) => { addItem(config.dataKey, data); setModal(false); }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
