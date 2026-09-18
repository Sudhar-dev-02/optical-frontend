import React, { useState } from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  X,
  PhoneCall,
  BarChart3,
  Users,
  UserPlus,
  Wallet
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

  const pendingCount = bills.filter(b => (b.deliveryStatus || 'Pending') !== 'Delivered').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-blue-600 to-indigo-700', badge: null },
    { id: 'billing', label: 'Billing & POS', icon: FileText, color: 'from-blue-600 to-indigo-700', badge: null },
    { id: 'reminders', label: 'Reminders', icon: Bell, color: 'from-blue-600 to-indigo-700', badge: pendingCount > 0 ? pendingCount : null },
    { id: 'followup', label: 'Follow-Up', icon: PhoneCall, color: 'from-blue-600 to-indigo-700', badge: null },
    { id: 'wallet', label: 'Wallet Hub', icon: Wallet, color: 'from-blue-600 to-indigo-700', badge: null },
    ...(userRole === 'admin' ? [
      { id: 'reports', label: 'Reports', icon: BarChart3, color: 'from-blue-600 to-indigo-700', badge: null },
      { id: 'customers', label: 'Customer Info', icon: Users, color: 'from-blue-600 to-indigo-700', badge: null },
      { id: 'staff', label: 'Add Staff', icon: UserPlus, color: 'from-blue-600 to-indigo-700', badge: null }
    ] : [])
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const isCollapsedView = isCollapsed && !isMobileOpen;

  const mobileDrawerClass = isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0';
  const widthCollapseClass = isCollapsed ? 'md:w-20' : 'md:w-64';
  const asideThemeClass = isDarkMode 
    ? 'bg-slate-900/95 border-slate-800/80 text-slate-100 shadow-2xl shadow-slate-950/80' 
    : 'bg-white/95 border-slate-200/80 text-slate-900 shadow-2xl shadow-slate-300/50';

  const asideClassName = `fixed md:sticky top-0 bottom-0 left-0 z-50 h-screen select-none transition-all duration-300 flex flex-col justify-between border-r backdrop-blur-2xl ${mobileDrawerClass} ${widthCollapseClass} ${asideThemeClass}`;

  const headerAlignClass = isCollapsedView ? 'flex-col gap-2.5 justify-center py-3 px-2' : 'justify-between gap-3';
  const headerClassName = `p-3.5 sm:p-4 border-b border-slate-700/20 flex items-center ${headerAlignClass}`;

  const logoWrapperClass = `flex items-center gap-3 overflow-hidden transition-all ${isCollapsedView ? 'justify-center w-full' : ''}`;

  const brandTitleClass = isDarkMode ? 'text-slate-100' : 'text-slate-900';
  const subtitleClass = `text-[10px] font-semibold tracking-wide flex items-center gap-1 ${isDarkMode ? 'text-sky-400' : 'text-blue-600'}`;

  const collapseBtnTheme = isDarkMode 
    ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700' 
    : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200';
  const collapseBtnSize = isCollapsedView ? 'w-9 h-9 p-0 shadow-sm' : 'p-1.5';
  const desktopCollapseBtnClass = `rounded-xl border transition-all cursor-pointer hidden md:flex items-center justify-center ${collapseBtnTheme} ${collapseBtnSize}`;

  const mobileCloseBtnTheme = isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700';
  const mobileCloseBtnClass = `p-1.5 rounded-xl border transition-all cursor-pointer flex md:hidden items-center justify-center ${mobileCloseBtnTheme}`;

  const navHeaderLabelClass = `px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase text-slate-400 ${isCollapsedView ? 'hidden' : 'block'}`;

  const themeBtnLayout = isCollapsedView ? 'w-12 h-12 p-0 mx-auto rounded-2xl' : 'w-full p-2.5 rounded-xl gap-2.5';
  const themeBtnStyle = isDarkMode ? 'bg-slate-800/80 border-slate-700 text-sky-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-blue-600 hover:bg-slate-200';
  const themeBtnClass = `border flex items-center justify-center transition-all cursor-pointer text-xs font-bold ${themeBtnLayout} ${themeBtnStyle}`;

  const getNavItemClassName = (item, isActive) => {
    const base = 'font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer relative group ';
    const sizing = isCollapsedView ? 'w-12 h-12 p-0 mx-auto flex items-center justify-center rounded-2xl ' : 'w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl ';
    let theme = '';
    if (isActive) {
      theme = `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-sky-500/25 ring-2 ring-white/30`;
    } else if (isDarkMode) {
      theme = 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60';
    } else {
      theme = 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
    }
    return `${base}${sizing}${theme}`;
  };

  const getNavBadgeClassName = (isActive) => {
    if (isActive) {
      return 'px-2 py-0.5 rounded-full text-xs font-black transition-all bg-white/25 text-white';
    }
    return 'px-2 py-0.5 rounded-full text-xs font-black transition-all bg-sky-500/20 border border-sky-500/40 text-sky-400 animate-pulse';
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
      <aside className={asideClassName}>
        {/* Top Header / Brand Logo */}
        <div className={headerClassName}>
          <div className={logoWrapperClass}>
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200/80 shadow-md overflow-hidden shrink-0">
              <img 
                src={logoImg} 
                alt="Optics India Logo" 
                className="w-full h-full object-contain scale-125" 
              />
            </div>
            
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <h2 className="text-lg font-brand font-semibold tracking-tight truncate flex items-center gap-0.5">
                  <span className={brandTitleClass}>Optics</span>
                  <span className="text-blue-700 dark:text-sky-400 font-bold">India</span>
                </h2>
                <p className={subtitleClass}>
                  <Sparkles className="w-3 h-3 text-sky-400" /> POS v2.0
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-xl border transition-all cursor-pointer hidden md:flex items-center justify-center p-1.5 bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            title="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="p-1.5 rounded-xl border transition-all cursor-pointer flex md:hidden items-center justify-center bg-slate-800 border-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Navigation Links */}
        <div className="p-2 sm:p-3 space-y-2 flex-1 mt-1 overflow-y-auto">
          <div className={navHeaderLabelClass}>
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const itemClassName = getNavItemClassName(item, isActive);
            const badgeClassName = getNavBadgeClassName(isActive);
            const iconWrapperClass = isActive ? 'relative shrink-0 flex items-center justify-center text-white' : 'relative shrink-0 flex items-center justify-center';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={itemClassName}
                title={isCollapsedView ? item.label : ''}
              >
                {/* Icon Container */}
                <div className={iconWrapperClass}>
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

                  {/* Badge for Collapsed View */}
                  {isCollapsedView && item.badge !== null && (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-sky-500 text-white animate-pulse shadow-sm">
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
                  <span className={badgeClassName}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Footer Section */}
        <div className="p-2.5 sm:p-3 border-t border-slate-700/20 space-y-2">
          {/* Theme Quick Switcher */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={themeBtnClass}
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-sky-400 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="text-slate-200 font-bold truncate">Frosted Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-600 shrink-0" />
                {(!isCollapsed || isMobileOpen) && <span className="text-slate-800 font-bold truncate">Obsidian Dark</span>}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
