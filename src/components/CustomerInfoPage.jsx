import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Phone, MapPin, Stethoscope, Calendar, DollarSign, 
  MessageSquare, PhoneCall, ExternalLink, User, Wallet, Eye, X, 
  ShoppingBag, ShieldCheck, CheckCircle2, Award, Clock 
} from 'lucide-react';

const STORE_PHONE = '+91 90432 29107 / +91 99524 17748';

export default function CustomerInfoPage({ bills = [], isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Group bills by customer phone number or customer name
  const customerProfiles = useMemo(() => {
    const map = {};

    // Pass 1: Aggregate each customer's own orders and direct cashback/redemptions
    bills.forEach(bill => {
      const phoneKey = bill.customer?.phone ? bill.customer.phone.replace(/\D/g, '') : `NO_PHONE_${bill.billNo}`;
      const mrdKey = (bill.customer?.mrdNo || '').toLowerCase().trim().replace(/^0+/, '');

      if (!map[phoneKey]) {
        map[phoneKey] = {
          phoneKey,
          name: bill.customer?.name || 'Unnamed Customer',
          phone: bill.customer?.phone || '',
          mrdNo: bill.customer?.mrdNo || '',
          cleanMrd: mrdKey,
          address: bill.customer?.address || '',
          gender: bill.customer?.gender || 'Male',
          age: bill.customer?.age || '',
          bills: [],
          totalSpend: 0,
          totalBalance: 0,
          walletBalance: 0,
          referralCount: 0,
          latestDate: bill.date || bill.createdAt
        };
      }

      map[phoneKey].bills.push(bill);
      map[phoneKey].totalSpend += (Number(bill.netAmount) || 0);
      map[phoneKey].totalBalance += (Number(bill.balanceAmount) || 0);
      map[phoneKey].walletBalance += (Number(bill.cashbackEarned) || 0) - (Number(bill.walletRedeemed) || 0);
    });

    // Pass 2: Credit 10% Net Amount Referral Cashback to Referrer's Wallet
    bills.forEach(bill => {
      const refMrd = (bill.referrerMrd || '').toLowerCase().trim().replace(/^0+/, '');
      const refPhone = (bill.referrerPhone || '').replace(/\D/g, '');
      const net = Number(bill.netAmount) || 0;
      const refBonus = Math.round(net * 0.10); // 10% of purchaser's net amount credited to referrer

      if (refBonus > 0 && (refMrd || refPhone)) {
        const referrer = Object.values(map).find(c => 
          (refMrd && c.cleanMrd === refMrd) || 
          (refMrd && c.mrdNo && c.mrdNo.toLowerCase().trim() === refMrd) ||
          (refPhone && c.phone.replace(/\D/g, '') === refPhone)
        );

        if (referrer) {
          referrer.walletBalance += refBonus;
          referrer.referralCount = (referrer.referralCount || 0) + 1;
        }
      }
    });

    return Object.values(map);
  }, [bills]);

  // Search filter
  const filteredCustomers = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return customerProfiles;

    return customerProfiles.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(query);
      const phoneMatch = c.phone.includes(query);
      const addressMatch = c.address.toLowerCase().includes(query);
      const mrdMatch = c.mrdNo.toLowerCase().includes(query);
      return nameMatch || phoneMatch || addressMatch || mrdMatch;
    });
  }, [customerProfiles, searchTerm]);

  const getWhatsAppLink = (cust) => {
    const rawPhone = cust.phone.replace(/\D/g, '');
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const msg = `Hello ${cust.name}, greetings from Optics India (${STORE_PHONE})! Your current Optics India Wallet Balance is ₹${Math.max(0, cust.walletBalance).toLocaleString('en-IN')} Rupees. Feel free to redeem it on your next visit!`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-400/20 pb-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-700 dark:text-sky-500" /> Master Customer Directory & Info
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Comprehensive Customer Purchase History, Lifetime Value, and Prescription Tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-blue-50 dark:bg-sky-500/15 border border-blue-200 dark:border-sky-500/30 text-blue-800 dark:text-sky-400">
              Admin Exclusive ({customerProfiles.length} Customers)
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, address, MRD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold ${inputClass}`}
          />
        </div>
      </div>

      {/* Customer Profile Cards List */}
      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className={`${panelClass} p-8 rounded-3xl text-center space-y-2`}>
            <User className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
            <h3 className="text-base font-bold">No Customer Records Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search keywords.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.phoneKey}
              className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all hover:border-blue-500/50 shadow-md`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info Block */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-base text-blue-900 dark:text-sky-400">{cust.name}</span>
                    {cust.mrdNo && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-400/30 text-slate-500 dark:text-slate-400">
                        MRD #{cust.mrdNo}
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/40 text-blue-800 dark:text-blue-300">
                      {cust.bills.length} Orders
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> ₹{Math.max(0, cust.walletBalance).toLocaleString('en-IN')} Wallet Rupees
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs opacity-90 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                      <span className="font-bold text-blue-800 dark:text-sky-400">{cust.phone || 'No Phone'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-700 dark:text-slate-300">{cust.address || 'No Address'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-700 dark:text-sky-300" />
                      <span className="text-slate-700 dark:text-slate-300">{cust.gender} ({cust.age ? `${cust.age} yrs` : 'N/A'})</span>
                    </div>
                  </div>
                </div>

                {/* Right Financial & Action Block */}
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <div className="text-right font-mono text-xs">
                    <div className="opacity-70 text-[10px] text-slate-600 dark:text-slate-400">Lifetime Spend</div>
                    <div className="font-black text-sm text-blue-900 dark:text-sky-400">₹ {cust.totalSpend.toFixed(2)}</div>
                    {cust.totalBalance > 0 && (
                      <div className="text-[10px] text-blue-800 dark:text-sky-400 font-bold">Bal: ₹ {cust.totalBalance.toFixed(2)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                      title="View Full Customer Data & Orders"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    {cust.phone && (
                      <>
                        <a
                          href={getWhatsAppLink(cust)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${cust.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-800 dark:text-sky-400 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" />
                          <span>Call</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAILED CUSTOMER DATA MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-all ${
            isDarkMode ? 'bg-slate-900 border-cyan-500/30 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/30">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black">{selectedCustomer.name}</h2>
                    {selectedCustomer.mrdNo && (
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                        MRD #{selectedCustomer.mrdNo}
                      </span>
                    )}
                  </div>
                  <div className="text-xs opacity-70 font-mono flex items-center gap-2 mt-0.5">
                    <span>Phone: {selectedCustomer.phone || 'N/A'}</span>
                    <span>•</span>
                    <span>Gender/Age: {selectedCustomer.gender} ({selectedCustomer.age ? `${selectedCustomer.age} yrs` : 'N/A'})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                }`}
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
              {/* Financial Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="opacity-70 text-[11px]">Lifetime Spend</div>
                  <div className="text-base font-black font-mono text-blue-600 dark:text-sky-400 mt-0.5">
                    ₹ {selectedCustomer.totalSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="opacity-70 text-[11px]">Balance Due</div>
                  <div className={`text-base font-black font-mono mt-0.5 ${selectedCustomer.totalBalance > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    ₹ {selectedCustomer.totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="opacity-70 text-[11px]">Wallet Balance</div>
                  <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <Wallet className="w-4 h-4" /> ₹{Math.max(0, selectedCustomer.walletBalance).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="opacity-70 text-[11px]">Orders / Referrals</div>
                  <div className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400 mt-0.5 flex items-center gap-1">
                    <ShoppingBag className="w-4 h-4" /> {selectedCustomer.bills.length} Orders ({selectedCustomer.referralCount || 0} Ref)
                  </div>
                </div>
              </div>

              {/* Customer Demographics Card */}
              <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="font-extrabold uppercase tracking-wider text-sky-500 text-[11px] flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Customer Contact & Address Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</div>
                  <div><strong>Address:</strong> {selectedCustomer.address || 'N/A'}</div>
                  <div><strong>Gender / Age:</strong> {selectedCustomer.gender} ({selectedCustomer.age ? `${selectedCustomer.age} yrs` : 'N/A'})</div>
                </div>
              </div>

              {/* Comprehensive Orders & Prescription History Table */}
              <div className="space-y-3">
                <h3 className="font-black text-sm uppercase tracking-wider text-cyan-500 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Order Purchase History ({selectedCustomer.bills.length})
                </h3>

                {selectedCustomer.bills.length === 0 ? (
                  <p className="text-xs opacity-60 italic">No purchase history recorded for this customer.</p>
                ) : (
                  selectedCustomer.bills.map((bill, idx) => (
                    <div 
                      key={bill._id || bill.billNo || idx}
                      className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-400/20 pb-2.5">
                        <div className="flex items-center gap-2 font-mono font-bold">
                          <span className="text-amber-500 font-black text-sm">Bill #{bill.billNo}</span>
                          <span className="opacity-60">•</span>
                          <span className="opacity-80">
                            {bill.date ? new Date(bill.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-extrabold">
                            {bill.entryType || 'New'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            bill.deliveryStatus === 'Delivered' 
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                              : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          }`}>
                            {bill.deliveryStatus || 'Pending'}
                          </span>
                          <span className="font-mono font-black text-emerald-500 text-sm">
                            ₹ {bill.netAmount !== undefined ? bill.netAmount : bill.totalAmount}
                          </span>
                        </div>
                      </div>

                      {/* Items Purchased (Lens & Frame) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-500/10 p-3 rounded-xl">
                        <div>
                          <strong className="text-sky-400 font-extrabold block mb-1">Lens Details:</strong>
                          <div className="space-y-0.5 opacity-90 font-mono text-[11px]">
                            <div>Type: {bill.lens?.type || 'N/A'} | Coating: {bill.lens?.coating || 'N/A'}</div>
                            <div>Brand: {bill.lens?.brand || 'N/A'} | Warranty: {bill.lens?.warranty || 'N/A'}</div>
                            <div>Qty: {bill.lens?.qty || 1} • Price: ₹{bill.lens?.price || 0}</div>
                          </div>
                        </div>

                        <div>
                          <strong className="text-blue-400 font-extrabold block mb-1">Frame Details:</strong>
                          <div className="space-y-0.5 opacity-90 font-mono text-[11px]">
                            <div>Type: {bill.frame?.type || 'N/A'}</div>
                            <div>Brand: {bill.frame?.brand || 'N/A'} | Warranty: {bill.frame?.warranty || 'N/A'}</div>
                            <div>Qty: {bill.frame?.qty || 1} • Price: ₹{bill.frame?.price || 0}</div>
                          </div>
                        </div>
                      </div>

                      {/* Prescription Powers Box */}
                      {bill.prescription && (
                        <div className={`p-3 rounded-xl border font-mono text-[11px] ${
                          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <strong className="text-cyan-500 font-extrabold block mb-1.5 font-sans">Prescription Powers (RE & LE):</strong>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-0.5">
                              <span className="text-rose-500 font-bold block">RE (Right Eye):</span>
                              <div>SPH: {bill.prescription.rightEye?.sph || '-'} | CYL: {bill.prescription.rightEye?.cyl || '-'}</div>
                              <div>AXIS: {bill.prescription.rightEye?.axis || '-'} | ADD: {bill.prescription.rightEye?.add || '-'}</div>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-sky-500 font-bold block">LE (Left Eye):</span>
                              <div>SPH: {bill.prescription.leftEye?.sph || '-'} | CYL: {bill.prescription.leftEye?.cyl || '-'}</div>
                              <div>AXIS: {bill.prescription.leftEye?.axis || '-'} | ADD: {bill.prescription.leftEye?.add || '-'}</div>
                            </div>
                          </div>
                          {(bill.prescription.pd || bill.prescription.ri) && (
                            <div className="mt-2 pt-1.5 border-t border-slate-700/30 flex gap-4 text-[10px] opacity-80">
                              {bill.prescription.pd && <span><strong>PD:</strong> {bill.prescription.pd} mm</span>}
                              {bill.prescription.ri && <span><strong>R.I:</strong> {bill.prescription.ri}</span>}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Doctor & Payment Breakdown */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono opacity-90 border-t border-slate-400/20 pt-2">
                        <div>
                          <span>Dr: <strong>{bill.customer?.drName || 'N/A'}</strong></span>
                          <span className="mx-2">•</span>
                          <span>Staff: <strong>{bill.customer?.orderTakenBy || 'N/A'}</strong></span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span>Adv: <strong>₹{bill.advanceAmount || 0}</strong></span>
                          <span>Bal: <strong className={bill.balanceAmount > 0 ? 'text-amber-500' : 'text-emerald-500'}>₹{bill.balanceAmount || 0}</strong></span>
                          {bill.referralDiscount > 0 && <span className="text-emerald-500">Ref Off: -₹{bill.referralDiscount}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between gap-3 ${
              isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="text-xs opacity-70 font-mono">
                Total Orders Recorded: {selectedCustomer.bills.length}
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-xs cursor-pointer shadow-md transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
