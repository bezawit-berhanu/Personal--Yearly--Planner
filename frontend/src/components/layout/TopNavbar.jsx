import { useState, useRef, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import {
  Sparkles, LogOut, ChevronDown, Menu, X, User, Search, Palette,
  LayoutGrid, FileText, Target, DollarSign, Check, Flame,
  BarChart3, CheckSquare, Repeat, PieChart, CreditCard, ShoppingBag,
  Crown, Rocket, Users, Award, Trophy, Zap, Compass, Briefcase,
  GraduationCap, BookMarked, BookOpen, Star, Activity, Smile, Plane,
  MapPin, CalendarCheck, CalendarRange, Calendar, CalendarDays, Sun,
  StickyNote, Database, Cpu, Lightbulb, Feather, BookHeart, PenTool,
  Bookmark, Book, CheckCircle2, HeartHandshake, Network, UserCheck,
  Cake, Gift, Shield, LayoutDashboard
} from 'lucide-react';

const ICON_MAP = {
  LayoutDashboard, BarChart3, FileText, Target, CheckSquare, Repeat,
  DollarSign, PieChart, CreditCard, ShoppingBag, Crown, Rocket, Users,
  Award, Trophy, Zap, Compass, Briefcase, GraduationCap, BookMarked,
  BookOpen, Star, Activity, Smile, Plane, MapPin, CalendarCheck,
  CalendarRange, Calendar, CalendarDays, Sun, StickyNote, Database,
  Cpu, Lightbulb, Feather, BookHeart, PenTool, Bookmark, Book,
  CheckCircle2, HeartHandshake, Network, UserCheck, Cake, Gift,
  Shield, Palette
};

export default function TopNavbar() {
  const { db, navigateTo } = usePlannerContext();
  const { user, logout } = useAuth();
  const { theme, updateTheme } = useTheme();

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const megaMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

  const TOTAL_SECTIONS = NAV_GROUPS.reduce((acc, g) => acc + g.items.length, 0);

  useEffect(() => {
    function handleClickOutside(e) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setMegaMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const THEME_PRESETS = [
    { label: 'Pure White & Pink', bg: '#FFFFFF', text: '#1A1A2E', accent: '#E879A0', wallpaper: '' },
    { label: 'Soft Rose Glass', bg: '#FFF5F8', text: '#1A1A2E', accent: '#D85D8B', wallpaper: '' },
    { label: 'Dark Rose Night', bg: '#1E1B2E', text: '#F8FAFC', accent: '#F9A8C9', wallpaper: '' },
    { label: 'Aesthetic Wallpaper', bg: '#FFFFFF', text: '#0F172A', accent: '#E879A0', wallpaper: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2000&q=80' },
  ];

  // Filter groups by category selection and search query
  const filteredGroups = NAV_GROUPS
    .filter(group => selectedCategory === 'ALL' || group.label === selectedCategory)
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.label.toLowerCase().includes(searchFilter.toLowerCase())
      )
    }))
    .filter(group => group.items.length > 0);

  const totalFilteredItems = filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  const activeCategory = NAV_GROUPS.find(g => g.items.some(i => i.id === db.activeTab));

  return (
    <header className="sticky top-0 z-[10000] bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-9 h-9 bg-pink-100/90 text-pink-700 flex items-center justify-center rounded-sm group-hover:bg-pink-200 transition-colors shadow-xs">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold text-slate-900 tracking-tight leading-none">
                  {user?.name ? `${user.name}'s` : 'Personal'} 2027
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-700">
                  Planner OS
                </span>
              </div>
            </button>
          </div>

          {/* Unified Navigation Dropdown (Desktop) */}
          <div className="hidden lg:flex items-center gap-2" ref={megaMenuRef}>
            
            {/* Quick 1-Click Shortcuts */}
            <button
              onClick={() => navigateTo('dashboard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-sm transition-all cursor-pointer ${
                db.activeTab === 'dashboard'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-slate-800 hover:bg-pink-50 hover:text-pink-700'
              }`}
            >
              Dashboard
            </button>

            {/* UNIFIED SINGLE MEGA-DROPDOWN BUTTON WITH EXACT COUNT (52) */}
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-sm ${
                  megaMenuOpen || (activeCategory && db.activeTab !== 'dashboard')
                    ? 'bg-pink-500 text-white'
                    : 'bg-white/85 text-slate-800 hover:bg-pink-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Planner Sections</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* SINGLE UNIFIED MEGA DROPDOWN POPUP */}
              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[92vw] max-w-5xl glass-modal shadow-2xl rounded-sm p-5 z-[10000] animate-fadeIn max-h-[85vh] flex flex-col">
                  
                  {/* Top Bar: Title & Search */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>Planner Sections</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        Click any section below to jump directly to your view
                      </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search planner sections (e.g. 'Cashflow', 'Notes', 'Journal')..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="modal-input pl-9 text-xs font-semibold w-full"
                        autoFocus
                      />
                      {searchFilter && (
                        <button
                          onClick={() => setSearchFilter('')}
                          className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-pink-600 font-bold"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Multi-Column Responsive Grid of All Categories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-1 max-h-[60vh]">
                    {filteredGroups.map((group) => (
                      <div key={group.label} className="bg-white/40 rounded-sm p-2.5 space-y-1.5 flex flex-col justify-start">
                        <div className="flex items-center justify-between bg-pink-50/90 px-2 py-1 rounded-sm">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-pink-700 truncate">
                            {group.label}
                          </h4>
                        </div>
                        <div className="space-y-0.5">
                          {group.items.map((item) => {
                            const active = db.activeTab === item.id;
                            const IconComponent = ICON_MAP[item.icon] || FileText;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigateTo(item.id);
                                  setMegaMenuOpen(false);
                                  setSearchFilter('');
                                }}
                                className={`w-full text-left px-2 py-1.5 text-xs font-semibold rounded-sm transition-colors flex items-center justify-between cursor-pointer ${
                                  active
                                    ? 'bg-pink-500 text-white font-bold shadow-xs'
                                    : 'text-slate-800 hover:bg-pink-50 hover:text-pink-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <IconComponent className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-pink-600'}`} />
                                  <span className="truncate">{item.label}</span>
                                </div>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"></span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer info bar */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-semibold shrink-0">
                    <span>{user?.name ? `${user.name}'s` : 'Personal'} Planner OS</span>
                    <button
                      onClick={() => { navigateTo('appearance'); setMegaMenuOpen(false); }}
                      className="text-pink-600 font-bold hover:underline"
                    >
                      Configure Themes & Blurry Wallpapers →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Profile, Theme Selector & Mobile Hamburger */}
          <div className="flex items-center gap-2 shrink-0">

            {/* Instant Theme Chooser Dropdown */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="btn-secondary text-xs p-2 sm:px-3 sm:py-1.5"
                title="Choose UI Theme"
              >
                <Palette className="w-4 h-4 text-pink-600" />
                <span className="hidden sm:inline">Theme</span>
              </button>

              {themeMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass-modal shadow-2xl rounded-sm py-2 z-[10000] animate-fadeIn">
                  <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-widest text-pink-700 mb-1">
                    Select Preset Theme
                  </div>
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        updateTheme({
                          bg_color: preset.bg,
                          text_color: preset.text,
                          accent_color: preset.accent,
                          bg_wallpaper: preset.wallpaper
                        });
                        setThemeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-pink-50/80 text-slate-800 font-semibold transition-colors flex items-center justify-between cursor-pointer text-xs"
                    >
                      <span>{preset.label}</span>
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: preset.bg === 'transparent' ? '#E879A0' : preset.bg }}
                      />
                    </button>
                  ))}

                  {/* Wallpaper Blur Quick Toggle */}
                  <div className="mt-1 pt-2 px-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-pink-700 mb-1 flex items-center justify-between">
                      <span>Wallpaper Blur</span>
                      <span className="font-extrabold text-pink-600">
                        {theme.wallpaper_blur !== undefined ? theme.wallpaper_blur : (theme.custom_theme_json?.wallpaper_blur ?? 0)}px
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 mb-2">
                      {[
                        { label: '0px', val: 0 },
                        { label: '4px', val: 4 },
                        { label: '8px', val: 8 },
                        { label: '16px', val: 16 }
                      ].map((b) => {
                        const active = (theme.wallpaper_blur !== undefined ? theme.wallpaper_blur : (theme.custom_theme_json?.wallpaper_blur ?? 0)) === b.val;
                        return (
                          <button
                            key={b.val}
                            onClick={() => updateTheme({ wallpaper_blur: b.val })}
                            className={`py-0.5 text-[10px] font-bold rounded-sm cursor-pointer transition-colors text-center ${
                              active
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/70 text-slate-700 hover:bg-pink-50'
                            }`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Card Transparency / Opacity Quick Selector */}
                    <div className="text-[10px] font-bold uppercase tracking-wider text-pink-700 mb-1 flex items-center justify-between">
                      <span>Card Transparency</span>
                      <span className="font-extrabold text-pink-600">
                        {100 - (theme.card_opacity !== undefined ? theme.card_opacity : (theme.custom_theme_json?.card_opacity ?? 60))}% Translucent
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { label: '100%', val: 0 },
                        { label: '70%', val: 30 },
                        { label: '40%', val: 60 },
                        { label: '20%', val: 80 },
                        { label: '0%', val: 100 }
                      ].map((o) => {
                        const currentOp = theme.card_opacity !== undefined ? theme.card_opacity : (theme.custom_theme_json?.card_opacity ?? 60);
                        const active = Number(currentOp) === o.val;
                        return (
                          <button
                            key={o.val}
                            onClick={() => updateTheme({ card_opacity: o.val })}
                            className={`py-0.5 text-[9px] font-bold rounded-sm cursor-pointer transition-colors text-center ${
                              active
                                ? 'bg-pink-500 text-white'
                                : 'bg-white/70 text-slate-700 hover:bg-pink-50'
                            }`}
                          >
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2 pt-1.5 px-3">
                    <button
                      onClick={() => { navigateTo('appearance'); setThemeMenuOpen(false); }}
                      className="w-full text-center text-[11px] font-bold text-pink-600 hover:underline py-1 cursor-pointer"
                    >
                      Custom Wallpaper & Settings →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-3">
                <div className="w-8 h-8 bg-pink-500 text-white flex items-center justify-center font-bold text-xs rounded-sm shadow-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'B'}
                </div>
                <span className="text-xs font-bold text-slate-800">{user.name}</span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="btn-ghost p-1.5 text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden btn-ghost p-2 text-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu with Full Search & All 52 Sections */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl px-4 py-4 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
          {user && (
            <div className="flex items-center justify-between pb-3 text-xs font-bold">
              <span className="text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-pink-600" /> Signed in as {user.name}
              </span>
              <button onClick={logout} className="text-rose-600 flex items-center gap-1 cursor-pointer hover:underline">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          {/* Mobile Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search all ${TOTAL_SECTIONS} planner sections...`}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="modal-input pl-9 text-xs font-semibold"
            />
          </div>

          {filteredGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-700 px-1 pb-1 flex items-center justify-between">
                <span>{group.label}</span>
                <span className="bg-pink-100 text-pink-600 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {group.items.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.icon] || FileText;
                  const active = db.activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateTo(item.id);
                        setMobileMenuOpen(false);
                        setSearchFilter('');
                      }}
                      className={`text-left px-2.5 py-2 text-xs rounded-sm transition-colors cursor-pointer flex items-center gap-2 ${
                        active
                          ? 'bg-pink-500 text-white font-bold shadow-xs'
                          : 'text-slate-800 bg-slate-100/90 hover:bg-pink-50'
                      }`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-pink-600'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}

