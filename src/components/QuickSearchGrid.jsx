import React, { useEffect, useRef, memo } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { formatBillNo } from '../utils/billNumber';

const PrescriptionBox = memo(function PrescriptionBox({ rx, isDarkMode }) {
  if (!rx) {
    return (
      <span className="opacity-40 italic text-[10px] font-sans">
        No Rx
      </span>
    );
  }

  const rSph = rx.rightEye?.sph || rx.rightEye?.dv?.sphere || '';
  const rCyl = rx.rightEye?.cyl || rx.rightEye?.dv?.cylinder || '';
  const rAxi = rx.rightEye?.axis || rx.rightEye?.dv?.axis || '';
  const rAdd = rx.rightEye?.add || '';

  const lSph = rx.leftEye?.sph || rx.leftEye?.dv?.sphere || '';
  const lCyl = rx.leftEye?.cyl || rx.leftEye?.dv?.cylinder || '';
  const lAxi = rx.leftEye?.axis || rx.leftEye?.dv?.axis || '';
  const lAdd = rx.leftEye?.add || '';

  const hasAnyPower = [rSph, rCyl, rAxi, rAdd, lSph, lCyl, lAxi, lAdd].some(
    v => v && v !== '-' && String(v).trim() !== ''
  );

  if (!hasAnyPower) {
    return (
      <span className="opacity-40 italic text-[10px] font-sans">
        No Rx
      </span>
    );
  }

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      className={`rounded-lg border overflow-hidden text-[10px] font-mono shadow-xs min-w-[240px] max-w-[300px] my-0.5 ${
        isDarkMode 
          ? 'bg-slate-950/85 border-slate-700/70' 
          : 'bg-white/95 border-slate-200 shadow-2xs'
      }`}
    >
      {/* Prescription Header */}
      <div className={`grid grid-cols-5 gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-center border-b ${
        isDarkMode 
          ? 'bg-slate-900/90 border-slate-800 text-slate-400' 
          : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}>
        <span className="text-left font-sans font-bold">EYE</span>
        <span>SPH</span>
        <span>CYL</span>
        <span>AXIS</span>
        <span>ADD</span>
      </div>

      {/* Right Eye RE Box / Row */}
      <div className={`grid grid-cols-5 gap-1 px-2 py-1 items-center text-center border-b ${
        isDarkMode 
          ? 'border-slate-800/70 bg-rose-950/25 text-slate-200' 
          : 'border-slate-100 bg-rose-50/70 text-slate-800'
      }`}>
        <span className="text-left font-black text-rose-500 font-sans text-[10px] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
          RE
        </span>
        <span className="font-bold text-sky-500">{rSph || '-'}</span>
        <span className="font-semibold">{rCyl || '-'}</span>
        <span className="font-semibold">{rAxi || '-'}</span>
        <span className="font-bold text-amber-500">{rAdd || '-'}</span>
      </div>

      {/* Left Eye LE Box / Row */}
      <div className={`grid grid-cols-5 gap-1 px-2 py-1 items-center text-center ${
        isDarkMode 
          ? 'bg-sky-950/25 text-slate-200' 
          : 'bg-sky-50/70 text-slate-800'
      }`}>
        <span className="text-left font-black text-sky-500 font-sans text-[10px] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
          LE
        </span>
        <span className="font-bold text-sky-500">{lSph || '-'}</span>
        <span className="font-semibold">{lCyl || '-'}</span>
        <span className="font-semibold">{lAxi || '-'}</span>
        <span className="font-bold text-amber-500">{lAdd || '-'}</span>
      </div>

      {/* Optional PD / RI details */}
      {(rx.pd || rx.ri) && (
        <div className={`flex items-center justify-between px-2 py-0.5 text-[9px] border-t font-sans ${
          isDarkMode ? 'border-slate-800 bg-slate-900/60 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-500'
        }`}>
          {rx.pd && <span><strong>PD:</strong> {rx.pd} mm</span>}
          {rx.ri && <span><strong>R.I:</strong> {rx.ri}</span>}
        </div>
      )}
    </div>
  );
});

export default function QuickSearchGrid({ 
  bills, 
  activeBillId, 
  onSelectBill, 
  searchQuery, 
  setSearchQuery, 
  onClosePanel,
  isDarkMode 
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-[#0B2D5B]';

  return (
    <div className={`${panelClass} p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl flex flex-col h-full shadow-2xl transition-all duration-300 relative border ${
      isDarkMode ? 'border-[#D4AF37]/30' : 'border-[#0B2D5B]/20'
    }`}>
      {/* Header bar with title and Close X button */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#0B2D5B]/15 dark:border-[#D4AF37]/20">
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-[#0B2D5B] dark:text-[#D4AF37]">
          <Search className="w-4 h-4 text-[#D4AF37]" /> Quick Find & Load Bill
        </span>

        {onClosePanel && (
          <button
            onClick={onClosePanel}
            className={`p-1 rounded-xl border transition-all cursor-pointer flex items-center gap-1 px-2 text-[11px] font-bold ${
              isDarkMode 
                ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900' 
                : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
            }`}
            title="Close Search Panel"
          >
            <X className="w-3.5 h-3.5" /> <span>Close</span>
          </button>
        )}
      </div>

      {/* Top Search Input Bar */}
      <div className={`flex items-center gap-2 mb-3 p-2.5 rounded-xl sm:rounded-2xl border ${
        isDarkMode ? 'bg-[#061833] border-[#0B2D5B]' : 'bg-white/80 border-[#0B2D5B]/20'
      }`}>
        <span className="font-bold text-xs whitespace-nowrap flex items-center gap-1.5 opacity-90 text-[#0B2D5B] dark:text-[#D4AF37]">
          <Search className="w-4 h-4 text-[#D4AF37]" /> Find :
        </span>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search by Name, Phone, Bill No..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full rounded-xl px-3 py-1.5 text-xs font-semibold ${inputClass}`}
        />
      </div>

      {/* Bill Records Table Container with Horizontal Scroll */}
      <div className={`flex-1 overflow-x-auto overflow-y-auto rounded-xl sm:rounded-2xl border min-h-[300px] sm:min-h-[320px] ${
        isDarkMode ? 'bg-[#061833]/90 border-[#0B2D5B]' : 'bg-white/90 border-[#0B2D5B]/15'
      }`}>
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className={`border-b font-extrabold sticky top-0 backdrop-blur-xl z-10 ${
            isDarkMode ? 'bg-[#0B2D5B]/85 border-[#0B2D5B] text-[#D4AF37]' : 'bg-[#0B2D5B]/10 border-[#0B2D5B]/20 text-[#0B2D5B]'
          }`}>
            <tr>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20">Date</th>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20 text-center">Bill No.</th>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20">MRD No</th>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20">Name</th>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20">Phone</th>
              <th className="p-2 sm:p-2.5 border-r border-slate-400/20 min-w-[280px]">Prescription (Lens Powers)</th>
              <th className="p-2 sm:p-2.5 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-400/20 font-mono">
            {bills.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center opacity-60 font-sans">
                  {searchQuery && searchQuery.trim() 
                    ? "No billing records found matching your search term." 
                    : "Type customer Name, Phone, or Bill No above to search records."}
                </td>
              </tr>
            ) : (
              bills.map((b) => {
                const isSelected = activeBillId === b._id || activeBillId === b.billNo;
                const formattedDate = b.date 
                  ? new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                  : '07-07-2026';

                return (
                  <tr 
                    key={b._id || b.billNo}
                    onClick={() => onSelectBill(b)}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? isDarkMode
                          ? 'bg-[#0B2D5B]/60 border-l-4 border-l-[#D4AF37] text-white font-bold'
                          : 'bg-[#0B2D5B]/10 border-l-4 border-l-[#0B2D5B] text-[#0B2D5B] font-black' 
                        : isDarkMode
                          ? 'hover:bg-[#0B2D5B]/20 text-slate-300'
                          : 'hover:bg-[#0B2D5B]/5 text-slate-800'
                    }`}
                  >
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-[11px] font-semibold">{formattedDate}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-center font-black text-[#D4AF37]">{formatBillNo(b.billNo)}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 opacity-70 text-[11px]">{b.customer?.mrdNo || '00003'}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 font-sans font-bold">{b.customer?.name}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-[#0B2D5B] dark:text-[#D4AF37] font-semibold">{b.customer?.phone}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20"><PrescriptionBox rx={b.prescription} isDarkMode={isDarkMode} /></td>
                    <td className="p-2 sm:p-2.5 text-right font-black text-emerald-600 dark:text-emerald-400">₹ {b.netAmount !== undefined && b.netAmount !== null ? b.netAmount : (b.totalAmount || 0)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count & Hint */}
      <div className="mt-2.5 pt-2 border-t border-[#0B2D5B]/15 dark:border-[#D4AF37]/20 flex items-center justify-between text-[11px] font-semibold opacity-80">
        <span>{searchQuery && searchQuery.trim() ? `${bills.length} matching records found` : 'Type above to search'}</span>
        <span className="font-sans font-bold text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 animate-pulse text-[#D4AF37]" /> Click row to load & auto-close
        </span>
      </div>
    </div>
  );
}
