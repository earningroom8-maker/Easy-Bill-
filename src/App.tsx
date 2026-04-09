import React, { useState, useEffect } from 'react';
import { Note, Bill, Settings, Contact, Quotation } from './types';
import Dashboard from './components/Dashboard';
import NoteEditor from './components/NoteEditor';
import BillEditor from './components/BillEditor';
import QuotationEditor from './components/QuotationEditor';
import NoteList from './components/NoteList';
import BillList from './components/BillList';
import SettingsView from './components/SettingsView';

import WelcomeView from './components/WelcomeView';

type View = 'dashboard' | 'note-editor' | 'bill-editor' | 'quotation-editor' | 'material-editor' | 'settings' | 'note-list' | 'bill-list' | 'welcome';

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  currency: 'Rs',
  billOptions: {
    showDiscount: false,
    showGST: false,
    showEmail: false,
  },
  defaultTerms: 'Thank you for your business!',
  businessProfile: {
    name: '',
    address: '',
    phone: '',
    email: '',
    country: '',
  },
};

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [notes, setNotes] = useState<Note[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [currentNote, setCurrentNote] = useState<Note | undefined>();
  const [currentBill, setCurrentBill] = useState<Bill | undefined>();
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | undefined>();

  // Load data from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedBills = localStorage.getItem('bills');
    const savedQuotations = localStorage.getItem('quotations');
    const savedContacts = localStorage.getItem('contacts');
    const savedSettings = localStorage.getItem('settings');

    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedBills) setBills(JSON.parse(savedBills));
    if (savedQuotations) setQuotations(JSON.parse(savedQuotations));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        if (!parsedSettings.businessProfile?.name) {
          setView('welcome');
        }
      } catch (e) {
        console.error('Failed to parse settings', e);
        setView('welcome');
      }
    } else {
      setView('welcome');
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveNote = (noteData: Partial<Note>) => {
    if (currentNote) {
      setNotes(notes.map(n => n.id === currentNote.id ? { ...n, ...noteData } as Note : n));
    } else {
      const newNote: Note = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        customerName: noteData.customerName || '',
        contactNo: noteData.contactNo || '',
        content: noteData.content || '',
        date: noteData.date || '',
      };
      setNotes([newNote, ...notes]);
    }

    // Save contact
    if (noteData.customerName && noteData.contactNo) {
      setContacts(prev => {
        const existing = prev.find(c => c.phone === noteData.contactNo);
        if (existing) {
          return prev.map(c => c.phone === noteData.contactNo ? { ...c, name: noteData.customerName!, lastUpdated: Date.now() } : c);
        }
        return [{
          id: Math.random().toString(36).substr(2, 9),
          name: noteData.customerName!,
          phone: noteData.contactNo!,
          lastUpdated: Date.now()
        }, ...prev];
      });
    }

    setView('dashboard');
    setCurrentNote(undefined);
  };

  const handleSaveBill = (billData: Partial<Bill>) => {
    if (currentBill) {
      setBills(bills.map(b => b.id === currentBill.id ? { ...b, ...billData } as Bill : b));
    } else {
      const newBill: Bill = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        billNo: billData.billNo || '001',
        customerName: billData.customerName || '',
        date: billData.date || '',
        items: billData.items || [],
        received: billData.received || 0,
        isCleared: billData.isCleared || false,
      };
      setBills([newBill, ...bills]);
    }
    setView('dashboard');
    setCurrentBill(undefined);
  };

  const handleSaveQuotation = (quoteData: Partial<Quotation>) => {
    if (currentQuotation) {
      setQuotations(quotations.map(q => q.id === currentQuotation.id ? { ...q, ...quoteData } as Quotation : q));
    } else {
      const newQuote: Quotation = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        quotationNo: quoteData.quotationNo || 'QT-001',
        customerName: quoteData.customerName || '',
        date: quoteData.date || '',
        validUntil: quoteData.validUntil || '',
        items: quoteData.items || [],
      };
      setQuotations([newQuote, ...quotations]);
    }
    setView('dashboard');
    setCurrentQuotation(undefined);
  };

  const handleToggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const getNextBillNo = () => {
    if (bills.length === 0) return '001';
    const numbers = bills.map(b => {
      const n = parseInt(b.billNo);
      return isNaN(n) ? 0 : n;
    });
    const max = Math.max(...numbers, 0);
    return (max + 1).toString().padStart(3, '0');
  };

  const getNextQuotationNo = () => {
    if (quotations.length === 0) return 'QT-001';
    const numbers = quotations.map(q => {
      const n = parseInt(q.quotationNo.replace('QT-', ''));
      return isNaN(n) ? 0 : n;
    });
    const max = Math.max(...numbers, 0);
    return `QT-${(max + 1).toString().padStart(3, '0')}`;
  };

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      {view === 'welcome' && (
        <WelcomeView 
          initialSettings={settings}
          onComplete={(newSettings) => {
            setSettings(newSettings);
            setView('dashboard');
          }}
        />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          notes={notes}
          bills={bills}
          contacts={contacts}
          settings={settings}
          onNewNote={() => { setCurrentNote(undefined); setView('note-editor'); }}
          onNewBill={() => { setCurrentBill(undefined); setView('bill-editor'); }}
          onNewQuotation={() => { setCurrentQuotation(undefined); setView('quotation-editor'); }}
          onOpenSettings={() => setView('settings')}
          onViewNote={(note) => { setCurrentNote(note); setView('note-editor'); }}
          onViewBill={(bill) => { setCurrentBill(bill); setView('bill-editor'); }}
          onViewNoteList={() => setView('note-list')}
          onViewBillList={() => setView('bill-list')}
          onNewMaterial={() => { setCurrentQuotation(undefined); setView('material-editor'); }}
          onToggleDarkMode={handleToggleDarkMode}
        />
      )}

      {view === 'note-editor' && (
        <NoteEditor 
          note={currentNote}
          settings={settings}
          onSave={handleSaveNote}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'bill-editor' && (
        <BillEditor 
          bill={currentBill}
          nextBillNo={getNextBillNo()}
          settings={settings}
          onSave={handleSaveBill}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'quotation-editor' && (
        <QuotationEditor 
          quotation={currentQuotation}
          nextQuotationNo={getNextQuotationNo()}
          settings={settings}
          onSave={handleSaveQuotation}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'material-editor' && (
        <QuotationEditor 
          quotation={currentQuotation}
          nextQuotationNo={getNextQuotationNo()}
          settings={settings}
          onSave={handleSaveQuotation}
          onBack={() => setView('dashboard')}
          isMaterialList={true}
        />
      )}

      {view === 'settings' && (
        <SettingsView 
          settings={settings}
          onSave={(newSettings) => { setSettings(newSettings); setView('dashboard'); }}
          onBack={() => setView('dashboard')}
        />
      )}

      {view === 'note-list' && (
        <NoteList 
          notes={notes}
          settings={settings}
          onBack={() => setView('dashboard')}
          onNewNote={() => { setCurrentNote(undefined); setView('note-editor'); }}
          onViewNote={(note) => { setCurrentNote(note); setView('note-editor'); }}
        />
      )}

      {view === 'bill-list' && (
        <BillList 
          bills={bills}
          settings={settings}
          onBack={() => setView('dashboard')}
          onNewBill={() => { setCurrentBill(undefined); setView('bill-editor'); }}
          onViewBill={(bill) => { setCurrentBill(bill); setView('bill-editor'); }}
        />
      )}
    </div>
  );
}
