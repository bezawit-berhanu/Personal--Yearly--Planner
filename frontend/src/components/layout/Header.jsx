import { Menu } from 'lucide-react';
import { usePlannerContext } from '../../context/PlannerContext';
import { NAV_GROUPS } from '../../data/sectionConfigs';

function getLabel(tab) {
  for (const g of NAV_GROUPS) {
    const found = g.items.find((i) => i.id === tab);
    if (found) return found.label;
  }
  return 'Planner';
}

export default function Header() {
  const { db, toggleSidebar } = usePlannerContext();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <header className="h-14 shrink-0 bg-white border-b border-cream-200 flex items-center justify-between px-5 shadow-subtle z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn-ghost p-2 rounded-lg"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-lg font-semibold text-cream-800">
          {getLabel(db.activeTab)}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs font-medium text-cream-500 bg-cream-100 border border-cream-200 px-3 py-1.5 rounded-full">
          📅 {today}
        </span>
        <div className="w-8 h-8 rounded-full bg-cream-700 flex items-center justify-center text-white text-sm font-bold font-serif">
          B
        </div>
      </div>
    </header>
  );
}
