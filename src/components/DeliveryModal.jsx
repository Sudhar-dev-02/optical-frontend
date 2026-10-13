import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  DollarSign, 
  User, 
  Phone, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { formatBillNo } from '../utils/billNumber';

export default function DeliveryModal({ bill, isOpen, onClose, onConfirmDelivery, isDarkMode }) {
  if (!isOpen || !bill) return null;

  const netAmount = Number(bill.netAmount || 0);
  const prevAdvance = Number(bill.advanceAmount || 0);
  const currentBalance = Number(bill.balanceAmount || Math.max(0, netAmount - prevAdvance));

  const isAlreadyDelivered = (bill.deliveryStatus || '').toLowerCase() === 'delivered';

  // 'YES' = Mark as Delivered, 'NO' = Keep / Revert to Pending
  const [deliveryDecision, setDeliveryDecision] = useState('YES');
  const [payingNow, setPayingNow] = useState(currentBalance.toString());
  const [payMode, setPayMode] = useState(bill.payMode || 'CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDeliveryDecision('YES');
    setPayingNow(currentBalance.toString());
    setPayMode(bill.payMode || 'CASH');
    setIsSubmitting(false);
  }, [bill, currentBalance]);

  const numPayingNow = Math.max(0, Number(payingNow) || 0);
  const newAdvance = prevAdvance + numPayingNow;
  const newBalance = Math.max(0, netAmount - newAdvance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Prevent re-submitting if already marked delivered
    if (isAlreadyDelivered && deliveryDecision === 'YES') {
      return;
    }

    setIsSubmitting(true);
    try {
      if (deliveryDecision === 'YES') {
        await onConfirmDelivery(bill._id || bill.billNo, {
          status: 'Delivered',
          advanceAmount: newAdvance,
          balanceAmount: newBalance,
          payMode: currentBalance > 0 ? payMode : (bill.payMode || 'CASH')
        });
      } else {
        await onConfirmDelivery(bill._id || bill.billNo, {
          status: 'Pending',
          advanceAmount: prevAdvance,
          balanceAmount: currentBalance,
          payMode: bill.payMode || 'CASH'
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = bill.deliveryDate 
    ? new Date(bill.deliveryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : (bill.date ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A');

  const panelBg = isDarkMode 
    ? 'bg-[#061833]/95 border-[#0B2D5B]/70 text-slate-100 shadow-2xl shadow-black/80' 
    : 'bg-white/95 border-[#0B2D5B]/15 text-[#0B2D5B] shadow-2xl';

  const cardBg = isDarkMode ? 'bg-[#0B2D5B]/20 border-[#D4AF37]/25' : 'bg-[#0B2D5B]/5 border-[#0B2D5B]/15';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-[#0B2D5B]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-3xl border p-6 sm:p-7 relative overflow-hidden transition-all duration-300 transform scale-100 ${panelBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header Accent */}
        <div className={`absolute top-0 left-0 right-0 h-2 transition-all duration-300 ${
          deliveryDecision === 'YES'
            ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600'
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
        }`} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl border transition-all cursor-pointer ${
            isDarkMode ? 'bg-[#0B2D5B]/50 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#0B2D5B]' : 'bg-slate-100 border-[#0B2D5B]/15 text-[#0B2D5B] hover:bg-[#0B2D5B]/10'
          }`}
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className={`p-3 rounded-2xl text-white shadow-lg transition-all duration-300 ${
            deliveryDecision === 'YES'
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 shadow-emerald-500/20'
              : 'bg-gradient-to-tr from-amber-600 to-orange-700 shadow-amber-500/20'
          }`}>
            {deliveryDecision === 'YES' ? (
              <Truck className="w-6 h-6" />
            ) : (
              <Clock className="w-6 h-6" />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 text-[#0B2D5B] dark:text-slate-100">
              Delivery Confirmation
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Confirm order delivery status & finalize balance settlement
            </p>
          </div>
        </div>

        {/* Order & Customer Summary Card */}
        <div className={`p-4 rounded-2xl border ${cardBg} mb-4 space-y-2`}>
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-[#0B2D5B]/15 dark:bg-[#0B2D5B]/50 border border-[#0B2D5B]/20 dark:border-[#D4AF37]/30 text-[#0B2D5B] dark:text-[#D4AF37] font-mono font-black text-xs">
              Bill #{formatBillNo(bill.billNo)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Deliv Date: {formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-extrabold text-sm text-[#0B2D5B] dark:text-slate-100">{bill.customer?.name || 'Customer'}</span>
            </div>
            {bill.customer?.phone && (
              <div className="flex items-center gap-1.5 text-xs text-[#0B2D5B] dark:text-[#D4AF37] font-mono font-bold">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{bill.customer.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Form Start */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1) YES or NO Decision Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Mark this order as Delivered?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* YES Option Card */}
              <button
                type="button"
                onClick={() => setDeliveryDecision('YES')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  deliveryDecision === 'YES'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  deliveryDecision === 'YES'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-1">
                    <span>Yes, Delivered</span>
                  </div>
                  <div className="text-[11px] opacity-75 mt-0.5">
                    Order handed to customer
                  </div>
                </div>
              </button>

              {/* NO Option Card */}
              <button
                type="button"
                onClick={() => setDeliveryDecision('NO')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  deliveryDecision === 'NO'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 dark:border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/30 shadow-md'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  deliveryDecision === 'NO'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-1">
                    <span>No, Keep Pending</span>
                  </div>
                  <div className="text-[11px] opacity-75 mt-0.5">
                    Still awaiting delivery
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2) Financial Breakdown Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Net Bill */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
            }`}>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">Net Amount</span>
              <span className="text-base font-black text-slate-900 dark:text-slate-100 font-mono mt-0.5 block">
                ₹{netAmount.toFixed(2)}
              </span>
            </div>

            {/* Advance Amount */}
            <div className={`p-3 rounded-2xl border ${
              isDarkMode ? 'bg-[#0B2D5B]/25 border-[#0B2D5B]/50' : 'bg-[#0B2D5B]/5 border-[#0B2D5B]/20'
            }`}>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#0B2D5B] dark:text-[#D4AF37]">Advance Paid</span>
              <span className="text-base font-black text-[#0B2D5B] dark:text-[#D4AF37] font-mono mt-0.5 block">
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
                currentBalance > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                Balance Due
              </span>
              <span className={`text-base font-black font-mono mt-0.5 block ${
                currentBalance > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                ₹{currentBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 3) Conditional Settlement Box based on Decision */}
          {deliveryDecision === 'YES' ? (
            currentBalance > 0 ? (
              <div className={`p-4 rounded-2xl border space-y-4 ${
                isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Amount Paying Now */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
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

                {/* Settlement Summary */}
                <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Updated Total Advance:</span>
                      <span className="font-mono font-bold text-[#0B2D5B] dark:text-[#D4AF37]">₹{newAdvance.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 dark:text-slate-400 font-semibold">Remaining Balance:</span>
                      <span className={`font-mono font-black ${newBalance === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-amber-400'}`}>
                        ₹{newBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {newBalance === 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-400 text-[11px] font-black inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Fully Settled
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/40 text-amber-900 dark:text-amber-400 text-[11px] font-black inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Partial Balance
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Order is fully paid (₹0.00 Balance). Ready to be delivered to customer.</span>
              </div>
            )
          ) : (
            <div className="p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Order will remain/revert to "Pending" status in the deliveries queue.</span>
            </div>
          )}

          {/* Already Delivered Notice */}
          {isAlreadyDelivered && deliveryDecision === 'YES' && (
            <div className="p-3.5 rounded-2xl border border-[#D4AF37]/40 bg-[#0B2D5B]/15 text-[#0B2D5B] dark:text-[#D4AF37] text-xs font-bold flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>This order has already been finalized as Delivered. It cannot be submitted as delivered again.</span>
            </div>
          )}

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
              disabled={isSubmitting || (isAlreadyDelivered && deliveryDecision === 'YES')}
              className={`px-6 py-2.5 rounded-xl text-white font-black text-xs shadow-lg flex items-center gap-2 transition-all ${
                isAlreadyDelivered && deliveryDecision === 'YES'
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                  : isSubmitting
                  ? 'bg-slate-500 cursor-wait opacity-70'
                  : deliveryDecision === 'YES'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-500/25 cursor-pointer active:scale-95'
                  : 'bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 shadow-amber-500/25 cursor-pointer active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Submitting...'
                  : isAlreadyDelivered && deliveryDecision === 'YES'
                  ? 'Already Delivered (Completed)'
                  : deliveryDecision === 'YES'
                  ? 'Submit (Mark Delivered)'
                  : 'Submit (Keep Pending)'}
              </span>
              {!isSubmitting && !(isAlreadyDelivered && deliveryDecision === 'YES') && (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
