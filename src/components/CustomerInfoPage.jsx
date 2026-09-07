import React, { useState, useMemo } from 'react';
import { Users, Search, Phone, MapPin, Stethoscope, Calendar, DollarSign, MessageSquare, PhoneCall, ExternalLink, User } from 'lucide-react';

const STORE_PHONE = '+91 90432 29107 / +91 99524 17748';

export default function CustomerInfoPage({ bills = [], isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Group bills by customer phone number or customer name
  const customerProfiles = useMemo(() => {
    const map = {};

    bills.forEach(bill => {
      const phoneKey = bill.customer?.phone ? bill.customer.phone.replace(/\D/g, '') : `NO_PHONE_${bill.billNo}`;
      
      if (!map[phoneKey]) {
        map[phoneKey] = {
          phoneKey,
          name: bill.customer?.name || 'Unnamed Customer',
          phone: bill.customer?.phone || '',
          mrdNo: bill.customer?.mrdNo || '',
          address: bill.customer?.address || '',
          gender: bill.customer?.gender || 'Male',
          age: bill.customer?.age || '',
          bills: [],
          totalSpend: 0,
          totalBalance: 0,
          latestDate: bill.date || bill.createdAt
        };
      }

      map[phoneKey].bills.push(bill);
      map[phoneKey].totalSpend += (Number(bill.netAmount) || 0);
      map[phoneKey].totalBalance += (Number(bill.balanceAmount) || 0);
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
    const msg = `Hello ${cust.name}, greetings from Optics India (${STORE_PHONE})! We are reaching out regarding your optical records. Please feel free to contact us at ${STORE_PHONE} anytime!`;
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
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 via-sky-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-500" /> Master Customer Directory & Info
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Comprehensive Customer Purchase History, Lifetime Value, and Prescription Tracking
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
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
              className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all hover:border-sky-500/50 shadow-md`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info Block */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-base text-sky-500">{cust.name}</span>
                    {cust.mrdNo && (
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-400/30 text-slate-400">
                        MRD #{cust.mrdNo}
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                      {cust.bills.length} Orders
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs opacity-90 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-bold text-amber-500">{cust.phone || 'No Phone'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cust.address || 'No Address'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>{cust.gender} ({cust.age ? `${cust.age} yrs` : 'N/A'})</span>
                    </div>
                  </div>
                </div>

                {/* Right Financial & Action Block */}
                <div className="flex flex-wrap items-center gap-4 shrink-0">
                  <div className="text-right font-mono text-xs">
                    <div className="opacity-70 text-[10px]">Lifetime Spend</div>
                    <div className="font-black text-sm text-emerald-500">₹ {cust.totalSpend.toFixed(2)}</div>
                    {cust.totalBalance > 0 && (
                      <div className="text-[10px] text-rose-500 font-bold">Bal: ₹ {cust.totalBalance.toFixed(2)}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {cust.phone && (
                      <>
                        <a
                          href={getWhatsAppLink(cust)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`tel:${cust.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-slate-500/15 border border-slate-400/30 hover:bg-slate-500/25 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
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
    </div>
  );
}
