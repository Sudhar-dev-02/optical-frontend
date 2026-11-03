import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Phone, 
  Lock, 
  Trash2, 
  User, 
  GraduationCap, 
  AlertCircle, 
  Edit, 
  X, 
  Save,
  Building2,
  Store,
  Plus,
  Check
} from 'lucide-react';

export default function StaffSetupPage({ 
  registeredStaff = [], 
  branches = ['Optics India', 'Ayncare'],
  onAddBranch,
  onEditBranch,
  onDeleteBranch,
  onAddStaff, 
  onDeleteStaff, 
  onUpdateStaff,
  isDarkMode 
}) {
  // New Staff Registration State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [qualification, setQualification] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [role, setRole] = useState('Salesperson');
  const [branch, setBranch] = useState(branches[0] || 'Optics India');
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState(null);

  // New Branch Management State
  const [newBranchInput, setNewBranchInput] = useState('');
  const [showAddBranchCard, setShowAddBranchCard] = useState(false);
  const [branchMsg, setBranchMsg] = useState(null);

  // Edit / Delete Branch Management State
  const [editingBranch, setEditingBranch] = useState(null);
  const [editBranchName, setEditBranchName] = useState('');
  const [confirmDeleteBranch, setConfirmDeleteBranch] = useState(null);

  // Edit Staff Profile Modal State
  const [editingStaff, setEditingStaff] = useState(null);

  const handleStartEditBranch = (branchName) => {
    setEditingBranch(branchName);
    setEditBranchName(branchName);
  };

  const handleSaveEditBranch = (oldName) => {
    if (!editBranchName.trim()) {
      alert('Branch name cannot be empty.');
      return;
    }
    if (onEditBranch) {
      const success = onEditBranch(oldName, editBranchName.trim());
      if (success) {
        if (branch.toLowerCase() === oldName.toLowerCase()) {
          setBranch(editBranchName.trim());
        }
        setEditingBranch(null);
        setEditBranchName('');
      }
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteBranch && onDeleteBranch) {
      const deletedName = confirmDeleteBranch;
      const success = onDeleteBranch(deletedName);
      if (success) {
        if (branch.toLowerCase() === deletedName.toLowerCase()) {
          setBranch('Optics India');
        }
      }
      setConfirmDeleteBranch(null);
    }
  };

  const handleCreateBranch = (e) => {
    if (e) e.preventDefault();
    setBranchMsg(null);
    if (!newBranchInput.trim()) {
      setBranchMsg({ type: 'error', text: 'Please enter a branch name.' });
      return;
    }
    if (onAddBranch) {
      const success = onAddBranch(newBranchInput.trim());
      if (success) {
        setBranch(newBranchInput.trim());
        setBranchMsg({ type: 'success', text: `Branch "${newBranchInput.trim()}" added successfully!` });
        setNewBranchInput('');
        setShowAddBranchCard(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMsg(null);

    const cleanedName = name.trim();
    const cleanedPhone = phone.replace(/\D/g, '');
    const cleanedEmergencyPhone = emergencyPhone.replace(/\D/g, '');

    if (!cleanedName) {
      setMsg({ type: 'error', text: 'Please enter staff member name.' });
      return;
    }

    if (!cleanedPhone || cleanedPhone.length !== 10) {
      setMsg({ type: 'error', text: 'Please enter a valid 10-digit mobile phone number.' });
      return;
    }

    if (!pin || pin.length !== 4) {
      setMsg({ type: 'error', text: 'Please enter a 4-digit PIN.' });
      return;
    }

    // Check duplicate phone
    if (registeredStaff.some(s => s.phone === cleanedPhone)) {
      setMsg({ type: 'error', text: 'Staff member with this mobile number is already registered!' });
      return;
    }

    const newStaffMember = {
      id: Date.now().toString(),
      name: cleanedName,
      phone: cleanedPhone,
      emergencyPhone: cleanedEmergencyPhone,
      qualification: qualification.trim(),
      age: age.trim(),
      gender,
      role: role.toLowerCase(),
      branch: (branch || 'Optics India').trim(),
      address: address.trim(),
      pin,
      createdAt: new Date().toISOString()
    };

    onAddStaff(newStaffMember);

    // Reset Form
    setName('');
    setPhone('');
    setEmergencyPhone('');
    setQualification('');
    setAge('');
    setGender('Male');
    setRole('Salesperson');
    setBranch(branches[0] || 'Optics India');
    setAddress('');
    setPin('');
    setMsg({ 
      type: 'success', 
      text: `Staff member "${cleanedName}" assigned to "${branch || 'Optics India'}" registered successfully! Login Phone: ${cleanedPhone} & PIN: ${pin}.` 
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    if (!editingStaff.name || !editingStaff.name.trim()) {
      alert('Please enter staff name.');
      return;
    }

    const cleanedPhone = editingStaff.phone.replace(/\D/g, '');
    if (!cleanedPhone || cleanedPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!editingStaff.pin || editingStaff.pin.length !== 4) {
      alert('Please enter a 4-digit PIN.');
      return;
    }

    if (onUpdateStaff) {
      onUpdateStaff({
        ...editingStaff,
        branch: (editingStaff.branch || 'Optics India').trim(),
        phone: cleanedPhone,
        emergencyPhone: (editingStaff.emergencyPhone || '').replace(/\D/g, '')
      });
    }

    setEditingStaff(null);
  };

  const panelClass = isDarkMode ? 'glass-panel-dark' : 'glass-panel-light';
  const inputClass = isDarkMode ? 'glass-input-dark text-slate-100' : 'glass-input-light text-slate-900';
  const labelClass = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl`}>
        <div className="flex items-center justify-between border-b border-slate-400/20 pb-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-[#D4AF37]" /> Staff & Login Setup Manager
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Register & Manage Staff Profiles (Name, Phone, Emergency Contact, Qualification, Age, Address & Login PIN)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/30 border border-[#0B2D5B]/20 text-[#0B2D5B] dark:text-[#D4AF37]">
              Admin Control Panel
            </span>
          </div>
        </div>

        {/* Register Staff Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-semibold">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 1) Staff Full Name */}
            <div className="flex flex-col gap-1">
              <label className={`${labelClass} font-bold`}>1) *Staff Full Name:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl pl-9 pr-3 py-2 font-semibold ${inputClass}`}
                />
              </div>
            </div>

            {/* 2) Phone Number (Login ID) */}
            <div className="flex flex-col gap-1">
              <label className={`${labelClass} font-bold`}>2) *Mobile Number (Login ID):</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full rounded-xl pl-9 pr-3 py-2 font-mono font-bold ${inputClass}`}
                />
              </div>
            </div>

            {/* 3) Emergency Contact Number */}
            <div className="flex flex-col gap-1">
              <label className={`${labelClass} font-bold`}>3) Emergency Contact No:</label>
              <div className="relative">
                <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Emergency contact mobile"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value.replace(/\D/g, ''))}
                  className={`w-full rounded-xl pl-9 pr-3 py-2 font-mono font-semibold ${inputClass}`}
                />
              </div>
            </div>

            {/* 4) Qualification */}
            <div className="flex flex-col gap-1">
              <label className={`${labelClass} font-bold`}>4) Qualification:</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                <input
                  type="text"
                  placeholder="e.g. B.Optom / Diploma in Optometry"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className={`w-full rounded-xl pl-9 pr-3 py-2 font-semibold ${inputClass}`}
                />
              </div>
            </div>

            {/* 5) Age & Gender */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>5) Age:</label>
                <input
                  type="text"
                  placeholder="Age"
                  maxLength={3}
                  value={age}
                  onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
                  className={`w-full rounded-xl px-3 py-2 font-mono font-semibold ${inputClass}`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                >
                  <option value="Male" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Male</option>
                  <option value="Female" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Female</option>
                  <option value="Other" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Other</option>
                </select>
              </div>
            </div>

            {/* 6) Staff Role & PIN */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>Role:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                >
                  <option value="Salesperson" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Salesperson</option>
                  <option value="Optometrist" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Optometrist</option>
                  <option value="Store Manager" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Store Manager</option>
                  <option value="Admin" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>*Login PIN (4-digit):</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="e.g. 1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    className={`w-full rounded-xl pl-9 pr-3 py-2 font-mono font-bold ${inputClass}`}
                  />
                </div>
              </div>
            </div>

            {/* 7) Staff Assigned Branch */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className={`${labelClass} font-bold flex items-center gap-1`}>
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" /> *Store Branch:
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddBranchCard(prev => !prev)}
                  className="text-[10px] font-bold text-sky-500 hover:text-sky-400 flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Branch
                </button>
              </div>
              <div className="relative">
                <select
                  value={branch}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setShowAddBranchCard(true);
                    } else {
                      setBranch(e.target.value);
                    }
                  }}
                  className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                >
                  {branches.map(b => (
                    <option 
                      key={b} 
                      value={b} 
                      style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                    >
                      {b}
                    </option>
                  ))}
                  <option 
                    value="__NEW__" 
                    className="text-sky-500 font-bold"
                    style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: '#0284c7' }}
                  >
                    + Add New Branch...
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Add Branch Inline Card */}
          {showAddBranchCard && (
            <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-center gap-2 animate-in fade-in duration-200 ${
              isDarkMode ? 'bg-[#0B2D5B]/30 border-[#D4AF37]/40' : 'bg-[#0B2D5B]/5 border-[#0B2D5B]/20'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs shrink-0 text-[#0B2D5B] dark:text-[#D4AF37]">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Create New Branch:</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Ayncare Anna Nagar"
                value={newBranchInput}
                onChange={(e) => setNewBranchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateBranch(e); }}
                className={`flex-1 w-full rounded-lg px-3 py-1.5 text-xs font-semibold ${inputClass}`}
              />
              <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCreateBranch}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:brightness-110 text-[#061833] font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Branch
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBranchCard(false)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-400/30 text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {branchMsg && (
            <div className={`p-2.5 rounded-xl border text-xs font-semibold ${
              branchMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {branchMsg.text}
            </div>
          )}

          {/* Address Line */}
          <div className="flex flex-col gap-1">
            <label className={`${labelClass} font-bold`}>7) Residential Address:</label>
            <input
              type="text"
              placeholder="Full Street / City Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:brightness-110 text-[#061833] font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4 text-[#061833]" />
              <span>Add Salesperson Staff</span>
            </button>
          </div>
        </form>

        {/* Feedback Message */}
        {msg && (
          <div className={`mt-3 p-3 rounded-xl border text-xs font-semibold ${
            msg.type === 'success' ? 'bg-[#0B2D5B]/10 border-[#0B2D5B]/30 text-[#0B2D5B] dark:text-[#D4AF37]' : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-300'
          }`}>
            {msg.text}
          </div>
        )}
      </div>

      {/* Active Store Branches Bar */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-400/20 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0B2D5B] dark:text-[#D4AF37]">
                Store Branches & Locations ({branches.length})
              </h2>
              <p className="text-[11px] opacity-70">
                Staff and sales entries are segregated by branch across Dashboard, Reports, and Follow-Up
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBranchCard(prev => !prev)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#D4AF37]/50 bg-[#0B2D5B] text-[#D4AF37] hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Add New Branch</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {branches.map(b => {
            const staffCount = registeredStaff.filter(s => (s.branch || 'Optics India').toLowerCase() === b.toLowerCase()).length;
            const isEditingThis = editingBranch === b;
            const isHq = b.toLowerCase() === 'optics india';

            return (
              <div
                key={b}
                className={`group px-3.5 py-2.5 rounded-2xl text-xs font-bold border flex items-center gap-2.5 transition-all shadow-xs ${
                  isDarkMode 
                    ? 'bg-[#061833] border-[#0B2D5B]/70 text-slate-200 hover:border-[#D4AF37]/50' 
                    : 'bg-white border-[#0B2D5B]/20 text-[#0B2D5B] hover:border-[#D4AF37]/50 hover:shadow-sm'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                  <Store className="w-4 h-4" />
                </div>

                {isEditingThis ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={editBranchName}
                      onChange={(e) => setEditBranchName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditBranch(b);
                        if (e.key === 'Escape') setEditingBranch(null);
                      }}
                      className="px-2 py-1 text-xs font-bold rounded-lg border outline-none bg-white text-slate-900 border-[#D4AF37] ring-1 ring-[#D4AF37]/50 w-36"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEditBranch(b)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                      title="Save branch name"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBranch(null)}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2.5 min-w-[130px]">
                    <div>
                      <div className="font-extrabold text-[12px] flex items-center gap-1.5">
                        <span>{b}</span>
                        {isHq && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] font-black uppercase tracking-wider">
                            HQ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-70 font-mono">
                        {isHq ? `${staffCount + 2} staff` : `${staffCount} staff`}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 ml-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditBranch(b)}
                        className="p-1 rounded-lg hover:bg-[#D4AF37]/20 text-[#D4AF37] hover:brightness-110 transition-all cursor-pointer"
                        title={`Rename "${b}" branch`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {!isHq && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteBranch(b)}
                          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-500 hover:text-rose-600 transition-all cursor-pointer"
                          title={`Delete "${b}" branch`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Registered Staff List */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-400/20 pb-2">
          <h2 className="text-sm sm:text-base font-bold flex items-center gap-2 text-[#0B2D5B] dark:text-[#D4AF37]">
            <Shield className="w-4 h-4 text-[#D4AF37]" /> Registered Staff Directory ({registeredStaff.length + 2})
          </h2>
          <span className="text-[11px] opacity-70 font-semibold">Admin & Salesperson Directory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Default Primary Admin Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#0B2D5B]/20 border-[#D4AF37]/30' : 'bg-[#0B2D5B]/5 border-[#0B2D5B]/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#D4AF37]" /> Admin (Primary)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#0B2D5B] dark:text-[#D4AF37] font-extrabold text-[10px]">
                SYSTEM ADMIN
              </span>
            </div>
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                <Building2 className="w-3 h-3 text-[#D4AF37]" /> Branch: Optics India (HQ)
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Name: <strong>Optics India Admin</strong></div>
              <div>Phone: <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">+91 733 933 4042</strong></div>
              <div>PIN: <strong>**** (1234)</strong></div>
            </div>
          </div>

          {/* Default Demo Salesperson Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-[#0B2D5B]/20 border-[#D4AF37]/30' : 'bg-[#0B2D5B]/5 border-[#0B2D5B]/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#D4AF37]" /> Default Salesperson
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#0B2D5B] dark:text-[#D4AF37] font-extrabold text-[10px]">
                SALES EXECUTIVE
              </span>
            </div>
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                <Building2 className="w-3 h-3 text-[#D4AF37]" /> Branch: Optics India
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Name: <strong>Sales Staff Demo</strong></div>
              <div>Phone: <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">+91 9123456789</strong></div>
              <div>PIN: <strong>**** (1111)</strong></div>
            </div>
          </div>

          {/* Registered Custom Staff Members */}
          {registeredStaff.map((staff) => (
            <div
              key={staff.id}
              className={`p-4 rounded-2xl border transition-all relative group space-y-2.5 ${
                isDarkMode ? 'bg-[#061833]/80 border-[#0B2D5B]/40 hover:border-[#D4AF37]/40' : 'bg-white border-[#0B2D5B]/20 hover:border-[#D4AF37]/40'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-400/20 pb-2">
                <span className="font-extrabold text-[#0B2D5B] dark:text-[#D4AF37] flex items-center gap-1.5 text-sm">
                  <User className="w-4 h-4 text-[#D4AF37]" /> {staff.name}
                </span>
                <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/30 border border-[#0B2D5B]/20 text-[#0B2D5B] dark:text-[#D4AF37]">
                  {staff.role || 'Salesperson'}
                </span>
              </div>

              {/* Branch Pill */}
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                  <Building2 className="w-3 h-3 text-[#D4AF37]" /> Branch: {staff.branch || 'Optics India'}
                </span>
              </div>

              {/* Staff Profile Details Display */}
              <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="opacity-70">Mobile Login:</span>
                  <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">+91 {staff.phone}</strong>
                </div>
                {staff.emergencyPhone && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Emergency Contact:</span>
                    <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">+91 {staff.emergencyPhone}</strong>
                  </div>
                )}
                {staff.qualification && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Qualification:</span>
                    <strong className="text-[#0B2D5B] dark:text-[#D4AF37]">{staff.qualification}</strong>
                  </div>
                )}
                {staff.age && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Age:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{staff.age} yrs</strong>
                  </div>
                )}
                {staff.gender && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Gender:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{staff.gender}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Assigned Branch:</span>
                  <strong className="text-sky-600 dark:text-sky-400 font-bold">{staff.branch || 'Optics India'}</strong>
                </div>
                {staff.address && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Address:</span>
                    <strong className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{staff.address}</strong>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-400/10 pt-1">
                  <span className="opacity-70">Login PIN:</span>
                  <strong>**** ({staff.pin})</strong>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-400/20">
                <button
                  type="button"
                  onClick={() => setEditingStaff(staff)}
                  className="py-1 px-2 rounded-xl bg-[#0B2D5B]/10 dark:bg-[#0B2D5B]/30 border border-[#0B2D5B]/30 hover:bg-[#0B2D5B] text-[#0B2D5B] dark:text-[#D4AF37] hover:text-[#D4AF37] font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3 h-3 text-[#D4AF37]" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteStaff(staff.id)}
                  className="py-1 px-2 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Staff Profile Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${panelClass} max-w-lg w-full p-5 sm:p-6 rounded-3xl shadow-2xl border border-[#D4AF37]/30 space-y-4 animate-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between border-b border-slate-400/20 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2 text-[#0B2D5B] dark:text-[#D4AF37]">
                <Edit className="w-5 h-5 text-[#D4AF37]" /> Edit Staff Profile: {editingStaff.name}
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1 rounded-xl bg-slate-500/20 hover:bg-slate-500/40 text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Edit Name */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Staff Full Name:</label>
                  <input
                    type="text"
                    value={editingStaff.name || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                  />
                </div>

                {/* Edit Phone */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Mobile Number (Login ID):</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editingStaff.phone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value.replace(/\D/g, '') })}
                    className={`w-full rounded-xl px-3 py-2 font-mono font-bold ${inputClass}`}
                  />
                </div>

                {/* Edit Emergency Phone */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Emergency Contact No:</label>
                  <input
                    type="text"
                    maxLength={10}
                    value={editingStaff.emergencyPhone || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, emergencyPhone: e.target.value.replace(/\D/g, '') })}
                    className={`w-full rounded-xl px-3 py-2 font-mono font-semibold ${inputClass}`}
                  />
                </div>

                {/* Edit Qualification */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Qualification:</label>
                  <input
                    type="text"
                    value={editingStaff.qualification || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, qualification: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                  />
                </div>

                {/* Edit Age */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Age:</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editingStaff.age || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, age: e.target.value.replace(/\D/g, '') })}
                    className={`w-full rounded-xl px-3 py-2 font-mono font-semibold ${inputClass}`}
                  />
                </div>

                {/* Edit Gender */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Gender:</label>
                  <select
                    value={editingStaff.gender || 'Male'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, gender: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                  >
                    <option value="Male" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Male</option>
                    <option value="Female" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Female</option>
                    <option value="Other" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Other</option>
                  </select>
                </div>

                {/* Edit Role */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>Role:</label>
                  <select
                    value={editingStaff.role ? (editingStaff.role.charAt(0).toUpperCase() + editingStaff.role.slice(1)) : 'Salesperson'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value.toLowerCase() })}
                    className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                  >
                    <option value="Salesperson" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Salesperson</option>
                    <option value="Optometrist" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Optometrist</option>
                    <option value="Store Manager" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Store Manager</option>
                    <option value="Admin" style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>Admin</option>
                  </select>
                </div>

                {/* Edit PIN */}
                <div className="flex flex-col gap-1">
                  <label className={`${labelClass} font-bold`}>4-Digit Setup PIN:</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editingStaff.pin || ''}
                    onChange={(e) => setEditingStaff({ ...editingStaff, pin: e.target.value.replace(/\D/g, '') })}
                    className={`w-full rounded-xl px-3 py-2 font-mono font-bold ${inputClass}`}
                  />
                </div>

                {/* Edit Branch */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className={`${labelClass} font-bold flex items-center gap-1`}>
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Assigned Store Branch:
                  </label>
                  <select
                    value={editingStaff.branch || 'Optics India'}
                    onChange={(e) => setEditingStaff({ ...editingStaff, branch: e.target.value })}
                    className={`w-full rounded-xl px-3 py-2 font-semibold ${inputClass}`}
                  >
                    {branches.map(b => (
                      <option 
                        key={b} 
                        value={b} 
                        style={{ backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', color: isDarkMode ? '#f8fafc' : '#0f172a' }}
                      >
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Edit Address */}
              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>Address:</label>
                <input
                  type="text"
                  value={editingStaff.address || ''}
                  onChange={(e) => setEditingStaff({ ...editingStaff, address: e.target.value })}
                  className={`w-full rounded-xl px-3 py-2 font-medium ${inputClass}`}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-400/20">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="py-2 px-4 rounded-xl bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:brightness-110 text-[#061833] font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#061833]" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Branch Confirmation Modal */}
      {confirmDeleteBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className={`p-5 rounded-2xl max-w-sm w-full border shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-[#061833] border-[#0B2D5B] text-slate-100' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-rose-600 dark:text-rose-400">Delete Store Branch?</h3>
                <p className="text-xs opacity-80 mt-0.5">
                  Are you sure you want to remove <strong className="text-slate-900 dark:text-slate-100">"{confirmDeleteBranch}"</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              ⚠️ Any staff members or billing records previously under this branch will be safely reassigned to <strong>Optics India</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDeleteBranch(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-400/30 hover:bg-slate-500/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
