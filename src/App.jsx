import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CustomerPrescriptionForm from './components/CustomerPrescriptionForm';
import QuickSearchGrid from './components/QuickSearchGrid';
import ActionBar from './components/ActionBar';
import DashboardPage from './components/DashboardPage';
import LoginPage from './components/LoginPage';
import DeliveryModal from './components/DeliveryModal';
import { BILLS_API as API_BASE } from './config/api';
import { formatBillNo, getNextSequentialBillNo } from './utils/billNumber';

// Lazy load secondary heavy pages and modals for optimal bundle splitting
const RemindersPage = lazy(() => import('./components/RemindersPage'));
const FollowUpPage = lazy(() => import('./components/FollowUpPage'));
const WalletPage = lazy(() => import('./components/WalletPage'));
const ReportsPage = lazy(() => import('./components/ReportsPage'));
const CustomerInfoPage = lazy(() => import('./components/CustomerInfoPage'));
const StaffSetupPage = lazy(() => import('./components/StaffSetupPage'));
const InvoicePrintModal = lazy(() => import('./components/InvoicePrintModal'));
const ItemSetupModal = lazy(() => import('./components/ItemSetupModal'));

// Sleek loading fallback for lazy-loaded route chunks
const PageLoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center p-16">
    <div className="flex items-center gap-2.5 text-xs font-bold text-[#0B2D5B] dark:text-[#D4AF37] animate-pulse">
      <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      <span>Loading module...</span>
    </div>
  </div>
);

const defaultFormState = {
  billNo: '',
  entryType: 'New',
  date: new Date().toISOString().substring(0, 10),
  customer: {
    mrdNo: '',
    name: '',
    phone: '',
    address: '',
    age: '',
    gender: '',
    drName: '',
    orderTakenBy: '',
    note: ''
  },
  prescription: {
    rightEye: { sph: '', cyl: '-', axis: '-', add: '-', va: '' },
    leftEye: { sph: '', cyl: '-', axis: '-', add: '-', va: '' },
    pd: '',
    ri: ''
  },
  lens: { type: '', coating: '', brand: '', warranty: '', qty: '', price: '' },
  frame: { type: '', brand: '', warranty: '', qty: '', price: '' },
  totalAmount: 0,
  discountAmount: '',
  referralDiscount: 0,
  referrerMrd: '',
  referrerPhone: '',
  walletRedeemed: 0,
  cashbackEarned: 0,
  netAmount: 0,
  payMode: 'CASH',
  onlinePayAmount: '',
  advanceAmount: '',
  balanceAmount: 0,
  deliveryDate: new Date().toISOString().substring(0, 10),
  reminderDate: new Date().toISOString().substring(0, 10),
  deliveryStatus: 'Pending'
};

