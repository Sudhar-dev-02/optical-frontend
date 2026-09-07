import React, { useState, useEffect } from 'react';
import { Eye, Clock, Phone, Database, Sparkles, Sun, Moon, Menu, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Header({ isOnline, isDarkMode, setIsDarkMode, onToggleMobileMenu, currentUser, onLogout }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const datePart = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
      const timePart = now.toLocaleTimeString('en-GB');
      setTimeStr(`${datePart} & ${timePart}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`px-3 sm:px-6 py-2.5 sm:py-3 border-b backdrop-blur-2xl transition-all duration-300 sticky top-0 z-30 shadow-sm ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-800 text-slate-100' 
        : 'bg-white/80 border-white/60 text-slate-900'
    }`}>
      <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Menu Hamburger Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className={`p-2 rounded-xl border flex md:hidden items-center justify-center transition-all cursor-pointer shrink-0 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-sky-400' : 'bg-slate-100 border-slate-300 text-sky-600'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo Container */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200/80 shadow-sm overflow-hidden shrink-0">
            <img 
              src={logoImg} 
              alt="Optics India Logo" 
              className="w-full h-full object-contain scale-130" 
            />
          </div>

          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <h1 className="text-base sm:text-xl font-brand font-semibold tracking-tight truncate flex items-center gap-0.5">
                <span className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>Optics</span>
                <span className="text-sky-500 font-medium">India</span>
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide hidden sm:flex items-center gap-1 border ${
                isDarkMode 
                  ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300' 
                  : 'bg-blue-50 border-blue-200/80 text-blue-700'
              }`}>
                <Sparkles className="w-2.5 h-2.5 text-cyan-500" /> POS v2.0
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] flex items-center gap-1 sm:gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <span className="truncate">Optical Billing</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 font-semibold text-sky-500 shrink-0">
                <Phone className="w-3 h-3" /> +91 90432 29107 / +91 99524 17748
              </span>
            </p>
          </div>
        </div>

        {/* Right Section: Logged-in User, Theme Switcher, Clock & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold">
          {/* Active Logged In User Badge */}
          {currentUser && (
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${
              currentUser.role === 'admin'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                : 'bg-sky-500/15 border-sky-500/30 text-sky-400'
            }`}>
              {currentUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> : <UserCheck className="w-3.5 h-3.5 text-sky-400" />}
              <span>{currentUser.role === 'admin' ? 'Admin' : 'Sales'}: <strong>{currentUser.phone}</strong></span>
            </div>
          )}

          {/* Desktop Glass Theme Toggle Switch */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100/90 border-slate-300/80 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-slate-200 font-bold hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                <span className="text-slate-800 font-bold hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Live Date & Time Counter */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-mono font-bold text-[10px] sm:text-xs shadow-2xs ${
            isDarkMode 
              ? 'bg-slate-950/80 border-slate-800 text-slate-300' 
              : 'bg-slate-100/80 border-slate-300/80 text-slate-800'
          }`}>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-500" />
            <span>{timeStr}</span>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              title="Logout from session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
