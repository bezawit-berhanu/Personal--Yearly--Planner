import {
  LayoutDashboard, BarChart3, Target, CheckSquare, Repeat,
  Crown, Rocket, Users, Award, Trophy, Zap, Compass,
  Briefcase, GraduationCap, BookMarked, BookOpen, Star,
  DollarSign, CreditCard, ShoppingBag,
  Activity, Smile,
  CalendarDays, Calendar, CalendarRange, CalendarCheck, Sun,
  Database, Cpu, Lightbulb, Search, Feather, Palette,
  PenTool, FileText, Bookmark, BookHeart,
  Network, HeartHandshake, UserCheck, Cake, Gift,
  Plane, MapPin, Book, CheckCircle2,
  Shield, ChevronDown, ChevronRight,
} from 'lucide-react';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import { usePlannerContext } from '../../context/PlannerContext';
import { useState } from 'react';

const ICON_MAP = {
  LayoutDashboard, BarChart3, Target, CheckSquare, Repeat,
  Crown, Rocket, Users, Award, Trophy, Zap, Compass,
  Briefcase, GraduationCap, BookMarked, BookOpen, Star,
  DollarSign, CreditCard, ShoppingBag,
  Activity, Smile,
  CalendarDays, Calendar, CalendarRange, CalendarCheck, Sun,
  Database, Cpu, Lightbulb, Search, Feather, Palette,
  PenTool, FileText, Bookmark, BookHeart,
  Network, HeartHandshake, UserCheck, Cake, Gift,
  Plane, MapPin, Book, CheckCircle2,
  Shield,
};

function NavGroup({ group }) {
  const { db, navigateTo } = usePlannerContext();
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-cream-500 hover:text-cream-700 transition"
      >
        {group.label}
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {open && (
        <div className="space-y-0.5 mt-0.5">
          {group.items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = db.activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all duration-150
                  ${active
                    ? 'bg-white text-cream-700 font-semibold shadow-subtle border border-cream-200'
                    : 'text-cream-600 hover:bg-cream-150 hover:text-cream-700'
                  }`}
              >
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { db } = usePlannerContext();

  return (
    <aside
      className={`
        flex flex-col bg-cream-100 border-r border-cream-200 z-20 transition-all duration-300
        ${db.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
        shrink-0
      `}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-cream-200 bg-white shrink-0">
        <h1 className="font-serif text-lg font-bold text-cream-800 tracking-wide leading-tight">
          Bezawit's 2019
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-cream-500 mt-0.5">
          Personal OS · Planner
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-cream-200 text-center text-[11px] text-cream-400 bg-white shrink-0">
        ✨ Fully Editable · Auto-saves
      </div>
    </aside>
  );
}