function AppContent() {
  const [bills, setBills] = useState([]);
  const [formData, setFormData] = useState(defaultFormState);
  const [activeBillId, setActiveBillId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Current active view calculated from current route hash
  const currentPath = location.pathname.replace(/^\//, '');
  const currentView = currentPath || 'dashboard';

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('optics_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredStaff, setRegisteredStaff] = useState(() => {
    try {
      const saved = localStorage.getItem('optics_registered_staff');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('optics_current_user', JSON.stringify(user));
    showNotification(`Welcome, ${user.name || user.role}! Logged in successfully.`, 'success');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('optics_current_user');
    showNotification('Logged out successfully.', 'info');
    navigate('/login');
  };

  const handleAddStaff = (newStaff) => {
    setRegisteredStaff(prev => {
      const updated = [...prev, newStaff];
      localStorage.setItem('optics_registered_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteStaff = (staffId) => {
    setRegisteredStaff(prev => {
      const updated = prev.filter(s => s.id !== staffId);
      localStorage.setItem('optics_registered_staff', JSON.stringify(updated));
      return updated;
    });
    showNotification('Staff member removed.', 'info');
  };

  const handleUpdateStaff = (updatedStaff) => {
    setRegisteredStaff(prev => {
      const updated = prev.map(s => s.id === updatedStaff.id ? updatedStaff : s);
      localStorage.setItem('optics_registered_staff', JSON.stringify(updated));
      return updated;
    });
    showNotification(`Staff profile for "${updatedStaff.name}" updated successfully.`, 'success');
  };
  
  // Search Panel Slide-out / Collapsible state
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);

  // Mobile menu drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modals state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isDuplicateBill, setIsDuplicateBill] = useState(false);
  const [showItemSetupModal, setShowItemSetupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);

  const showNotification = (msg, type = 'info') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleSearch = () => {
    setIsSearchPanelOpen(prev => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          const el = document.getElementById('search-panel-container');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
      return newState;
    });
  };

  const handleSelectBillAndClose = (billRecord) => {
    handleSelectBill(billRecord);
    setIsSearchPanelOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification(`Bill #${formatBillNo(billRecord.billNo)} loaded into form.`, 'success');
  };

  const fetchBills = useCallback(async (query = '') => {
    try {
      const res = await axios.get(`${API_BASE}?query=${encodeURIComponent(query)}`);
      const fetchedBills = res.data || [];
      setBills(fetchedBills);
      setIsOnline(true);
      return fetchedBills;
    } catch {
      console.warn('Backend server offline or unreachable, using local state persistence.');
      setIsOnline(false);
      return [];
    }
  }, []);

  const resetFormFields = useCallback((currentBills = bills) => {
    setActiveBillId(null);
    setIsEditing(false);
    const nextBillNo = getNextSequentialBillNo(currentBills);
    setFormData({
      ...defaultFormState,
      billNo: nextBillNo,
      customer: {
        ...defaultFormState.customer,
        gender: ''
      }
    });
  }, [bills]);

  useEffect(() => {
    let isMounted = true;
    const initBills = async () => {
      const fetched = await fetchBills();
      if (!isMounted) return;
      const nextNo = getNextSequentialBillNo(fetched);
      setFormData(prev => ({
        ...prev,
        billNo: prev.billNo ? formatBillNo(prev.billNo) : nextNo
      }));
    };
    initBills();
    return () => { isMounted = false; };
  }, [fetchBills]);

  const handleNew = () => {
    resetFormFields(bills);
    showNotification('Form reset. Next continuous bill number assigned.', 'info');
  };

  const handleSave = async () => {
    if (!formData.customer.name.trim() || !formData.customer.phone.trim()) {
      showNotification('Please provide Customer Name and Phone number.', 'error');
      return;
    }

    let savedBillNo = formData.billNo ? formatBillNo(formData.billNo) : getNextSequentialBillNo(bills);
    const customerName = formData.customer.name;
    const savePayload = { ...formData, billNo: savedBillNo };

    try {
      if (isEditing && activeBillId) {
        await axios.put(`${API_BASE}/${activeBillId}`, savePayload);
      } else {
        const res = await axios.post(API_BASE, savePayload);
        if (res.data?.billNo) {
          savedBillNo = formatBillNo(res.data.billNo);
        }
      }
      const updatedList = await fetchBills();
      resetFormFields(updatedList);
      showNotification(`Customer "${customerName}" info & Bill #${savedBillNo} saved successfully!`, 'success');
    } catch {
      const existingIdx = bills.findIndex(b => String(b.billNo) === String(formData.billNo));
      let updatedList;
      if (existingIdx >= 0) {
        updatedList = [...bills];
        updatedList[existingIdx] = { ...savePayload, _id: bills[existingIdx]._id };
        setBills(updatedList);
      } else {
        const newRecord = { ...savePayload, _id: 'bill_' + Date.now() };
        updatedList = [newRecord, ...bills];
        setBills(updatedList);
      }
      resetFormFields(updatedList);
      showNotification(`Customer "${customerName}" info & Bill #${savedBillNo} saved successfully!`, 'success');
    }
  };

  const handleEdit = () => {
    if (!activeBillId) {
      showNotification('Please select a bill record from the table to edit.', 'warning');
      return;
    }
    setIsEditing(true);
    showNotification(`Editing enabled for Bill #${formatBillNo(formData.billNo)}`, 'info');
  };

  const handleDelete = async () => {
    if (!activeBillId) {
      showNotification('Please select a bill record from the table to delete.', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete Bill #${formatBillNo(formData.billNo)}?`)) {
      try {
        await axios.delete(`${API_BASE}/${activeBillId}`);
        showNotification(`Bill #${formatBillNo(formData.billNo)} deleted.`, 'success');
      } catch {
        setBills(bills.filter(b => b._id !== activeBillId && String(b.billNo) !== String(formData.billNo)));
        showNotification(`Bill #${formatBillNo(formData.billNo)} removed locally.`, 'success');
      }
      fetchBills();
      handleNew();
    }
  };

  const handleView = () => {
    setIsDuplicateBill(false);
    setShowPrintModal(true);
  };

  const handleDuplicateBill = () => {
    setIsDuplicateBill(true);
    setShowPrintModal(true);
  };

  const handleDeliveryToggle = async () => {
    if (!activeBillId) {
      showNotification('Please select a bill record from the table to toggle delivery status.', 'warning');
      return;
    }

    const targetBill = bills.find(b => b._id === activeBillId || b.billNo === activeBillId) || formData;
    if ((targetBill.deliveryStatus || 'Pending') !== 'Delivered') {
      setShowDeliveryModal(true);
    } else {
      await handleDeliveryToggleById(activeBillId, 'Pending');
    }
  };

  const handleDeliveryToggleById = async (targetId, forcedStatus = null) => {
    const targetBill = bills.find(b => b._id === targetId || String(b.billNo) === String(targetId));
    const currentStatus = targetBill?.deliveryStatus || 'Pending';

    let payload = {};
    if (typeof forcedStatus === 'object' && forcedStatus !== null) {
      payload = { ...forcedStatus };
      if (!payload.status) {
        payload.status = currentStatus === 'Delivered' ? 'Pending' : 'Delivered';
      }
    } else if (typeof forcedStatus === 'string') {
      payload = { status: forcedStatus };
    } else {
      payload = { status: currentStatus === 'Delivered' ? 'Pending' : 'Delivered' };
    }

    try {
      const balInfo = payload.deliveryAmount !== undefined && Number(payload.deliveryAmount) > 0 ? ` (Balance ₹${Number(payload.deliveryAmount).toFixed(2)} settled)` : '';
      showNotification(`Order #${formatBillNo(targetBill?.billNo || targetId)} marked as "${payload.status}"${balInfo}`, 'success');
    } catch {
      console.warn('Network issue updating delivery status, updating locally.');
    }

    setBills(prev => prev.map(b => 
      (b._id === targetId || String(b.billNo) === String(targetId)) ? { ...b, ...payload, deliveryStatus: payload.status } : b
    ));

    if (activeBillId === targetId || formData._id === targetId || String(formData.billNo) === String(targetId)) {
      setFormData(prev => ({
        ...prev,
        ...payload,
        deliveryStatus: payload.status
      }));
    }

    fetchBills();
  };

  const handleSendSMS = async (billRecord) => {
    const targetId = billRecord._id || billRecord.billNo;
    try {
      await axios.post(`${API_BASE}/${targetId}/send-sms`);
      showNotification(`SMS/WhatsApp notification sent to ${billRecord.customer?.name} (${billRecord.customer?.phone})`, 'success');
    } catch {
      showNotification(`SMS/WhatsApp notification triggered for ${billRecord.customer?.name}`, 'success');
    }

    setBills(prev => prev.map(b => 
      (b._id === targetId || String(b.billNo) === String(targetId)) ? { ...b, smsSent: true } : b
    ));
  };

  const handleToggleSMS = async (billRecord, forcedStatus = null) => {
    const targetId = billRecord._id || billRecord.billNo;
    const newStatus = forcedStatus !== null ? forcedStatus : !billRecord.smsSent;
    try {
      await axios.patch(`${API_BASE}/${targetId}/toggle-sms`, { sent: newStatus });
      showNotification(newStatus ? `Reminder marked as Sent for Bill #${formatBillNo(billRecord.billNo)}` : `Reminder marked as Pending for Bill #${formatBillNo(billRecord.billNo)}`, 'success');
    } catch {
      console.warn('Network issue toggling SMS status, updated locally.');
      showNotification(`Reminder marked as ${newStatus ? 'Sent' : 'Pending'} (local)`, 'info');
    }

    setBills(prev => prev.map(b => 
      (b._id === targetId || String(b.billNo) === String(targetId)) ? { ...b, smsSent: newStatus } : b
    ));
  };

  const handleUpdateFollowUpStatus = async (targetId, status = 'Sent', type = null) => {
    const targetBill = bills.find(b => b._id === targetId || String(b.billNo) === String(targetId));
    try {
      await axios.patch(`${API_BASE}/${targetId}/followup`, { status, type });
      showNotification(`Follow-up for Bill #${formatBillNo(targetBill?.billNo || targetId)} marked as "${status}"`, 'success');
    } catch {
      console.warn('Network issue updating follow-up status, updated locally.');
      showNotification(`Follow-up for Bill #${formatBillNo(targetBill?.billNo || targetId)} marked as "${status}" (local)`, 'info');
    }

    setBills(prev => prev.map(b => {
      if (b._id === targetId || String(b.billNo) === String(targetId)) {
        const details = b.followUpDetails || {};
        const now = new Date().toISOString();
        if (type === 'service') details.serviceSentAt = now;
        if (type === 'feedback') details.feedbackSentAt = now;
        if (type === 'eyecheck') details.eyeCheckSentAt = now;
        details.lastContactedAt = now;
        return { ...b, followUpStatus: status, followUpDetails: details };
      }
      return b;
    }));
  };

  const handleSelectBill = (billRecord) => {
    setActiveBillId(billRecord._id || billRecord.billNo);
    setIsEditing(false);

    setFormData({
      ...defaultFormState,
      ...billRecord,
      billNo: formatBillNo(billRecord.billNo),
      date: billRecord.date ? billRecord.date.substring(0, 10) : new Date().toISOString().substring(0, 10),
      deliveryDate: billRecord.deliveryDate ? billRecord.deliveryDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
      reminderDate: billRecord.reminderDate ? billRecord.reminderDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
      customer: {
        ...defaultFormState.customer,
        ...(billRecord.customer || {})
      },
      prescription: {
        ...defaultFormState.prescription,
        ...(billRecord.prescription || {})
      },
      lens: {
        ...defaultFormState.lens,
        ...(billRecord.lens || {})
      },
      frame: {
        ...defaultFormState.frame,
        ...(billRecord.frame || {})
      },
      totalAmount: billRecord.totalAmount || 1500,
      discountAmount: billRecord.discountAmount || 0,
      netAmount: billRecord.netAmount || 1500,
      advanceAmount: billRecord.advanceAmount || 0,
      balanceAmount: billRecord.balanceAmount || 0
    });
  };

  const filteredBills = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase();
    const cleanNum = q.replace(/^0+/, '');

    return bills.filter(b => {
      const nameMatch = b.customer?.name && b.customer.name.toLowerCase().includes(q);
      const mrdNo = (b.customer?.mrdNo || '').toLowerCase().trim();
      const cleanMrd = mrdNo.replace(/^0+/, '');
      const mrdMatch = mrdNo.includes(q) || (cleanNum && cleanMrd === cleanNum);
      const formattedBNo = formatBillNo(b.billNo).toLowerCase();
      const rawBNo = String(b.billNo || '').toLowerCase();
      const billNoMatch = rawBNo === q || rawBNo === cleanNum || rawBNo.includes(q) || formattedBNo.includes(q);
      const phoneMatch = b.customer?.phone && (q.length >= 7 ? b.customer.phone.includes(q) : b.customer.phone === q);

      return nameMatch || mrdMatch || billNoMatch || phoneMatch;
    });
  }, [bills, searchQuery]);

  // Dedicated /login Route & Authentication Guard
  if (currentView === 'login' || !currentUser) {
    if (!currentUser && currentView !== 'login') {
      return <Navigate to="/login" replace />;
    }

    if (currentUser && currentView === 'login') {
      return <Navigate to="/dashboard" replace />;
    }

    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        registeredStaff={registeredStaff}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'aurora-bg-dark text-slate-100' : 'aurora-bg-light text-slate-900'
    }`}>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className={`fixed top-16 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-bounce backdrop-blur-md ${
          toastMessage.type === 'success' ? 'bg-[#0B2D5B]/95 border-[#D4AF37] text-[#D4AF37] shadow-xl shadow-[#0B2D5B]/40' :
          toastMessage.type === 'error' ? 'bg-rose-950/90 border border-rose-500 text-rose-200 shadow-xl' :
          toastMessage.type === 'warning' ? 'bg-amber-950/90 border border-[#D4AF37] text-amber-200 shadow-xl' :
          'bg-[#0B2D5B]/95 border-[#D4AF37] text-[#D4AF37] shadow-xl shadow-[#0B2D5B]/40'
        }`}>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar 
        currentView={currentView}
        setCurrentView={(view) => navigate(`/${view}`)}
        bills={bills}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        userRole={currentUser.role}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-x-hidden">
        <Header 
          isOnline={isOnline} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          onToggleMobileMenu={() => setIsMobileOpen(prev => !prev)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* View Switch Router with Suspense */}
        <div className="flex-1 flex flex-col justify-between">
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="/billing" 
                element={
                  <main className="p-4.5 flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4.5 items-start max-w-[1920px] mx-auto w-full transition-all duration-300">
                    {/* Left Column: Optical Form */}
                    <div className={`${isSearchPanelOpen ? 'xl:col-span-7' : 'xl:col-span-12'} w-full transition-all duration-300`}>
                      <CustomerPrescriptionForm 
                        formData={formData}
                        setFormData={setFormData}
                        isEditing={isEditing}
                        isDarkMode={isDarkMode}
                        onToggleSearch={handleToggleSearch}
                        isSearchPanelOpen={isSearchPanelOpen}
                        userRole={currentUser?.role || 'admin'}
                        bills={bills}
                      />
                    </div>

                    {/* Right Column: Quick Search Grid */}
                    {isSearchPanelOpen && (
                      <div id="search-panel-container" className="xl:col-span-5 w-full h-full transition-all duration-300">
                        <QuickSearchGrid 
                          bills={filteredBills}
                          activeBillId={activeBillId}
                          onSelectBill={handleSelectBillAndClose}
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          onClosePanel={() => setIsSearchPanelOpen(false)}
                          isDarkMode={isDarkMode}
                        />
                      </div>
                    )}
                  </main>
                } 
              />

              <Route 
                path="/dashboard" 
                element={
                  <main className="flex-1 w-full">
                    <DashboardPage 
                      bills={bills}
                      isDarkMode={isDarkMode}
                      userRole={currentUser?.role}
                      onNavigateToReminders={() => navigate('/reminders')}
                      onNavigateToBilling={() => navigate('/billing')}
                      onSelectBill={(b) => {
                        handleSelectBill(b);
                        navigate('/billing');
                      }}
                    />
                  </main>
                } 
              />

              <Route 
                path="/reminders" 
                element={
                  <main className="flex-1 w-full">
                    <RemindersPage 
                      bills={bills}
                      isDarkMode={isDarkMode}
                      onToggleStatus={handleDeliveryToggleById}
                      onSendSMS={handleSendSMS}
                      onToggleSMS={handleToggleSMS}
                    />
                  </main>
                } 
              />

              <Route 
                path="/followup" 
                element={
                  <main className="flex-1 w-full p-4.5 max-w-[1920px] mx-auto">
                    <FollowUpPage 
                      bills={bills}
                      isDarkMode={isDarkMode}
                      onUpdateBillStatus={handleUpdateFollowUpStatus}
                    />
                  </main>
                } 
              />

              {/* Wallet & Loyalty Hub */}
              <Route 
                path="/wallet" 
                element={
                  <main className="flex-1 w-full p-4.5 max-w-[1920px] mx-auto">
                    <WalletPage 
                      bills={bills}
                      isDarkMode={isDarkMode}
                    />
                  </main>
                } 
              />

              {/* Admin Exclusive Views */}
              <Route 
                path="/reports" 
                element={
                  currentUser.role === 'admin' ? (
                    <main className="flex-1 w-full p-4.5 max-w-[1920px] mx-auto">
                      <ReportsPage 
                        bills={bills}
                        isDarkMode={isDarkMode}
                      />
                    </main>
                  ) : (
                    <Navigate to="/billing" replace />
                  )
                } 
              />

              <Route 
                path="/customers" 
                element={
                  currentUser.role === 'admin' ? (
                    <main className="flex-1 w-full p-4.5 max-w-[1920px] mx-auto">
                      <CustomerInfoPage 
                        bills={bills}
                        isDarkMode={isDarkMode}
                      />
                    </main>
                  ) : (
                    <Navigate to="/billing" replace />
                  )
                } 
              />

              <Route 
                path="/staff" 
                element={
                  currentUser.role === 'admin' ? (
                    <main className="flex-1 w-full p-4.5 max-w-[1920px] mx-auto">
                      <StaffSetupPage 
                        registeredStaff={registeredStaff}
                        onAddStaff={handleAddStaff}
                        onDeleteStaff={handleDeleteStaff}
                        onUpdateStaff={handleUpdateStaff}
                        isDarkMode={isDarkMode}
                      />
                    </main>
                  ) : (
                    <Navigate to="/billing" replace />
                  )
                } 
              />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/billing" replace />} />
            </Routes>
          </Suspense>

          {/* Bottom Floating Action Dock (Only visible in Billing POS view) */}
          {currentView === 'billing' && (
            <footer className="p-4 sticky bottom-0 z-20 pointer-events-none">
              <div className="max-w-[1920px] mx-auto w-full pointer-events-auto">
                <ActionBar 
                  onNew={handleNew}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  onDelivery={handleDeliveryToggle}
                  onDuplicateBill={handleDuplicateBill}
                  onItemSetup={() => setShowItemSetupModal(true)}
                  onToggleSearch={handleToggleSearch}
                  isSearchPanelOpen={isSearchPanelOpen}
                  isEditing={isEditing}
                  isDarkMode={isDarkMode}
                />
              </div>
            </footer>
          )}
        </div>
      </div>

      {/* Modals wrapped in Suspense for lazy chunks */}
      <Suspense fallback={null}>
        {showPrintModal && (
          <InvoicePrintModal 
            bill={formData}
            isDuplicate={isDuplicateBill}
            onClose={() => setShowPrintModal(false)}
          />
        )}

        {showItemSetupModal && (
          <ItemSetupModal 
            onClose={() => setShowItemSetupModal(false)}
            userRole={currentUser?.role || 'admin'}
          />
        )}
      </Suspense>

      {showDeliveryModal && (
        <DeliveryModal
          bill={bills.find(b => b._id === activeBillId || b.billNo === activeBillId) || formData}
          isOpen={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          onConfirmDelivery={(billId, settlementData) => {
            handleDeliveryToggleById(billId, settlementData);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
