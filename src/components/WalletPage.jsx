import React, { useState, useMemo } from 'react';
import { 
  Wallet, Gift, Users, Search, ArrowUpRight, ArrowDownLeft, 
  FileSpreadsheet, MessageSquare, PhoneCall, ExternalLink, 
  Eye, CheckCircle2, DollarSign, Calendar, TrendingUp, 
  Award, ShieldCheck, Clock, X, ArrowRight, RefreshCw,
  Sparkles, Filter, ChevronRight, Share2, HelpCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { 
  getCustomerWalletProfiles, 
  getAllWalletAuditTransactions, 
  getWalletSummaryMetrics 
} from '../utils/wallet';

const STORE_PHONE = '+91 90432 29107 / +91 99524 17748';
const STORE_NAME = 'Optics India';

export default function WalletPage({ 
  bills = [], 
  isDarkMode, 
  userRole = 'admin',
  onSelectCustomerForBilling 
}) {
  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'audit' | 'rules'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'POSITIVE' | 'REFERRERS' | 'REDEEMED'
  const [auditFilterType, setAuditFilterType] = useState('ALL'); // 'ALL' | 'CASHBACK' | 'REFERRAL_BONUS' | 'REDEEMED'
  const [selectedCustomerLedger, setSelectedCustomerLedger] = useState(null);

  // Compute all wallet profiles and metrics from bills
  const walletProfiles = useMemo(() => {
    return getCustomerWalletProfiles(bills);
  }, [bills]);

  const metrics = useMemo(() => {
    return getWalletSummaryMetrics(bills);
  }, [bills]);

  const allAuditLogs = useMemo(() => {
    return getAllWalletAuditTransactions(bills);
  }, [bills]);

  // Filtered customer profiles
  const filteredProfiles = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return walletProfiles.filter(profile => {
      // Search match
      const nameMatch = profile.name.toLowerCase().includes(q);
      const phoneMatch = profile.phone.includes(q);
      const mrdMatch = profile.mrdNo.toLowerCase().includes(q);
      const addrMatch = (profile.address || '').toLowerCase().includes(q);
      const matchesSearch = !q || (nameMatch || phoneMatch || mrdMatch || addrMatch);

      if (!matchesSearch) return false;

      // Filter pill
      if (filterType === 'POSITIVE') return profile.walletBalance > 0;
      if (filterType === 'REFERRERS') return profile.referralCount > 0;
      if (filterType === 'REDEEMED') return profile.walletRedeemed > 0;

      return true;
    });
  }, [walletProfiles, searchTerm, filterType]);

  // Filtered audit transactions
  const filteredAuditLogs = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();

    return allAuditLogs.filter(log => {
      const nameMatch = (log.customerName || '').toLowerCase().includes(q);
      const phoneMatch = (log.customerPhone || '').includes(q);
      const mrdMatch = (log.customerMrd || '').toLowerCase().includes(q);
      const billMatch = String(log.billNo || '').includes(q);
      const matchesSearch = !q || (nameMatch || phoneMatch || mrdMatch || billMatch);

      if (!matchesSearch) return false;

      if (auditFilterType !== 'ALL' && log.type !== auditFilterType) return false;

      return true;
    });
  }, [allAuditLogs, searchTerm, auditFilterType]);

  // WhatsApp Alert Generator
  const getWhatsAppLink = (cust) => {
    const rawPhone = cust.phone.replace(/\D/g, '');
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const msg = `Hello ${cust.name}, greetings from ${STORE_NAME} (${STORE_PHONE})! ✨\n\nYour current Loyalty Wallet Balance is ₹${cust.walletBalance.toLocaleString('en-IN')} Rupees.\n\nYou can redeem your wallet amount directly on your next eyewear purchase or prescription frame at our store.\n\nThank you for choosing ${STORE_NAME}!`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
  };

  // Export to Excel Spreadsheet
  const handleExportExcel = () => {
    // Sheet 1: Customer Wallet Summary
    const summaryData = walletProfiles.map((p, idx) => ({
      'S.No': idx + 1,
      'Customer Name': p.name,
      'MRD No': p.mrdNo,
      'Phone': p.phone,
      'Available Wallet Balance (₹)': p.walletBalance,
      'Direct Cashback Earned (₹)': p.directCashbackEarned,
      'Referral Bonuses Earned (₹)': p.referralBonusEarned,
      'Total Redeemed (₹)': p.walletRedeemed,
      'Referrals Count': p.referralCount,
      'Total Spend (₹)': p.totalSpend,
      'Orders Count': p.bills.length
    }));

    // Sheet 2: Master Transaction Audit Log
    const auditData = allAuditLogs.map((log, idx) => ({
      'Log ID': idx + 1,
      'Date': typeof log.date === 'string' ? log.date.substring(0, 10) : new Date(log.date).toISOString().substring(0, 10),
      'Customer Name': log.customerName,
      'MRD No': log.customerMrd,
      'Phone': log.customerPhone,
      'Transaction Type': log.type,
      'Bill No': log.billNo,
      'Order Amount (₹)': log.netAmount || 0,
      'Wallet Change (₹)': log.amount,
      'Description / Note': log.note
    }));

    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    const ws2 = XLSX.utils.json_to_sheet(auditData);

    XLSX.utils.book_append_sheet(wb, ws1, 'Customer Wallets');
    XLSX.utils.book_append_sheet(wb, ws2, 'Audit Transaction Log');

    XLSX.writeFile(wb, `Optics_India_Wallet_Report_${new Date().toISOString().substring(0, 10)}.xlsx`);
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="p-3.5 sm:p-4.5 max-w-[1920px] mx-auto w-full space-y-4 animate-in fade-in duration-300 pb-16">
      {/* TOP HEADER & ACTION BANNER */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg border`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-400/20 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                  Customer Wallet &amp; Loyalty Hub
                </h1>
                <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
                  Maintain customer cashback points, track referral commissions, and review ledger balances in real time
                </p>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              title="Download full wallet & transaction excel ledger"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel Ledger</span>
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
          {/* Card 1: Total Circulation */}
          <div className={`p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/70 border-blue-200'}`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              <span>In Circulation</span>
              <Wallet className="w-4 h-4 text-blue-700 dark:text-sky-400" />
            </div>
            <div className="mt-1 font-mono font-black text-lg sm:text-xl text-blue-900 dark:text-sky-300">
              ₹ {metrics.totalPoolInCirculation.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-blue-800/80 dark:text-sky-400/80 font-semibold mt-0.5">
              Available across customers
            </div>
          </div>

          {/* Card 2: Total Cashback Distributed */}
          <div className={`p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-indigo-50/70 border-indigo-200'}`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              <span>10% Purchase Cashback</span>
              <Gift className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-1 font-mono font-black text-lg sm:text-xl text-indigo-900 dark:text-indigo-300">
              ₹ {metrics.totalCashbackGiven.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-indigo-800/80 dark:text-indigo-400/80 font-semibold mt-0.5">
              Earned on purchases
            </div>
          </div>

          {/* Card 3: Total Referral Bonuses */}
          <div className={`p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/70 border-sky-200'}`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              <span>10% Referral Bonuses</span>
              <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="mt-1 font-mono font-black text-lg sm:text-xl text-sky-900 dark:text-sky-300">
              ₹ {metrics.totalReferralBonusesGiven.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-sky-800/80 dark:text-sky-400/80 font-semibold mt-0.5">
              {metrics.totalReferralCount} friends referred
            </div>
          </div>

          {/* Card 4: Total Redeemed */}
          <div className={`p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              <span>Wallet Redeemed</span>
              <ArrowDownLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="mt-1 font-mono font-black text-lg sm:text-xl text-slate-800 dark:text-slate-200">
              ₹ {metrics.totalRedeemed.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
              Used against checkouts
            </div>
          </div>

          {/* Card 5: Active Holders */}
          <div className={`col-span-2 sm:col-span-1 p-3.5 rounded-2xl border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/70 border-blue-200'}`}>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold">
              <span>Active Balance Users</span>
              <Award className="w-4 h-4 text-blue-700 dark:text-sky-400" />
            </div>
            <div className="mt-1 font-mono font-black text-lg sm:text-xl text-blue-900 dark:text-sky-300">
              {metrics.activeWalletHolders} / {metrics.totalCustomers}
            </div>
            <div className="text-[10px] text-blue-800/80 dark:text-sky-400/80 font-semibold mt-0.5">
              Customers with ₹ &gt; 0
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS & SEARCH / FILTER CONTROLS */}
      <div className={`${panelClass} p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-3`}>
        {/* Main Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-950/60 border border-slate-300/40 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Wallets ({filteredProfiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Transaction Audit Log ({allAuditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Loyalty Policy</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {activeTab === 'customers' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  filterType === 'ALL'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('POSITIVE')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  filterType === 'POSITIVE'
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Balance &gt; 0
              </button>
              <button
                type="button"
                onClick={() => setFilterType('REFERRERS')}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  filterType === 'REFERRERS'
                    ? 'bg-indigo-700 text-white border-indigo-700'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                Referrers
              </button>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="flex items-center gap-1">
              {['ALL', 'CASHBACK', 'REFERRAL_BONUS', 'REDEEMED'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAuditFilterType(type)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border uppercase transition-all cursor-pointer ${
                    auditFilterType === type
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          {/* Search Box */}
          <div className="relative min-w-[220px] sm:min-w-[280px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, MRD, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl pl-8 pr-3 py-1.5 text-xs font-semibold ${inputClass}`}
            />
          </div>
        </div>
      </div>

      {/* TAB 1: CUSTOMER WALLETS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-3">
          {filteredProfiles.length === 0 ? (
            <div className={`${panelClass} p-10 rounded-3xl text-center space-y-2 border`}>
              <Wallet className="w-12 h-12 mx-auto text-slate-400 opacity-60" />
              <h3 className="text-base font-bold">No Customer Wallet Records Found</h3>
              <p className="text-xs text-slate-400">Try adjusting your search or filter options.</p>
            </div>
          ) : (
            filteredProfiles.map((cust) => (
              <div
                key={cust.phoneKey}
                className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all hover:border-blue-500/50 shadow-md`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Customer Core Identity */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-base text-blue-900 dark:text-sky-300">{cust.name}</span>
                      {cust.mrdNo && (
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-400/30 text-slate-600 dark:text-slate-300">
                          MRD #{cust.mrdNo}
                        </span>
                      )}
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-sky-500/15 border border-blue-200 dark:border-sky-500/30 text-blue-800 dark:text-sky-300 flex items-center gap-1 shadow-xs">
                        <Wallet className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                        <span className="text-xs font-mono font-black">₹{cust.walletBalance.toLocaleString('en-IN')} Wallet Rupees</span>
                      </span>

                      {cust.referralCount > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-300 dark:border-indigo-500/40 text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          <span>{cust.referralCount} Referred</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono opacity-90">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                        <span className="font-bold text-blue-800 dark:text-sky-300">{cust.phone || 'No Phone'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-500">Address:</span>
                        <span className="text-slate-700 dark:text-slate-300 truncate">{cust.address || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Orders:</span>
                        <span className="font-bold">{cust.bills.length} Bills (₹{cust.totalSpend.toFixed(0)})</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-blue-50/50 border-blue-200'}`}>
                        <div className="text-[10px] text-slate-500">Cashback</div>
                        <div className="font-bold text-blue-700 dark:text-sky-400">₹{cust.directCashbackEarned}</div>
                      </div>
                      <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-indigo-50/50 border-indigo-200'}`}>
                        <div className="text-[10px] text-slate-500">Ref. Bonus</div>
                        <div className="font-bold text-indigo-700 dark:text-indigo-400">₹{cust.referralBonusEarned}</div>
                      </div>
                      <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="text-[10px] text-slate-500">Redeemed</div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">₹{cust.walletRedeemed}</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomerLedger(cust)}
                        className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                        title="View Full Itemized Ledger"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ledger</span>
                      </button>

                      {cust.phone && (
                        <a
                          href={getWhatsAppLink(cust)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                          title="Send Wallet Balance Statement on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: MASTER TRANSACTION AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-lg overflow-x-auto`}>
          <div className="flex items-center justify-between border-b border-slate-400/20 pb-3 mb-3">
            <h3 className="font-black text-sm flex items-center gap-2 text-blue-900 dark:text-sky-400">
              <Clock className="w-4 h-4 text-blue-700 dark:text-sky-400" />
              <span>All Historical Wallet Credit &amp; Debit Transactions</span>
            </h3>
            <span className="text-xs font-mono font-bold opacity-70">
              Showing {filteredAuditLogs.length} events
            </span>
          </div>

          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className={`border-b border-slate-400/20 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <th className="py-2 px-3 font-extrabold">DATE</th>
                <th className="py-2 px-3 font-extrabold">CUSTOMER</th>
                <th className="py-2 px-3 font-extrabold">TYPE</th>
                <th className="py-2 px-3 font-extrabold">BILL NO</th>
                <th className="py-2 px-3 font-extrabold text-right">ORDER NET</th>
                <th className="py-2 px-3 font-extrabold text-right">WALLET IMPACT</th>
                <th className="py-2 px-3 font-extrabold">NOTE / DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-400/10">
              {filteredAuditLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAuditLogs.map((log) => {
                  const isCredit = log.amount > 0;
                  return (
                    <tr key={log.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-bold">
                        {typeof log.date === 'string' ? log.date.substring(0, 10) : new Date(log.date).toISOString().substring(0, 10)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-sans font-bold text-slate-900 dark:text-slate-100">{log.customerName}</div>
                        <div className="text-[10px] text-slate-500">MRD #{log.customerMrd || 'N/A'} • {log.customerPhone}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {log.type === 'CASHBACK' && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-sky-400 font-bold text-[10px] border border-blue-500/30">
                            Cashback 10%
                          </span>
                        )}
                        {log.type === 'REFERRAL_BONUS' && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold text-[10px] border border-indigo-500/30">
                            Referral Bonus 10%
                          </span>
                        )}
                        {log.type === 'REDEEMED' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-500/30">
                            Redeemed
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-700 dark:text-sky-400">
                        #{log.billNo}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {log.netAmount ? `₹ ${log.netAmount.toFixed(2)}` : '-'}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-black ${isCredit ? 'text-blue-700 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {isCredit ? `+₹ ${log.amount}` : `-₹ ${Math.abs(log.amount)}`}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-xs text-slate-600 dark:text-slate-300">
                        {log.note}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: LOYALTY RULES & POLICY */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${panelClass} p-5 rounded-3xl border space-y-3`}>
            <div className="p-3 rounded-2xl bg-blue-700 text-white w-fit shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-blue-900 dark:text-sky-400">1) 10% Purchase Cashback</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Every customer automatically earns <strong>10% of their final Net Amount</strong> into their Optics India Wallet as loyalty cashback upon invoice generation.
            </p>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-[11px] font-mono font-bold text-blue-800 dark:text-sky-300">
              Example: Bill of ₹5,000 = ₹500 Cashback directly credited to customer wallet.
            </div>
          </div>

          <div className={`${panelClass} p-5 rounded-3xl border space-y-3`}>
            <div className="p-3 rounded-2xl bg-indigo-700 text-white w-fit shadow-md">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-indigo-900 dark:text-indigo-400">2) 20% Referral Off &amp; 10% Referrer Bonus</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              When a new patient provides a friend's MRD/Phone number, the new customer receives an instant <strong>20% discount</strong>, and the referrer receives a <strong>10% bonus credit</strong> into their wallet!
            </p>
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-[11px] font-mono font-bold text-indigo-800 dark:text-indigo-300">
              Example: Friend buys ₹4,000 net = Referrer earns ₹400 bonus instantly.
            </div>
          </div>

          <div className={`${panelClass} p-5 rounded-3xl border space-y-3`}>
            <div className="p-3 rounded-2xl bg-sky-700 text-white w-fit shadow-md">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-sky-900 dark:text-sky-400">3) Instant Checkout Redemption</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Cashiers can seamlessly redeem any portion or max available wallet balance directly on the POS screen by clicking <strong>Max</strong> or entering the desired redeem amount.
            </p>
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-[11px] font-mono font-bold text-sky-800 dark:text-sky-300">
              No expiry restrictions: Points accumulate across lifetime store visits.
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CUSTOMER WALLET LEDGER MODAL */}
      {selectedCustomerLedger && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all ${
            isDarkMode ? 'bg-slate-900 border-blue-500/30 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-600/30">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black">{selectedCustomerLedger.name}</h2>
                    {selectedCustomerLedger.mrdNo && (
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-700 dark:text-sky-400">
                        MRD #{selectedCustomerLedger.mrdNo}
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-70 font-mono mt-0.5">
                    Phone: {selectedCustomerLedger.phone || 'N/A'} • {selectedCustomerLedger.address || 'No Address'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomerLedger(null)}
                className="p-2 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Top Mini Balance Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-100">Current Available Wallet Balance</div>
                  <div className="text-2xl font-black font-mono mt-0.5">₹ {selectedCustomerLedger.walletBalance.toLocaleString('en-IN')} Rupees</div>
                </div>

                <div className="text-right text-xs font-mono text-blue-100">
                  <div>Lifetime Spend: ₹{selectedCustomerLedger.totalSpend.toFixed(0)}</div>
                  <div>Bills: {selectedCustomerLedger.bills.length} Orders</div>
                </div>
              </div>

              {/* Ledger Breakdown Grid */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="text-[10px] text-slate-500">Total Purchase Cashback</div>
                  <div className="text-base font-black text-blue-700 dark:text-sky-400 mt-0.5">₹ {selectedCustomerLedger.directCashbackEarned}</div>
                </div>

                <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-indigo-50 border-indigo-200'}`}>
                  <div className="text-[10px] text-slate-500">Total Referral Bonuses</div>
                  <div className="text-base font-black text-indigo-700 dark:text-indigo-400 mt-0.5">₹ {selectedCustomerLedger.referralBonusEarned}</div>
                </div>

                <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="text-[10px] text-slate-500">Total Redeemed at Checkout</div>
                  <div className="text-base font-black text-slate-700 dark:text-slate-300 mt-0.5">₹ {selectedCustomerLedger.walletRedeemed}</div>
                </div>
              </div>

              {/* Itemized Transactions Table */}
              <div className="space-y-2">
                <div className="font-bold text-xs flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4 text-blue-700 dark:text-sky-400" /> Itemized Transaction History ({selectedCustomerLedger.ledger.length} events)
                </div>

                <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <table className="w-full text-xs font-mono text-left">
                    <thead className={isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                      <tr>
                        <th className="py-2 px-3">DATE</th>
                        <th className="py-2 px-3">EVENT</th>
                        <th className="py-2 px-3">BILL #</th>
                        <th className="py-2 px-3 text-right">IMPACT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-400/10">
                      {selectedCustomerLedger.ledger.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">
                            No ledger history available.
                          </td>
                        </tr>
                      ) : (
                        selectedCustomerLedger.ledger.map((item) => {
                          const isCredit = item.amount > 0;
                          return (
                            <tr key={item.id} className="hover:bg-slate-500/5">
                              <td className="py-2.5 px-3 text-slate-500">
                                {typeof item.date === 'string' ? item.date.substring(0, 10) : new Date(item.date).toISOString().substring(0, 10)}
                              </td>
                              <td className="py-2.5 px-3 font-sans">
                                <div className="font-bold text-slate-800 dark:text-slate-200">{item.title}</div>
                                <div className="text-[11px] text-slate-500">{item.note}</div>
                              </td>
                              <td className="py-2.5 px-3 font-bold text-blue-700 dark:text-sky-400">
                                #{item.billNo}
                              </td>
                              <td className={`py-2.5 px-3 text-right font-black ${isCredit ? 'text-blue-700 dark:text-sky-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                {isCredit ? `+₹ ${item.amount}` : `-₹ ${Math.abs(item.amount)}`}
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

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {selectedCustomerLedger.phone ? (
                <a
                  href={getWhatsAppLink(selectedCustomerLedger)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Balance via WhatsApp</span>
                </a>
              ) : <div />}

              <button
                type="button"
                onClick={() => setSelectedCustomerLedger(null)}
                className="px-4 py-2 rounded-xl border font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
