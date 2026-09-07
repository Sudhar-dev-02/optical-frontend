import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Receipt, 
  CreditCard, 
  DollarSign, 
  User, 
  Phone, 
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DeliveryModal({ bill, isOpen, onClose, onConfirmDelivery, isDarkMode }) {
  if (!isOpen || !bill) return null;

  const netAmount = Number(bill.netAmount || 0);
  const prevAdvance = Number(bill.advanceAmount || 0);
  const currentBalance = Number(bill.balanceAmount || Math.max(0, netAmount - prevAdvance));

  // Default paying now to current balance due
  const [payingNow, setPayingNow] = useState(currentBalance.toString());
  const [payMode, setPayMode] = useState(bill.payMode || 'CASH');

  useEffect(() => {
    setPayingNow(currentBalance.toString());
    setPayMode(bill.payMode || 'CASH');
  }, [bill]);

  const numPayingNow = Math.max(0, Number(payingNow) || 0);
  const newAdvance = prevAdvance + numPayingNow;
  const newBalance = Math.max(0, netAmount - newAdvance);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmDelivery(bill._id || bill.billNo, {
      status: 'Delivered',
      advanceAmount: newAdvance,
      balanceAmount: newBalance,
      payMode: payMode
    });
    onClose();
  };

  const formattedDate = bill.deliveryDate 
    ? new Date(bill.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : (bill.date ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A');

  const panelBg = isDarkMode 
    ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-2xl shadow-black/80' 
    : 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl';

  const cardBg = isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 relative overflow-hidden transition-all duration-300 transform scale-100 ${panelBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl border transition-all cursor-pointer ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              Order Delivery & Settlement
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Confirm order delivery & record final balance settlement
            </p>
          </div>
        </div>

        {/* Order & Customer Summary Card */}
        <div className={`p-4 rounded-2xl border ${cardBg} mb-5 space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 font-mono font-black text-xs">
              Bill #{bill.billNo}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Deliv Date: {formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <span className="font-extrabold text-sm">{bill.customer?.name || 'Customer'}</span>
            </div>
            {bill.customer?.phone && (
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-mono font-bold">
                <Phone className="w-3.5 h-3.5" />
                <span>{bill.customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Start */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Financial Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Net Bill */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
            }`}>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Net Amount</span>
              <span className="text-base font-black text-slate-100 font-mono mt-0.5 block">
                ₹{netAmount.toFixed(2)}
              </span>
            </div>

            {/* Advance Amount */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-sky-950/40 border-sky-800/50' : 'bg-sky-50 border-sky-200'
            }`}>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-sky-400">Advance Paid</span>
              <span className="text-base font-black text-sky-400 font-mono mt-0.5 block">
                ₹{prevAdvance.toFixed(2)}
              </span>
            </div>

            {/* Balance Due */}
            <div className={`p-3 rounded-2xl border ${
              currentBalance > 0 
                ? (isDarkMode ? 'bg-rose-950/40 border-rose-800/50' : 'bg-rose-50 border-rose-200')
                : (isDarkMode ? 'bg-emerald-950/40 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200')
            }`}>
              <span className={`block text-[10px] font-extrabold uppercase tracking-wider ${
                currentBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                Balance Due
              </span>
              <span className={`text-base font-black font-mono mt-0.5 block ${
                currentBalance > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                ₹{currentBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Collection Inputs */}
          <div className={`p-4 rounded-2xl border space-y-4.5 ${
            isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount Paying Now */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Amount Paying Now (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={netAmount}
                  step="0.01"
                  value={payingNow}
                  onChange={(e) => setPayingNow(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-3.5 py-2.5 text-sm font-mono font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                />
              </div>

              {/* Payment Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  <span>Payment Mode</span>
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputClass}`}
                >
                  <option value="CASH">CASH</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="CARD">CARD (Debit/Credit)</option>
                  <option value="ONLINE">ONLINE TRANSFER</option>
                  <option value="BANK_TRANSFER">BANK TRANSFER</option>
                </select>
              </div>
            </div>

            {/* Calculated Settlement Summary Box */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Updated Total Advance:</span>
                  <span className="font-mono font-bold text-sky-400">₹{newAdvance.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Remaining Balance:</span>
                  <span className={`font-mono font-black ${newBalance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ₹{newBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                {newBalance === 0 ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-black inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Fully Settled
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[11px] font-black inline-flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Partial Balance
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-xl border font-bold text-xs cursor-pointer transition-all active:scale-95 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit & Mark Delivered</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
