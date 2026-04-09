import React, { useState } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Note, Settings } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NoteListProps {
  notes: Note[];
  settings: Settings;
  onBack: () => void;
  onNewNote: () => void;
  onViewNote: (note: Note) => void;
}

export default function NoteList({ notes, settings, onBack, onNewNote, onViewNote }: NoteListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note => 
    note.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.contactNo.includes(searchQuery)
  );

  return (
    <div className={cn("min-h-screen flex flex-col", settings.darkMode ? "bg-black text-white" : "bg-white text-slate-900")}>
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-black/5">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-xl">Notebook</h1>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className={cn("relative flex items-center rounded-xl border px-4 py-3", settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200")}>
          <Search size={18} className="text-slate-400 mr-2" />
          <input 
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <p>Koi notes nahi mile</p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <motion.button
              key={note.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewNote(note)}
              className={cn(
                "w-full text-left p-5 rounded-[24px] border transition-all",
                settings.darkMode ? "bg-slate-900 border-slate-800" : "bg-[#fffbeb] border-[#fef3c7]"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-lg">{note.customerName}</h3>
                <span className="text-xs opacity-40">{note.date}</span>
              </div>
              <p className="text-sm font-bold opacity-70 mb-2">{note.contactNo}</p>
              <p className="text-sm opacity-50 line-clamp-2">
                {note.content || "Empty note"}
              </p>
            </motion.button>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onNewNote}
        className="fixed bottom-8 right-6 w-16 h-16 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 z-20"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}
