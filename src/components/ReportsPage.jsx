import React, { useMemo } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Calendar, Layers, ShieldCheck, Download, Sparkles } from 'lucide-react';

export default function ReportsPage({ bills = [], isDarkMode }) {
  // Aggregate sales statistics
  const summaryMetrics = useMemo(() => {
    let totalGrossRevenue = 0;
    let totalDiscount = 0;
    let totalNetRevenue = 0;
    let totalAdvanceCollected = 0;
    let totalOutstandingBalance = 0;

    let cashTotal = 0;
    let upiTotal = 0;
    let cardTotal = 0;
    let onlineTotal = 0;
    let bankTotal = 0;

    const lensTypeCounts = {};
    const frameBrandCounts = {};

    bills.forEach(bill => {
      totalGrossRevenue += Number(bill.totalAmount) || 0;
      totalDiscount += Number(bill.discountAmount) || 0;
      totalNetRevenue += Number(bill.netAmount) || 0;
      totalAdvanceCollected += Number(bill.advanceAmount) || 0;
      totalOutstandingBalance += Number(bill.balanceAmount) || 0;

      // Payment mode totals
      const mode = (bill.payMode || 'CASH').toUpperCase();
      const net = Number(bill.netAmount) || 0;
      if (mode === 'CASH') cashTotal += net;
      else if (mode === 'UPI') upiTotal += net;
      else if (mode === 'CARD') cardTotal += net;
      else if (mode === 'ONLINE') onlineTotal += net;
      else if (mode === 'BANK_TRANSFER') bankTotal += net;

      // Lens counts
      const lType = bill.lens?.type || 'Standard SV';
      lensTypeCounts[lType] = (lensTypeCounts[lType] || 0) + (Number(bill.lens?.qty) || 1);

      // Frame brand counts
      const fBrand = bill.frame?.brand || 'Generic Frame';
      frameBrandCounts[fBrand] = (frameBrandCounts[fBrand] || 0) + (Number(bill.frame?.qty) || 1);
    });

    return {
      totalBills: bills.length,
      totalGrossRevenue,
      totalDiscount,
      totalNetRevenue,
      totalAdvanceCollected,
      totalOutstandingBalance,
      payModeSplit: { cashTotal, upiTotal, cardTotal, onlineTotal, bankTotal },
      lensTypeCounts,
      frameBrandCounts
    };
  }, [bills]);

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-400/20 pb-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-600 bg-clip-text text-transparent flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" /> Sales & Revenue Reports Dashboard
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Comprehensive Financial Metrics, Payment Mode Breakdowns, and Inventory Analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              Admin Exclusive
            </span>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Total Gross Revenue */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
              <span>Gross Sales</span>
              <DollarSign className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono">₹ {summaryMetrics.totalGrossRevenue.toFixed(2)}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Total across {summaryMetrics.totalBills} bills</div>
          </div>

          {/* Card 2: Total Discounts */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-amber-950/40 border-amber-800/40' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between text-amber-500 font-bold mb-1">
              <span>Total Discounts</span>
              <PieChart className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-500">₹ {summaryMetrics.totalDiscount.toFixed(2)}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Special offers & discounts</div>
          </div>

          {/* Card 3: Net Revenue */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50/80 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-emerald-500 font-bold mb-1">
              <span>Net Revenue</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-500">₹ {summaryMetrics.totalNetRevenue.toFixed(2)}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">After all discounts</div>
          </div>

          {/* Card 4: Outstanding Balance */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-rose-950/40 border-rose-800/40' : 'bg-rose-50/80 border-rose-200'
          }`}>
            <div className="flex items-center justify-between text-rose-500 font-bold mb-1">
              <span>Outstanding Balances</span>
              <DollarSign className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-500">₹ {summaryMetrics.totalOutstandingBalance.toFixed(2)}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Pending customer balance</div>
          </div>
        </div>
      </div>

      {/* Payment Modes & Inventory Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment Mode Revenue Split */}
        <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3`}>
          <h2 className="text-sm sm:text-base font-bold flex items-center gap-2 border-b border-slate-400/20 pb-2">
            <PieChart className="w-4 h-4 text-sky-500" /> Payment Mode Revenue Split
          </h2>

          <div className="space-y-2.5 text-xs font-semibold">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-bold text-emerald-500">💵 CASH Payments:</span>
              <span className="font-mono font-bold text-sm">₹ {summaryMetrics.payModeSplit.cashTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
              <span className="font-bold text-sky-500">📱 UPI Payments (GPay/PhonePe):</span>
              <span className="font-mono font-bold text-sm">₹ {summaryMetrics.payModeSplit.upiTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <span className="font-bold text-purple-500">💳 CARD Payments:</span>
              <span className="font-mono font-bold text-sm">₹ {summaryMetrics.payModeSplit.cardTotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <span className="font-bold text-amber-500">🌐 ONLINE / Net Banking:</span>
              <span className="font-mono font-bold text-sm">₹ {summaryMetrics.payModeSplit.onlineTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Top Product Category Analytics */}
        <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3`}>
          <h2 className="text-sm sm:text-base font-bold flex items-center gap-2 border-b border-slate-400/20 pb-2">
            <BarChart3 className="w-4 h-4 text-amber-500" /> Best-Selling Lens & Frame Inventory
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <h3 className="font-bold opacity-80 mb-2 text-sky-400">Popular Lens Designs:</h3>
              <div className="space-y-1 font-mono">
                {Object.entries(summaryMetrics.lensTypeCounts).map(([type, count]) => (
                  <div key={type} className="flex justify-between p-1.5 rounded-lg bg-slate-500/10">
                    <span className="truncate pr-1">{type || 'SV'}</span>
                    <strong className="text-sky-400">{count} sold</strong>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold opacity-80 mb-2 text-amber-400">Top Frame Brands:</h3>
              <div className="space-y-1 font-mono">
                {Object.entries(summaryMetrics.frameBrandCounts).map(([brand, count]) => (
                  <div key={brand} className="flex justify-between p-1.5 rounded-lg bg-slate-500/10">
                    <span className="truncate pr-1">{brand || 'Regular'}</span>
                    <strong className="text-amber-400">{count} sold</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
