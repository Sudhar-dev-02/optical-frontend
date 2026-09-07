import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar, 
  ShoppingBag, 
  AlertCircle, 
  Truck, 
  FileSpreadsheet, 
  Search, 
  RotateCcw,
  CheckCircle2,
  Clock,
  Glasses
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ReportsPage({ bills = [], isDarkMode }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract YYYY-MM-DD from bill.date safely
  const getBillDateStr = (bill) => {
    if (!bill?.date) return '';
    if (typeof bill.date === 'string') return bill.date.substring(0, 10);
    try {
      return new Date(bill.date).toISOString().substring(0, 10);
    } catch {
      return '';
    }
  };

  // Filter bills by Start Date, End Date, and optional Search
  const filteredBills = useMemo(() => {
    return bills.filter(bill => {
      const bDate = getBillDateStr(bill);
      if (startDate && bDate && bDate < startDate) return false;
      if (endDate && bDate && bDate > endDate) return false;

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const bNo = String(bill.billNo || '').toLowerCase();
        const name = String(bill.customer?.name || '').toLowerCase();
        const phone = String(bill.customer?.phone || '').toLowerCase();
        const mrd = String(bill.customer?.mrdNo || '').toLowerCase();
        if (!bNo.includes(q) && !name.includes(q) && !phone.includes(q) && !mrd.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [bills, startDate, endDate, searchQuery]);

  // Aggregate sales statistics based on filtered bills
  const summaryMetrics = useMemo(() => {
    let totalSale = 0;
    let totalDelivery = 0;
    let totalBalance = 0;

    let cashTotal = 0;
    let upiTotal = 0;
    let cardTotal = 0;
    let onlineTotal = 0;
    let bankTotal = 0;

    const lensTypeCounts = {};
    const frameBrandCounts = {};

    // Check if any bill has explicit deliveryAmount field
    const hasExplicitDeliveryAmount = filteredBills.some(
      b => b.deliveryAmount !== undefined && b.deliveryAmount !== null && b.deliveryAmount !== '' && Number(b.deliveryAmount) > 0
    );

    filteredBills.forEach(bill => {
      const net = Number(bill.netAmount ?? bill.totalAmount ?? 0);
      const bal = Number(bill.balanceAmount ?? 0);
      totalBalance += bal;

      if (hasExplicitDeliveryAmount) {
        const delAmt = Number(bill.deliveryAmount) || 0;
        totalDelivery += delAmt;
        totalSale += Math.max(0, net - delAmt);
      } else {
        // If order is Delivered vs Pending/Ready
        if (bill.deliveryStatus === 'Delivered') {
          totalDelivery += net;
        } else {
          totalSale += net;
        }
      }

      // Payment mode totals
      const mode = (bill.payMode || 'CASH').toUpperCase();
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

    // Formula requested: Gross sales = total sale + delivery amount
    const grossSales = totalSale + totalDelivery;

    return {
      totalBills: filteredBills.length,
      grossSales,
      totalSale,
      totalBalance,
      totalDelivery,
      payModeSplit: { cashTotal, upiTotal, cardTotal, onlineTotal, bankTotal },
      lensTypeCounts,
      frameBrandCounts
    };
  }, [filteredBills]);

  // Quick Date Preset Handlers
  const handleSetToday = () => {
    const todayStr = new Date().toISOString().substring(0, 10);
    setStartDate(todayStr);
    setEndDate(todayStr);
  };

  const handleSetThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
    const todayStr = now.toISOString().substring(0, 10);
    setStartDate(firstDay);
    setEndDate(todayStr);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
  };

  // Helper for formatting Prescription Summary string in Excel
  const formatRxSummary = (rx) => {
    if (!rx) return 'N/A';
    const rSph = rx.rightEye?.sph || rx.rightEye?.dv?.sphere || '-';
    const rCyl = rx.rightEye?.cyl || rx.rightEye?.dv?.cylinder || '-';
    const rAxi = rx.rightEye?.axis || rx.rightEye?.dv?.axis || '-';
    const rAdd = rx.rightEye?.add || '-';
    const rVa  = rx.rightEye?.va || '-';

    const lSph = rx.leftEye?.sph || rx.leftEye?.dv?.sphere || '-';
    const lCyl = rx.leftEye?.cyl || rx.leftEye?.dv?.cylinder || '-';
    const lAxi = rx.leftEye?.axis || rx.leftEye?.dv?.axis || '-';
    const lAdd = rx.leftEye?.add || '-';
    const lVa  = rx.leftEye?.va || '-';

    const hasAny = [rSph, rCyl, rAxi, rAdd, rVa, lSph, lCyl, lAxi, lAdd, lVa].some(
      v => v && v !== '-' && String(v).trim() !== ''
    );
    if (!hasAny) return 'No Rx';

    const addR = (rAdd && rAdd !== '-') ? ` ADD ${rAdd}` : '';
    const addL = (lAdd && lAdd !== '-') ? ` ADD ${lAdd}` : '';
    const vaR = (rVa && rVa !== '-') ? ` VA ${rVa}` : '';
    const vaL = (lVa && lVa !== '-') ? ` VA ${lVa}` : '';

    return `RE: SPH ${rSph}, CYL ${rCyl}, AXIS ${rAxi}${addR}${vaR} | LE: SPH ${lSph}, CYL ${lCyl}, AXIS ${lAxi}${addL}${vaL}`;
  };

  // Render separate RE / LE Prescription Box inside report table
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
        className={`rounded-lg border overflow-hidden text-[10px] font-mono shadow-xs min-w-[240px] max-w-[290px] my-0.5 ${
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

  // Export filtered bills directly to Excel (.xlsx) including full Prescription Details
  const handleExportExcel = () => {
    if (filteredBills.length === 0) {
      alert('No entries available to export for the selected filter.');
      return;
    }

    const excelData = filteredBills.map(b => ({
      'Bill No': b.billNo || '',
      'Date': b.date ? new Date(b.date).toLocaleDateString('en-GB') : '',
      'MRD No': b.customer?.mrdNo || '',
      'Customer Name': b.customer?.name || '',
      'Phone': b.customer?.phone || '',
      'Doctor / Prescribed By': b.customer?.drName || '',
      'Order Taken By': b.customer?.orderTakenBy || '',
      // Complete Prescription Summary
      'Prescription (Lens Powers)': formatRxSummary(b.prescription),
      // Detailed RE Parameters
      'RE SPH': b.prescription?.rightEye?.sph || b.prescription?.rightEye?.dv?.sphere || '',
      'RE CYL': b.prescription?.rightEye?.cyl || b.prescription?.rightEye?.dv?.cylinder || '',
      'RE AXIS': b.prescription?.rightEye?.axis || b.prescription?.rightEye?.dv?.axis || '',
      'RE ADD': b.prescription?.rightEye?.add || '',
      'RE VA': b.prescription?.rightEye?.va || '',
      // Detailed LE Parameters
      'LE SPH': b.prescription?.leftEye?.sph || b.prescription?.leftEye?.dv?.sphere || '',
      'LE CYL': b.prescription?.leftEye?.cyl || b.prescription?.leftEye?.dv?.cylinder || '',
      'LE AXIS': b.prescription?.leftEye?.axis || b.prescription?.leftEye?.dv?.axis || '',
      'LE ADD': b.prescription?.leftEye?.add || '',
      'LE VA': b.prescription?.leftEye?.va || '',
      'PD (mm)': b.prescription?.pd || '',
      'R.I': b.prescription?.ri || '',
      // Product & Financial Details
      'Lens Type': b.lens?.type || '',
      'Lens Brand': b.lens?.brand || '',
      'Frame Brand': b.frame?.brand || '',
      'Total Amount (₹)': Number(b.totalAmount || 0),
      'Discount (₹)': Number(b.discountAmount || 0),
      'Net Amount (₹)': Number(b.netAmount || 0),
      'Advance (₹)': Number(b.advanceAmount || 0),
      'Balance (₹)': Number(b.balanceAmount || 0),
      'Delivery Status': b.deliveryStatus || 'Pending',
      'Delivery Date': b.deliveryDate ? new Date(b.deliveryDate).toLocaleDateString('en-GB') : '',
      'Payment Mode': b.payMode || 'CASH'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Entries');

    // Auto-fit column widths
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length + 3, 14)
    }));
    worksheet['!cols'] = colWidths;

    const startLabel = startDate || 'all';
    const endLabel = endDate || 'all';
    const filename = `Optics_India_Report_${startLabel}_to_${endLabel}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const inputClass = isDarkMode 
    ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-sky-500' 
    : 'bg-white border-slate-300 text-slate-900 focus:border-sky-500';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & 4 KPI Boxes */}
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

        {/* 4 KPI Cards: Gross Sales, Total Sale, Total Balance, Total Delivery */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Gross Sales = Total Sale + Delivery Amount */}
          <div className={`p-4 rounded-2xl border transition-all shadow-xs ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
              <span className="text-slate-500 dark:text-slate-400">Gross Sales</span>
              <DollarSign className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-sky-500">
              ₹ {summaryMetrics.grossSales.toFixed(2)}
            </div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">
              value(total sale + delivery amount)
            </div>
          </div>

          {/* Card 2: Total Sale */}
          <div className={`p-4 rounded-2xl border transition-all shadow-xs ${
            isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50/80 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-emerald-500 font-bold mb-1">
              <span>Total Sale</span>
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-500">
              ₹ {summaryMetrics.totalSale.toFixed(2)}
            </div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">
              Total sale amount
            </div>
          </div>

          {/* Card 3: Total Balance */}
          <div className={`p-4 rounded-2xl border transition-all shadow-xs ${
            isDarkMode ? 'bg-rose-950/40 border-rose-800/40' : 'bg-rose-50/80 border-rose-200'
          }`}>
            <div className="flex items-center justify-between text-rose-500 font-bold mb-1">
              <span>Total Balance</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-rose-500">
              ₹ {summaryMetrics.totalBalance.toFixed(2)}
            </div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">
              Pending balance amount
            </div>
          </div>

          {/* Card 4: Total Delivery */}
          <div className={`p-4 rounded-2xl border transition-all shadow-xs ${
            isDarkMode ? 'bg-amber-950/40 border-amber-800/40' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between text-amber-500 font-bold mb-1">
              <span>Total Delivery</span>
              <Truck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-500">
              ₹ {summaryMetrics.totalDelivery.toFixed(2)}
            </div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">
              Delivery amount
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter & Filtered Entries Section with Excel Download */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-400/20 pb-3">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" /> Date Range Filter & Sales Entries
            </h2>
            <p className="text-xs opacity-70 mt-0.5">
              Filter billing entries between dates and export directly to Excel with full Prescription (Lens Powers)
            </p>
          </div>

          {/* Download Excel Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            title="Export filtered records including Prescription to Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel</span>
          </button>
        </div>

        {/* Date Filter Controls Bar */}
        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Start Date */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold opacity-80 whitespace-nowrap">Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border outline-none font-mono ${inputClass}`}
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold opacity-80 whitespace-nowrap">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border outline-none font-mono ${inputClass}`}
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleSetToday}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300' 
                    : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleSetThisMonth}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300' 
                    : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700 shadow-2xs'
                }`}
              >
                This Month
              </button>

              {(startDate || endDate || searchQuery) && (
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-500/40 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all cursor-pointer flex items-center gap-1"
                  title="Clear all filters"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Search Input in table */}
            <div className="flex-1 min-w-[200px] flex items-center gap-1.5">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Search by Bill No, Name, Phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border outline-none ${inputClass}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] opacity-70 font-semibold flex items-center justify-between">
            <span>
              Showing <strong>{filteredBills.length}</strong> of <strong>{bills.length}</strong> total billing entries
            </span>
            {(startDate || endDate) && (
              <span className="font-mono text-sky-500 font-bold">
                Filtered: {startDate || 'Beginning'} → {endDate || 'Today'}
              </span>
            )}
          </div>
        </div>

        {/* Filtered Entries Table with Prescription (Lens Powers) */}
        <div className={`overflow-x-auto rounded-xl border max-h-[440px] overflow-y-auto ${
          isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <table className="w-full text-left text-xs min-w-[1100px]">
            <thead className={`border-b font-extrabold sticky top-0 backdrop-blur-xl z-10 ${
              isDarkMode ? 'bg-slate-900/95 border-slate-800 text-slate-300' : 'bg-slate-100/95 border-slate-200 text-slate-700'
            }`}>
              <tr>
                <th className="p-2.5 border-r border-slate-400/20 text-center">Bill No.</th>
                <th className="p-2.5 border-r border-slate-400/20">Date</th>
                <th className="p-2.5 border-r border-slate-400/20">MRD No</th>
                <th className="p-2.5 border-r border-slate-400/20">Customer Name</th>
                <th className="p-2.5 border-r border-slate-400/20">Phone</th>
                <th className="p-2.5 border-r border-slate-400/20 min-w-[260px]">Prescription (Lens Powers)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-right">Total (₹)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-right">Discount (₹)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-right">Net Amt (₹)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-right">Advance (₹)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-right">Balance (₹)</th>
                <th className="p-2.5 border-r border-slate-400/20 text-center">Status</th>
                <th className="p-2.5 text-center">Pay Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/20 font-mono">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="13" className="p-8 text-center opacity-60 font-sans">
                    No billing entries found for the selected date range or search query.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => {
                  const formattedDate = b.date 
                    ? new Date(b.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                    : 'N/A';
                  const isDelivered = b.deliveryStatus === 'Delivered';

                  return (
                    <tr 
                      key={b._id || b.billNo}
                      className={`transition-all ${
                        isDarkMode ? 'hover:bg-slate-900/60 text-slate-300' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <td className="p-2.5 border-r border-slate-400/20 text-center font-bold text-amber-500">
                        {b.billNo}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-[11px]">
                        {formattedDate}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-[11px] opacity-70">
                        {b.customer?.mrdNo || '-'}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 font-sans font-bold">
                        {b.customer?.name || '-'}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-amber-500 font-semibold">
                        {b.customer?.phone || '-'}
                      </td>
                      {/* Prescription (Lens Powers) RE & LE Box */}
                      <td className="p-2.5 border-r border-slate-400/20">
                        {renderPrescriptionBox(b.prescription)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-right">
                        {Number(b.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-right text-amber-500">
                        {Number(b.discountAmount || 0).toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-right font-bold text-sky-500">
                        {Number(b.netAmount || 0).toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-right text-emerald-500">
                        {Number(b.advanceAmount || 0).toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-right font-bold text-rose-500">
                        {Number(b.balanceAmount || 0).toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-400/20 text-center font-sans">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDelivered 
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}>
                          {isDelivered ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {b.deliveryStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-sans">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/15 text-slate-400">
                          {b.payMode || 'CASH'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modes & Inventory Breakdown Grid (Preserved intact) */}
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
