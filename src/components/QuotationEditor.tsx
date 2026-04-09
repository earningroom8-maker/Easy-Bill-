import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Plus, Trash2, FileDown, Printer, Share2, Image as ImageIcon } from 'lucide-react';
import { Quotation, BillItem, Settings } from '../types';
import { cn } from '../lib/utils';
import { format, addDays } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface QuotationEditorProps {
  quotation?: Quotation;
  nextQuotationNo?: string;
  settings: Settings;
  onSave: (quotation: Partial<Quotation>) => void;
  onBack: () => void;
  isMaterialList?: boolean;
}

export default function QuotationEditor({ quotation, nextQuotationNo, settings, onSave, onBack, isMaterialList }: QuotationEditorProps) {
  const [customerName, setCustomerName] = useState(quotation?.customerName || '');
  const [quotationNo, setQuotationNo] = useState(quotation?.quotationNo || nextQuotationNo || 'QT-001');
  const [date, setDate] = useState(quotation?.date || format(new Date(), 'dd MMM yyyy'));
  const [validUntil, setValidUntil] = useState(quotation?.validUntil || format(addDays(new Date(), 30), 'dd MMM yyyy'));
  const [items, setItems] = useState<BillItem[]>(quotation?.items || [{ id: '1', name: '', qty: 0, rate: 0 }]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Quotation_${quotationNo}`,
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

  const total = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);

  const handleSave = () => {
    onSave({
      customerName,
      quotationNo,
      date,
      validUntil,
      items
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
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', [imgWidth, Math.max(imgHeight, pageHeight)]);
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Quotation_${quotationNo}_${customerName || 'Untitled'}.pdf`);
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
    link.download = `Quotation_${quotationNo}_${customerName || 'Untitled'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      <header className="p-4 flex items-center justify-between border-b border-slate-200 sticky top-0 bg-inherit z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg">{isMaterialList ? 'Material List' : 'Quotation'}</h1>
            <p className="text-xs opacity-50">{quotationNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm">
            <Save size={16} /> Save
          </button>
          <div className={cn("flex items-center rounded-xl p-1 gap-0.5", settings.darkMode ? "bg-slate-900" : "bg-slate-100")}>
            <button onClick={exportToImage} title="Save as Image" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#3b82f6' }}>
              <ImageIcon size={18} />
            </button>
            <button onClick={exportToPDF} title="Save as PDF" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#ef4444' }}>
              <FileDown size={18} />
            </button>
            <button onClick={() => handlePrint()} title="Print" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm hover:shadow")} style={{ color: '#475569' }}>
              <Printer size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div 
          ref={printRef}
          className={cn("max-w-2xl mx-auto rounded-3xl p-8")}
          style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight" style={{ color: isMaterialList ? '#0369a1' : '#9333ea' }}>
              {isMaterialList ? 'MATERIAL LIST' : 'QUOTATION'}
            </h2>
            <h3 className="text-lg font-bold mt-2" style={{ color: '#0f172a' }}>
              {settings.businessProfile.name || "F.Z ELECTRIC SERVICE'S"}
            </h3>
            <p className="text-sm" style={{ color: '#64748b' }}>{settings.businessProfile.address}</p>
            <p className="text-sm font-bold" style={{ color: '#0f172a' }}>{settings.businessProfile.phone}</p>
            {settings.billOptions.showEmail && settings.businessProfile.email && (
              <p className="text-sm mt-1" style={{ color: '#64748b' }}>{settings.businessProfile.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 border-y py-6 mb-6" style={{ borderColor: '#f1f5f9' }}>
            <div className="border-r pr-6" style={{ borderColor: '#f1f5f9' }}>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>Quotation For</label>
              <input 
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name"
                className="w-full text-lg font-bold placeholder:text-slate-200 focus:outline-none bg-transparent"
                style={{ color: '#0f172a' }}
              />
            </div>
            <div className="pl-6">
              <div className="mb-4">
                <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: '#94a3b8' }}>Quote No.</label>
                <input 
                  type="text"
                  value={quotationNo}
                  onChange={(e) => setQuotationNo(e.target.value)}
                  className="text-xl font-black focus:outline-none bg-transparent w-full"
                  style={{ color: isMaterialList ? '#0369a1' : '#9333ea' }}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: '#94a3b8' }}>Valid Until</label>
                  <input 
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="text-xs font-bold focus:outline-none bg-transparent w-full"
                    style={{ color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className={cn(
              "grid gap-2 pb-2 border-b text-[10px] font-bold uppercase tracking-widest",
              isMaterialList ? "grid-cols-10" : "grid-cols-12"
            )} style={{ borderColor: '#f1f5f9', color: '#94a3b8' }}>
              <div className={isMaterialList ? "col-span-8" : "col-span-6"}>Description</div>
              <div className="col-span-2 text-center">Qty</div>
              {!isMaterialList && <div className="col-span-2 text-right">Rate</div>}
              {!isMaterialList && <div className="col-span-2 text-right">Total</div>}
            </div>
            <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
              {items.map((item) => (
                <div key={item.id} className={cn(
                  "grid gap-2 py-4 items-center group",
                  isMaterialList ? "grid-cols-10" : "grid-cols-12"
                )}>
                  <div className={isMaterialList ? "col-span-8" : "col-span-6" + " flex items-center gap-2"}>
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
                      placeholder="Item description"
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
                  {!isMaterialList && (
                    <div className="col-span-2">
                      <input 
                        type="number"
                        value={item.rate || ''}
                        onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
                        className="w-full text-right font-medium focus:outline-none rounded-lg py-1 px-2 print:bg-transparent"
                        style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}
                      />
                    </div>
                  )}
                  {!isMaterialList && (
                    <div className="col-span-2 text-right font-bold" style={{ color: '#0f172a' }}>
                      {settings.currency}{item.qty * item.rate}
                    </div>
                  )}
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

          {!isMaterialList && (
            <div className="space-y-4 pt-6 border-t-2" style={{ borderColor: '#0f172a' }}>
              <div className="flex justify-between items-center">
                <span className="text-lg font-black" style={{ color: '#0f172a' }}>Estimated Total</span>
                <span className="text-xl font-black" style={{ color: '#9333ea' }}>{settings.currency}{total}</span>
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-xs italic" style={{ color: '#94a3b8' }}>
              {isMaterialList 
                ? "This is a list of materials required for the project." 
                : "This is an estimate only. Prices are subject to change."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
