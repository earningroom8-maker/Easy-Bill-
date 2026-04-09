import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Plus, Trash2, FileDown, Printer, Share2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Bill, BillItem, Settings } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BillEditorProps {
  bill?: Bill;
  nextBillNo?: string;
  settings: Settings;
  onSave: (bill: Partial<Bill>) => void;
  onBack: () => void;
}

export default function BillEditor({ bill, nextBillNo, settings, onSave, onBack }: BillEditorProps) {
  const [customerName, setCustomerName] = useState(bill?.customerName || '');
  const [billNo, setBillNo] = useState(bill?.billNo || nextBillNo || '001');
  const [date, setDate] = useState(bill?.date || format(new Date(), 'dd MMM yyyy'));
  const [items, setItems] = useState<BillItem[]>(bill?.items || [{ id: '1', name: '', qty: 0, rate: 0 }]);
  const [received, setReceived] = useState(bill?.received || 0);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [isCleared, setIsCleared] = useState(bill?.isCleared || false);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Bill_${billNo}`,
    onAfterPrint: () => console.log('Printed'),
    onPrintError: (error) => {
      console.error('Print failed:', error);
      // Fallback to simple window.print if iframe fails
      window.print();
    }
  });

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', qty: 0, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const gstAmount = settings.billOptions.showGST ? (subtotal * gst) / 100 : 0;
  const total = subtotal + gstAmount;
  const discountAmount = settings.billOptions.showDiscount ? (total * discount) / 100 : 0;
  const finalTotal = total - discountAmount;
  const balanceDue = finalTotal - received;

  const handleSave = () => {
    onSave({
      customerName,
      billNo,
      date,
      items,
      received,
      isCleared
    });
  };

  const exportToPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure all inputs are visible as text in the clone
        const inputs = clonedDoc.querySelectorAll('input');
        inputs.forEach(input => {
          const span = clonedDoc.createElement('span');
          span.innerText = input.value;
          span.className = input.className;
          span.style.cssText = input.style.cssText;
          span.style.display = 'inline-block';
          span.style.minHeight = '1.5em';
          input.parentNode?.replaceChild(span, input);
        });
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', [imgWidth, Math.max(imgHeight, pageHeight)]);
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Bill_${billNo}_${customerName || 'Untitled'}.pdf`);
  };

  const exportToImage = async () => {
    const element = printRef.current;
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const inputs = clonedDoc.querySelectorAll('input');
        inputs.forEach(input => {
          const span = clonedDoc.createElement('span');
          span.innerText = input.value;
          span.className = input.className;
          span.style.cssText = input.style.cssText;
          span.style.display = 'inline-block';
          span.style.minHeight = '1.5em';
          input.parentNode?.replaceChild(span, input);
        });
      }
    });
    
    const link = document.createElement('a');
    link.download = `Bill_${billNo}_${customerName || 'Untitled'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Bill: ${billNo}`,
          text: `Bill for ${customerName}. Total: ${settings.currency}${total}`,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Sharing not supported on this browser. Use PDF instead.');
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-inherit z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{billNo}</h1>
            <p className="text-xs opacity-50">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm">
            <Save size={16} /> Save
          </button>
          <div className={cn("flex items-center rounded-xl p-1 gap-0.5", settings.darkMode ? "bg-slate-900" : "bg-slate-100")}>
            <button onClick={handleShare} className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} title="Share">
              <Share2 size={18} style={{ color: '#64748b' }} />
            </button>
            <button onClick={exportToImage} title="Save as Image" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#3b82f6' }}>
              <ImageIcon size={18} />
            </button>
            <button onClick={exportToPDF} title="Save as PDF" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#ef4444' }}>
              <FileDown size={18} />
            </button>
            <button onClick={() => handlePrint()} title="Print Bill" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#475569' }}>
              <Printer size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        {/* Bill Preview/Edit Area */}
        <div 
          ref={printRef}
          className={cn("max-w-2xl mx-auto rounded-3xl p-8")}
          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          {/* Business Header */}
          <div className="text-center mb-8 relative">
            {isCleared && (
              <div className="absolute -top-4 -right-4 rotate-12 opacity-50" style={{ color: '#22c55e' }}>
                <CheckCircle2 size={80} strokeWidth={1} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-center -mt-2">Cleared</p>
              </div>
            )}
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#f97316' }}>
              {settings.businessProfile.name || "F.Z ELECTRIC SERVICE'S"}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>{settings.businessProfile.address || "Gujranwala Pakistan"}</p>
            <p className="text-sm font-bold mt-1" style={{ color: '#0f172a' }}>{settings.businessProfile.phone || "03246043916"}</p>
            {settings.billOptions.showEmail && settings.businessProfile.email && (
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{settings.businessProfile.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 border-y py-6 mb-6" style={{ borderColor: '#f1f5f9' }}>
            <div className="border-r pr-6" style={{ borderColor: '#f1f5f9' }}>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>Billed To</label>
              <input 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name"
                className="w-full text-lg font-bold placeholder:text-slate-200 focus:outline-none bg-transparent"
                style={{ color: '#0f172a' }}
              />
            </div>
            <div className="pl-6">
              <div className="mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: '#94a3b8' }}>Bill No.</label>
                <input 
                  type="text"
                  value={billNo}
                  onChange={(e) => setBillNo(e.target.value)}
                  className="text-xl font-black focus:outline-none bg-transparent w-full"
                  style={{ color: '#f97316' }}
                />
                <p className="text-[8px] opacity-50 font-bold" style={{ color: '#94a3b8' }}>( Example 001, 002, 003 )</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: '#94a3b8' }}>Date</label>
                <input 
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-sm font-bold focus:outline-none bg-transparent w-full"
                  style={{ color: '#0f172a' }}
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="grid grid-cols-12 gap-2 pb-2 border-b text-[10px] font-bold uppercase tracking-widest" style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}>
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 py-4 items-center group">
                  <div className="col-span-6 flex items-center gap-2">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                      style={{ color: '#f87171' }}
                      data-html2canvas-ignore
                    >
                      <Trash2 size={14} />
                    </button>
                    <input 
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder={`Item ${items.indexOf(item) + 1}`}
                      className="w-full font-medium focus:outline-none bg-transparent"
                      style={{ color: '#0f172a' }}
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={item.qty || ''}
                      onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                      className="w-full text-center font-medium focus:outline-none rounded-lg py-1 print:bg-transparent"
                      style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="number"
                      value={item.rate || ''}
                      onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                      className="w-full text-right font-medium focus:outline-none rounded-lg py-1 px-2 print:bg-transparent"
                      style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}
                    />
                  </div>
                  <div className="col-span-2 text-right font-bold" style={{ color: '#0f172a' }}>
                    {settings.currency}{item.qty * item.rate}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={addItem}
              className="mt-4 w-full py-4 border-2 border-dashed rounded-2xl transition-colors print:hidden flex items-center justify-center gap-2"
              style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}
              data-html2canvas-ignore
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Totals */}
          <div className="space-y-4 pt-6 border-t-2" style={{ borderColor: '#0f172a' }}>
            {settings.billOptions.showGST && (
              <div className="flex justify-between items-center font-bold text-sm" style={{ color: '#64748b' }}>
                <span>Subtotal</span>
                <span>{settings.currency}{subtotal}</span>
              </div>
            )}
            
            {settings.billOptions.showGST && (
              <div className="flex justify-between items-center font-bold text-sm" style={{ color: '#0f172a' }}>
                <div className="flex items-center gap-2">
                  <span>GST (%)</span>
                  <input 
                    type="number"
                    value={gst || ''}
                    onChange={(e) => setGst(parseInt(e.target.value) || 0)}
                    className="w-12 text-center border rounded-lg py-1 focus:outline-none print:hidden"
                    style={{ backgroundColor: '#f8fafc' }}
                  />
                </div>
                <span>+{settings.currency}{gstAmount.toFixed(0)}</span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-lg font-black" style={{ color: '#0f172a' }}>Total</span>
              <span className="text-xl font-black" style={{ color: '#f97316' }}>{settings.currency}{total.toFixed(0)}</span>
            </div>

            {settings.billOptions.showDiscount && (
              <div className="flex justify-between items-center font-bold text-sm" style={{ color: '#ef4444' }}>
                <div className="flex items-center gap-2">
                  <span>Discount (%)</span>
                  <input 
                    type="number"
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                    className="w-12 text-center border rounded-lg py-1 focus:outline-none print:hidden"
                    style={{ backgroundColor: '#fef2f2' }}
                  />
                </div>
                <span>-{settings.currency}{discountAmount.toFixed(0)}</span>
              </div>
            )}

            <div className="flex justify-between items-center font-bold" style={{ color: '#16a34a' }}>
              <span>Received</span>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50">{settings.currency}</span>
                <input 
                  type="number"
                  value={received || ''}
                  onChange={(e) => setReceived(parseInt(e.target.value) || 0)}
                  className="w-24 text-right rounded-xl px-3 py-2 focus:outline-none print:bg-transparent"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                />
              </div>
            </div>
            <div className="p-4 rounded-2xl flex justify-between items-center print:bg-transparent print:border" style={{ backgroundColor: '#fff7ed', borderColor: '#ffedd5' }}>
              <span className="font-bold" style={{ color: '#7c2d12' }}>Balance Due</span>
              <span className="text-xl font-black" style={{ color: '#ea580c' }}>{settings.currency}{balanceDue.toFixed(0)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs italic mb-8" style={{ color: '#94a3b8' }}>{settings.defaultTerms || "Thank you for your business!"}</p>
            
            <button 
              onClick={() => setIsCleared(!isCleared)}
              data-html2canvas-ignore
              className={cn(
                "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all print:hidden",
                isCleared 
                  ? "border-2" 
                  : "border-2 hover:bg-slate-200"
              )}
              style={{
                backgroundColor: isCleared ? '#dcfce7' : '#f1f5f9',
                color: isCleared ? '#15803d' : '#475569',
                borderColor: isCleared ? '#bbf7d0' : '#e2e8f0'
              }}
            >
              {isCleared ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-current" />}
              {isCleared ? "Bill Cleared (Tik Lag Gaya)" : "Clear Bill (Tik Lagao)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
