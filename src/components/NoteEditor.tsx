import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Share2, MoreVertical, Printer, FileDown } from 'lucide-react';
import { Note, Settings } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface NoteEditorProps {
  note?: Note;
  settings: Settings;
  onSave: (note: Partial<Note>) => void;
  onBack: () => void;
}

export default function NoteEditor({ note, settings, onSave, onBack }: NoteEditorProps) {
  const [customerName, setCustomerName] = useState(note?.customerName || '');
  const [contactNo, setContactNo] = useState(note?.contactNo || '');
  const [content, setContent] = useState(note?.content || '');
  const [date, setDate] = useState(note?.date || format(new Date(), 'MMM d, yyyy'));

  const handleSave = () => {
    onSave({
      customerName,
      contactNo,
      content,
      date
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById('note-content');
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: settings.darkMode ? '#000000' : '#fffbeb',
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
        
        const textareas = clonedDoc.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          const div = clonedDoc.createElement('div');
          div.innerText = textarea.value;
          div.className = textarea.className;
          div.style.cssText = textarea.style.cssText;
          div.style.whiteSpace = 'pre-wrap';
          div.style.height = 'auto';
          textarea.parentNode?.replaceChild(div, textarea);
        });
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', [imgWidth, Math.max(imgHeight, pageHeight)]);
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Note_${customerName || 'Untitled'}.pdf`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Note: ${customerName}`,
          text: content,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert('Sharing not supported on this browser. Use PDF instead.');
    }
  };

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-black text-white" : "bg-amber-50 text-slate-900")}>
      {/* Header */}
      <header className={cn("p-4 flex items-center justify-between border-b", settings.darkMode ? "border-white/10" : "border-amber-100/20")}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">{note ? 'Edit Note' : 'New Note'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm">
            <Save size={16} /> Save
          </button>
          <div className={cn("flex items-center rounded-xl p-1 gap-0.5", settings.darkMode ? "bg-slate-900" : "bg-white/50 border border-amber-100/50")}>
            <button onClick={handleShare} className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm")} title="Share">
              <Share2 size={18} style={{ color: '#64748b' }} />
            </button>
            <button onClick={exportToPDF} title="Save as PDF" className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm")} style={{ color: '#ef4444' }}>
              <FileDown size={18} />
            </button>
            <button className={cn("p-2 rounded-lg transition-all", settings.darkMode ? "hover:bg-slate-800" : "hover:bg-white shadow-sm")}>
              <MoreVertical size={18} style={{ color: '#475569' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Note Content */}
      <div id="note-content" className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: settings.darkMode ? '#cbd5e1' : '#92400e' }}>Customer Name</label>
            <input 
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ali Khan"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
              style={{ 
                backgroundColor: settings.darkMode ? '#171717' : '#ffffff80', 
                borderColor: settings.darkMode ? '#404040' : '#fde68a', 
                color: settings.darkMode ? '#ffffff' : '#0f172a' 
              }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: settings.darkMode ? '#cbd5e1' : '#92400e' }}>Contact No.</label>
            <input 
              type="tel"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder="Phone number"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
              style={{ 
                backgroundColor: settings.darkMode ? '#171717' : '#ffffff80', 
                borderColor: settings.darkMode ? '#404040' : '#fde68a', 
                color: settings.darkMode ? '#ffffff' : '#0f172a' 
              }}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: settings.darkMode ? '#cbd5e1' : '#92400e' }}>Date</label>
            <input 
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none"
              style={{ 
                backgroundColor: settings.darkMode ? '#171717' : '#ffffff80', 
                borderColor: settings.darkMode ? '#404040' : '#fde68a', 
                color: settings.darkMode ? '#ffffff' : '#0f172a' 
              }}
            />
          </div>
        </div>

        <div className="relative mt-8">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Yahan likho..."
            className="w-full min-h-[500px] bg-transparent notebook-lines focus:outline-none resize-none"
            style={{ 
              backgroundImage: `linear-gradient(transparent 31px, ${settings.darkMode ? '#ffffff40' : '#d1d5db'} 31px, ${settings.darkMode ? '#ffffff40' : '#d1d5db'} 32px, transparent 32px)`,
              backgroundSize: '100% 32px',
              lineHeight: '32px',
              paddingTop: '8px',
              color: settings.darkMode ? '#ffffff' : '#334155'
            }}
          />
        </div>
      </div>
    </div>
  );
}
