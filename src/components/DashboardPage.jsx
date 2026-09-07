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
  Filter
} from 'lucide-react';

export default function DashboardPage({ bills, isDarkMode, onNavigateToReminders, onNavigateToBilling, onSelectBill }) {
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'overdue', 'upcoming'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. KPI Calculations
  const totalSales = bills.reduce((acc, b) => acc + Number(b.netAmount || 0), 0);
  const totalOrders = bills.length;
  const totalBalance = bills.reduce((acc, b) => acc + Number(b.balanceAmount || 0), 0);
  
  // Unique Customers count by phone or name
  const uniqueCustomers = new Set(
    bills.map(b => (b.customer?.phone || b.customer?.name || '').trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const dueRemindersCount = bills.filter(b => (b.deliveryStatus || 'Pending') === 'Pending').length;
  const deliveredCount = bills.filter(b => b.deliveryStatus === 'Delivered').length;

  // 2. Date Filtering for Customer Reminders
  const todayStr = new Date().toISOString().substring(0, 10);

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
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
              📊
            </span>
            Executive Dashboard
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time business telemetry, sales summary, customer delivery schedules, and balance metrics.
          </p>
        </div>

        <button
          onClick={onNavigateToReminders}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Bell className="w-4 h-4 animate-bounce" />
          <span>Manage Delivery Reminders ({dueRemindersCount} Pending)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Grid - 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Total Sales */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-emerald-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-emerald-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Sales
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-emerald-500">
              ₹{totalSales.toLocaleString('en-IN')}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Cumulative revenue generated
            </p>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-blue-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-blue-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-500 font-bold border border-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-blue-500">
              {totalOrders}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {deliveredCount} Delivered • {dueRemindersCount} Pending
            </p>
          </div>
        </div>

        {/* KPI 3: Total Balance Due */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-rose-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-rose-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Balance
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500 font-bold border border-rose-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-rose-500">
              ₹{totalBalance.toLocaleString('en-IN')}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Outstanding customer receivables
            </p>
          </div>
        </div>

        {/* KPI 4: Total Customers */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-indigo-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-indigo-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Customers
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-500 font-bold border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-indigo-500">
              {uniqueCustomers}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Registered patient profiles
            </p>
          </div>
        </div>

        {/* KPI 5: Reminders Count */}
        <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] shadow-xl ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-amber-500/40' 
            : 'bg-white/90 border-slate-200/80 text-slate-900 hover:border-amber-400'
        }`}>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Due Reminders
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 font-bold border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-500">
              {dueRemindersCount}
            </div>
            <p className={`text-[11px] font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Pending delivery notifications
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
              <Calendar className="w-5 h-5 text-sky-500" />
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
                className={`w-full sm:w-60 pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${
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
                    ? 'bg-sky-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'today'
                    ? 'bg-sky-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('overdue')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'overdue'
                    ? 'bg-rose-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overdue
              </button>
              <button
                onClick={() => setDateFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all ${
                  dateFilter === 'upcoming'
                    ? 'bg-emerald-500 text-white font-bold shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>

        {/* Customer Info Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-700/20">
          <table className="w-full text-left border-collapse text-xs">
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
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-medium ${
              isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-slate-200 text-slate-800'
            }`}>
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-semibold">
                    No customer delivery records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
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
                      <td className="py-3 px-4 font-bold text-sky-400">
                        #{bill.billNo}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm">
                          {bill.customer?.name || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-sky-400" />
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
                          <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" /> Overdue
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isDelivered 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}>
                          {isDelivered ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Delivered
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 animate-pulse" /> Pending
                            </>
                          )}
                        </span>
                      </td>

                      {/* Net Amount */}
                      <td className="py-3 px-4 font-extrabold text-slate-300">
                        ₹{Number(bill.netAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-4">
                        <span className={`font-black ${
                          Number(bill.balanceAmount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
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
                              : 'bg-slate-100 border-slate-300 text-sky-600 hover:bg-sky-500 hover:text-white'
                          }`}
                          title="View Bill in POS"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
