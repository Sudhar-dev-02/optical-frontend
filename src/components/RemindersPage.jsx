import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Send, 
  Search, 
  Calendar, 
  User, 
  AlertTriangle,
  RotateCcw,
  Check,
  Truck,
  LayoutGrid,
  Table as TableIcon,
  MessageSquare
} from 'lucide-react';
import DeliveryModal from './DeliveryModal';

const STORE_PHONE = '+91 90432 29107 / +91 99524 17748';

export default function RemindersPage({ bills = [], isDarkMode, onToggleStatus, onSendSMS }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'delivered'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [selectedBillForDelivery, setSelectedBillForDelivery] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  const handleOpenDeliveryModal = (bill) => {
    setSelectedBillForDelivery(bill);
    setIsDeliveryModalOpen(true);
  };

  const todayStr = new Date().toISOString().substring(0, 10);

  // Filter bills by tab status
  const pendingBills = bills.filter(b => (b.deliveryStatus || 'Pending') !== 'Delivered');
  const deliveredBills = bills.filter(b => b.deliveryStatus === 'Delivered');

  const currentTabBills = activeTab === 'pending' ? pendingBills : deliveredBills;

  // Filter by search query
  const filteredBills = currentTabBills.filter(bill => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (bill.customer?.name && bill.customer.name.toLowerCase().includes(q)) ||
      (bill.customer?.phone && bill.customer.phone.includes(q)) ||
      (bill.customer?.mrdNo && bill.customer.mrdNo.includes(q)) ||
      (bill.customer?.drName && bill.customer.drName.toLowerCase().includes(q)) ||
      (bill.billNo && bill.billNo.toString().includes(q))
    );
  });

  const getWhatsAppLink = (bill) => {
    const rawPhone = bill.customer?.phone ? bill.customer.phone.replace(/\D/g, '') : '';
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const isDelivered = bill.deliveryStatus === 'Delivered';
    const statusMsg = isDelivered 
      ? `Your optical order (Bill #${bill.billNo}) is delivered! Thank you for choosing Optics India.` 
      : `Your optical order (Bill #${bill.billNo}) is ready for pickup/delivery! Please visit us or contact ${STORE_PHONE}.`;
    const msg = `Hello ${bill.customer?.name || 'Valued Customer'}, greetings from Optics India! ${statusMsg}`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';

  return (
    <div className="w-full max-w-[1920px] mx-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-700/20">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </span>
            Delivery & Customer Reminders
          </h1>
          <p className={`text-xs sm:text-sm mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Track pending & delivered customer optical orders, update delivery statuses, and dispatch SMS/WhatsApp notifications.
          </p>
        </div>

        {/* Top Controls: Search Bar & View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* View Switcher Toggle */}
          <div className={`flex items-center p-1 rounded-xl border ${
            isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View (Desktop & Tablet)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table View</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Card View</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:w-72 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, doctor, bill #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500 ${inputClass}`}
            />
          </div>
        </div>
      </div>

      {/* Status Tabs (2-Column Grid on Mobile) */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
        {/* Pending Tab */}
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/25 ring-2 ring-sky-400/50'
              : isDarkMode 
                ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Pending Deliveries</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${
            activeTab === 'pending'
              ? 'bg-white/20 text-white'
              : isDarkMode ? 'bg-slate-800 text-sky-400' : 'bg-sky-100 text-sky-800'
          }`}>
            {pendingBills.length}
          </span>
        </button>

        {/* Delivered Tab */}
        <button
          onClick={() => setActiveTab('delivered')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
            activeTab === 'delivered'
              ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-sky-500/25 ring-2 ring-sky-400/50'
              : isDarkMode 
                ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Delivered Orders</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black shrink-0 ${
            activeTab === 'delivered'
              ? 'bg-white/20 text-white'
              : isDarkMode ? 'bg-slate-800 text-sky-400' : 'bg-sky-100 text-sky-800'
          }`}>
            {deliveredBills.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      {filteredBills.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-white/60 border-slate-200 text-slate-500'
        }`}>
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-500" />
          <h3 className="text-lg font-bold">No customer orders in this category</h3>
          <p className="text-xs mt-1">
            {activeTab === 'pending' 
              ? 'All customer orders have been marked as delivered!' 
              : 'No orders are currently marked as delivered.'}
          </p>
        </div>
      ) : (
        <>
          {/* 1. TABLE VIEW (For Desktop & Tablet >= md when Table View selected) */}
          {(viewMode === 'table') && (
            <div className={`hidden md:block rounded-2xl border shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-xs border-collapse">
                  <thead>
                    <tr className={`border-b font-extrabold uppercase tracking-wider text-[11px] ${
                      isDarkMode ? 'bg-slate-950/90 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      <th className="p-3 border-r border-slate-400/20 text-center">Bill #</th>
                      <th className="p-3 border-r border-slate-400/20">Customer Details</th>
                      <th className="p-3 border-r border-slate-400/20">Delivery Date</th>
                      <th className="p-3 border-r border-slate-400/20">Lens Specification</th>
                      <th className="p-3 border-r border-slate-400/20">Frame Specification</th>
                      <th className="p-3 border-r border-slate-400/20">Doctor / Prescriber</th>
                      <th className="p-3 border-r border-slate-400/20 text-right">Advance Amount</th>
                      <th className="p-3 border-r border-slate-400/20 text-right">Net Bill / Balance</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y font-mono ${
                    isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-slate-200 text-slate-800'
                  }`}>
                    {filteredBills.map((bill) => {
                      const billId = bill._id || bill.billNo;
                      const isDelivered = bill.deliveryStatus === 'Delivered';
                      const formattedDelivDate = bill.deliveryDate 
                        ? new Date(bill.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                        : (bill.date ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'N/A');

                      const isOverdue = !isDelivered && bill.deliveryDate && bill.deliveryDate.substring(0, 10) < todayStr;

                      return (
                        <tr 
                          key={billId}
                          className={`transition-colors ${
                            isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          {/* Bill # */}
                          <td className="p-3 border-r border-slate-400/20 text-center">
                            <span className="px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono font-black text-xs">
                              #{bill.billNo}
                            </span>
                          </td>

                          {/* Customer Name, Phone, Age/Gender */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-black text-sm text-blue-900 dark:text-sky-400">{bill.customer?.name || 'Unnamed'}</div>
                            <div className="flex items-center gap-1.5 text-xs text-blue-800 dark:text-sky-400 font-mono font-bold mt-0.5">
                              <Phone className="w-3 h-3 text-blue-800 dark:text-sky-400" />
                              <span>{bill.customer?.phone || 'No Phone'}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                              {bill.customer?.age ? `${bill.customer.age} yrs` : ''} ({bill.customer?.gender || 'N/A'})
                            </div>
                          </td>

                          {/* Delivery Date */}
                          <td className="p-3 border-r border-slate-400/20 whitespace-nowrap">
                            <div className="font-bold font-mono">{formattedDelivDate}</div>
                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900 dark:bg-sky-950/50 dark:border-sky-800/60 dark:text-sky-300 text-[10px] font-bold mt-1">
                                <AlertTriangle className="w-3 h-3 text-blue-800 dark:text-sky-300" /> OVERDUE
                              </span>
                            )}
                          </td>

                          {/* Lens Specs */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-bold text-blue-800 dark:text-sky-400">{bill.lens?.type || 'Single Vision'}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              {bill.lens?.brand || 'Essilor'} ({bill.lens?.coating || 'HMC'})
                            </div>
                            {bill.lens?.warranty && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">W: {bill.lens.warranty}</div>
                            )}
                          </td>

                          {/* Frame Specs */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-bold text-blue-800 dark:text-sky-400">{bill.frame?.brand || 'Titan'}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                              {bill.frame?.type || 'Full frame'}
                            </div>
                            {bill.frame?.warranty && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">W: {bill.frame.warranty}</div>
                            )}
                          </td>

                          {/* Prescribed By / Doctor */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-semibold text-slate-700 dark:text-slate-300">
                              {bill.customer?.drName ? `Dr. ${bill.customer.drName}` : '-'}
                            </div>
                            {bill.customer?.orderTakenBy && (
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Taken by: {bill.customer.orderTakenBy}</div>
                            )}
                          </td>

                          {/* Advance Amount */}
                          <td className="p-3 border-r border-slate-400/20 text-right whitespace-nowrap font-sans">
                            <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                              ₹ {Number(bill.advanceAmount || 0).toLocaleString('en-IN')}
                            </div>
                          </td>

                          {/* Net Bill & Balance */}
                          <td className="p-3 border-r border-slate-400/20 text-right whitespace-nowrap">
                            <div className="text-xs font-semibold opacity-70">₹ {Number(bill.netAmount || 0).toFixed(2)}</div>
                            <div className={`font-black text-sm mt-0.5 ${
                              Number(bill.balanceAmount || 0) > 0 ? 'text-blue-800 dark:text-sky-400' : 'text-slate-600 dark:text-slate-300'
                            }`}>
                              Bal: ₹ {Number(bill.balanceAmount || 0).toFixed(2)}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {activeTab === 'pending' ? (
                                <button
                                  onClick={() => handleOpenDeliveryModal(bill)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                                  title="Open Delivery Settlement"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Need to Delivery</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onToggleStatus && onToggleStatus(billId, 'Pending')}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-700/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-700 hover:text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                                  title="Delivered (Click to revert to Pending)"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>Delivered</span>
                                </button>
                              )}

                              {bill.customer?.phone && (
                                <>
                                  <a
                                    href={getWhatsAppLink(bill)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white dark:bg-sky-500/20 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500 transition-all cursor-pointer"
                                    title="Send WhatsApp Reminder"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>

                                  <button
                                    onClick={() => onSendSMS && onSendSMS(bill)}
                                    className="p-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white dark:bg-sky-500/20 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500 transition-all cursor-pointer"
                                    title="Send SMS Reminder"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. MOBILE CARD VIEW (Auto-active on Mobile screens < md, or when Card view selected on Desktop) */}
          {(viewMode === 'cards' || viewMode === 'table') && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
              viewMode === 'table' ? 'block md:hidden' : 'block'
            }`}>
              {filteredBills.map((bill) => {
                const billId = bill._id || bill.billNo;
                const isDelivered = bill.deliveryStatus === 'Delivered';
                const formattedDelivDate = bill.deliveryDate 
                  ? new Date(bill.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                  : (bill.date ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : 'N/A');

                const isOverdue = !isDelivered && bill.deliveryDate && bill.deliveryDate.substring(0, 10) < todayStr;

                return (
                  <div
                    key={billId}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-xl flex flex-col justify-between relative overflow-hidden group ${
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
                      {/* Top Row: Bill # & Status Pills */}
                      <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                        <span className="px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-sky-400 font-mono font-black text-xs">
                          #{bill.billNo}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {isOverdue && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-400 font-extrabold text-[10px] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-700 dark:text-rose-400" /> OVERDUE
                            </span>
                          )}
                          {isDelivered ? (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 font-extrabold text-[10px] flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700 dark:text-emerald-400" /> DELIVERED
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-800 dark:text-sky-400 font-extrabold text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-700 dark:text-sky-400" /> PENDING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Customer Info Box */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                              {bill.customer?.name || 'Unnamed Customer'}
                            </h3>
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                              {bill.customer?.age ? `${bill.customer.age} yrs` : ''} ({bill.customer?.gender || 'N/A'})
                            </div>
                          </div>

                          {bill.customer?.phone && (
                            <a 
                              href={`tel:${bill.customer.phone}`}
                              className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 dark:bg-sky-500/15 dark:border-sky-500/30 dark:text-sky-400 text-xs font-mono font-bold flex items-center gap-1 shrink-0 hover:bg-blue-100"
                            >
                              <Phone className="w-3 h-3 text-blue-700 dark:text-sky-400" />
                              <span>{bill.customer.phone}</span>
                            </a>
                          )}
                        </div>

                        {/* Order & Prescription Specs Box */}
                        <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                          isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" /> Delivery Date:
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                              {formattedDelivDate}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                            <span>Lens Specs:</span>
                            <span className="font-bold text-blue-900 dark:text-sky-400">
                              {bill.lens?.type || 'Single Vision'} ({bill.lens?.brand || 'Essilor'} {bill.lens?.coating || 'HMC'})
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                            <span>Frame Specs:</span>
                            <span className="font-bold text-blue-900 dark:text-sky-400">
                              {bill.frame?.brand || 'Titan'} ({bill.frame?.type || 'Full frame'})
                            </span>
                          </div>

                          {bill.customer?.drName && (
                            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                              <span>Doctor:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">
                                Dr. {bill.customer.drName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financial Summary Grid */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-500/10 border border-slate-400/20 text-xs mb-3 text-center">
                        <div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Net Bill</div>
                          <div className="font-extrabold text-slate-900 dark:text-slate-100">
                            ₹{Number(bill.netAmount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Advance</div>
                          <div className="font-extrabold text-emerald-700 dark:text-emerald-400">
                            ₹{Number(bill.advanceAmount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Balance</div>
                          <div className={`font-black ${
                            Number(bill.balanceAmount || 0) > 0 ? 'text-blue-800 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            ₹{Number(bill.balanceAmount || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/20">
                      {activeTab === 'pending' ? (
                        <button
                          onClick={() => handleOpenDeliveryModal(bill)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Need to Delivery</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(billId, 'Pending')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-700 hover:text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          title="Delivered (Click to revert to Pending)"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Delivered</span>
                        </button>
                      )}

                      {bill.customer?.phone && (
                        <>
                          <a
                            href={getWhatsAppLink(bill)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white dark:bg-sky-500/20 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => onSendSMS && onSendSMS(bill)}
                            className="p-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-700 hover:text-white dark:bg-sky-500/20 dark:border-sky-500/40 dark:text-sky-400 dark:hover:bg-sky-500"
                            title="Send SMS Reminder"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Delivery Settlement Modal Popup */}
      <DeliveryModal 
        bill={selectedBillForDelivery}
        isOpen={isDeliveryModalOpen}
        onClose={() => {
          setIsDeliveryModalOpen(false);
          setSelectedBillForDelivery(null);
        }}
        onConfirmDelivery={(billId, settlementData) => {
          if (onToggleStatus) {
            onToggleStatus(billId, settlementData);
          }
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
