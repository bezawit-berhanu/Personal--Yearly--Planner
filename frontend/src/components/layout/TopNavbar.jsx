import { useState, useRef, useEffect } from 'react';
import { usePlannerContext } from '../../context/PlannerContext';
import { useAuth } from '../../context/AuthContext';
import { NAV_GROUPS } from '../../data/sectionConfigs';
import { Sparkles, LogOut, ChevronDown, Menu, X, User } from 'lucide-react';

export default function TopNavbar() {
  const { db, navigateTo } = usePlannerContext();
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-9 h-9 bg-pink-100 border border-pink-300 text-pink-600 flex items-center justify-center rounded-sm group-hover:bg-pink-200 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-base font-bold text-slate-900 tracking-tight leading-none">
                  Bezawit's 2027
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600">
                  Planner OS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Top Navigation Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1" ref={dropdownRef}>
            {NAV_GROUPS.map((group) => {
              const isOpen = openDropdown === group.label;
              const hasActiveChild = group.items.some(i => i.id === db.activeTab);

              return (
                <div key={group.label} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all rounded-sm cursor-pointer whitespace-nowrap ${
                      hasActiveChild
                        ? 'bg-pink-500 text-white border border-pink-500'
                        : 'text-slate-700 hover:text-pink-600 hover:bg-pink-50'
                    }`}
                  >
                    {group.label}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute left-0 mt-1.5 w-56 bg-white border border-slate-200 shadow-md py-1 z-50 rounded-sm">
                      {group.items.map((item) => {
                        const active = db.activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              navigateTo(item.id);
                              setOpenDropdown(null);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                              active
                                ? 'bg-pink-50 font-bold text-pink-700 border-l-2 border-pink-500'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-pink-600'
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
            {user && (
              <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 bg-pink-500 text-white flex items-center justify-center font-bold text-xs rounded-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'B'}
                </div>
                <span className="text-xs font-semibold text-slate-700">{user.name}</span>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="btn-ghost p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden btn-ghost p-2 text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-pink-200 px-4 py-4 max-h-[80vh] overflow-y-auto space-y-4 shadow-lg">
          {user && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-semibold text-slate-700">Signed in as {user.name}</span>
              <button onClick={logout} className="text-rose-600 font-semibold flex items-center gap-1 cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-pink-600 px-1">
                {group.label}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigateTo(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-2.5 py-2 text-xs rounded-sm transition-colors cursor-pointer ${
                      db.activeTab === item.id
                        ? 'bg-pink-500 text-white font-bold'
                        : 'text-slate-700 bg-slate-50 hover:bg-pink-50'
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
