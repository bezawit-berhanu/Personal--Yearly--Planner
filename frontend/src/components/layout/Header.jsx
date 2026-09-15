import { Menu, Calendar } from 'lucide-react';
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
    <header className="h-14 shrink-0 bg-[#FFFDF7] border-b border-[#C5A059]/30 flex items-center justify-between px-5 shadow-xs z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="btn-ghost p-2 text-[#6B1D2F] hover:bg-[#6B1D2F]/10 cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="font-serif text-lg font-bold text-[#3B0D18]">
          {getLabel(db.activeTab)}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center text-xs font-semibold text-[#6B1D2F] bg-[#6B1D2F]/5 border border-[#C5A059]/30 px-3 py-1.5 rounded-full">
          <Calendar className="w-3.5 h-3.5 text-[#C5A059] mr-1.5" />
          <span>{today}</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-[#6B1D2F] border border-[#C5A059]/40 flex items-center justify-center text-[#E6C687] text-sm font-bold font-serif shadow-xs">
          B
        </div>
      </div>
    </header>
  );
}
