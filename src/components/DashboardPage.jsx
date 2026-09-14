import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Wallet, 
  Users, 
  Bell, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Phone,
  Eye,
  ChevronRight,
  Filter,
  BarChart3
} from 'lucide-react';

export default function DashboardPage({ bills, isDarkMode, userRole = 'admin', onNavigateToReminders, onNavigateToBilling, onSelectBill }) {
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'overdue', 'upcoming'
  const [searchQuery, setSearchQuery] = useState('');

  const isAdmin = userRole === 'admin';

  // 1. Today & Overall KPI Calculations
  const todayStr = new Date().toISOString().substring(0, 10);

  const isToday = (bill) => {
    if (!bill) return false;
    const bDate = bill.date ? String(bill.date).substring(0, 10) : '';
    const cDate = bill.createdAt ? String(bill.createdAt).substring(0, 10) : '';
    return bDate === todayStr || cDate === todayStr;
  };

  const todayBills = bills.filter(isToday);

  const todaySales = todayBills.reduce((acc, b) => acc + Number(b.netAmount || b.totalAmount || 0), 0);
  const todayAdvance = todayBills.reduce((acc, b) => acc + Number(b.advanceAmount || 0), 0);
  const todayBalance = todayBills.reduce((acc, b) => acc + Number(b.balanceAmount || 0), 0);
  const todayOrdersCount = todayBills.length;
  const todayDeliveredCount = todayBills.filter(b => b.deliveryStatus === 'Delivered').length;
  const todayPendingCount = todayOrdersCount - todayDeliveredCount;

  // Unique Customers count by phone or name
  const uniqueCustomers = new Set(
    bills.map(b => (b.customer?.phone || b.customer?.name || '').trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const dueRemindersCount = bills.filter(b => (b.deliveryStatus || 'Pending') === 'Pending').length;
  const deliveredCount = bills.filter(b => b.deliveryStatus === 'Delivered').length;

  // 2. Date Filtering for Customer Reminders Table
  const filteredBills = bills.filter(bill => {
    // Search query filter
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      (bill.customer?.name && bill.customer.name.toLowerCase().includes(q)) ||
      (bill.customer?.phone && bill.customer.phone.includes(q)) ||
      (bill.billNo && bill.billNo.toString().includes(q))
    );

    if (!matchesSearch) return false;

    // Date filter
    const delDate = bill.deliveryDate || bill.date || '';
    if (dateFilter === 'today') {
      return delDate === todayStr;
    } else if (dateFilter === 'overdue') {
      return delDate && delDate < todayStr && (bill.deliveryStatus || 'Pending') !== 'Delivered';
    } else if (dateFilter === 'upcoming') {
      return delDate && delDate > todayStr && (bill.deliveryStatus || 'Pending') !== 'Delivered';
    }
    return true; // 'all'
  });

  return (
    <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-700/20">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </span>
            Executive Dashboard
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time business telemetry, sales summary, customer delivery schedules, and balance metrics.
          </p>
        </div>

        <button
          onClick={onNavigateToReminders}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Bell className="w-4 h-4 animate-bounce text-sky-300" />
          <span>Manage Delivery Reminders ({dueRemindersCount} Pending)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid - Today Metrics & Store Summary (2x2 Grid on Mobile) */}
      <div className={`grid gap-2.5 sm:gap-3.5 ${
        isAdmin 
          ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6' 
          : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {/* Admin Exclusive KPI Cards */}
        {isAdmin && (
          <>
            {/* KPI 1: Today Sales */}
            <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
                : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
            }`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Today Sales
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-2.5">
                <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
                  ₹{todaySales.toLocaleString('en-IN')}
                </div>
                <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Net sales today
                </p>
              </div>
            </div>

            {/* KPI 2: Advance Today */}
            <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
                : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
            }`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Advance Today
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-2.5">
                <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
                  ₹{todayAdvance.toLocaleString('en-IN')}
                </div>
                <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Advance collected
                </p>
              </div>
            </div>

            {/* KPI 3: Balance Today */}
            <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
                : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
            }`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Balance Today
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-2.5">
                <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
                  ₹{todayBalance.toLocaleString('en-IN')}
                </div>
                <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Balance due today
                </p>
              </div>
            </div>

            {/* KPI 4: Today Orders */}
            <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
                : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
            }`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Today Orders
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-2.5">
                <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
                  {todayOrdersCount}
                </div>
                <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {todayDeliveredCount} Deliv • {todayPendingCount} Pend
                </p>
              </div>
            </div>

            {/* KPI 5: Total Customers */}
            <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
              isDarkMode 
                ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
                : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
            }`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Total Customers
                </span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="mt-2 sm:mt-2.5">
                <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
                  {uniqueCustomers}
                </div>
                <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Patient profiles
                </p>
              </div>
            </div>
          </>
        )}

        {/* KPI 6: Reminders Count (Visible to Salesperson & Admin) */}
        <div className={`p-3 sm:p-4.5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-sky-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between gap-1">
            <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Due Reminders
            </span>
            <div className="p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 text-blue-800 dark:text-sky-400 font-bold border border-blue-200 dark:border-sky-500/20 shrink-0">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-2.5">
            <div className="text-lg sm:text-2xl font-black tracking-tight text-blue-900 dark:text-sky-400 truncate">
              {dueRemindersCount}
            </div>
            <p className={`text-[9px] sm:text-[10px] font-medium mt-0.5 sm:mt-1 truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Pending deliveries
            </p>
          </div>
        </div>
      </div>

      {/* Customer Delivery Info Section */}
      <div className={`p-5 sm:p-6 rounded-3xl border shadow-2xl transition-all duration-300 backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-slate-900/80 border-slate-800' 
          : 'bg-white/90 border-slate-200/80'
      }`}>
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-700/20">
          <div>
            <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2.5 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              <Calendar className="w-5 h-5 text-blue-700 dark:text-sky-500" />
              Customer Delivery Schedule & Reminders
            </h2>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              View and track customer orders based on set delivery dates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, bill..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full sm:w-60 pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-slate-950/80 border-slate-700 text-slate-200 placeholder-slate-500' 
                    : 'bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Date Filter Quick Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-800/20 border-slate-700/30 text-xs font-semibold">
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'all'
                    ? 'bg-blue-700 dark:bg-sky-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'today'
                    ? 'bg-blue-700 dark:bg-sky-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('overdue')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'overdue'
                    ? 'bg-blue-900 dark:bg-sky-700 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overdue
              </button>
              <button
                onClick={() => setDateFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'upcoming'
                    ? 'bg-blue-800 dark:bg-sky-600 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>

        {/* Customer Info Container: Desktop Table + Mobile Cards */}
        {filteredBills.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border font-semibold text-slate-400 ${
            isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            No customer delivery records match the current filter.
          </div>
        ) : (
          <>
            {/* 1. Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-700/20">
              <table className="w-full min-w-[700px] text-left border-collapse text-xs">
                <thead>
                  <tr className={`border-b font-extrabold uppercase tracking-wider ${
                    isDarkMode 
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400' 
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <th className="py-3 px-4">Bill No</th>
                    <th className="py-3 px-4">Customer Info</th>
                    <th className="py-3 px-4">Delivery Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Net Amount</th>
                    <th className="py-3 px-4">Advance</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-medium ${
                  isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-slate-200 text-slate-800'
                }`}>
                  {filteredBills.map((bill) => {
                    const isDelivered = bill.deliveryStatus === 'Delivered';
                    const isOverdue = !isDelivered && bill.deliveryDate && bill.deliveryDate < todayStr;

                    return (
                      <tr 
                        key={bill._id || bill.billNo}
                        className={`transition-colors duration-150 ${
                          isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Bill No */}
                        <td className="py-3 px-4 font-bold text-blue-800 dark:text-sky-400">
                          #{bill.billNo}
                        </td>

                        {/* Customer Info */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {bill.customer?.name || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            <Phone className="w-3 h-3 text-blue-700 dark:text-sky-400" />
                            <span>{bill.customer?.phone || 'No Phone'}</span>
                            {bill.customer?.mrdNo && (
                              <span className="opacity-75">• MRD: {bill.customer.mrdNo}</span>
                            )}
                          </div>
                        </td>

                        {/* Delivery Date */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-bold font-mono">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{bill.deliveryDate || bill.date || 'N/A'}</span>
                          </div>
                          {isOverdue && (
                            <span className="text-[10px] text-blue-800 dark:text-sky-400 font-bold flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isDelivered 
                              ? 'bg-blue-50 dark:bg-sky-500/15 border-blue-200 dark:border-sky-500/30 text-blue-800 dark:text-sky-400'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {isDelivered ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Delivered
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 animate-pulse text-blue-700 dark:text-sky-400" /> Pending
                              </>
                            )}
                          </span>
                        </td>

                        {/* Net Amount */}
                        <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-slate-300">
                          ₹{Number(bill.netAmount || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Advance */}
                        <td className="py-3 px-4 font-bold text-emerald-700 dark:text-emerald-400">
                          ₹{Number(bill.advanceAmount || 0).toLocaleString('en-IN')}
                        </td>

                        {/* Balance */}
                        <td className="py-3 px-4">
                          <span className={`font-black ${
                            Number(bill.balanceAmount || 0) > 0 ? 'text-blue-800 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            ₹{Number(bill.balanceAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (onSelectBill) onSelectBill(bill);
                              if (onNavigateToBilling) onNavigateToBilling();
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isDarkMode 
                                ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-sky-500 hover:text-white' 
                                : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white'
                            }`}
                            title="View Bill in POS"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Cards View (< md) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
              {filteredBills.map((bill) => {
                const isDelivered = bill.deliveryStatus === 'Delivered';
                const isOverdue = !isDelivered && bill.deliveryDate && bill.deliveryDate < todayStr;

                return (
                  <div
                    key={bill._id || bill.billNo}
                    className={`p-4 rounded-2xl border transition-all shadow-lg flex flex-col justify-between relative overflow-hidden ${
                      isDarkMode 
                        ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    {/* Top Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isDelivered ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-blue-600'
                    }`} />

                    <div>
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                        <span className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-sky-400 font-mono font-black text-xs">
                          #{bill.billNo}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-400 font-extrabold text-[10px] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400" /> Overdue
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold flex items-center gap-1 border ${
                            isDelivered
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-400'
                              : 'bg-blue-500/15 border-blue-500/30 text-blue-800 dark:text-sky-400'
                          }`}>
                            {isDelivered ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                            {isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                              {bill.customer?.name || 'Unnamed Customer'}
                            </h3>
                            {bill.customer?.mrdNo && (
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                                MRD: {bill.customer.mrdNo}
                              </div>
                            )}
                          </div>

                          {bill.customer?.phone && (
                            <a 
                              href={`tel:${bill.customer.phone}`}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 dark:bg-sky-500/15 dark:border-sky-500/30 dark:text-sky-400 text-xs font-mono font-bold flex items-center gap-1 shrink-0"
                            >
                              <Phone className="w-3 h-3 text-blue-700 dark:text-sky-400" />
                              <span>{bill.customer.phone}</span>
                            </a>
                          )}
                        </div>

                        {/* Delivery Schedule details */}
                        <div className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" /> Delivery Date:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                              {bill.deliveryDate || bill.date || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-500/10 border border-slate-400/20 text-xs text-center">
                          <div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Net Bill</div>
                            <div className="font-extrabold text-slate-900 dark:text-slate-100">
                              ₹{Number(bill.netAmount || 0).toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Advance</div>
                            <div className="font-extrabold text-emerald-700 dark:text-emerald-400">
                              ₹{Number(bill.advanceAmount || 0).toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Balance</div>
                            <div className={`font-black ${
                              Number(bill.balanceAmount || 0) > 0 ? 'text-blue-800 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              ₹{Number(bill.balanceAmount || 0).toLocaleString('en-IN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (onSelectBill) onSelectBill(bill);
                        if (onNavigateToBilling) onNavigateToBilling();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 mt-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Bill in POS</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
