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
  PhoneCall,
  Send,
  Check,
  CheckCheck,
  AlertTriangle,
  CalendarCheck2,
  CalendarDays
} from 'lucide-react';
import { formatBillNo } from '../utils/billNumber';

const STORE_PHONE = '+91 733 933 4042';

export default function FollowUpPage({ bills = [], isDarkMode, onUpdateBillStatus }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'service' | 'feedback' | 'eyecheck'
  const [dateScope, setDateScope] = useState('today'); // 'today' | 'overdue' | 'upcoming' | 'all'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Pending' | 'Sent' | 'Contacted' | 'Completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [localStatuses, setLocalStatuses] = useState({});

  // Helper date calculations
  const addDays = (dateStr, days) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d;
  };

  const toDateOnly = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  const isSameDay = (d1, d2) => {
    try {
      const t1 = toDateOnly(d1).getTime();
      const t2 = toDateOnly(d2).getTime();
      return t1 === t2;
    } catch {
      return false;
    }
  };

  const isPast = (d, today) => {
    try {
      return toDateOnly(d).getTime() < toDateOnly(today).getTime();
    } catch {
      return false;
    }
  };

  const isWithinNextDays = (d, today, days = 7) => {
    try {
      const diffTime = toDateOnly(d).getTime() - toDateOnly(today).getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays > 0 && diffDays <= days;
    } catch {
      return false;
    }
  };

  const formatDate = (d) => {
    try {
      const dateObj = new Date(d);
      return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return String(d);
    }
  };

  // Enrich bills with calculated follow-up dates, due classification, and status
  const followUpItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bills.map((bill) => {
      const baseDate = bill.deliveryDate || bill.date || new Date().toISOString();
      
      // 1) Free Service: 90 days after delivery (3 months)
      const serviceDate = addDays(baseDate, 90);
      
      // 2) Product Feedback: 7 days after delivery (1 week)
      const feedbackDate = addDays(baseDate, 7);
      
      // 3) Next Eye Check: 240 days after delivery (8 months)
      const eyeCheckDate = addDays(baseDate, 240);

      // Workflow Due Flags
      const serviceDueToday = isSameDay(serviceDate, today);
      const serviceOverdue = isPast(serviceDate, today);
      const serviceUpcoming = isWithinNextDays(serviceDate, today, 7);

      const feedbackDueToday = isSameDay(feedbackDate, today);
      const feedbackOverdue = isPast(feedbackDate, today);
      const feedbackUpcoming = isWithinNextDays(feedbackDate, today, 7);

      const eyeCheckDueToday = isSameDay(eyeCheckDate, today);
      const eyeCheckOverdue = isPast(eyeCheckDate, today);
      const eyeCheckUpcoming = isWithinNextDays(eyeCheckDate, today, 7);

      const hasAnyDueToday = serviceDueToday || feedbackDueToday || eyeCheckDueToday;
      const hasAnyOverdue = serviceOverdue || feedbackOverdue || eyeCheckOverdue;
      const hasAnyUpcoming = serviceUpcoming || feedbackUpcoming || eyeCheckUpcoming;

      const savedStatus = localStatuses[bill._id || bill.billNo] || bill.followUpStatus || 'Pending';

      return {
        ...bill,
        serviceDate,
        feedbackDate,
        eyeCheckDate,
        serviceDueToday,
        serviceOverdue,
        serviceUpcoming,
        feedbackDueToday,
        feedbackOverdue,
        feedbackUpcoming,
        eyeCheckDueToday,
        eyeCheckOverdue,
        eyeCheckUpcoming,
        hasAnyDueToday,
        hasAnyOverdue,
        hasAnyUpcoming,
        currentStatus: savedStatus
      };
    });
  }, [bills, localStatuses]);

  // Filter items based on selected category tab, date scope, status, and search query
  const filteredItems = useMemo(() => {
    return followUpItems.filter(item => {
      // 1. Search term matching
      const query = searchTerm.toLowerCase().trim();
      const nameMatch = (item.customer?.name || '').toLowerCase().includes(query);
      const phoneMatch = (item.customer?.phone || '').includes(query);
      const billMatch = (item.billNo || '').toString().includes(query) || formatBillNo(item.billNo).toLowerCase().includes(query);
      const matchesSearch = !query || nameMatch || phoneMatch || billMatch;

      // 2. Status filter matching
      const matchesStatus = statusFilter === 'all' || item.currentStatus === statusFilter;

      // 3. Tab & Date Scope matching
      let matchesTabAndDate = false;

      if (activeTab === 'all') {
        if (dateScope === 'today') {
          matchesTabAndDate = item.hasAnyDueToday;
        } else if (dateScope === 'overdue') {
          matchesTabAndDate = item.hasAnyOverdue && item.currentStatus !== 'Completed';
        } else if (dateScope === 'upcoming') {
          matchesTabAndDate = item.hasAnyUpcoming;
        } else {
          matchesTabAndDate = true; // 'all' dates
        }
      } else if (activeTab === 'service') {
        if (dateScope === 'today') {
          matchesTabAndDate = item.serviceDueToday;
        } else if (dateScope === 'overdue') {
          matchesTabAndDate = item.serviceOverdue && item.currentStatus !== 'Completed';
        } else if (dateScope === 'upcoming') {
          matchesTabAndDate = item.serviceUpcoming;
        } else {
          matchesTabAndDate = true;
        }
      } else if (activeTab === 'feedback') {
        if (dateScope === 'today') {
          matchesTabAndDate = item.feedbackDueToday;
        } else if (dateScope === 'overdue') {
          matchesTabAndDate = item.feedbackOverdue && item.currentStatus !== 'Completed';
        } else if (dateScope === 'upcoming') {
          matchesTabAndDate = item.feedbackUpcoming;
        } else {
          matchesTabAndDate = true;
        }
      } else if (activeTab === 'eyecheck') {
        if (dateScope === 'today') {
          matchesTabAndDate = item.eyeCheckDueToday;
        } else if (dateScope === 'overdue') {
          matchesTabAndDate = item.eyeCheckOverdue && item.currentStatus !== 'Completed';
        } else if (dateScope === 'upcoming') {
          matchesTabAndDate = item.eyeCheckUpcoming;
        } else {
          matchesTabAndDate = true;
        }
      }

      return matchesSearch && matchesStatus && matchesTabAndDate;
    });
  }, [followUpItems, activeTab, dateScope, statusFilter, searchTerm]);

  // Status toggle handler
  const handleToggleStatus = (id, currentStatus) => {
    const cycle = {
      'Pending': 'Sent',
      'Sent': 'Contacted',
      'Contacted': 'Completed',
      'Completed': 'Pending'
    };
    const nextStatus = cycle[currentStatus] || 'Pending';
    setLocalStatuses(prev => ({ ...prev, [id]: nextStatus }));
    if (onUpdateBillStatus) {
      onUpdateBillStatus(id, nextStatus);
    }
  };

  // Direct status update handler
  const handleSetStatus = (id, nextStatus, type = null) => {
    setLocalStatuses(prev => ({ ...prev, [id]: nextStatus }));
    if (onUpdateBillStatus) {
      onUpdateBillStatus(id, nextStatus, type);
    }
  };

  // Generate customized WhatsApp Link based on follow-up type
  const getWhatsAppLink = (item, type) => {
    const rawPhone = (item.customer?.phone || '').replace(/\D/g, '');
    const phoneWithCountry = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const customerName = item.customer?.name || 'Valued Customer';
    const billNo = formatBillNo(item.billNo);

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

  // Handle WhatsApp Send & Auto Mark as Sent
  const handleSendWhatsApp = (e, item, type) => {
    e.preventDefault();
    const link = getWhatsAppLink(item, type);
    window.open(link, '_blank', 'noopener,noreferrer');
    
    // Automatically mark status as 'Sent' and record follow-up type timestamp
    const targetId = item._id || item.billNo;
    handleSetStatus(targetId, 'Sent', type);
  };

  // Metrics counters
  const totalCount = followUpItems.length;
  const dueTodayCount = followUpItems.filter(i => i.hasAnyDueToday).length;
  const overdueCount = followUpItems.filter(i => i.hasAnyOverdue && i.currentStatus !== 'Completed').length;
  const sentCount = followUpItems.filter(i => i.currentStatus === 'Sent' || i.currentStatus === 'Contacted').length;
  const completedCount = followUpItems.filter(i => i.currentStatus === 'Completed').length;

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner & KPI Summary Cards */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0B2D5B]/15 dark:border-[#D4AF37]/20 pb-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-2">
              <Phone className="w-6 h-6 text-[#D4AF37]" /> Customer Follow-Up Manager
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Automated 3-Month Free Service, 1-Week Product Feedback, and 8-Month Vision Checkup Workflows
            </p>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Due Today */}
          <div 
            onClick={() => setDateScope('today')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              dateScope === 'today'
                ? 'ring-2 ring-[#D4AF37]/50 bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/40 border-[#0B2D5B] dark:border-[#D4AF37]'
                : isDarkMode ? 'bg-[#061833]/90 border-[#0B2D5B]/60 hover:border-[#D4AF37]/40' : 'bg-white/80 border-[#0B2D5B]/15 hover:border-[#0B2D5B]/30'
            }`}
          >
            <div className={`flex items-center justify-between font-bold mb-1 ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#0B2D5B]'}`}>
              <span>🎯 Due Today</span>
              <CalendarCheck2 className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#0B2D5B] dark:text-[#D4AF37]">{dueTodayCount}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Scheduled for today</div>
          </div>

          {/* Card 2: Overdue Pending */}
          <div 
            onClick={() => setDateScope('overdue')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              dateScope === 'overdue'
                ? 'ring-2 ring-amber-500 bg-amber-50/90 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500 text-amber-900'
                : isDarkMode ? 'bg-amber-950/30 border-amber-800/40 text-amber-300 hover:border-amber-700' : 'bg-amber-50/80 border-amber-200 text-amber-900 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1">
              <span>⚠️ Overdue Pending</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono">{overdueCount}</div>
            <div className="text-[10px] opacity-80 font-semibold mt-0.5">Past due date action required</div>
          </div>

          {/* Card 3: Sent / Contacted */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1">
              <span>🚀 Sent & Contacted</span>
              <Send className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono">{sentCount}</div>
            <div className="text-[10px] opacity-80 font-semibold mt-0.5">WhatsApp / Call dispatched</div>
          </div>

          {/* Card 4: Total Follow-Up Queue */}
          <div 
            onClick={() => setDateScope('all')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              dateScope === 'all'
                ? 'ring-2 ring-slate-500 bg-slate-100 dark:bg-slate-800 border-slate-400'
                : isDarkMode ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between font-bold mb-1 text-slate-700 dark:text-slate-300">
              <span>📋 All Customers</span>
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-slate-100">{totalCount}</div>
            <div className="text-[10px] opacity-70 font-semibold mt-0.5">Complete customer queue</div>
          </div>
        </div>
      </div>

      {/* Navigation Category Tabs & Filters */}
      <div className={`${panelClass} p-3 sm:p-4 rounded-2xl sm:rounded-3xl space-y-3`}>
        {/* Row 1: Category Workflow Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#0B2D5B]/5 dark:bg-[#061833]/60 border border-[#0B2D5B]/20 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-[#0B2D5B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2D5B] dark:hover:text-[#D4AF37] hover:bg-[#0B2D5B]/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>All Workflows</span>
            </button>

            <button
              onClick={() => setActiveTab('service')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'service'
                  ? 'bg-[#0B2D5B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2D5B] dark:hover:text-[#D4AF37] hover:bg-[#0B2D5B]/10'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>🛠️ Free Service (3M)</span>
            </button>

            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'feedback'
                  ? 'bg-[#0B2D5B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2D5B] dark:hover:text-[#D4AF37] hover:bg-[#0B2D5B]/10'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>💬 Product Feedback (1W)</span>
            </button>

            <button
              onClick={() => setActiveTab('eyecheck')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'eyecheck'
                  ? 'bg-[#0B2D5B] text-[#D4AF37] border border-[#D4AF37]/40 shadow-md font-black'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0B2D5B] dark:hover:text-[#D4AF37] hover:bg-[#0B2D5B]/10'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>👁️ Eye Check (8M)</span>
            </button>
          </div>

          {/* Date Scope Filter Buttons: Today (Default) | Overdue | Upcoming | All */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#0B2D5B]/5 dark:bg-[#061833]/60 border border-[#0B2D5B]/20 text-xs font-bold">
            <button
              onClick={() => setDateScope('today')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                dateScope === 'today'
                  ? 'bg-[#0B2D5B] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md font-black'
                  : 'text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/10'
              }`}
              title="Show only customer follow-ups due today"
            >
              <CalendarCheck2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>🎯 Due Today ({dueTodayCount})</span>
            </button>

            <button
              onClick={() => setDateScope('overdue')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                dateScope === 'overdue'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-amber-800 dark:text-amber-400 hover:bg-amber-500/20'
              }`}
              title="Show customer follow-ups past their due date"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>⚠️ Overdue ({overdueCount})</span>
            </button>

            <button
              onClick={() => setDateScope('upcoming')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                dateScope === 'upcoming'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-500/20'
              }`}
              title="Show customer follow-ups due in the next 7 days"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Next 7 Days</span>
            </button>

            <button
              onClick={() => setDateScope('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                dateScope === 'all'
                  ? 'bg-slate-800 text-white shadow-md dark:bg-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-500/20'
              }`}
              title="Show all customers in queue"
            >
              <span>All Queue ({totalCount})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search & Status Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-slate-400/10">
          <div className="relative min-w-[200px] sm:min-w-[280px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, phone, bill #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-xl pl-8 pr-3 py-1.5 font-medium ${inputClass}`}
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`rounded-xl px-2.5 py-1.5 font-bold ${inputClass}`}
              >
                <option value="all" className={isDarkMode ? 'bg-slate-900' : ''}>All Statuses</option>
                <option value="Pending" className={isDarkMode ? 'bg-slate-900' : ''}>⏳ Pending</option>
                <option value="Sent" className={isDarkMode ? 'bg-slate-900' : ''}>🚀 Sent (WhatsApp)</option>
                <option value="Contacted" className={isDarkMode ? 'bg-slate-900' : ''}>📞 Contacted</option>
                <option value="Completed" className={isDarkMode ? 'bg-slate-900' : ''}>✅ Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Follow-Up Cards List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className={`${panelClass} p-8 rounded-3xl text-center space-y-2`}>
            <CalendarCheck2 className="w-10 h-10 mx-auto text-[#D4AF37] opacity-60" />
            <h3 className="text-base font-bold">
              {dateScope === 'today' ? 'No Follow-Ups Due Today' : 'No Follow-Ups Found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {dateScope === 'today' 
                ? 'Great job! There are no customer reminders scheduled for today under this tab.' 
                : 'No customer records match your current filter or search criteria.'}
            </p>
            {dateScope === 'today' && (
              <button
                type="button"
                onClick={() => setDateScope('all')}
                className="mt-2 px-3 py-1.5 rounded-xl bg-[#0B2D5B] hover:bg-[#143E77] text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                View All Customer Follow-Ups ({totalCount})
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => {
            const rawPhone = item.customer?.phone || '';
            const status = item.currentStatus;
            const itemId = item._id || item.billNo;
            const isSentOrContacted = status === 'Sent' || status === 'Contacted';

            // Determine which workflow is active / due for this card
            const showServiceAction = activeTab === 'service' || (activeTab === 'all' && (item.serviceDueToday || item.serviceOverdue || dateScope === 'all'));
            const showFeedbackAction = activeTab === 'feedback' || (activeTab === 'all' && (item.feedbackDueToday || item.feedbackOverdue || dateScope === 'all'));
            const showEyeCheckAction = activeTab === 'eyecheck' || (activeTab === 'all' && (item.eyeCheckDueToday || item.eyeCheckOverdue || dateScope === 'all'));

            return (
              <div
                key={itemId}
                className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all hover:border-[#D4AF37]/50 shadow-md ${
                  isSentOrContacted ? 'border-emerald-500/30' : item.hasAnyDueToday ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Customer Information Block */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-sm sm:text-base text-[#0B2D5B] dark:text-[#D4AF37]">
                        {item.customer?.name || 'Unnamed Customer'}
                      </span>

                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/30 border border-[#0B2D5B]/20 text-[#0B2D5B] dark:text-[#D4AF37]">
                        Bill #{formatBillNo(item.billNo)}
                      </span>

                      {/* Due Today Badge */}
                      {item.hasAnyDueToday && (
                        <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#0B2D5B] dark:text-[#D4AF37] font-extrabold text-[10px] flex items-center gap-1 animate-pulse">
                          <CalendarCheck2 className="w-2.5 h-2.5 text-[#D4AF37]" /> DUE TODAY
                        </span>
                      )}

                      {/* Follow-Up Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(itemId, status)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                          status === 'Completed'
                            ? 'bg-[#0B2D5B]/15 dark:bg-[#0B2D5B]/30 border-[#0B2D5B]/30 text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/25'
                            : status === 'Sent'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/30'
                            : status === 'Contacted'
                            ? 'bg-[#0B2D5B]/15 dark:bg-[#0B2D5B]/30 border-[#0B2D5B]/30 text-[#0B2D5B] dark:text-[#D4AF37] hover:bg-[#0B2D5B]/25'
                            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to cycle status: Pending ➔ Sent ➔ Contacted ➔ Completed"
                      >
                        {status === 'Completed' ? (
                          <CheckCheck className="w-2.5 h-2.5 text-[#D4AF37]" />
                        ) : status === 'Sent' ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <RefreshCw className="w-2.5 h-2.5" />
                        )}
                        <span>{status === 'Sent' ? 'SENT' : status}</span>
                      </button>

                      {/* Sent Time Stamp if available */}
                      {item.followUpDetails?.lastContactedAt && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {new Date(item.followUpDetails.lastContactedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs opacity-90 pt-1">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{rawPhone || 'N/A'}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>Purchase: <strong>{formatDate(item.deliveryDate || item.date)}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>Staff: <strong>{item.customer?.orderTakenBy || 'Store Staff'}</strong></span>
                      </div>
                    </div>

                    {/* Prescription & Order Summary */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] opacity-75 font-mono pt-1">
                      {item.lens?.type && (
                        <span>Lens: <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">{item.lens.type} ({item.lens.brand || 'Regular'})</strong></span>
                      )}
                      {item.frame?.brand && (
                        <span>Frame: <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">{item.frame.brand}</strong></span>
                      )}
                      {item.prescription?.rightEye?.sph && (
                        <span>RE SPH: <strong>{item.prescription.rightEye.sph}</strong></span>
                      )}
                      {item.prescription?.leftEye?.sph && (
                        <span>LE SPH: <strong>{item.prescription.leftEye.sph}</strong></span>
                      )}
                    </div>
                  </div>

                  {/* Target Follow-Up Dates Grid with Due Indicators */}
                  <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-slate-500/10 border border-slate-400/20 text-[11px] shrink-0">
                    {/* 3M Free Service Date */}
                    <div className={`p-1.5 rounded-lg ${
                      item.serviceDueToday 
                        ? 'bg-[#0B2D5B]/15 border border-[#D4AF37]/40 text-[#0B2D5B] dark:text-[#D4AF37] font-bold' 
                        : item.serviceOverdue ? 'opacity-80' : ''
                    }`}>
                      <div className="text-[10px] font-bold text-[#0B2D5B] dark:text-[#D4AF37] uppercase flex items-center justify-center gap-0.5">
                        <span>🛠️ 3M Service</span>
                      </div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.serviceDate)}</div>
                      {item.serviceDueToday && <span className="text-[9px] text-[#0B2D5B] dark:text-[#D4AF37] font-black">● DUE TODAY</span>}
                    </div>

                    {/* 1W Product Feedback Date */}
                    <div className={`p-1.5 rounded-lg border-x border-slate-400/20 ${
                      item.feedbackDueToday 
                        ? 'bg-[#0B2D5B]/15 border border-[#D4AF37]/40 text-[#0B2D5B] dark:text-[#D4AF37] font-bold' 
                        : item.feedbackOverdue ? 'opacity-80' : ''
                    }`}>
                      <div className="text-[10px] font-bold text-[#0B2D5B] dark:text-[#D4AF37] uppercase flex items-center justify-center gap-0.5">
                        <span>💬 1W Feedback</span>
                      </div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.feedbackDate)}</div>
                      {item.feedbackDueToday && <span className="text-[9px] text-[#0B2D5B] dark:text-[#D4AF37] font-black">● DUE TODAY</span>}
                    </div>

                    {/* 8M Eye Checkup Date */}
                    <div className={`p-1.5 rounded-lg ${
                      item.eyeCheckDueToday 
                        ? 'bg-[#0B2D5B]/15 border border-[#D4AF37]/40 text-[#0B2D5B] dark:text-[#D4AF37] font-bold' 
                        : item.eyeCheckOverdue ? 'opacity-80' : ''
                    }`}>
                      <div className="text-[10px] font-bold text-[#0B2D5B] dark:text-[#D4AF37] uppercase flex items-center justify-center gap-0.5">
                        <span>👁️ 8M Check</span>
                      </div>
                      <div className="font-mono font-bold mt-0.5">{formatDate(item.eyeCheckDate)}</div>
                      {item.eyeCheckDueToday && <span className="text-[9px] text-[#0B2D5B] dark:text-[#D4AF37] font-black">● DUE TODAY</span>}
                    </div>
                  </div>

                  {/* Action Buttons: WhatsApp Send & Mark Sent Action Bar */}
                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 justify-end">
                    {/* 1) WhatsApp: Free Service */}
                    {showServiceAction && (
                      <button
                        type="button"
                        onClick={(e) => handleSendWhatsApp(e, item, 'service')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          status === 'Sent' || status === 'Completed'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                            : 'bg-[#0B2D5B] hover:bg-[#143E77] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                        }`}
                        title="Send 3-Month Free Service WhatsApp Message & Mark as Sent"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>{status === 'Sent' || status === 'Completed' ? 'WhatsApp Sent ✓ (3M)' : 'WhatsApp Service (3M)'}</span>
                      </button>
                    )}

                    {/* 2) WhatsApp: Feedback */}
                    {showFeedbackAction && (
                      <button
                        type="button"
                        onClick={(e) => handleSendWhatsApp(e, item, 'feedback')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          status === 'Sent' || status === 'Completed'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                            : 'bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:brightness-110 text-[#061833] font-black shadow-sm'
                        }`}
                        title="Send Product Feedback WhatsApp Message & Mark as Sent"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>{status === 'Sent' || status === 'Completed' ? 'WhatsApp Sent ✓ (Feedback)' : 'WhatsApp Feedback (1W)'}</span>
                      </button>
                    )}

                    {/* 3) WhatsApp: Eye Check */}
                    {showEyeCheckAction && (
                      <button
                        type="button"
                        onClick={(e) => handleSendWhatsApp(e, item, 'eyecheck')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          status === 'Sent' || status === 'Completed'
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                            : 'bg-[#0B2D5B] hover:bg-[#143E77] text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                        }`}
                        title="Send 8-Month Eye Checkup WhatsApp Message & Mark as Sent"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>{status === 'Sent' || status === 'Completed' ? 'WhatsApp Sent ✓ (8M)' : 'WhatsApp Eye Check (8M)'}</span>
                      </button>
                    )}

                    {/* Secondary Actions: Quick Mark Sent / Call Customer */}
                    <div className="flex items-center gap-1.5">
                      {/* Explicit Mark as Sent / Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleSetStatus(itemId, status === 'Sent' ? 'Pending' : 'Sent')}
                        className={`flex-1 px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          status === 'Sent'
                            ? 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        title={status === 'Sent' ? 'Click to revert to Pending' : 'Manually mark as Sent'}
                      >
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{status === 'Sent' ? 'Marked Sent' : 'Mark Sent'}</span>
                      </button>

                      {/* Direct Call Button */}
                      {rawPhone && (
                        <a
                          href={`tel:${rawPhone}`}
                          onClick={() => {
                            if (status === 'Pending') handleSetStatus(itemId, 'Contacted');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/30 border border-[#0B2D5B]/30 hover:bg-[#0B2D5B]/20 text-[#0B2D5B] dark:text-[#D4AF37] font-bold text-xs flex items-center justify-center gap-1 transition-all"
                          title="Call customer directly and mark as Contacted"
                        >
                          <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                          <span>Call</span>
                        </a>
                      )}
                    </div>
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


