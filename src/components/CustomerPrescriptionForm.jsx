import React, { useEffect, useState, useMemo } from 'react';
import { User, Phone, MapPin, Stethoscope, Calendar, Glasses, DollarSign, Plus, Search, Gift, Wallet, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import { CATALOG_API, CUSTOMERS_API } from '../config/api';
import { calculateCustomerWallet } from '../utils/wallet';

export default function CustomerPrescriptionForm({ formData, setFormData, isEditing, isDarkMode, onToggleSearch, isSearchPanelOpen, userRole = 'admin', bills = [] }) {
  const [customOrderTakenOptions, setCustomOrderTakenOptions] = useState([]);
  const [customPrescribedByOptions, setCustomPrescribedByOptions] = useState([]);
  const [customRiOptions, setCustomRiOptions] = useState([]);
  const [customLensBrandOptions, setCustomLensBrandOptions] = useState([]);
  const [customFrameBrandOptions, setCustomFrameBrandOptions] = useState([]);
  
  const [dbCatalog, setDbCatalog] = useState(null);
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [isReferralApplied, setIsReferralApplied] = useState(false);
  const [isCashbackApplied, setIsCashbackApplied] = useState(true);
  const [isSearchingReferrer, setIsSearchingReferrer] = useState(false);

  // Dynamic available wallet balance for current customer
  const currentCustomerWalletBalance = useMemo(() => {
    return calculateCustomerWallet(formData.customer?.mrdNo || formData.customer?.phone, bills);
  }, [formData.customer?.mrdNo, formData.customer?.phone, bills]);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    try {
      const res = await axios.get(CATALOG_API);
      if (res.data) {
        setDbCatalog(res.data);
      }
    } catch (err) {
      console.warn('Catalog API offline, using default options.');
    }
  };

  const handleClearReferrer = () => {
    setFormData(prev => ({
      ...prev,
      referrerMrd: '',
      referrerPhone: '',
      referralDiscount: 0
    }));
    setReferrerInfo(null);
    setIsReferralApplied(false);
  };

  const handleLookupReferrer = async (mrdOrPhone, source = 'mrd') => {
    if (!mrdOrPhone || !mrdOrPhone.trim()) {
      setReferrerInfo(null);
      setIsReferralApplied(false);
      return;
    }

    const q = mrdOrPhone.trim().toLowerCase();
    const cleanNum = q.replace(/^0+/, ''); // e.g. "00480" -> "480", "00004" -> "4"

    // 1. Check local bills prop
    if (bills && bills.length > 0) {
      let match = null;
      if (source === 'mrd') {
        match = bills.find(b => {
          const bMrd = (b.customer?.mrdNo || '').toLowerCase().trim();
          const bCleanMrd = bMrd.replace(/^0+/, '');
          return (bMrd && bMrd === q) || (cleanNum && bCleanMrd === cleanNum);
        });
      } else {
        match = bills.find(b => {
          const bPhone = (b.customer?.phone || '').replace(/\D/g, '');
          return bPhone && (bPhone === q || (q.length >= 7 && bPhone.includes(q)));
        });
      }

      if (match && match.customer) {
        const foundMrd = match.customer.mrdNo || '';
        const foundPhone = match.customer.phone || '';
        const calculatedWallet = calculateCustomerWallet(foundMrd || foundPhone, bills);

        setReferrerInfo({
          name: match.customer.name,
          mrdNo: foundMrd || foundPhone,
          phone: foundPhone,
          walletBalance: calculatedWallet
        });
        setIsReferralApplied(true);
        return;
      }
    }

    // 2. Fetch from backend API using collection query parameter to guarantee 200 OK
    setIsSearchingReferrer(true);
    try {
      const res = await axios.get(`${CUSTOMERS_API}?query=${encodeURIComponent(q)}`, {
        validateStatus: (status) => status < 500
      });

      const foundCustomer = Array.isArray(res.data) 
        ? (res.data.length > 0 ? res.data[0] : null)
        : res.data;

      if (res.status === 200 && foundCustomer && !foundCustomer.message) {
        const calculatedWallet = calculateCustomerWallet(foundCustomer.mrdNo || foundCustomer.phone, bills) || foundCustomer.walletBalance || 0;
        setReferrerInfo({
          ...foundCustomer,
          walletBalance: calculatedWallet
        });
        setIsReferralApplied(true);
      } else {
        if (cleanNum.length >= 1) {
          const calculatedWallet = calculateCustomerWallet(mrdOrPhone, bills);
          setReferrerInfo({
            name: `Customer (${mrdOrPhone})`,
            mrdNo: source === 'mrd' ? mrdOrPhone : '',
            phone: source === 'phone' ? mrdOrPhone : '',
            walletBalance: calculatedWallet
          });
          setIsReferralApplied(true);
        } else {
          setReferrerInfo(null);
          setIsReferralApplied(false);
        }
      }
    } catch (err) {
      // Fallback referrer profile for valid input
      if (cleanNum.length >= 1) {
        const calculatedWallet = calculateCustomerWallet(mrdOrPhone, bills);
        setReferrerInfo({
          name: `Customer (${mrdOrPhone})`,
          mrdNo: source === 'mrd' ? mrdOrPhone : '',
          phone: source === 'phone' ? mrdOrPhone : '',
          walletBalance: calculatedWallet
        });
        setIsReferralApplied(true);
      } else {
        setReferrerInfo(null);
        setIsReferralApplied(false);
      }
    } finally {
      setIsSearchingReferrer(false);
    }
  };

  useEffect(() => {
    if (formData.referrerMrd && formData.referrerMrd.trim().length >= 1) {
      handleLookupReferrer(formData.referrerMrd, 'mrd');
    } else if (formData.referrerPhone && formData.referrerPhone.trim().length >= 7) {
      handleLookupReferrer(formData.referrerPhone, 'phone');
    } else {
      setReferrerInfo(null);
      setIsReferralApplied(false);
    }
  }, [formData.referrerMrd, formData.referrerPhone]);

  useEffect(() => {
    const lensPrice = Number(formData.lens.price) || 0;
    const framePrice = Number(formData.frame.price) || 0;

    const lensQty = Number(formData.lens.qty) || (lensPrice > 0 ? 1 : 0);
    const frameQty = Number(formData.frame.qty) || (framePrice > 0 ? 1 : 0);

    const lensTotal = lensQty * lensPrice;
    const frameTotal = frameQty * framePrice;
    const total = lensTotal + frameTotal;

    const manualDiscount = Number(formData.discountAmount) || 0;
    
    // 20% Referral Discount if Referral is applied
    const refDiscount = isReferralApplied ? Math.round(total * 0.20) : 0;
    const walletRedeemed = Number(formData.walletRedeemed) || 0;
    
    const subNet = Math.max(0, total - manualDiscount - refDiscount - walletRedeemed);
    // 10% Wallet Cashback discount earned based on Net Amount if applied
    const cashback = isCashbackApplied ? Math.round(subNet * 0.10) : 0;
    const net = Math.max(0, subNet - cashback);
    
    const advance = Number(formData.advanceAmount) || 0;
    const balance = Math.max(0, net - advance);

    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      referralDiscount: refDiscount,
      netAmount: net,
      cashbackEarned: cashback,
      balanceAmount: balance
    }));
  }, [
    formData.lens.qty, formData.lens.price,
    formData.frame.qty, formData.frame.price,
    formData.discountAmount, formData.advanceAmount,
    formData.walletRedeemed, isReferralApplied, isCashbackApplied
  ]);

  const handleCustomerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const handleRxChange = (eye, field, value) => {
    setFormData(prev => ({
      ...prev,
      prescription: {
        ...prev.prescription,
        [eye]: {
          ...(prev.prescription[eye] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleProductChange = (category, field, value) => {
    setFormData(prev => {
      const updatedCategory = {
        ...prev[category],
        [field]: value
      };
      // Auto-set qty to 1 if user enters a price and qty is empty
      if (field === 'price' && value && Number(value) > 0 && !updatedCategory.qty) {
        updatedCategory.qty = '1';
      }
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  // Master Dropdown Lists matching handwritten specification & Database Catalog
  const orderTakenOptions = Array.from(new Set(['', 'Babu', 'Abrar', 'Janani', 'Arafath', ...(dbCatalog?.orderTakenOptions || []), ...customOrderTakenOptions]));
  const prescribedByOptions = Array.from(new Set(['', 'Bushra', 'Janani', 'Aravint Hsptl', 'Vivekanandha', 'Agarwal', ...(dbCatalog?.prescribedByOptions || []), ...customPrescribedByOptions]));
  const genderOptions = ['', 'Male', 'Female', 'Other'];
  const riOptions = ['', '1.51', '1.54', '1.59', '1.6', '1.74', ...customRiOptions];

  const lensTypeOptions = Array.from(new Set(['', 'SV', 'Bifocal', 'Progressive', ...(dbCatalog?.lensTypes || [])]));
  const lensCoatingOptions = Array.from(new Set([
    '', 'HC', 'HMC', 'Bluecut', 'Bluecut, Blue', 'Bluecut Green', 
    'PG HC', 'PG HMC', 'PG Bluecut HMC', 'PG Bluecut green', 'PG Bluecut Blue',
    ...(dbCatalog?.lensCoatings || [])
  ]));
  const lensBrandOptions = Array.from(new Set(['', 'essilor', 'crizal', 'zeiss', 'hoya', 'regular', ...(dbCatalog?.lensBrands || []), ...customLensBrandOptions]));
  const lensWarrantyOptions = Array.from(new Set(['', 'NIL', '6 months', '1 year', '2 years', ...(dbCatalog?.lensWarranties || [])]));

  const frameTypeOptions = Array.from(new Set(['', 'Supra', 'Full frame', 'Rimless', 'Sunglass', 'Reading glass', 'Contact lens', ...(dbCatalog?.frameTypes || [])]));
  const frameBrandOptions = Array.from(new Set([
    '', 'Arcadio', 'IDEE', 'Iris', 'Fastrack', 'Titan', 'Rayban', 
    'Infinity', 'Nova', 'Velocity', 'Opium', 'Sizzler', 'Taghills', 
    ...(dbCatalog?.frameBrands || []), ...customFrameBrandOptions
  ]));
  const frameWarrantyOptions = Array.from(new Set(['', 'NIL', '6 months', '1 year', '2 years', ...(dbCatalog?.frameWarranties || [])]));

  const sphOptions = ['', 'plano', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00', '+0.25', '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00'];
  const cylOptions = ['-', '-0.25', '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75', '-2.00', '-2.25', '-2.50', '-2.75', '-3.00'];
  const axisOptions = ['-', '5', '10', '15', '20', '25', '30', '45', '60', '75', '90', '105', '120', '135', '150', '165', '180'];
  const addOptions = ['-', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75', '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25', '+3.50'];
  const vaOptions = [
    '', '6/6', '6/6-1', '6/6-2', '6/6+1', '6/6+2', 
    '6/9', '6/9-1', '6/9+1', '6/12', '6/18', '6/24', '6/36', '6/60',
    '20/20', '20/25', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200',
    'N6', 'N8', 'N10', 'N12', 'N18', 'N36',
    'J1', 'J1+', 'J2', 'J3', 'J4', 'J6', 'J8', 'J10',
    'CF', 'CF 1m', 'CF 2m', 'HM', 'PL', 'NPL',
    'PH 6/6', 'NIP', 'Amblyopic'
  ];

  const handleSelectWithAdd = async (e, onChange, setCustomList, label, catalogKey) => {
    const val = e.target.value;
    if (val === '__ADD_CUSTOM__') {
      if (userRole !== 'admin') {
        alert('Only administrators can add new dropdown items.');
        return;
      }
      const customVal = window.prompt(`Enter new custom ${label}:`);
      if (customVal && customVal.trim()) {
        const trimmed = customVal.trim();
        setCustomList(prev => [...prev, trimmed]);
        onChange(trimmed);

        if (catalogKey && dbCatalog) {
          try {
            const updatedArr = Array.from(new Set([...(dbCatalog[catalogKey] || []), trimmed]));
            await axios.post(CATALOG_API, { [catalogKey]: updatedArr });
            setDbCatalog(prev => ({ ...prev, [catalogKey]: updatedArr }));
          } catch (err) {
            console.warn('Could not sync custom option to backend catalog API.');
          }
        }
      }
    } else {
      onChange(val);
    }
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="flex flex-col gap-3 sm:gap-3.5">
      {/* SECTION 1: Customer Entry */}
      <div className={`${panelClass} p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl transition-all duration-300`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-slate-400/20 pb-2.5 sm:pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sky-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-500" /> Customer Entry
            </span>
            {isEditing && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 font-bold">
                Editing #{formData.billNo}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
            {onToggleSearch && (
              <button
                type="button"
                onClick={onToggleSearch}
                className={`px-3 py-1 rounded-xl border font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSearchPanelOpen
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-md'
                    : 'bg-sky-500/15 border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white'
                }`}
                title="Open Quick Search Grid"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Find</span>
              </button>
            )}

            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'}`}>
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700 dark:text-sky-500" />
              <input 
                type="date" 
                value={formData.date ? formData.date.substring(0, 10) : new Date().toISOString().substring(0, 10)}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-transparent font-bold focus:outline-none text-[10px] sm:text-xs font-mono text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* 9 Customer Entry Fields */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 text-xs">
          {/* 1) *Name */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold`}>1) *Name:</label>
            <input 
              type="text" 
              placeholder="Customer Name (letters only)"
              value={formData.customer.name}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                handleCustomerChange('name', cleaned);
              }}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-semibold ${inputClass}`}
            />
          </div>

          {/* 2) *Phone No */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold flex items-center gap-1`}>
              <Phone className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" /> 2) *Phone No:
            </label>
            <input 
              type="text" 
              maxLength={10}
              placeholder="10-digit Indian Mobile (6-9...)"
              value={formData.customer.phone}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 0 && !/^[6-9]/.test(val)) {
                  val = '';
                }
                handleCustomerChange('phone', val.slice(0, 10));
              }}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-mono font-bold text-blue-800 dark:text-sky-400 ${inputClass}`}
            />
          </div>

          {/* 3) Age */}
          <div className="col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold`}>3) Age:</label>
            <input 
              type="text" 
              inputMode="numeric"
              placeholder="Age"
              value={formData.customer.age}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                handleCustomerChange('age', val);
              }}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-mono font-semibold ${inputClass}`}
            />
          </div>

          {/* 4) *Bill No */}
          <div className="col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold`}>4) *Bill No:</label>
            <input 
              type="text" 
              placeholder="Bill No"
              value={formData.billNo || ''}
              onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-mono font-bold text-blue-800 dark:text-sky-400 ${inputClass}`}
            />
          </div>

          {/* 5) *MRD No */}
          <div className="col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold`}>5) *MRD No:</label>
            <input 
              type="text" 
              placeholder="MRD No"
              value={formData.customer.mrdNo}
              onChange={(e) => handleCustomerChange('mrdNo', e.target.value)}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-mono font-semibold ${inputClass}`}
            />
          </div>

          {/* 6) Gender */}
          <div className="col-span-1 flex flex-col gap-1 min-w-0">
            <label className={`${labelClass} font-bold`}>6) Gender:</label>
            <select 
              value={formData.customer.gender}
              onChange={(e) => handleCustomerChange('gender', e.target.value)}
              className={`w-full max-w-full min-w-0 truncate text-ellipsis rounded-xl px-2.5 py-1.5 sm:py-2 font-bold ${inputClass}`}
            >
              {genderOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
            </select>
          </div>

          {/* Referrer MRD Field */}
          <div className="col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold flex items-center gap-1 text-emerald-700 dark:text-emerald-400`}>
              <Gift className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Referrer MRD No:
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Referrer MRD No"
                value={formData.referrerMrd || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, referrerMrd: val }));
                  handleLookupReferrer(val, 'mrd');
                }}
                className={`w-full rounded-xl pl-3 pr-8 py-1.5 sm:py-2 font-mono font-bold text-emerald-800 dark:text-emerald-400 border-emerald-500/40 ${inputClass}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {formData.referrerMrd && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, referrerMrd: '' }));
                      if (!formData.referrerPhone) handleClearReferrer();
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-full transition-colors cursor-pointer"
                    title="Clear Referrer MRD"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {isSearchingReferrer && (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Referrer Phone Field */}
          <div className="col-span-1 flex flex-col gap-1">
            <label className={`${labelClass} font-bold flex items-center gap-1 text-emerald-700 dark:text-emerald-400`}>
              <Phone className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> Referrer Phone No:
            </label>
            <div className="relative">
              <input 
                type="text" 
                maxLength={10}
                placeholder="Referrer Mobile No"
                value={formData.referrerPhone || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, referrerPhone: val }));
                  handleLookupReferrer(val, 'phone');
                }}
                className={`w-full rounded-xl pl-3 pr-8 py-1.5 sm:py-2 font-mono font-bold text-emerald-800 dark:text-emerald-400 border-emerald-500/40 ${inputClass}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {formData.referrerPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, referrerPhone: '' }));
                      if (!formData.referrerMrd) handleClearReferrer();
                    }}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-full transition-colors cursor-pointer"
                    title="Clear Referrer Phone"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {isSearchingReferrer && (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* 7) Order Taken */}
          <div className="col-span-1 flex flex-col gap-1 min-w-0">
            <label className={`${labelClass} font-bold`}>7) Order Taken:</label>
            <select 
              value={formData.customer.orderTakenBy}
              onChange={(e) => handleSelectWithAdd(e, (val) => handleCustomerChange('orderTakenBy', val), setCustomOrderTakenOptions, 'Order Taken Staff', 'orderTakenOptions')}
              className={`w-full max-w-full min-w-0 truncate text-ellipsis rounded-xl px-2.5 py-1.5 sm:py-2 font-medium ${inputClass}`}
            >
              {orderTakenOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
              {userRole === 'admin' && (
                <option value="__ADD_CUSTOM__" className={isDarkMode ? 'bg-slate-900 text-sky-400 font-bold' : 'text-sky-600 font-bold'}>+ Add Custom...</option>
              )}
            </select>
          </div>

          {/* 8) Prescribed By */}
          <div className="col-span-1 flex flex-col gap-1 min-w-0">
            <label className={`${labelClass} font-bold flex items-center gap-1`}>
              <Stethoscope className="w-3.5 h-3.5 text-blue-700 dark:text-sky-400" /> 8) Prescribed By:
            </label>
            <select 
              value={formData.customer.drName}
              onChange={(e) => handleSelectWithAdd(e, (val) => handleCustomerChange('drName', val), setCustomPrescribedByOptions, 'Prescriber / Doctor', 'prescribedByOptions')}
              className={`w-full max-w-full min-w-0 truncate text-ellipsis rounded-xl px-2.5 py-1.5 sm:py-2 font-medium ${inputClass}`}
            >
              {prescribedByOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
              {userRole === 'admin' && (
                <option value="__ADD_CUSTOM__" className={isDarkMode ? 'bg-slate-900 text-sky-400 font-bold' : 'text-sky-600 font-bold'}>+ Add Custom...</option>
              )}
            </select>
          </div>

          {/* 9) Address */}
          <div className="col-span-2 sm:col-span-1 md:col-span-3 lg:col-span-3 flex flex-col gap-1">
            <label className={`${labelClass} font-bold flex items-center gap-1`}>
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> 9) Address:
            </label>
            <input 
              type="text" 
              placeholder="City / Address"
              value={formData.customer.address}
              onChange={(e) => handleCustomerChange('address', e.target.value)}
              className={`w-full rounded-xl px-3 py-1.5 sm:py-2 font-medium ${inputClass}`}
            />
          </div>
        </div>

        {/* Referrer Info & 20% Referral Discount Popup Banner */}
        {referrerInfo ? (
          <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 border-2 border-emerald-500/50 shadow-xl text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950 dark:text-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-sm sm:text-base flex flex-wrap items-center gap-2">
                  <span className="text-emerald-950 dark:text-emerald-100">Referred by: {referrerInfo.name}</span>
                  <span className="px-2.5 py-0.5 rounded-xl bg-emerald-500/25 border border-emerald-500/40 text-emerald-900 dark:text-emerald-300 font-mono text-xs font-black">
                    MRD #{referrerInfo.mrdNo || referrerInfo.phone}
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Referrer Wallet Balance: <strong className="text-sm font-mono font-black text-emerald-900 dark:text-emerald-300">₹{Number(referrerInfo.walletBalance || 0).toLocaleString('en-IN')} Rupees</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsReferralApplied(!isReferralApplied)}
                className={`px-4 py-2.5 rounded-xl font-extrabold flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer transition-all shadow-md active:scale-95 ${
                  isReferralApplied
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-400 shadow-emerald-600/30'
                    : 'bg-white dark:bg-slate-900 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{isReferralApplied ? '20% Referral Discount Applied!' : 'Apply 20% Discount'}</span>
              </button>

              <button
                type="button"
                onClick={handleClearReferrer}
                className="p-2.5 rounded-xl border border-rose-400/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                title="Remove Referral"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          formData.referrerMrd && formData.referrerMrd.trim().length > 1 && (
            <div className="mt-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 pl-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Checking referral profile for "{formData.referrerMrd}"...</span>
            </div>
          )
        )}
      </div>

      {/* Datalists for Rx Inputs allowing manual typing of positive/negative numbers */}
      <datalist id="sphOptionsList">
        {sphOptions.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      <datalist id="cylOptionsList">
        {cylOptions.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      <datalist id="axisOptionsList">
        {axisOptions.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      <datalist id="addOptionsList">
        {addOptions.map(opt => <option key={opt} value={opt} />)}
      </datalist>
      <datalist id="vaOptionsList">
        {vaOptions.map(opt => <option key={opt} value={opt} />)}
      </datalist>

      {/* SECTION 2 & 3: Prescription Matrix & Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Prescription Eye Power Matrix (Left 7 Cols) */}
        <div className={`${panelClass} lg:col-span-7 p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl`}>
          {/* SECTION 2: Prescription Rx Powers */}
          <div className="mt-3.5 pt-3 border-t border-slate-400/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sky-500 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-sky-500" /> Prescription
              </span>
              <span className="opacity-60 text-[10px] sm:text-[11px] uppercase font-bold font-mono">RE & LE Powers</span>
            </div>

            {/* Scrollable Matrix Wrapper for Mobile */}
            <div className="overflow-x-auto min-w-0 w-full pb-1">
              <div className="min-w-[340px]">
                {/* Matrix Header Labels */}
                <div className="grid grid-cols-5 gap-1.5 text-[10px] sm:text-[11px] font-bold opacity-70 text-center border-b border-slate-400/20 pb-1.5 mb-2">
                  <div className="text-left pl-1">EYE</div>
                  <div>SPH</div>
                  <div>CYL</div>
                  <div>AXIS</div>
                  <div>ADD</div>
                  {/* <div>VA.</div> */}
                </div>

                {/* Right Eye RE */}
                <div className={`grid grid-cols-5 gap-1.5 items-center mb-2 p-2 rounded-xl border transition-all ${
                  isDarkMode ? 'bg-sky-950/30 border-sky-800/40' : 'bg-blue-50/80 border-blue-200'
                }`}>
                  <span className="font-extrabold text-xs text-blue-800 dark:text-sky-400 pl-1">RE</span>
                  <input 
                    type="text"
                    list="sphOptionsList"
                    placeholder="SPH"
                    value={formData.prescription?.rightEye?.sph || ''}
                    onChange={(e) => handleRxChange('rightEye', 'sph', e.target.value.replace(/[^0-9+\-.\splanoPLANO]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono font-bold text-sky-500 text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="cylOptionsList"
                    placeholder="CYL"
                    value={formData.prescription?.rightEye?.cyl || ''}
                    onChange={(e) => handleRxChange('rightEye', 'cyl', e.target.value.replace(/[^0-9+\-.\s]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="axisOptionsList"
                    placeholder="AXIS"
                    value={formData.prescription?.rightEye?.axis || ''}
                    onChange={(e) => handleRxChange('rightEye', 'axis', e.target.value.replace(/[^0-9\-]/g, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="addOptionsList"
                    placeholder="ADD"
                    value={formData.prescription?.rightEye?.add || ''}
                    onChange={(e) => handleRxChange('rightEye', 'add', e.target.value.replace(/[^0-9+\-.\s]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  {/* <input 
                    type="text"
                    list="vaOptionsList"
                    placeholder="VA"
                    title="Enter Visual Acuity or Comments (e.g., 6/6, 6/6-2, PH 6/6, CF, NIP, J1)"
                    value={formData.prescription?.rightEye?.va || ''}
                    onChange={(e) => handleRxChange('rightEye', 'va', e.target.value.replace(/[^0-9\/a-zA-Z\s+.\-]/g, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  /> */}
                </div>

                {/* Left Eye LE */}
                <div className={`grid grid-cols-5 gap-1.5 items-center mb-3 p-2 rounded-xl border transition-all ${
                  isDarkMode ? 'bg-sky-950/30 border-sky-800/40' : 'bg-sky-500/10 border-sky-300/60'
                }`}>
                  <span className="font-extrabold text-xs text-sky-500 pl-1">LE</span>
                  <input 
                    type="text"
                    list="sphOptionsList"
                    placeholder="SPH"
                    value={formData.prescription?.leftEye?.sph || ''}
                    onChange={(e) => handleRxChange('leftEye', 'sph', e.target.value.replace(/[^0-9+\-.\splanoPLANO]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono font-bold text-sky-500 text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="cylOptionsList"
                    placeholder="CYL"
                    value={formData.prescription?.leftEye?.cyl || ''}
                    onChange={(e) => handleRxChange('leftEye', 'cyl', e.target.value.replace(/[^0-9+\-.\s]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="axisOptionsList"
                    placeholder="AXIS"
                    value={formData.prescription?.leftEye?.axis || ''}
                    onChange={(e) => handleRxChange('leftEye', 'axis', e.target.value.replace(/[^0-9\-]/g, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  <input 
                    type="text"
                    list="addOptionsList"
                    placeholder="ADD"
                    value={formData.prescription?.leftEye?.add || ''}
                    onChange={(e) => handleRxChange('leftEye', 'add', e.target.value.replace(/[^0-9+\-.\s]/gi, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  />
                  {/* <input 
                    type="text"
                    list="vaOptionsList"
                    placeholder="VA"
                    title="Enter Visual Acuity or Comments (e.g., 6/6, 6/6-2, PH 6/6, CF, NIP, J1)"
                    value={formData.prescription?.leftEye?.va || ''}
                    onChange={(e) => handleRxChange('leftEye', 'va', e.target.value.replace(/[^0-9\/a-zA-Z\s+.\-]/g, ''))}
                    className={`w-full rounded-lg px-1.5 py-1 font-mono text-[11px] ${inputClass}`}
                  /> */}
                </div>
              </div>
            </div>

            {/* Below Table Controls: PD & R.I */}
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2 border-t border-slate-400/20 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-bold opacity-80">PD:</span>
                <input 
                  type="text" 
                  inputMode="decimal"
                  placeholder="e.g. 62"
                  value={formData.prescription?.pd || ''}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, pd: cleaned } }));
                  }}
                  className={`w-16 sm:w-20 rounded-lg px-2 py-1 font-mono text-center ${inputClass}`}
                />
                <span className="opacity-70 font-semibold">mm</span>
              </div>

              <div className="flex items-center gap-1.5 min-w-0 max-w-full">
                <span className="font-bold opacity-80 shrink-0">R.I:</span>
                <select 
                  value={formData.prescription?.ri || ''}
                  onChange={(e) => handleSelectWithAdd(e, (val) => setFormData(prev => ({ ...prev, prescription: { ...prev.prescription, ri: val } })), setCustomRiOptions, 'Refractive Index (R.I)')}
                  className={`rounded-lg px-2 py-1 font-bold text-sky-500 max-w-full min-w-0 truncate text-ellipsis ${inputClass}`}
                >
                  {riOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
                  <option value="__ADD_CUSTOM__" className={isDarkMode ? 'bg-slate-900 text-sky-400 font-bold' : 'text-sky-600 font-bold'}>+ Add Custom...</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Items: Lens & Frame */}
          <div className="mt-3.5 pt-3 border-t border-slate-400/20 space-y-3 text-xs">
            {/* LENS Row */}
            <div className="grid grid-cols-1 sm:flex sm:flex-nowrap items-center gap-2 min-w-0 w-full">
              <div className="flex items-center gap-1.5 min-w-0 flex-1 w-full">
                <span className="font-extrabold w-12 shrink-0 text-sky-500">Lens:</span>
                <select 
                  value={formData.lens.type || ''}
                  onChange={(e) => handleProductChange('lens', 'type', e.target.value)}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-semibold text-sky-500 truncate text-ellipsis ${inputClass}`}
                >
                  {lensTypeOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt || '-- Lens Type --'}</option>)}
                </select>

                <select 
                  value={formData.lens.coating || ''}
                  onChange={(e) => handleProductChange('lens', 'coating', e.target.value)}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-medium truncate text-ellipsis ${inputClass}`}
                >
                  {lensCoatingOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt || '-- Coating --'}</option>)}
                </select>

                <select 
                  value={formData.lens.brand || ''}
                  onChange={(e) => handleSelectWithAdd(e, (val) => handleProductChange('lens', 'brand', val), setCustomLensBrandOptions, 'Lens Brand')}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-medium truncate text-ellipsis ${inputClass}`}
                >
                  {lensBrandOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt || '-- Brand --'}</option>)}
                  <option value="__ADD_CUSTOM__" className={isDarkMode ? 'bg-slate-900 text-sky-400 font-bold' : 'text-sky-600 font-bold'}>+ Add Custom...</option>
                </select>

                <select 
                  value={formData.lens.warranty || ''}
                  onChange={(e) => handleProductChange('lens', 'warranty', e.target.value)}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-medium truncate text-ellipsis ${inputClass}`}
                >
                  {lensWarrantyOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt || '-- Warranty --'}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end pl-14 sm:pl-0 shrink-0">
                <span className="text-[10px] opacity-70 font-bold sm:hidden">Qty:</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  title="Quantity (No)"
                  placeholder="No"
                  value={formData.lens.qty}
                  onChange={(e) => handleProductChange('lens', 'qty', e.target.value.replace(/\D/g, ''))}
                  className={`w-14 rounded-lg px-1 py-1.5 text-center font-mono font-bold ${inputClass}`}
                />
                <span className="text-[10px] opacity-70 font-bold sm:hidden">Price:</span>
                <input 
                  type="text" 
                  inputMode="decimal"
                  title="Amount"
                  placeholder="Amount"
                  value={formData.lens.price}
                  onChange={(e) => handleProductChange('lens', 'price', e.target.value.replace(/[^0-9.]/g, ''))}
                  className={`w-24 rounded-lg px-2 py-1.5 font-mono text-blue-800 dark:text-sky-400 font-bold text-right ${inputClass}`}
                />
              </div>
            </div>

            {/* FRAME Row */}
            <div className="grid grid-cols-1 sm:flex sm:flex-nowrap items-center gap-2 min-w-0 w-full">
              <div className="flex items-center gap-1.5 min-w-0 flex-1 w-full">
                <span className="font-extrabold w-12 shrink-0 text-blue-800 dark:text-sky-400">Frame:</span>
                <select 
                  value={formData.frame.type || ''}
                  onChange={(e) => handleProductChange('frame', 'type', e.target.value)}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-semibold text-blue-800 dark:text-sky-400 truncate text-ellipsis ${inputClass}`}
                >
                  {frameTypeOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
                </select>

                <select 
                  value={formData.frame.brand || ''}
                  onChange={(e) => handleSelectWithAdd(e, (val) => handleProductChange('frame', 'brand', val), setCustomFrameBrandOptions, 'Frame Brand')}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-medium truncate text-ellipsis ${inputClass}`}
                >
                  {frameBrandOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
                  <option value="__ADD_CUSTOM__" className={isDarkMode ? 'bg-slate-900 text-sky-400 font-bold' : 'text-blue-700 font-bold'}>+ Add Custom...</option>
                </select>

                <select 
                  value={formData.frame.warranty || ''}
                  onChange={(e) => handleProductChange('frame', 'warranty', e.target.value)}
                  className={`flex-1 min-w-0 max-w-full rounded-lg px-2 py-1.5 font-medium truncate text-ellipsis ${inputClass}`}
                >
                  {frameWarrantyOptions.map(opt => <option key={opt} value={opt} className={isDarkMode ? 'bg-slate-900' : ''}>{opt}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 justify-end pl-14 sm:pl-0 shrink-0">
                <span className="text-[10px] opacity-70 font-bold sm:hidden">Qty:</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  title="Quantity (No)"
                  placeholder="No"
                  value={formData.frame.qty}
                  onChange={(e) => handleProductChange('frame', 'qty', e.target.value.replace(/\D/g, ''))}
                  className={`w-14 rounded-lg px-1 py-1.5 text-center font-mono font-bold ${inputClass}`}
                />
                <span className="text-[10px] opacity-70 font-bold sm:hidden">Price:</span>
                <input 
                  type="text" 
                  inputMode="decimal"
                  title="Amount"
                  placeholder="Amount"
                  value={formData.frame.price}
                  onChange={(e) => handleProductChange('frame', 'price', e.target.value.replace(/[^0-9.]/g, ''))}
                  className={`w-24 rounded-lg px-2 py-1.5 font-mono text-blue-800 dark:text-sky-400 font-bold text-right ${inputClass}`}
                />
              </div>
            </div>
          </div>

          {/* Note / Customization Box */}
          <div className="mt-3.5 pt-3 border-t border-slate-400/20 flex flex-col gap-1.5">
            <label className={`${labelClass} font-bold text-xs`}>Note: offer (eg: 40% on diwali) * Customize</label>
            <textarea 
              rows={2}
              placeholder="offer (eg: 40% on diwali) * Customize..."
              value={formData.customer.note}
              onChange={(e) => handleCustomerChange('note', e.target.value)}
              className={`w-full rounded-xl px-3 py-2 text-blue-800 dark:text-sky-400 font-semibold text-xs ${inputClass}`}
            />
          </div>
        </div>

        {/* Financial Summary Panel (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          <div className={`${panelClass} p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl text-xs flex flex-col justify-between flex-1`}>
            <div className="flex items-center justify-between border-b border-slate-400/20 pb-2 mb-3">
              <span className="text-blue-800 dark:text-sky-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-800 dark:text-sky-400" /> Payment Summary
              </span>
              <span className="opacity-70 font-mono font-bold text-[11px]">INR ₹</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold opacity-80">Total:</span>
                <span className="font-mono font-bold text-sm">₹ {formData.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold opacity-80">Disc.Amt:</span>
                <div className="flex items-center gap-1">
                  <span className="opacity-40 font-mono">0</span>
                  <input 
                    type="text" 
                    inputMode="decimal"
                    value={formData.discountAmount}
                    onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value.replace(/[^0-9.]/g, '') })}
                    className={`w-20 sm:w-24 rounded-lg px-2 py-1 text-right font-mono text-blue-800 dark:text-sky-400 font-bold ${inputClass}`}
                  />
                </div>
              </div>

              {/* 20% Referral Discount Row */}
              {(formData.referralDiscount > 0 || isReferralApplied) && (
                <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> Referral Off (20%):
                  </span>
                  <span className="font-mono font-extrabold text-sm">- ₹ {formData.referralDiscount.toFixed(2)}</span>
                </div>
              )}

              {/* Wallet Redeem Row for Existing Customer Points */}
              <div className="flex flex-col gap-1.5 p-2 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Wallet Points Redeem:</span>
                  </span>
                  {currentCustomerWalletBalance > 0 && (
                    <span className="text-xs font-mono font-black text-amber-700 dark:text-amber-300">
                      (Avail: ₹{currentCustomerWalletBalance.toLocaleString('en-IN')})
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  {currentCustomerWalletBalance > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        const isRedeemed = Number(formData.walletRedeemed) > 0;
                        if (isRedeemed) {
                          setFormData(prev => ({ ...prev, walletRedeemed: '' }));
                        } else {
                          const maxRedeem = Math.min(
                            currentCustomerWalletBalance,
                            Math.max(0, (formData.totalAmount || 0) - (Number(formData.discountAmount) || 0) - (Number(formData.referralDiscount) || 0))
                          );
                          setFormData(prev => ({ ...prev, walletRedeemed: maxRedeem > 0 ? String(maxRedeem) : '' }));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95 ${
                        Number(formData.walletRedeemed) > 0
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20'
                          : 'bg-white dark:bg-slate-900 border border-amber-400 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800'
                      }`}
                      title={Number(formData.walletRedeemed) > 0 ? 'Click to unapply wallet points' : `Click to apply available ₹${currentCustomerWalletBalance} points`}
                    >
                      {Number(formData.walletRedeemed) > 0 ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                          <span>Applied (₹{formData.walletRedeemed})</span>
                        </>
                      ) : (
                        <span>Apply ₹{currentCustomerWalletBalance} Points</span>
                      )}
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono opacity-60">₹0 Points Available</span>
                  )}

                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono">- ₹</span>
                    <input 
                      type="text" 
                      inputMode="decimal"
                      placeholder="0"
                      value={formData.walletRedeemed || ''}
                      onChange={(e) => setFormData({ ...formData, walletRedeemed: e.target.value.replace(/[^0-9.]/g, '') })}
                      className={`w-16 sm:w-20 rounded-lg px-2 py-1 text-right font-mono text-amber-800 dark:text-amber-400 font-bold ${inputClass}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-400/20">
                <span className="font-black">Net Amt:</span>
                <span className="font-mono font-black text-blue-800 dark:text-sky-400 text-base">₹ {formData.netAmount.toFixed(2)}</span>
              </div>

              {/* 10% Cashback Preview Badge with Apply/Unapply Toggle */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all shadow-xs ${
                isCashbackApplied
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-sky-500/15 dark:to-blue-600/15 border-blue-200 dark:border-sky-500/30 text-blue-900 dark:text-sky-300'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Wallet className={`w-4 h-4 ${isCashbackApplied ? 'text-blue-700 dark:text-sky-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>10% Wallet Cashback Off:</span>
                  <span className="font-mono font-extrabold text-sm ml-0.5">
                    {isCashbackApplied ? `- ₹ ${formData.cashbackEarned || 0}.00` : '₹ 0.00 (Unapplied)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCashbackApplied(!isCashbackApplied)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95 shrink-0 ${
                    isCashbackApplied
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isCashbackApplied ? 'Click to unapply 10% cashback discount' : 'Click to apply 10% cashback discount'}
                >
                  {isCashbackApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-200" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <span>Apply</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold opacity-80">Pay Mode:</span>
                <select 
                  value={formData.payMode}
                  onChange={(e) => setFormData({ ...formData, payMode: e.target.value })}
                  className={`rounded-lg px-2 py-1 font-bold uppercase text-[11px] sm:text-xs ${inputClass}`}
                >
                  <option value="CASH" className={isDarkMode ? 'bg-slate-900' : ''}>CASH</option>
                  <option value="UPI" className={isDarkMode ? 'bg-slate-900' : ''}>UPI</option>
                  <option value="CARD" className={isDarkMode ? 'bg-slate-900' : ''}>CARD</option>
                  <option value="ONLINE" className={isDarkMode ? 'bg-slate-900' : ''}>ONLINE</option>
                  <option value="BANK_TRANSFER" className={isDarkMode ? 'bg-slate-900' : ''}>BANK TRANSFER</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold opacity-80">Online:</span>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={formData.onlinePayAmount}
                  onChange={(e) => setFormData({ ...formData, onlinePayAmount: e.target.value.replace(/[^0-9.]/g, '') })}
                  className={`w-24 sm:w-28 rounded-lg px-2 py-1 text-right font-mono font-semibold ${inputClass}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold opacity-80">Advance:</span>
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={formData.advanceAmount}
                  onChange={(e) => setFormData({ ...formData, advanceAmount: e.target.value.replace(/[^0-9.]/g, '') })}
                  className={`w-24 sm:w-28 rounded-lg px-2 py-1 text-right font-mono text-blue-800 dark:text-sky-400 font-bold ${inputClass}`}
                />
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-slate-400/20">
                <span className="text-blue-800 dark:text-sky-400 font-black">Bal.Amt:</span>
                <span className="font-mono font-bold text-blue-800 dark:text-sky-400 text-sm">₹ {formData.balanceAmount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-400/20">
                <div>
                  <span className="text-[10px] opacity-70 font-bold block mb-0.5">Delivery Date:</span>
                  <input 
                    type="date" 
                    value={formData.deliveryDate ? formData.deliveryDate.substring(0, 10) : ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className={`w-full rounded-lg px-1.5 py-1 text-[10px] sm:text-[11px] font-mono font-semibold ${inputClass}`}
                  />
                </div>
                <div>
                  <span className="text-[10px] opacity-70 font-bold block mb-0.5">Reminder Date:</span>
                  <input 
                    type="date" 
                    value={formData.reminderDate ? formData.reminderDate.substring(0, 10) : ''}
                    onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                    className={`w-full rounded-lg px-1.5 py-1 text-[10px] sm:text-[11px] font-mono font-semibold ${inputClass}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


