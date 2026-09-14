import React from 'react';
import { PlusCircle, Save, Edit3, Trash2, Eye, Truck, Copy, PackagePlus, LogOut, Search } from 'lucide-react';

export default function ActionBar({ 
  onNew, 
  onSave, 
  onEdit, 
  onDelete, 
  onView, 
  onDelivery, 
  onDuplicateBill, 
  onItemSetup, 
  onToggleSearch,
  isSearchPanelOpen,
  isEditing,
  isDarkMode
}) {
  const dockClass = isDarkMode ? 'glass-dock-dark' : 'glass-dock-light';

  return (
    <div className={`${dockClass} p-2.5 sm:p-3.5 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5 shadow-2xl transition-all duration-300`}>
      <div className="grid grid-cols-5 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto text-[11px] sm:text-xs font-black">
        {/* New Button */}
        <button
          onClick={onNew}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">New</span>
        </button>

        {/* Find / Search Toggle Button */}
        <button
          onClick={onToggleSearch}
          className={`px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30 ${
            isSearchPanelOpen
              ? 'bg-gradient-to-r from-sky-400 to-blue-600 text-white ring-sky-300 shadow-sky-500/30 font-black'
              : 'bg-gradient-to-r from-sky-600 to-blue-700 text-white hover:from-sky-500 hover:to-blue-600'
          }`}
          title="Toggle Quick Find Grid"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Find</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>{isEditing ? 'Upd' : 'Save'}</span>
        </button>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-sky-600 to-blue-700 text-white font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30"
        >
          <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/20"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> <span>Del</span>
        </button>

        {/* Delivery Status Button */}
        <button
          onClick={onDelivery}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30"
        >
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Delivery</span><span className="sm:hidden">Dli</span>
        </button>

        {/* Item Setup Button */}
        <button
          onClick={onItemSetup}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-slate-900 border border-slate-800 text-white transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-white/30"
        >
          <PackagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> <span className="hidden sm:inline">Item Setup</span><span className="sm:hidden">Setup</span>
        </button>
      </div>

      <button
        onClick={onNew}
        className={`w-full sm:w-auto px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-full border text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-sky-400 hover:bg-slate-800 hover:text-white' 
            : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
        }`}
      >
        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> Clear / Close
      </button>
    </div>
  );
}
