import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CustomerPrescriptionForm from './components/CustomerPrescriptionForm';
import QuickSearchGrid from './components/QuickSearchGrid';
import ActionBar from './components/ActionBar';
import InvoicePrintModal from './components/InvoicePrintModal';
import ItemSetupModal from './components/ItemSetupModal';
import DashboardPage from './components/DashboardPage';
import RemindersPage from './components/RemindersPage';
import FollowUpPage from './components/FollowUpPage';
import LoginPage from './components/LoginPage';
import StaffSetupPage from './components/StaffSetupPage';
import ReportsPage from './components/ReportsPage';
import CustomerInfoPage from './components/CustomerInfoPage';
import DeliveryModal from './components/DeliveryModal';
import { BILLS_API as API_BASE } from './config/api';

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

  // Current active view calculated from current route hash (e.g. 'billing', 'dashboard', 'reminders', 'followup', 'reports', 'customers', 'staff')
  const currentPath = location.pathname.replace(/^\//, '');
  const currentView = currentPath || 'billing';

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
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('optics_current_user');
    showNotification('Logged out successfully.', 'info');
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
    showNotification(`Bill #${billRecord.billNo} loaded into form.`, 'success');
  };

  const fetchBills = async (query = '') => {
    try {
      const res = await axios.get(`${API_BASE}?query=${query}`);
      setBills(res.data);
      setIsOnline(true);
    } catch (err) {
      console.warn('Backend server offline or unreachable, using local state persistence.');
      setIsOnline(false);
    }
  };

  const fetchNextBillNo = async () => {
    // Keep billNo un-prefilled as requested by user
    setFormData(prev => ({
      ...defaultFormState,
      billNo: ''
    }));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleNew = () => {
    setActiveBillId(null);
    setIsEditing(false);
    setFormData({
      ...defaultFormState,
      billNo: '',
      customer: {
        ...defaultFormState.customer,
        gender: ''
      }
    });
    showNotification('Form reset. Ready for new customer entry.', 'info');
  };

  const handleSave = async () => {
    if (!formData.customer.name.trim() || !formData.customer.phone.trim()) {
      showNotification('Please provide Customer Name and Phone number.', 'error');
      return;
    }

    try {
      if (isEditing && activeBillId) {
        await axios.put(`${API_BASE}/${activeBillId}`, formData);
        showNotification(`Bill #${formData.billNo} updated successfully!`, 'success');
      } else {
        const res = await axios.post(API_BASE, formData);
        showNotification(`Bill #${res.data.billNo || formData.billNo} created successfully!`, 'success');
      }
      fetchBills();
      handleNew();
    } catch (err) {
      const existingIdx = bills.findIndex(b => b.billNo === formData.billNo);
      if (existingIdx >= 0) {
        const updated = [...bills];
        updated[existingIdx] = { ...formData, _id: bills[existingIdx]._id };
        setBills(updated);
      } else {
        const newRecord = { ...formData, _id: 'bill_' + Date.now() };
        setBills([newRecord, ...bills]);
      }
      showNotification(`Bill #${formData.billNo} saved locally!`, 'success');
      handleNew();
    }
  };

  const handleEdit = () => {
    if (!activeBillId) {
      showNotification('Please select a bill record from the table to edit.', 'warning');
      return;
    }
    setIsEditing(true);
    showNotification(`Editing enabled for Bill #${formData.billNo}`, 'info');
  };

  const handleDelete = async () => {
    if (!activeBillId) {
      showNotification('Please select a bill record from the table to delete.', 'warning');
      return;
    }

    if (window.confirm(`Are you sure you want to delete Bill #${formData.billNo}?`)) {
      try {
        await axios.delete(`${API_BASE}/${activeBillId}`);
        showNotification(`Bill #${formData.billNo} deleted.`, 'success');
      } catch (err) {
        setBills(bills.filter(b => b._id !== activeBillId && b.billNo !== formData.billNo));
        showNotification(`Bill #${formData.billNo} removed locally.`, 'success');
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
    const targetBill = bills.find(b => b._id === targetId || b.billNo === targetId);
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
      await axios.patch(`${API_BASE}/${targetId}/delivery`, payload);
      showNotification(`Order #${targetBill?.billNo || targetId} delivery status updated to "${payload.status}"`, 'success');
    } catch (err) {
      console.warn('Network issue updating delivery status, updating locally.');
    }

    setBills(prev => prev.map(b => 
      (b._id === targetId || b.billNo === targetId) ? { ...b, ...payload, deliveryStatus: payload.status } : b
    ));

    if (activeBillId === targetId || formData._id === targetId || formData.billNo === targetId) {
      setFormData(prev => ({
        ...prev,
        ...payload,
        deliveryStatus: payload.status
      }));
    }

    fetchBills();
  };

  const handleSendSMS = async (billRecord) => {
    try {
      await axios.post(`${API_BASE}/${billRecord._id || billRecord.billNo}/send-sms`);
      showNotification(`SMS notification sent to ${billRecord.customer?.name} (${billRecord.customer?.phone})`, 'success');
    } catch (err) {
      showNotification(`SMS notification triggered for ${billRecord.customer?.name}`, 'success');
    }
  };

  const handleSelectBill = (billRecord) => {
    setActiveBillId(billRecord._id || billRecord.billNo);
    setIsEditing(false);
    setFormData({
      ...defaultFormState,
      ...billRecord,
      customer: { ...defaultFormState.customer, ...(billRecord.customer || {}) },
      prescription: { ...defaultFormState.prescription, ...(billRecord.prescription || {}) },
      lens: { ...defaultFormState.lens, ...(billRecord.lens || {}) },
      frame: { ...defaultFormState.frame, ...(billRecord.frame || {}) },
      totalAmount: billRecord.totalAmount || 1500,
      discountAmount: billRecord.discountAmount || 0,
      netAmount: billRecord.netAmount || 1500,
      advanceAmount: billRecord.advanceAmount || 0,
      balanceAmount: billRecord.balanceAmount || 0
    });
  };

  const filteredBills = bills.filter(b => {
    if (!searchQuery || !searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return (
      (b.customer?.name && b.customer.name.toLowerCase().includes(q)) ||
      (b.customer?.phone && b.customer.phone.includes(q)) ||
      (b.customer?.mrdNo && b.customer.mrdNo.includes(q)) ||
      (b.billNo && b.billNo.toString().includes(q))
    );
  });

  if (!currentUser) {
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
          toastMessage.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
          toastMessage.type === 'error' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
          toastMessage.type === 'warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
          'bg-sky-500/20 border-sky-500/50 text-sky-400'
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

        {/* View Switch Router */}
        <div className="flex-1 flex flex-col justify-between">
          <Routes>
            <Route path="/" element={<Navigate to="/billing" replace />} />
            <Route 
              path="/billing" 
              element={
                <main className="p-4.5 flex-1 grid grid-cols-1 xl:grid-cols-12 gap-4.5 items-start max-w-[1920px] mx-auto w-full transition-all duration-300">
                  {/* Left Column: Optical Form (Full 12 cols when search is closed, 7 cols when search is open) */}
                  <div className={`${isSearchPanelOpen ? 'xl:col-span-7' : 'xl:col-span-12'} w-full transition-all duration-300`}>
                    <CustomerPrescriptionForm 
                      formData={formData}
                      setFormData={setFormData}
                      isEditing={isEditing}
                      isDarkMode={isDarkMode}
                      onToggleSearch={handleToggleSearch}
                      isSearchPanelOpen={isSearchPanelOpen}
                      userRole={currentUser?.role || 'admin'}
                    />
                  </div>

                  {/* Right Column: Quick Search Grid (Slides in / Opens when isSearchPanelOpen is true) */}
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

      {/* Modals */}
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

