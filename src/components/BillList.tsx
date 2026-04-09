import React, { useState } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Bill, Settings } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface BillListProps {
  bills: Bill[];
  settings: Settings;
  onBack: () => void;
  onNewBill: () => void;
  onViewBill: (bill: Bill) => void;
}

export default function BillList({ bills, settings, onBack, onNewBill, onViewBill }: BillListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = bills.filter(bill => 
    bill.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.billNo.includes(searchQuery)
  );

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-black text-white" : "bg-white text-slate-900")}>
      {/* Header */}
      <header className="p-4 flex flex-col border-b border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-xl">Bill Book</h1>
            <p className="text-xs opacity-50">{bills.length} invoices</p>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className={cn("relative flex items-center rounded-xl border px-4 py-3", settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200")}>
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text"
            placeholder="Search customer or bill no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filteredBills.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <p>Koi bills nahi mile</p>
          </div>
        ) : (
          filteredBills.map((bill) => {
            const total = bill.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
            const balanceDue = total - bill.received;
            
            return (
              <motion.button
                key={bill.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewBill(bill)}
                className={cn(
                  "w-full text-left p-4 rounded-[24px] border transition-all flex items-center justify-between",
                  settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ffedd5] text-[#9a3412] flex items-center justify-center font-bold text-lg">
                    {bill.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{bill.customerName}</p>
                    <p className="text-xs text-slate-500">{bill.billNo} • {bill.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Rs{total}</p>
                  {balanceDue > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                      Due Rs{balanceDue}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onNewBill}
        className="fixed bottom-8 right-6 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 z-20"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
