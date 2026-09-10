import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  UtensilsCrossed,
  HeartHandshake,
  Bot,
  LayoutDashboard,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  PlusCircle,
  Palette,
  Check,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme, palette, changePalette, palettes } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);
  const paletteRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close palette dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target)) {
        setPaletteDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    ...(isAuthenticated
      ? [
          {
            name: 'AI Advisor',
            path: '/chat',
            badge: 'Groq',
            icon: <Bot className="w-4 h-4 text-brand-400" />,
          },
          {
            name: 'Find Food',
            path: '/donations',
            icon: <UtensilsCrossed className="w-4 h-4" />,
          },
          {
            name: 'Donate Food',
            path: '/donate',
            icon: <PlusCircle className="w-4 h-4" />,
          },
          {
            name: 'Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;
  const currentPalette = palettes?.find((p) => p.id === palette) || palettes?.[0];

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 p-0.5 border border-brand-500/20 shadow-lg shadow-brand-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <img src="/logo.png" alt="Replate Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight font-display text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                Replate<span className="text-brand-500">.</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 -mt-1">
                Food Rescue AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
                {link.badge && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Color Palette Switcher Dropdown */}
            <div className="relative" ref={paletteRef}>
              <button
                onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
                title="Change color theme"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-brand-500/50 hover:bg-brand-500/5 transition-all text-xs font-semibold"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-inner ring-1 ring-white/20"
                  style={{
                    background: `linear-gradient(135deg, ${currentPalette?.color}, ${currentPalette?.secondary})`,
                  }}
                />
                <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {paletteDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Color Palette
                    </p>
                  </div>

                  <div className="space-y-1">
                    {palettes?.map((p) => {
                      const isSelected = palette === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            changePalette(p.id);
                            setPaletteDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-4 h-4 rounded-full shadow-sm ring-2 ring-black/10 shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${p.color}, ${p.secondary})`,
                              }}
                            />
                            <div className="text-left">
                              <p className="leading-tight">{p.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.desc}</p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark/light mode"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-all hover:scale-105"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 hover:border-brand-500 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {user?.name}
                    </p>
                    <p className="text-[10px] text-brand-500 capitalize">{user?.role}</p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Get Started
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          {/* Palette Selector in Mobile */}
          <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Select Theme Color
            </p>
            <div className="grid grid-cols-3 gap-2">
              {palettes?.map((p) => (
                <button
                  key={p.id}
                  onClick={() => changePalette(p.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-semibold border ${
                    palette === p.id
                      ? 'border-brand-500 bg-brand-500/20 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-300'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ background: p.color }}
                  />
                  <span className="truncate">{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl text-base font-medium ${
                isActive(link.path)
                  ? 'bg-brand-500/20 text-brand-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {link.icon}
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-slate-400">
                  Signed in as <strong className="text-white">{user?.name}</strong> ({user?.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/20 text-rose-300 font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center p-3 rounded-xl bg-slate-800 text-white font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center p-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold shadow-lg shadow-brand-500/25"
                >
                  Join Replate Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
