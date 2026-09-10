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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-200/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-9 h-9 bg-pink-100/90 border border-pink-300 text-pink-700 flex items-center justify-center rounded-sm group-hover:bg-pink-200 transition-colors">
                <Sparkles className="w-5 h-5" />
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

          {/* Desktop Top Navigation Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1.5 py-1" ref={dropdownRef}>
            {NAV_GROUPS.map((group, groupIdx) => {
              const isOpen = openDropdown === group.label;
              const hasActiveChild = group.items.some(i => i.id === db.activeTab);
              // Align dropdown to right if it's in the last two groups to avoid off-screen overflow
              const alignRight = groupIdx >= NAV_GROUPS.length - 2;

              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(group.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-sm cursor-pointer whitespace-nowrap ${
                      hasActiveChild || isOpen
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'text-slate-800 hover:text-pink-700 hover:bg-pink-50/90'
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Popup */}
                  {isOpen && (
                    <div
                      className={`absolute top-full mt-1 ${alignRight ? 'right-0' : 'left-0'} w-64 bg-white border border-pink-200 shadow-xl rounded-sm py-1.5 z-50`}
                    >
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-pink-700 border-b border-pink-100 mb-1">
                        {group.label}
                      </div>
                      <div className="max-h-[70vh] overflow-y-auto space-y-0.5">
                        {group.items.map((item) => {
                          const active = db.activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigateTo(item.id);
                                setOpenDropdown(null);
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                                active
                                  ? 'bg-pink-50 text-pink-900 font-bold border-l-4 border-pink-500'
                                  : 'text-slate-800 hover:bg-pink-50/70 hover:text-pink-800'
                              }`}
                            >
                              <span>{item.label}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3 shrink-0">
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-b border-pink-200 px-4 py-4 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl">
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

          {NAV_GROUPS.map((group) => (
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
