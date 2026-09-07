import React, { useState } from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  Bell, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  X,
  PhoneCall,
  BarChart3,
  Users,
  UserPlus
} from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  bills = [], 
  isDarkMode, 
  setIsDarkMode,
  isMobileOpen,
  setIsMobileOpen,
  userRole = 'salesperson'
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Count pending reminders for notification badge
  const pendingCount = bills.filter(b => (b.deliveryStatus || 'Pending') !== 'Delivered').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'from-cyan-500 to-blue-600',
      badge: null
    },
    {
      id: 'billing',
      label: 'Billing & POS',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      badge: null
    },
    {
      id: 'reminders',
      label: 'Reminders',
      icon: Bell,
      color: 'from-amber-500 to-orange-600',
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      id: 'followup',
      label: 'Follow-Up',
      icon: PhoneCall,
      color: 'from-emerald-500 to-teal-600',
      badge: null
    },
    ...(userRole === 'admin' ? [
      {
        id: 'reports',
        label: 'Reports',
        icon: BarChart3,
        color: 'from-purple-500 to-indigo-600',
        badge: null
      },
      {
        id: 'customers',
        label: 'Customer Info',
        icon: Users,
        color: 'from-sky-500 to-blue-700',
        badge: null
      },
      {
        id: 'staff',
        label: 'Add Staff',
        icon: UserPlus,
        color: 'from-indigo-600 to-violet-700',
        badge: null
      }
    ] : [])
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false); // Auto-close drawer on mobile selection
    }
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-0 bottom-0 left-0 z-50 h-screen select-none transition-all duration-300 flex flex-col justify-between border-r backdrop-blur-2xl
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}
        ${isDarkMode 
          ? 'bg-slate-900/95 border-slate-800/80 text-slate-100 shadow-2xl shadow-slate-950/80' 
          : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-2xl shadow-slate-300/50'
        }
      `}>
        {/* Top Header / Brand Logo */}
        <div className="p-3.5 sm:p-4 border-b border-slate-700/20 flex items-center justify-between gap-3">
          <div className={`flex items-center gap-3 overflow-hidden transition-all ${isCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center border border-slate-200/80 shadow-md overflow-hidden shrink-0">
              <img 
                src={logoImg} 
                alt="Optics India Logo" 
                className="w-full h-full object-contain scale-130" 
              />
            </div>
            
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <h2 className="text-lg font-brand font-semibold tracking-tight truncate flex items-center gap-0.5">
                  <span className={isDarkMode ? 'text-slate-100' : 'text-slate-900'}>Optics</span>
                  <span className="text-sky-500 font-medium">India</span>
                </h2>
                <p className={`text-[10px] font-semibold tracking-wide flex items-center gap-1 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  <Sparkles className="w-3 h-3 text-cyan-500" /> POS v2.0
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer hidden md:flex items-center justify-center ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer flex md:hidden items-center justify-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Navigation Links */}
        <div className="p-3 space-y-2 flex-1 mt-2 overflow-y-auto">
          <div className={`px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 ${
            isCollapsed && !isMobileOpen ? 'hidden' : 'block'
          }`}>
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer relative group ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/20 ring-2 ring-white/30`
                    : isDarkMode
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                } ${isCollapsed && !isMobileOpen ? 'md:justify-center md:px-0' : ''}`}
                title={isCollapsed && !isMobileOpen ? item.label : ''}
              >
                {/* Icon Container */}
                <div className={`relative shrink-0 flex items-center justify-center ${
                  isActive ? 'text-white' : ''
                }`}>
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

                  {/* Badge for Collapsed View */}
                  {isCollapsed && !isMobileOpen && item.badge !== null && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate font-black tracking-wide flex-1 text-left">
                    {item.label}
                  </span>
                )}

                {/* Badge for Expanded View */}
                {(!isCollapsed || isMobileOpen) && item.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-black transition-all ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Footer Section */}
        <div className="p-3 border-t border-slate-700/20 space-y-2">
          {/* Theme Quick Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-full p-2.5 rounded-xl border flex items-center justify-center gap-2.5 transition-all cursor-pointer text-xs font-bold ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200'
            }`}
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="text-slate-200 font-bold truncate">Frosted Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="text-slate-800 font-bold truncate">Obsidian Dark</span>}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
