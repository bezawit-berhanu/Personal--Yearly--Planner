import { useState, useRef, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import {
  Sparkles, LogOut, ChevronDown, Menu, X, User, Search, Palette,
  LayoutGrid, FileText, Target, DollarSign, Check, Flame
} from 'lucide-react';

export default function TopNavbar() {
  const { db, navigateTo } = usePlannerContext();
  const { user, logout } = useAuth();
  const { updateTheme } = useTheme();

  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const megaMenuRef = useRef(null);
  const themeMenuRef = useRef(null);

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

  // Filter items across all categories for mega menu search
  const filteredGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchFilter.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  const activeCategory = NAV_GROUPS.find(g => g.items.some(i => i.id === db.activeTab));

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-9 h-9 bg-pink-100/90 border border-pink-300 text-pink-700 flex items-center justify-center rounded-sm group-hover:bg-pink-200 transition-colors shadow-xs">
                <Sparkles className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold text-slate-900 tracking-tight leading-none">
                  Bezawit's 2027
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

            {/* UNIFIED SINGLE MEGA-DROPDOWN BUTTON */}
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer shadow-sm ${
                  megaMenuOpen || (activeCategory && db.activeTab !== 'dashboard')
                    ? 'bg-pink-500 text-white border border-pink-500'
                    : 'bg-white/85 text-slate-800 border border-slate-300 hover:border-pink-400 hover:bg-pink-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>All Sections ({NAV_GROUPS.reduce((acc, g) => acc + g.items.length, 0)})</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* SINGLE UNIFIED MEGA DROPDOWN POPUP */}
              {megaMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[850px] bg-white/95 backdrop-blur-xl border border-pink-200 shadow-2xl rounded-sm p-4 z-50 animate-fadeIn">
                  
                  {/* Search Bar inside Mega Dropdown */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-pink-100">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search all 46 planner sections (e.g., 'Cashflow', 'KPI', 'Health', 'Habits')..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="modal-input pl-9 text-xs font-semibold"
                        autoFocus
                      />
                    </div>
                    {searchFilter && (
                      <button
                        onClick={() => setSearchFilter('')}
                        className="text-xs text-slate-500 hover:text-pink-600 font-bold px-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* 4-Column Responsive Grid of All Categories */}
                  <div className="grid grid-cols-4 gap-4 max-h-[65vh] overflow-y-auto pr-1">
                    {filteredGroups.map((group) => (
                      <div key={group.label} className="space-y-1.5">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-pink-700 bg-pink-50/80 px-2 py-1 rounded-sm border-l-2 border-pink-500">
                          {group.label}
                        </h4>
                        <div className="space-y-0.5">
                          {group.items.map((item) => {
                            const active = db.activeTab === item.id;
                            return (
                              <button
                                key={item.id}
                                onClick={() => {
                                  navigateTo(item.id);
                                  setMegaMenuOpen(false);
                                  setSearchFilter('');
                                }}
                                className={`w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-sm transition-colors flex items-center justify-between cursor-pointer ${
                                  active
                                    ? 'bg-pink-500 text-white font-bold'
                                    : 'text-slate-800 hover:bg-pink-50 hover:text-pink-800'
                                }`}
                              >
                                <span className="truncate">{item.label}</span>
                                {active && <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-1"></span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Bezawit's Planner OS · Click any section to jump directly</span>
                    <button
                      onClick={() => navigateTo('appearance')}
                      className="text-pink-600 font-bold hover:underline"
                    >
                      Configure Themes & Wallpapers →
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
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-pink-200 shadow-xl rounded-sm py-2 z-50 text-xs">
                  <div className="px-3 py-1 font-bold text-[10px] uppercase tracking-widest text-pink-700 border-b border-pink-100 mb-1">
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
                      className="w-full text-left px-3 py-2 hover:bg-pink-50 text-slate-800 font-semibold transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>{preset.label}</span>
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: preset.bg === 'transparent' ? '#E879A0' : preset.bg }}
                      />
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1 px-3">
                    <button
                      onClick={() => { navigateTo('appearance'); setThemeMenuOpen(false); }}
                      className="w-full text-center text-[11px] font-bold text-pink-600 hover:underline py-1"
                    >
                      Custom Wallpaper & Settings →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-300 pl-3">
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

      {/* Mobile Drawer Menu with Full Search & All 46 Sections */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-pink-200 px-4 py-4 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
          {user && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold">
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
              placeholder="Search all 46 planner sections..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="modal-input pl-9 text-xs font-semibold"
            />
          </div>

          {filteredGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-700 px-1 border-b border-pink-100 pb-1">
                {group.label}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      setMobileMenuOpen(false);
                      setSearchFilter('');
                    }}
                    className={`text-left px-2.5 py-2 text-xs rounded-sm transition-colors cursor-pointer ${
                      db.activeTab === item.id
                        ? 'bg-pink-500 text-white font-bold shadow-xs'
                        : 'text-slate-800 bg-slate-100/90 hover:bg-pink-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
