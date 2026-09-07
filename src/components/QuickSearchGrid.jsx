import React, { useEffect, useRef } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';

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

  const renderPrescriptionBox = (rx) => {
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
    const rVa  = rx.rightEye?.va || '';

    const lSph = rx.leftEye?.sph || rx.leftEye?.dv?.sphere || '';
    const lCyl = rx.leftEye?.cyl || rx.leftEye?.dv?.cylinder || '';
    const lAxi = rx.leftEye?.axis || rx.leftEye?.dv?.axis || '';
    const lAdd = rx.leftEye?.add || '';
    const lVa  = rx.leftEye?.va || '';

    const hasAnyPower = [rSph, rCyl, rAxi, rAdd, rVa, lSph, lCyl, lAxi, lAdd, lVa].some(
      v => v && v !== '-' && v.trim() !== ''
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
        <div className={`grid grid-cols-6 gap-1 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-center border-b ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 text-slate-400' 
            : 'bg-slate-100/90 border-slate-200 text-slate-600'
        }`}>
          <span className="text-left font-sans font-bold">EYE</span>
          <span>SPH</span>
          <span>CYL</span>
          <span>AXIS</span>
          <span>ADD</span>
          <span>V/A</span>
        </div>

        {/* Right Eye RE Box / Row */}
        <div className={`grid grid-cols-6 gap-1 px-2 py-1 items-center text-center border-b ${
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
          <span className="opacity-70 text-[9px]">{rVa || '-'}</span>
        </div>

        {/* Left Eye LE Box / Row */}
        <div className={`grid grid-cols-6 gap-1 px-2 py-1 items-center text-center ${
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
          <span className="opacity-70 text-[9px]">{lVa || '-'}</span>
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
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';

  return (
    <div className={`${panelClass} p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl flex flex-col h-full shadow-2xl transition-all duration-300 relative border ${
      isDarkMode ? 'border-cyan-500/30' : 'border-sky-300'
    }`}>
      {/* Header bar with title and Close X button */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/20">
        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-sky-500">
          <Search className="w-4 h-4" /> Quick Find & Load Bill
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
        isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white/60 border-slate-200'
      }`}>
        <span className="font-bold text-xs whitespace-nowrap flex items-center gap-1.5 opacity-90">
          <Search className="w-4 h-4 text-sky-500" /> Find :
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
        isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white/70 border-slate-200'
      }`}>
        <table className="w-full text-left text-xs min-w-[760px]">
          <thead className={`border-b font-extrabold sticky top-0 backdrop-blur-xl z-10 ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-300' : 'bg-slate-100/90 border-slate-200 text-slate-700'
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
                          ? 'bg-sky-950/80 border-l-4 border-l-sky-400 text-sky-200 font-bold'
                          : 'bg-sky-100/90 border-l-4 border-l-sky-600 text-slate-950 font-black' 
                        : isDarkMode
                          ? 'hover:bg-slate-900/60 text-slate-300'
                          : 'hover:bg-slate-100/70 text-slate-800'
                    }`}
                  >
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-[11px] font-semibold">{formattedDate}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-center font-bold text-amber-500">{b.billNo}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 opacity-70 text-[11px]">{b.customer?.mrdNo || '00003'}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 font-sans font-bold">{b.customer?.name}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20 text-amber-500 font-semibold">{b.customer?.phone}</td>
                    <td className="p-2 sm:p-2.5 border-r border-slate-400/20">{renderPrescriptionBox(b.prescription)}</td>
                    <td className="p-2 sm:p-2.5 text-right font-black text-emerald-500">₹ {b.totalAmount || b.netAmount || 0}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Count & Hint */}
      <div className="mt-2.5 pt-2 border-t border-slate-400/20 flex items-center justify-between text-[11px] font-semibold opacity-80">
        <span>{searchQuery && searchQuery.trim() ? `${bills.length} matching records found` : 'Type above to search'}</span>
        <span className="font-sans font-bold text-sky-500 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5 animate-pulse" /> Click row to load & auto-close
        </span>
      </div>
    </div>
  );
}
