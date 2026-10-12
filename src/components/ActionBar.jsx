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
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B89025] hover:from-[#E5C358] hover:to-[#D4AF37] text-[#061833] font-black transition-all shadow-md shadow-[#D4AF37]/25 flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-amber-200/50"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#061833]" /> <span className="hidden xs:inline">New</span>
        </button>

        {/* Find / Search Toggle Button */}
        <button
          onClick={onToggleSearch}
          className={`px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ${
            isSearchPanelOpen
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89025] text-[#061833] ring-[#D4AF37] shadow-[#D4AF37]/30'
              : 'bg-gradient-to-r from-[#0B2D5B] to-[#143E77] text-[#D4AF37] hover:from-[#0F356B] hover:to-[#184B8E] ring-[#D4AF37]/40'
          }`}
          title="Toggle Quick Find Grid"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Find</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C358] to-[#B89025] hover:from-[#E5C358] hover:to-[#D4AF37] text-[#061833] font-black transition-all shadow-lg shadow-[#D4AF37]/30 flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-amber-200/60"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#061833]" /> <span>{isEditing ? 'Upd' : 'Save'}</span>
        </button>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#0B2D5B] to-[#143E77] hover:from-[#0F356B] hover:to-[#184B8E] text-[#D4AF37] font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-[#D4AF37]/40"
        >
          <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span>Edit</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-[#061833] border border-rose-500/40 text-rose-400 hover:bg-rose-950/40 hover:text-white font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-rose-500/20"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> <span>Del</span>
        </button>

        {/* Delivery Status Button */}
        <button
          onClick={onDelivery}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#0B2D5B] via-[#0F356B] to-[#143E77] text-white hover:text-[#D4AF37] font-black transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-[#D4AF37]/40 border border-[#D4AF37]/30"
        >
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> <span className="hidden sm:inline">Delivery</span><span className="sm:hidden">Dli</span>
        </button>

        {/* Item Setup Button */}
        <button
          onClick={onItemSetup}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full bg-[#061833] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#0B2D5B] transition-all shadow-md flex items-center justify-center gap-1 sm:gap-2 active:scale-95 cursor-pointer ring-1 sm:ring-2 ring-[#D4AF37]/30"
        >
          <PackagePlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> <span className="hidden sm:inline">Item Setup</span><span className="sm:hidden">Setup</span>
        </button>
      </div>

      <button
        onClick={onNew}
        className={`w-full sm:w-auto px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-full border text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isDarkMode 
            ? 'bg-[#061833] border-[#0B2D5B] text-[#D4AF37] hover:bg-[#0B2D5B] hover:text-white' 
            : 'bg-slate-100 border-[#0B2D5B]/20 text-[#0B2D5B] hover:bg-[#0B2D5B]/10'
        }`}
      >
        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" /> Clear / Close
      </button>
    </div>
  );
}
