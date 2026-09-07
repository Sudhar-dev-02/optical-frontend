import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Wrench, 
  Stethoscope, 
  Calendar, 
  Search, 
  CheckCircle2, 
  Clock, 
  User, 
  Filter, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  PhoneCall
} from 'lucide-react';

const STORE_PHONE = '+91 733 933 4042';

export default function FollowUpPage({ bills = [], isDarkMode, onUpdateBillStatus }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'service' | 'feedback' | 'eyecheck'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Pending' | 'Contacted' | 'Completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatuses, setLocalStatuses] = useState({});

  // Helper date calculations
  const addDays = (dateStr, days) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d;
  };

  const formatDate = (d) => {
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return String(d);
    }
  };

  // Enrich bills with calculated follow-up dates and status
  const followUpItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bills.map((bill) => {
      const baseDate = bill.deliveryDate || bill.date || new Date().toISOString();
      
      // 1) Free Service: 90 days after delivery (3 months)
      const serviceDate = addDays(baseDate, 90);
      
      // 2) Product Feedback: 14 days after delivery
      const feedbackDate = addDays(baseDate, 14);
      
      // 3) Next Eye Check: 240 days after delivery (8 months)
      const eyeCheckDate = addDays(baseDate, 240);

      const savedStatus = localStatuses[bill._id || bill.billNo] || bill.followUpStatus || 'Pending';

      return {
        ...bill,
        serviceDate,
        feedbackDate,
        eyeCheckDate,
        currentStatus: savedStatus
      };
    });
  }, [bills, localStatuses]);

  // Filter items based on selected category tab, status, and search query
  const filteredItems = useMemo(() => {
    return followUpItems.filter(item => {
      // Search term matching
      const query = searchTerm.toLowerCase().trim();
      const nameMatch = (item.customer?.name || '').toLowerCase().includes(query);
      const phoneMatch = (item.customer?.phone || '').includes(query);
      const billMatch = (item.billNo || '').toString().includes(query);
      const matchesSearch = !query || nameMatch || phoneMatch || billMatch;

      // Status filter matching
      const matchesStatus = statusFilter === 'all' || item.currentStatus === statusFilter;

      // Tab filter
      let matchesTab = true;
      if (activeTab === 'service') {
        matchesTab = true; // Shows items for 3-month free service
      } else if (activeTab === 'feedback') {
        matchesTab = true; // Shows items for feedback
      } else if (activeTab === 'eyecheck') {
        matchesTab = true; // Shows items for 8-month eye check
      }

      return matchesSearch && matchesStatus && matchesTab;
    });
  }, [followUpItems, activeTab, statusFilter, searchTerm]);

  // Status toggle handler
  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'Contacted' : currentStatus === 'Contacted' ? 'Completed' : 'Pending';
    setLocalStatuses(prev => ({ ...prev, [id]: nextStatus }));
    if (onUpdateBillStatus) {
      onUpdateBillStatus(id, nextStatus);
    }
  };

  // Generate customized WhatsApp Link based on follow-up type
  const getWhatsAppLink = (item, type) => {
    const rawPhone = (item.customer?.phone || '').replace(/\D/g, '');
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const customerName = item.customer?.name || 'Valued Customer';
    const billNo = item.billNo || '';

    let message = '';
    if (type === 'service') {
      message = `Hello ${customerName}, greetings from Optics India (${STORE_PHONE})! 👓✨\n\nIt has been 3 months since your eyewear purchase (Bill #${billNo}). We invite you to visit our store for a Complimentary Glasses Servicing, Ultrasonic Cleaning, and Frame Realignment.\n\nVisit us anytime or call ${STORE_PHONE} for queries!`;
    } else if (type === 'feedback') {
      message = `Hello ${customerName}, thank you for choosing Optics India (${STORE_PHONE})! 🌟\n\nWe would love to know how your new glasses (Bill #${billNo}) are fitting and if your vision is perfectly comfortable. If you need any minor adjustment, please feel free to reach out to us at ${STORE_PHONE}.\n\nHave a wonderful day!`;
    } else if (type === 'eyecheck') {
      message = `Hello ${customerName}, warm greetings from Optics India (${STORE_PHONE})! 👁️✨\n\nIt has been 8 months since your last eye prescription (Bill #${billNo}). Regular vision checkups ensure optimal eye health and clear vision.\n\nReply to this message or call ${STORE_PHONE} to schedule your free eye checkup at your convenience!`;
    } else {
      message = `Hello ${customerName}, greetings from Optics India (${STORE_PHONE}) regarding Bill #${billNo}. Please feel free to contact us for any assistance or vision queries!`;
    }

    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
  };

  // Metrics counters
  const totalCount = followUpItems.length;
  const pendingCount = followUpItems.filter(i => i.currentStatus === 'Pending').length;
  const contactedCount = followUpItems.filter(i => i.currentStatus === 'Contacted').length;
  const completedCount = followUpItems.filter(i => i.currentStatus === 'Completed').length;

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & KPI Summary Cards */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-400/20 pb-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <Phone className="w-6 h-6 text-sky-500" /> Customer Follow-Up Manager
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Automated 3-Month Free Service, Product Feedback, and 8-Month Vision Checkup Workflows
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
              isDarkMode ? 'bg-sky-950/60 border-sky-800 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}>
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>Official WhatsApp / Store Contact: <strong>{STORE_PHONE}</strong></span>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Total Records */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
              <span>Total Customers</span>
              <User className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono">{totalCount}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Active follow-up queue</div>
          </div>

          {/* Card 2: 3-Month Free Service Due */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-blue-950/40 border-blue-800/40' : 'bg-blue-50/80 border-blue-200'
          }`}>
            <div className="flex items-center justify-between text-blue-500 font-bold mb-1">
              <span>🛠️ 3M Free Service</span>
              <Wrench className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-blue-500">{followUpItems.length}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">90 days post-purchase</div>
          </div>

          {/* Card 3: Feedback Pending */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-amber-950/40 border-amber-800/40' : 'bg-amber-50/80 border-amber-200'
          }`}>
            <div className="flex items-center justify-between text-amber-500 font-bold mb-1">
              <span>💬 Product Feedback</span>
              <MessageSquare className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-amber-500">{pendingCount}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Post-delivery checkup</div>
          </div>

          {/* Card 4: 8-Month Next Eye Check */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-emerald-950/40 border-emerald-800/40' : 'bg-emerald-50/80 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-emerald-500 font-bold mb-1">
              <span>👁️ 8M Eye Checkup</span>
              <Stethoscope className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-500">{followUpItems.length}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">240 days vision check</div>
          </div>
        </div>
      </div>

      {/* Navigation Category Tabs & Filters */}
      <div className={`${panelClass} p-3 sm:p-4 rounded-2xl sm:rounded-3xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-500/10 border border-slate-400/20 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Follow-Ups ({totalCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('service')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'service'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-500/20'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-blue-300" />
              <span>🛠️ Free Service (3 Months)</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feedback'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-500/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>💬 Product Feedback</span>
            </button>

            <button
              onClick={() => setActiveTab('eyecheck')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'eyecheck'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-500/20'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
              <span>👁️ Next Eye Check (8 Months)</span>
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search Box */}
            <div className="relative min-w-[180px] sm:min-w-[220px] flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, bill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full rounded-xl pl-8 pr-3 py-1.5 font-medium ${inputClass}`}
              />
            </div>

            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-sky-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-xl px-2.5 py-1.5 font-bold ${inputClass}`}
              >
                <option value="all" className={isDarkMode ? 'bg-slate-900' : ''}>All Statuses</option>
                <option value="Pending" className={isDarkMode ? 'bg-slate-900' : ''}>Pending</option>
                <option value="Contacted" className={isDarkMode ? 'bg-slate-900' : ''}>Contacted</option>
                <option value="Completed" className={isDarkMode ? 'bg-slate-900' : ''}>Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Follow-Up Cards List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className={`${panelClass} p-8 rounded-3xl text-center space-y-2`}>
            <Clock className="w-10 h-10 mx-auto text-slate-400 opacity-60" />
            <h3 className="text-base font-bold">No Follow-Ups Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No customer records match your current filter or search criteria.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const rawPhone = item.customer?.phone || '';
            const status = item.currentStatus;

            return (
              <div
                key={item._id || item.billNo}
                className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all hover:border-sky-500/50 shadow-md`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Customer Information Block */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-sky-500">
                        {item.customer?.name || 'Unnamed Customer'}
                      </span>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400">
                        Bill #{item.billNo}
                      </span>

                      {/* Follow-Up Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item._id || item.billNo, status)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                          status === 'Completed'
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                            : status === 'Contacted'
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
                        }`}
                        title="Click to toggle status (Pending -> Contacted -> Completed)"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>{status}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs opacity-90 pt-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-bold">{rawPhone || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Purchase: <strong>{formatDate(item.deliveryDate || item.date)}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Staff: <strong>{item.customer?.orderTakenBy || 'Store Staff'}</strong></span>
                      </div>
                    </div>

                    {/* Prescription & Order Summary */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] opacity-75 font-mono pt-1">
                      {item.lens?.type && (
                        <span>Lens: <strong className="text-sky-400">{item.lens.type} ({item.lens.brand || 'Regular'})</strong></span>
                      )}
                      {item.frame?.brand && (
                        <span>Frame: <strong className="text-amber-400">{item.frame.brand}</strong></span>
                      )}
                      {item.prescription?.rightEye?.sph && (
                        <span>RE SPH: <strong>{item.prescription.rightEye.sph}</strong></span>
                      )}
                      {item.prescription?.leftEye?.sph && (
                        <span>LE SPH: <strong>{item.prescription.leftEye.sph}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Target Follow-Up Dates Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-slate-500/10 border border-slate-400/20 text-[11px] shrink-0">
                    <div className="p-1">
                      <div className="text-[10px] font-bold text-blue-400 uppercase">🛠️ 3M Free Service</div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.serviceDate)}</div>
                    </div>

                    <div className="p-1 border-x border-slate-400/20">
                      <div className="text-[10px] font-bold text-amber-400 uppercase">💬 Feedback</div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.feedbackDate)}</div>
                    </div>

                    <div className="p-1">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase">👁️ 8M Eye Check</div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.eyeCheckDate)}</div>
                    </div>
                  </div>

                  {/* Action Buttons: WhatsApp & Direct Call */}
                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 justify-end">
                    {/* 1) WhatsApp: Free Service */}
                    {(activeTab === 'all' || activeTab === 'service') && (
                      <a
                        href={getWhatsAppLink(item, 'service')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        title="Send 3-Month Free Service WhatsApp Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Service (3M)</span>
                      </a>
                    )}

                    {/* 2) WhatsApp: Feedback */}
                    {(activeTab === 'all' || activeTab === 'feedback') && (
                      <a
                        href={getWhatsAppLink(item, 'feedback')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        title="Send Product Feedback WhatsApp Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Feedback</span>
                      </a>
                    )}

                    {/* 3) WhatsApp: Eye Check */}
                    {(activeTab === 'all' || activeTab === 'eyecheck') && (
                      <a
                        href={getWhatsAppLink(item, 'eyecheck')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                        title="Send 8-Month Eye Checkup WhatsApp Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp Eye Check (8M)</span>
                      </a>
                    )}

                    {/* Direct Call Button */}
                    {rawPhone && (
                      <a
                        href={`tel:${rawPhone}`}
                        className="px-3 py-1 rounded-xl bg-slate-500/15 border border-slate-400/30 hover:bg-slate-500/25 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-500" />
                        <span>Call Customer</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
