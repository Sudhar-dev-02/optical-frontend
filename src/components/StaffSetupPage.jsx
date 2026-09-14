import React, { useState } from 'react';
import { 
  UserPlus, 
  Shield, 
  Phone, 
  Lock, 
  Trash2, 
  User, 
  MapPin, 
  GraduationCap, 
  AlertCircle, 
  Calendar,
  Sparkles,
  Edit,
  X,
  CheckCircle2,
  Save
} from 'lucide-react';

export default function StaffSetupPage({ 
  registeredStaff = [], 
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
  const [address, setAddress] = useState('');
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState(null);

  // Edit Staff Profile Modal State
  const [editingStaff, setEditingStaff] = useState(null);

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
      address: address.trim(),
      pin,
      role: role.toLowerCase(),
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
    setAddress('');
    setPin('');
    setMsg({ 
      type: 'success', 
      text: `Staff member "${cleanedName}" registered successfully! They can now log in using Phone ${cleanedPhone} & PIN ${pin}.` 
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
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-800 via-blue-600 to-indigo-700 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-blue-700 dark:text-sky-400" /> Staff & Login Setup Manager
            </h1>
            <p className={`text-xs font-semibold mt-0.5 ${labelClass}`}>
              Register & Manage Staff Profiles (Name, Phone, Emergency Contact, Qualification, Age, Address & Login PIN)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-blue-50 dark:bg-sky-500/15 border border-blue-200 dark:border-sky-500/30 text-blue-800 dark:text-sky-400">
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
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-sky-400" />
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
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-sky-400" />
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
                <AlertCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-sky-400" />
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
                <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-sky-400" />
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
                  <option value="Male" className={isDarkMode ? 'bg-slate-900' : ''}>Male</option>
                  <option value="Female" className={isDarkMode ? 'bg-slate-900' : ''}>Female</option>
                  <option value="Other" className={isDarkMode ? 'bg-slate-900' : ''}>Other</option>
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
                  <option value="Salesperson" className={isDarkMode ? 'bg-slate-900' : ''}>Salesperson</option>
                  <option value="Optometrist" className={isDarkMode ? 'bg-slate-900' : ''}>Optometrist</option>
                  <option value="Store Manager" className={isDarkMode ? 'bg-slate-900' : ''}>Store Manager</option>
                  <option value="Admin" className={isDarkMode ? 'bg-slate-900' : ''}>Admin</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`${labelClass} font-bold`}>*Login PIN (4-digit):</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-700 dark:text-sky-400" />
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
          </div>

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
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:brightness-110 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Salesperson Staff</span>
            </button>
          </div>
        </form>

        {/* Feedback Message */}
        {msg && (
          <div className={`mt-3 p-3 rounded-xl border text-xs font-semibold ${
            msg.type === 'success' ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-sky-500/15 dark:border-sky-500/40 dark:text-sky-400' : 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-sky-950/80 dark:border-sky-800 dark:text-sky-300'
          }`}>
            {msg.text}
          </div>
        )}
      </div>

      {/* Registered Staff List */}
      <div className={`${panelClass} p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3`}>
        <div className="flex items-center justify-between border-b border-slate-400/20 pb-2">
          <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-700 dark:text-sky-400" /> Registered Staff Directory ({registeredStaff.length + 2})
          </h2>
          <span className="text-[11px] opacity-70 font-semibold">Admin & Salesperson Directory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Default Primary Admin Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-sky-950/40 border-sky-800/40' : 'bg-blue-50/80 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-blue-800 dark:text-sky-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-700 dark:text-sky-400" /> Admin (Primary)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-sky-500/20 text-blue-900 dark:text-sky-300 font-extrabold text-[10px]">
                SYSTEM ADMIN
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Name: <strong>Optics India Admin</strong></div>
              <div>Phone: <strong className="text-blue-800 dark:text-sky-400">+91 733 933 4042</strong></div>
              <div>PIN: <strong>**** (1234)</strong></div>
            </div>
          </div>

          {/* Default Demo Salesperson Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isDarkMode ? 'bg-sky-950/40 border-sky-800/40' : 'bg-blue-50/80 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-extrabold text-blue-800 dark:text-sky-400 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-700 dark:text-sky-400" /> Default Salesperson
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-sky-500/20 text-blue-900 dark:text-sky-300 font-extrabold text-[10px]">
                SALES EXECUTIVE
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div>Name: <strong>Sales Staff Demo</strong></div>
              <div>Phone: <strong className="text-blue-800 dark:text-sky-400">+91 9123456789</strong></div>
              <div>PIN: <strong>**** (1111)</strong></div>
            </div>
          </div>

          {/* Registered Custom Staff Members */}
          {registeredStaff.map((staff) => (
            <div
              key={staff.id}
              className={`p-4 rounded-2xl border transition-all relative group space-y-2.5 ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-400/20 pb-2">
                <span className="font-extrabold text-blue-900 dark:text-sky-400 flex items-center gap-1.5 text-sm">
                  <User className="w-4 h-4 text-blue-700 dark:text-sky-400" /> {staff.name}
                </span>
                <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase bg-blue-50 dark:bg-sky-500/20 border border-blue-200 dark:border-sky-500/30 text-blue-800 dark:text-sky-400">
                  {staff.role || 'Salesperson'}
                </span>
              </div>

              {/* Staff Profile Details Display */}
              <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="opacity-70">Mobile Login:</span>
                  <strong className="text-blue-800 dark:text-sky-400">+91 {staff.phone}</strong>
                </div>
                {staff.emergencyPhone && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Emergency Contact:</span>
                    <strong className="text-blue-800 dark:text-sky-300">+91 {staff.emergencyPhone}</strong>
                  </div>
                )}
                {staff.qualification && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Qualification:</span>
                    <strong className="text-blue-800 dark:text-sky-300">{staff.qualification}</strong>
                  </div>
                )}
                {staff.age && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Age:</span>
                    <strong className="text-slate-800 dark:text-sky-300">{staff.age} yrs</strong>
                  </div>
                )}
                {staff.gender && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Gender:</span>
                    <strong className="text-slate-800 dark:text-sky-300">{staff.gender}</strong>
                  </div>
                )}
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
                  className="py-1 px-2 rounded-xl bg-blue-50 dark:bg-sky-500/15 border border-blue-200 dark:border-sky-500/30 hover:bg-blue-100 dark:hover:bg-sky-600 text-blue-800 dark:text-sky-400 dark:hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3 h-3" />
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
          <div className={`${panelClass} max-w-lg w-full p-5 sm:p-6 rounded-3xl shadow-2xl border border-white/20 space-y-4 animate-in zoom-in-95 duration-200`}>
            <div className="flex items-center justify-between border-b border-slate-400/20 pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2 text-sky-400">
                <Edit className="w-5 h-5" /> Edit Staff Profile: {editingStaff.name}
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
                    <option value="Male" className={isDarkMode ? 'bg-slate-900' : ''}>Male</option>
                    <option value="Female" className={isDarkMode ? 'bg-slate-900' : ''}>Female</option>
                    <option value="Other" className={isDarkMode ? 'bg-slate-900' : ''}>Other</option>
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
                    <option value="Salesperson" className={isDarkMode ? 'bg-slate-900' : ''}>Salesperson</option>
                    <option value="Optometrist" className={isDarkMode ? 'bg-slate-900' : ''}>Optometrist</option>
                    <option value="Store Manager" className={isDarkMode ? 'bg-slate-900' : ''}>Store Manager</option>
                    <option value="Admin" className={isDarkMode ? 'bg-slate-900' : ''}>Admin</option>
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
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-600 hover:brightness-110 text-white font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
