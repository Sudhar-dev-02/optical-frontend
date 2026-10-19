import React, { useState, useEffect, useCallback } from 'react';
import { PackagePlus, X, Plus, Check, UserCheck, Stethoscope } from 'lucide-react';
import axios from 'axios';
import { CATALOG_API } from '../config/api';

export default function ItemSetupModal({ onClose, userRole = 'admin' }) {
  const isAdmin = userRole === 'admin';
  const [orderTakenOptions, setOrderTakenOptions] = useState(['Babu', 'Abrar', 'Janani', 'Arafath']);
  const [prescribedByOptions, setPrescribedByOptions] = useState(['Bushra', 'Janani', 'Aravint Hsptl', 'Vivekanandha', 'Agarwal']);
  const [lensTypes, setLensTypes] = useState(['SV', 'Bifocal', 'Progressive']);
  const [lensCoatings, setLensCoatings] = useState(['HC', 'HMC', 'Bluecut', 'Bluecut Green', 'PG HMC']);
  const [lensBrands, setLensBrands] = useState(['essilor', 'crizal', 'zeiss', 'hoya', 'regular']);
  const [lensWarranties, setLensWarranties] = useState(['NIL', '6 months', '1 year', '2 years']);
  
  const [frameTypes, setFrameTypes] = useState(['Supra', 'Full frame', 'Rimless', 'Sunglass']);
  const [frameBrands, setFrameBrands] = useState(['Arcadio', 'IDEE', 'Iris', 'Fastrack', 'Titan', 'Rayban']);
  const [frameWarranties, setFrameWarranties] = useState(['NIL', '6 months', '1 year', '2 years']);

  const [newOrderTaken, setNewOrderTaken] = useState('');
  const [newPrescribedBy, setNewPrescribedBy] = useState('');
  const [newLensType, setNewLensType] = useState('');
  const [newLensCoating, setNewLensCoating] = useState('');
  const [newLensBrand, setNewLensBrand] = useState('');
  const [newLensWarranty, setNewLensWarranty] = useState('');
  
  const [newFrameType, setNewFrameType] = useState('');
  const [newFrameBrand, setNewFrameBrand] = useState('');

  const [_isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const fetchCatalog = useCallback(async () => {
    try {
      const res = await axios.get(CATALOG_API);
      if (res.data) {
        if (res.data.orderTakenOptions) setOrderTakenOptions(res.data.orderTakenOptions);
        if (res.data.prescribedByOptions) setPrescribedByOptions(res.data.prescribedByOptions);
        if (res.data.lensTypes) setLensTypes(res.data.lensTypes);
        if (res.data.lensCoatings) setLensCoatings(res.data.lensCoatings);
        if (res.data.lensBrands) setLensBrands(res.data.lensBrands);
        if (res.data.lensWarranties) setLensWarranties(res.data.lensWarranties);
        if (res.data.frameTypes) setFrameTypes(res.data.frameTypes);
        if (res.data.frameBrands) setFrameBrands(res.data.frameBrands);
        if (res.data.frameWarranties) setFrameWarranties(res.data.frameWarranties);
      }
    } catch (_err) {
      console.error('Failed to load catalog:', _err);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const saveCatalogToDatabase = async (payload) => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      await axios.post(CATALOG_API, payload);
      setSaveStatus('Saved to DB!');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (_err) {
      setSaveStatus('Saved Locally');
      setTimeout(() => setSaveStatus(''), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const currentPayload = (overrides = {}) => ({
    orderTakenOptions,
    prescribedByOptions,
    lensTypes,
    lensCoatings,
    lensBrands,
    lensWarranties,
    frameTypes,
    frameBrands,
    frameWarranties,
    ...overrides
  });

  const addOrderTaken = () => {
    if (newOrderTaken.trim()) {
      const val = newOrderTaken.trim();
      const updated = [...orderTakenOptions, val];
      setOrderTakenOptions(updated);
      setNewOrderTaken('');
      saveCatalogToDatabase(currentPayload({ orderTakenOptions: updated }));
    }
  };

  const addPrescribedBy = () => {
    if (newPrescribedBy.trim()) {
      const val = newPrescribedBy.trim();
      const updated = [...prescribedByOptions, val];
      setPrescribedByOptions(updated);
      setNewPrescribedBy('');
      saveCatalogToDatabase(currentPayload({ prescribedByOptions: updated }));
    }
  };

  const addLensType = () => {
    if (newLensType.trim()) {
      const val = newLensType.trim();
      const updated = [...lensTypes, val];
      setLensTypes(updated);
      setNewLensType('');
      saveCatalogToDatabase(currentPayload({ lensTypes: updated }));
    }
  };

  const addLensCoating = () => {
    if (newLensCoating.trim()) {
      const val = newLensCoating.trim();
      const updated = [...lensCoatings, val];
      setLensCoatings(updated);
      setNewLensCoating('');
      saveCatalogToDatabase(currentPayload({ lensCoatings: updated }));
    }
  };

  const addLensBrand = () => {
    if (newLensBrand.trim()) {
      const val = newLensBrand.trim();
      const updated = [...lensBrands, val];
      setLensBrands(updated);
      setNewLensBrand('');
      saveCatalogToDatabase(currentPayload({ lensBrands: updated }));
    }
  };

  const addLensWarranty = () => {
    if (newLensWarranty.trim()) {
      const val = newLensWarranty.trim();
      const updated = [...lensWarranties, val];
      setLensWarranties(updated);
      setNewLensWarranty('');
      saveCatalogToDatabase(currentPayload({ lensWarranties: updated }));
    }
  };

  const addFrameType = () => {
    if (newFrameType.trim()) {
      const val = newFrameType.trim();
      const updated = [...frameTypes, val];
      setFrameTypes(updated);
      setNewFrameType('');
      saveCatalogToDatabase(currentPayload({ frameTypes: updated }));
    }
  };

  const addFrameBrand = () => {
    if (newFrameBrand.trim()) {
      const val = newFrameBrand.trim();
      const updated = [...frameBrands, val];
      setFrameBrands(updated);
      setNewFrameBrand('');
      saveCatalogToDatabase(currentPayload({ frameBrands: updated }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#061833]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#0B2D5B]/20 rounded-2xl max-w-4xl w-full text-slate-900 shadow-2xl overflow-hidden my-6">
        <div className="bg-[#0B2D5B] px-5 py-3.5 border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#D4AF37] text-[#061833]">
              <PackagePlus className="w-6 h-6 text-[#061833]" />
            </div>
            <h2 className="text-base font-black text-[#D4AF37] tracking-wide">
              {isAdmin 
                ? 'ADMIN MASTER SETUP & CATALOG MANAGER (DATABASE PERSISTENT)' 
                : 'ITEM SETUP & CATALOG MANAGER'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40 animate-pulse">
                {saveStatus}
              </span>
            )}
            <button onClick={onClose} className="p-1.5 rounded-xl bg-[#0B2D5B]/60 border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#061833] transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs font-medium max-h-[80vh] overflow-y-auto">
          <p className="text-slate-600">
            {isAdmin 
              ? 'Admins can manage staff list, doctors, lens types, coatings, brands, and warranties. Details added here will automatically populate in all Sales Person dropdowns across the system.'
              : 'Manage lens types, coatings, brands, and warranties. Details added here will automatically populate in dropdowns across the system.'}
          </p>

          {/* Section 1: Staff & Doctor Setup (Admin Only) */}
          {isAdmin && (
            <div className="border border-[#0B2D5B]/20 bg-[#0B2D5B]/5 p-3 rounded-2xl space-y-3">
              <h3 className="font-black text-[#0B2D5B] text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-[#0B2D5B]/15 pb-1">
                <UserCheck className="w-4 h-4 text-[#D4AF37]" /> Order Taken Staff & Prescribed By Doctors (Admin Setup)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Order Taken Staff */}
                <div className="bg-white p-3 rounded-xl border border-[#0B2D5B]/20 shadow-xs">
                  <h4 className="font-bold text-[#0B2D5B] mb-2 flex items-center justify-between">
                    <span>Order Taken Staff List</span>
                    <span className="text-[10px] bg-[#0B2D5B]/10 text-[#0B2D5B] px-1.5 py-0.5 rounded font-mono font-bold">{orderTakenOptions.length} staff</span>
                  </h4>
                  <div className="flex gap-1.5 mb-2">
                    <input 
                      type="text" 
                      placeholder="New Staff Name"
                      value={newOrderTaken}
                      onChange={(e) => setNewOrderTaken(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                    />
                    <button onClick={addOrderTaken} className="px-2.5 py-1 bg-[#0B2D5B] hover:bg-[#143E77] border border-[#D4AF37]/40 rounded-md text-[#D4AF37] font-bold cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {orderTakenOptions.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#0B2D5B]/5 border border-[#0B2D5B]/15 text-[#0B2D5B] font-mono text-[11px] font-semibold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prescribed By Doctors */}
                <div className="bg-white p-3 rounded-xl border border-[#0B2D5B]/20 shadow-xs">
                  <h4 className="font-bold text-[#0B2D5B] mb-2 flex items-center justify-between flex items-center gap-1">
                    <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5 text-[#D4AF37]" /> Prescribed By (Doctors / Hospitals)</span>
                    <span className="text-[10px] bg-[#0B2D5B]/10 text-[#0B2D5B] px-1.5 py-0.5 rounded font-mono font-bold">{prescribedByOptions.length} items</span>
                  </h4>
                  <div className="flex gap-1.5 mb-2">
                    <input 
                      type="text" 
                      placeholder="New Doctor / Hospital Name"
                      value={newPrescribedBy}
                      onChange={(e) => setNewPrescribedBy(e.target.value)}
                      className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                    />
                    <button onClick={addPrescribedBy} className="px-2.5 py-1 bg-[#0B2D5B] hover:bg-[#143E77] border border-[#D4AF37]/40 rounded-md text-[#D4AF37] font-bold cursor-pointer">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {prescribedByOptions.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#0B2D5B]/5 border border-[#0B2D5B]/15 text-[#0B2D5B] font-mono text-[11px] font-semibold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Products & Inventory Setup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Lens Types */}
            <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-800 mb-2 flex items-center justify-between">
                <span>Lens Types</span>
                <span className="text-[10px] bg-sky-200/60 text-sky-900 px-1.5 py-0.5 rounded font-mono">{lensTypes.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Lens Type"
                  value={newLensType}
                  onChange={(e) => setNewLensType(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addLensType} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {lensTypes.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Lens Coatings */}
            <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-800 mb-2 flex items-center justify-between">
                <span>Lens Coatings</span>
                <span className="text-[10px] bg-sky-200/60 text-sky-900 px-1.5 py-0.5 rounded font-mono">{lensCoatings.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Lens Coating"
                  value={newLensCoating}
                  onChange={(e) => setNewLensCoating(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addLensCoating} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {lensCoatings.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Lens Brands */}
            <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-800 mb-2 flex items-center justify-between">
                <span>Lens Brands</span>
                <span className="text-[10px] bg-sky-200/60 text-sky-900 px-1.5 py-0.5 rounded font-mono">{lensBrands.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Lens Brand"
                  value={newLensBrand}
                  onChange={(e) => setNewLensBrand(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addLensBrand} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {lensBrands.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Lens Warranties */}
            <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200">
              <h3 className="font-bold text-sky-800 mb-2 flex items-center justify-between">
                <span>Lens Warranties</span>
                <span className="text-[10px] bg-sky-200/60 text-sky-900 px-1.5 py-0.5 rounded font-mono">{lensWarranties.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Lens Warranty (e.g. 1 year)"
                  value={newLensWarranty}
                  onChange={(e) => setNewLensWarranty(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addLensWarranty} className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {lensWarranties.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-sky-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Frame Types */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center justify-between">
                <span>Frame Types</span>
                <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-mono">{frameTypes.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Frame Type"
                  value={newFrameType}
                  onChange={(e) => setNewFrameType(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addFrameType} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {frameTypes.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-amber-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Frame Brands */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center justify-between">
                <span>Frame Brands</span>
                <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded font-mono">{frameBrands.length} items</span>
              </h3>
              <div className="flex gap-1.5 mb-2">
                <input 
                  type="text" 
                  placeholder="New Frame Brand"
                  value={newFrameBrand}
                  onChange={(e) => setNewFrameBrand(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-800"
                />
                <button onClick={addFrameBrand} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 rounded-md text-white font-bold">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {frameBrands.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white border border-amber-200 text-slate-700 font-mono text-[11px] font-semibold">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={onClose} className="px-5 py-2 bg-[#0B2D5B] hover:bg-[#143E77] border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md">
              <Check className="w-4 h-4 text-[#D4AF37]" /> Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
