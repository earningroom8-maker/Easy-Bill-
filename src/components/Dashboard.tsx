import React from 'react';
import { Plus, Settings as SettingsIcon, FileText, Receipt, Users, ChevronRight, CheckCircle2, Phone, Moon, Sun, Package, FileSignature } from 'lucide-react';
import { Note, Bill, Settings, Contact } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface DashboardProps {
  notes: Note[];
  bills: Bill[];
  contacts: Contact[];
  settings: Settings;
  onNewNote: () => void;
  onNewBill: () => void;
  onNewQuotation: () => void;
  onOpenSettings: () => void;
  onViewNote: (note: Note) => void;
  onViewBill: (bill: Bill) => void;
  onViewNoteList: () => void;
  onViewBillList: () => void;
  onNewMaterial: () => void;
  onToggleDarkMode: () => void;
}

export default function Dashboard({
  notes,
  bills,
  contacts,
  settings,
  onNewNote,
  onNewBill,
  onNewQuotation,
  onOpenSettings,
  onViewNote,
  onViewBill,
  onViewNoteList,
  onViewBillList,
  onNewMaterial,
  onToggleDarkMode
}: DashboardProps) {
  return (
    <div className={cn("min-h-screen pb-24", settings.darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      {/* Header */}
      <header className="p-6 flex justify-between items-start">
        <div>
          <p className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: '#f97316' }}>Dashboard</p>
          <h1 className="text-3xl font-bold">My Business</h1>
          <p className={cn("text-sm mt-1", settings.darkMode ? "text-slate-400" : "text-slate-500")}>
            {settings.businessProfile.name || "F.Z Electric Service's"}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onToggleDarkMode}
            className={cn("p-2 rounded-full transition-colors", settings.darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white shadow-sm hover:bg-slate-100")}
          >
            {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={onOpenSettings}
            className={cn("p-2 rounded-full transition-colors", settings.darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-white shadow-sm hover:bg-slate-100")}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onViewNoteList}
            className={cn("p-5 rounded-[32px] flex items-center gap-4 cursor-pointer", settings.darkMode ? "bg-slate-900 border border-slate-800" : "bg-[#fffbeb] border border-[#fef3c7]")}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", settings.darkMode ? "bg-amber-900/30 text-amber-400" : "bg-[#fef3c7] text-[#92400e]")}>
              <FileText size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{notes.length}</p>
              <p className="text-sm opacity-60 mt-1">Notes</p>
            </div>
          </motion.div>
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onViewBillList}
            className={cn("p-5 rounded-[32px] flex items-center gap-4 cursor-pointer", settings.darkMode ? "bg-slate-900 border border-slate-800" : "bg-[#eff6ff] border border-[#dbeafe]")}
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", settings.darkMode ? "bg-blue-900/30 text-blue-400" : "bg-[#dbeafe] text-[#1e40af]")}>
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold leading-none">{bills.length}</p>
              <p className="text-sm opacity-60 mt-1">Bills</p>
            </div>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onNewQuotation}
            className={cn("p-6 rounded-[32px] flex flex-col gap-4 cursor-pointer", settings.darkMode ? "bg-slate-900 border border-slate-800" : "bg-[#faf5ff] border border-[#f3e8ff]")}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", settings.darkMode ? "bg-purple-900/30 text-purple-400" : "bg-[#f3e8ff] text-[#6b21a8]")}>
              <FileSignature size={24} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: '#6b21a8' }}>Quotation</p>
              <p className="text-[10px] opacity-60">Customer ko quote bhejo</p>
            </div>
          </motion.div>

          <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onNewMaterial}
            className={cn("p-6 rounded-[32px] flex flex-col gap-4 cursor-pointer", settings.darkMode ? "bg-slate-900 border border-slate-800" : "bg-[#f0f9ff] border border-[#e0f2fe]")}
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0", settings.darkMode ? "bg-blue-900/30 text-blue-400" : "bg-[#e0f2fe] text-[#0369a1]")}>
              <Package size={24} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: '#0369a1' }}>Material List</p>
              <p className="text-[10px] opacity-60">Sirf saman ki list</p>
            </div>
          </motion.div>
        </div>

        {/* Customer Contacts */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xs uppercase tracking-widest opacity-60">
              Customer Contacts
            </h2>
            <span className="text-xs opacity-50">{contacts.length}</span>
          </div>
          {contacts.length === 0 ? (
            <div className={cn("p-8 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center text-center", 
              settings.darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400")}>
              <Users size={40} className="mb-2 opacity-20" />
              <p className="text-sm">Koi customer nahi. Notes mein naam aur contact add karo.</p>
            </div>
          ) : (
            <div className={cn("rounded-[32px] overflow-hidden border", 
              settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm")}>
              <div className="divide-y divide-slate-100">
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#ffedd5] text-[#9a3412] flex items-center justify-center font-bold text-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{contact.name}</p>
                        <p className="text-sm text-slate-500">{contact.phone}</p>
                      </div>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="w-10 h-10 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center hover:bg-[#bbf7d0] transition-colors"
                    >
                      <Phone size={18} fill="currentColor" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Recent Notes */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xs uppercase tracking-widest opacity-60">Recent Notes</h2>
            <button onClick={onViewNoteList} className="text-sm font-medium" style={{ color: '#f97316' }}>View all</button>
          </div>
          {notes.length === 0 ? (
            <div className={cn("p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center", 
              settings.darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400")}>
              <p className="text-sm mb-4">Koi note nahi</p>
              <button 
                onClick={onNewNote}
                className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Note likho
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.slice(0, 3).map(note => (
                <button 
                  key={note.id}
                  onClick={() => onViewNote(note)}
                  className={cn("w-full p-4 rounded-2xl flex justify-between items-center text-left transition-colors", 
                    settings.darkMode ? "bg-slate-900 hover:bg-slate-800" : "bg-white shadow-sm hover:bg-slate-50")}
                >
                  <div>
                    <p className="font-bold">{note.customerName}</p>
                    <p className="text-xs opacity-50">{note.date}</p>
                  </div>
                  <ChevronRight size={18} className="opacity-30" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Recent Bills */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xs uppercase tracking-widest opacity-60">Recent Bills</h2>
            <button onClick={onViewBillList} className="text-sm font-medium" style={{ color: '#f97316' }}>View all</button>
          </div>
          {bills.length === 0 ? (
            <div className={cn("p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center", 
              settings.darkMode ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400")}>
              <p className="text-sm mb-4">Koi bill nahi</p>
              <button 
                onClick={onNewBill}
                className="bg-orange-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Bill banao
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bills.slice(0, 3).map(bill => (
                <button 
                  key={bill.id}
                  onClick={() => onViewBill(bill)}
                  className={cn("w-full p-4 rounded-2xl flex justify-between items-center text-left transition-colors", 
                    settings.darkMode ? "bg-slate-900 hover:bg-slate-800" : "bg-white shadow-sm hover:bg-slate-50")}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{bill.customerName}</p>
                      {bill.isCleared && <CheckCircle2 size={14} style={{ color: '#22c55e' }} />}
                    </div>
                    <p className="text-xs opacity-50">Bill #{bill.billNo} • {bill.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: '#f97316' }}>{settings.currency}{bill.items.reduce((sum, item) => sum + (item.qty * item.rate), 0)}</p>
                    <ChevronRight size={18} className="opacity-30 inline-block ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
