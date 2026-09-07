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
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
              🔔
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
                  ? 'bg-amber-500 text-white shadow-md'
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
                  ? 'bg-amber-500 text-white shadow-md'
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
              className={`w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 ${inputClass}`}
            />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        {/* Pending Tab */}
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
            activeTab === 'pending'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/25 ring-2 ring-amber-400/50'
              : isDarkMode 
                ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pending Deliveries</span>
          <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
            activeTab === 'pending'
              ? 'bg-white/20 text-white'
              : isDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-800'
          }`}>
            {pendingBills.length}
          </span>
        </button>

        {/* Delivered Tab */}
        <button
          onClick={() => setActiveTab('delivered')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
            activeTab === 'delivered'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/50'
              : isDarkMode 
                ? 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Delivered Orders</span>
          <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
            activeTab === 'delivered'
              ? 'bg-white/20 text-white'
              : isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
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
          {/* 1. TABLE VIEW (Default for Desktop & Tablet) */}
          {(viewMode === 'table') && (
            <div className={`rounded-2xl border shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
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
                      <th className="p-3 border-r border-slate-400/20 text-right">Net Bill / Balance</th>
                      <th className="p-3 border-r border-slate-400/20 text-center">Status</th>
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
                            <div className="font-black text-sm text-sky-500">{bill.customer?.name || 'Unnamed'}</div>
                            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono font-bold mt-0.5">
                              <Phone className="w-3 h-3" />
                              <span>{bill.customer?.phone || 'No Phone'}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {bill.customer?.age ? `${bill.customer.age} yrs` : ''} ({bill.customer?.gender || 'N/A'})
                            </div>
                          </td>

                          {/* Delivery Date */}
                          <td className="p-3 border-r border-slate-400/20 whitespace-nowrap">
                            <div className="font-bold font-mono">{formattedDelivDate}</div>
                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold mt-1">
                                <AlertTriangle className="w-3 h-3" /> OVERDUE
                              </span>
                            )}
                          </td>

                          {/* Lens Specs */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-bold text-sky-400">{bill.lens?.type || 'Single Vision'}</div>
                            <div className="text-[11px] text-slate-400">
                              {bill.lens?.brand || 'Essilor'} ({bill.lens?.coating || 'HMC'})
                            </div>
                            {bill.lens?.warranty && (
                              <div className="text-[10px] text-slate-400">W: {bill.lens.warranty}</div>
                            )}
                          </td>

                          {/* Frame Specs */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-bold text-amber-400">{bill.frame?.brand || 'Titan'}</div>
                            <div className="text-[11px] text-slate-400">
                              {bill.frame?.type || 'Full frame'}
                            </div>
                            {bill.frame?.warranty && (
                              <div className="text-[10px] text-slate-400">W: {bill.frame.warranty}</div>
                            )}
                          </td>

                          {/* Prescribed By / Doctor */}
                          <td className="p-3 border-r border-slate-400/20 font-sans">
                            <div className="font-semibold text-slate-300">
                              {bill.customer?.drName ? `Dr. ${bill.customer.drName}` : '-'}
                            </div>
                            {bill.customer?.orderTakenBy && (
                              <div className="text-[10px] text-slate-400">Taken by: {bill.customer.orderTakenBy}</div>
                            )}
                          </td>

                          {/* Net Bill & Balance */}
                          <td className="p-3 border-r border-slate-400/20 text-right whitespace-nowrap">
                            <div className="text-xs font-semibold opacity-70">₹ {Number(bill.netAmount || 0).toFixed(2)}</div>
                            <div className={`font-black text-sm mt-0.5 ${
                              Number(bill.balanceAmount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
                            }`}>
                              Bal: ₹ {Number(bill.balanceAmount || 0).toFixed(2)}
                            </div>
                          </td>

                          {/* Status Pill */}
                          <td className="p-3 border-r border-slate-400/20 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                              isDelivered 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                                : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            }`}>
                              {isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                              {bill.deliveryStatus || 'Pending'}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {activeTab === 'pending' ? (
                                <button
                                  onClick={() => handleOpenDeliveryModal(bill)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                  title="Mark order as Delivered"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Delivered</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => onToggleStatus && onToggleStatus(billId, 'Pending')}
                                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                  title="Mark order as Pending"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Pending</span>
                                </button>
                              )}

                              {bill.customer?.phone && (
                                <>
                                  <a
                                    href={getWhatsAppLink(bill)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/40 transition-all cursor-pointer"
                                    title="Send WhatsApp Reminder"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>

                                  <button
                                    onClick={() => onSendSMS && onSendSMS(bill)}
                                    className="p-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-400 hover:text-white border border-sky-500/40 transition-all cursor-pointer"
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

          {/* 2. CARD VIEW (Option for mobile or card layout) */}
          {(viewMode === 'cards') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredBills.map((bill) => {
                const billId = bill._id || bill.billNo;
                const isDelivered = bill.deliveryStatus === 'Delivered';
                const isOverdue = !isDelivered && bill.deliveryDate && bill.deliveryDate.substring(0, 10) < todayStr;

                return (
                  <div
                    key={billId}
                    className={`p-5 rounded-2xl border transition-all duration-200 shadow-xl flex flex-col justify-between relative overflow-hidden group ${
                      isDarkMode 
                        ? 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-slate-700' 
                        : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {/* Status Indicator Bar top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                      isDelivered ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />

                    <div>
                      {/* Top Card Row: Bill No & Status Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono font-black text-xs">
                            #{bill.billNo}
                          </span>
                          {isOverdue && (
                            <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[10px] flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          )}
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                          isDelivered 
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}>
                          {isDelivered ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {bill.deliveryStatus || 'Pending'}
                        </span>
                      </div>

                      {/* Customer Info Box */}
                      <div className="space-y-2 mb-4">
                        <h3 className="text-base font-black tracking-tight flex items-center justify-between">
                          <span>{bill.customer?.name || 'Unnamed Customer'}</span>
                          <span className="text-xs font-medium text-slate-400">
                            {bill.customer?.age ? `${bill.customer.age} yrs` : ''} ({bill.customer?.gender || 'N/A'})
                          </span>
                        </h3>

                        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{bill.customer?.phone || 'No Phone Number'}</span>
                        </div>

                        {/* Prescription & Order Details */}
                        <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          isDarkMode ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex justify-between items-center text-slate-400 font-medium">
                            <span>Delivery Date:</span>
                            <span className="font-bold text-slate-200 font-mono">
                              {bill.deliveryDate || bill.date || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400 font-medium">
                            <span>Lens Specs:</span>
                            <span className="font-semibold text-slate-300">
                              {bill.lens?.type} ({bill.lens?.coating || 'HMC'})
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-slate-400 font-medium">
                            <span>Frame Specs:</span>
                            <span className="font-semibold text-slate-300">
                              {bill.frame?.brand} ({bill.frame?.type})
                            </span>
                          </div>
                          {bill.customer?.drName && (
                            <div className="flex justify-between items-center text-slate-400 font-medium">
                              <span>Doctor:</span>
                              <span className="font-medium text-slate-300">
                                Dr. {bill.customer.drName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Financial Summary */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-700/20 text-xs mb-4">
                        <div>
                          <span className="text-slate-400 font-medium">Net Bill:</span>
                          <span className="font-bold ml-1 text-slate-200">
                            ₹{Number(bill.netAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Balance Due:</span>
                          <span className={`font-black ml-1 ${
                            Number(bill.balanceAmount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            ₹{Number(bill.balanceAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/20">
                      {activeTab === 'pending' ? (
                        <button
                          onClick={() => handleOpenDeliveryModal(bill)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>Mark Delivered</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(billId, 'Pending')}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>Mark Pending</span>
                        </button>
                      )}

                      {bill.customer?.phone && (
                        <>
                          <a
                            href={getWhatsAppLink(bill)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                            title="Send WhatsApp Reminder"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => onSendSMS && onSendSMS(bill)}
                            className={`p-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                              isDarkMode 
                                ? 'bg-slate-800 border-slate-700 text-sky-400 hover:bg-sky-500 hover:text-white' 
                                : 'bg-slate-100 border-slate-300 text-sky-600 hover:bg-sky-500 hover:text-white'
                            }`}
                            title="Send Customer SMS Reminder"
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
