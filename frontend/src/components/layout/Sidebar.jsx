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
  Shield, ChevronDown, ChevronRight, Sparkles
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
        className="w-full flex items-center justify-between px-3 py-1.5 font-serif text-xs font-bold uppercase tracking-widest text-[#6B1D2F] hover:text-[#5B1425] transition cursor-pointer"
      >
        {group.label}
        {open ? <ChevronDown className="w-3 h-3 text-[#C5A059]" /> : <ChevronRight className="w-3 h-3 text-[#C5A059]" />}
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 cursor-pointer
                  ${active
                    ? 'bg-[#6B1D2F] text-[#FFFDF7] font-bold shadow-xs border border-[#C5A059]/40'
                    : 'text-[#3B0D18] hover:bg-[#FFFDF7] hover:text-[#6B1D2F]'
                  }`}
              >
                {Icon && <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#E6C687]' : 'text-[#C5A059]'}`} />}
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
  const { user } = useAuth();

  return (
    <aside
      className={`
        flex flex-col bg-[#F8F3EC]/90 border-r border-[#6B1D2F]/15 backdrop-blur-md z-20 transition-all duration-300
        ${db.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
        shrink-0
      `}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#6B1D2F]/15 bg-[#FFFDF7] shrink-0">
        <h1 className="font-serif text-lg font-bold text-[#3B0D18] tracking-wide leading-tight flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#C5A059]" />
          {user?.name ? `${user.name}'s` : 'Personal'} 2027
        </h1>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#6B1D2F] mt-0.5">
          Royal Planner OS
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {NAV_GROUPS.map((group) => (
          <NavGroup key={group.label} group={group} />
        ))}
      </nav>

    </aside>
  );
}
