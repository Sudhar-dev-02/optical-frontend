import React, { useState, useEffect } from 'react';
import { Clock, Phone, Sun, Moon, Menu, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
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
        ? 'bg-[#061833]/90 border-[#0B2D5B]/60 text-slate-100' 
        : 'bg-white/90 border-[#0B2D5B]/15 text-[#0B2D5B]'
    }`}>
      <div className="w-full flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Details */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Menu Hamburger Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className={`p-2 rounded-xl border flex md:hidden items-center justify-center transition-all cursor-pointer shrink-0 ${
                isDarkMode ? 'bg-[#0B2D5B]/40 border-[#D4AF37]/30 text-[#D4AF37]' : 'bg-[#0B2D5B]/10 border-[#0B2D5B]/20 text-[#0B2D5B]'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo Container */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0B2D5B] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm overflow-hidden shrink-0 p-1">
            <img 
              src={logoImg} 
              alt="Optics India Logo" 
              className="w-full h-full object-contain scale-110 rounded-xl" 
            />
          </div>

          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <h1 className="text-base sm:text-xl font-brand font-semibold tracking-tight truncate flex items-center gap-0.5">
                <span className={isDarkMode ? 'text-slate-100' : 'text-[#0B2D5B]'}>Optics</span>
                <span className="text-[#D4AF37] font-extrabold tracking-wide">India</span>
              </h1>
            </div>
            <p className={`text-[10px] sm:text-[11px] flex items-center gap-1 sm:gap-1.5 font-medium ${isDarkMode ? 'text-slate-400' : 'text-[#0B2D5B]/70'}`}>
              <span className="truncate">Optical Billing</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 font-bold text-[#0B2D5B] dark:text-[#D4AF37] shrink-0">
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span className="hidden sm:inline">+91 90432 29107 / +91 99524 17748</span>
                <span className="sm:hidden">+91 90432 29107</span>
              </span>
            </p>
          </div>
        </div>

        {/* Right Section: Logged-in User, Theme Switcher, Clock & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold">
          {/* Online/Offline Status Indicator */}
          {isOnline !== undefined && (
            <span className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              isOnline
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
            }`} title={isOnline ? 'Connected to backend server' : 'Operating in offline/local persistence mode'}>
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isOnline ? 'Online' : 'Local'}</span>
            </span>
          )}

          {/* Active Logged In User Badge */}
          {currentUser && (
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${
              isDarkMode 
                ? 'bg-[#0B2D5B]/50 border-[#D4AF37]/40 text-[#D4AF37]' 
                : 'bg-[#0B2D5B]/10 border-[#0B2D5B]/20 text-[#0B2D5B]'
            }`}>
              {currentUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> : <UserCheck className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{currentUser.role === 'admin' ? 'Admin' : 'Sales'}: <strong>{currentUser.phone}</strong></span>
            </div>
          )}

          {/* Desktop Glass Theme Toggle Switch */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
              isDarkMode 
                ? 'bg-[#0B2D5B]/50 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#0B2D5B]' 
                : 'bg-[#0B2D5B]/10 border-[#0B2D5B]/20 text-[#0B2D5B] hover:bg-[#0B2D5B]/15'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-slate-200 font-bold hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#0B2D5B] fill-[#0B2D5B]" />
                <span className="text-[#0B2D5B] font-bold hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Live Date & Time Clock Badge */}
          <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono font-bold tracking-tight text-[11px] shadow-sm ${
            isDarkMode 
              ? 'bg-[#0B2D5B]/40 border-[#0B2D5B] text-slate-300' 
              : 'bg-white/80 border-[#0B2D5B]/20 text-[#0B2D5B]'
          }`}>
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{timeStr || 'Loading...'}</span>
          </div>

          {/* Logout Action Button */}
          {currentUser && onLogout && (
            <button
              onClick={onLogout}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-full border flex items-center gap-1.5 text-rose-500 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm font-bold text-[11px] ${
                isDarkMode
                  ? 'bg-rose-950/40 border-rose-800/60 hover:bg-rose-900'
                  : 'bg-rose-50 border-rose-200 hover:bg-rose-600'
              }`}
              title="Logout session"
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
