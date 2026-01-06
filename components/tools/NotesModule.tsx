"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FileText, Bold, Heading, List, Copy, Download, Trash2 } from 'lucide-react';

const NotesModule = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [archive, setArchive] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persistence
  useEffect(() => {
    const savedText = localStorage.getItem('omnitool_notes');
    const savedArchive = localStorage.getItem('omnitool_notes_archive');
    if (savedText) setText(savedText);
    if (savedArchive) setArchive(JSON.parse(savedArchive));
  }, []);

  useEffect(() => {
    localStorage.setItem('omnitool_notes', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('omnitool_notes_archive', JSON.stringify(archive));
  }, [archive]);

  // Stats
  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    return { chars, words };
  }, [text]);

  const insertText = (before: string, after: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selAndText = text.slice(start, end);

    const newText = text.slice(0, start) + before + selAndText + after + text.slice(end);
    setText(newText);

    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (title || 'nota_omnitool') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm("Sei sicuro di voler cancellare tutto nell'editor?")) {
      setText('');
      setTitle('');
    }
  };

  const saveToArchive = () => {
    if (!text.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      title: title.trim() || 'Nota senza titolo',
      text: text,
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setArchive([newNote, ...archive]);
  };

  const deleteFromArchive = (id: string) => {
    if (confirm("Eliminare questa nota dall'archivio?")) {
      setArchive(archive.filter(n => n.id !== id));
    }
  };

  const loadFromArchive = (note: any) => {
    setTitle(note.title);
    setText(note.text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Note Veloci</h2>
      </div>

      <div className="glass-panel rounded-[2.5rem] shadow-2xl bg-slate-900/40 border-slate-500/20 flex flex-col overflow-hidden relative backdrop-blur-xl shadow-sm">
        <div className="flex flex-col border-b border-[var(--glass-border)]">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titolo della nota..."
            className="w-full bg-transparent px-6 py-4 text-xl font-bold text-adaptive placeholder:text-adaptive-muted outline-none border-b border-[var(--glass-border)] focus:bg-[var(--glass-input-bg)] transition-colors"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[var(--glass-bg)]">
            <div className="flex gap-1">
              <button onClick={() => insertText('**', '**')} className="p-2 rounded-lg hover:bg-[var(--glass-card-hover)] text-adaptive-muted hover:text-adaptive transition-colors" title="Grassetto"><Bold size={18} /></button>
              <button onClick={() => insertText('\n# ')} className="p-2 rounded-lg hover:bg-[var(--glass-card-hover)] text-adaptive-muted hover:text-adaptive transition-colors" title="Titolo"><Heading size={18} /></button>
              <button onClick={() => insertText('\n- ')} className="p-2 rounded-lg hover:bg-[var(--glass-card-hover)] text-adaptive-muted hover:text-adaptive transition-colors" title="Elenco"><List size={18} /></button>
            </div>
            <div className="flex gap-1">
              <button onClick={saveToArchive} className="p-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-2">
                SALVA NELL'ARCHIVIO
              </button>
              <button onClick={() => navigator.clipboard.writeText(text)} className="p-2 rounded-lg hover:bg-[var(--glass-card-hover)] text-adaptive-muted hover:text-adaptive transition-colors flex items-center gap-2" title="Copia">
                <Copy size={18} />
              </button>
              <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-[var(--glass-card-hover)] text-adaptive-muted hover:text-adaptive transition-colors flex items-center gap-2" title="Scarica TXT">
                <Download size={18} />
              </button>
              <button onClick={handleClear} className="p-2 rounded-lg hover:bg-red-500/20 text-red-500/70 hover:text-red-500 transition-colors" title="Pulisci">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Scrivi qui i tuoi pensieri..."
          className="w-full h-96 bg-transparent p-6 md:p-8 text-lg md:text-xl text-adaptive placeholder:text-adaptive-muted outline-none resize-none font-sans leading-relaxed custom-scrollbar selection:bg-indigo-500/50"
          spellCheck="false"
        />

        <div className="bg-[var(--glass-input-bg)] px-6 py-2 text-xs font-mono text-adaptive-muted flex justify-end gap-6 border-t border-[var(--glass-border)]">
          <span>{stats.words} parole</span>
          <span>{stats.chars} caratteri</span>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <h3 className="text-xl font-black text-adaptive px-2 flex items-center gap-3">
          <FileText className="text-indigo-500" />
          I tuoi Appunti
        </h3>

        {archive.length === 0 ? (
          <div className="text-center py-12 bg-[var(--glass-input-bg)] rounded-[2rem] border border-dashed border-[var(--glass-border)] text-adaptive-muted italic">
            L'archivio è vuoto. Salva la tua prima nota!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archive.map((note) => (
              <div key={note.id} className="glass-panel p-6 rounded-3xl bg-slate-800/10 border-[var(--glass-border)] flex flex-col gap-4 group hover:bg-[var(--glass-card-hover)] transition-all shadow-sm">
                <div className="flex-1">
                  <h4 className="text-lg font-black text-adaptive truncate mb-1">{note.title}</h4>
                  <p className="text-[10px] text-adaptive-muted font-bold uppercase tracking-wider">{note.date}</p>
                  <p className="text-sm text-adaptive-muted line-clamp-3 mt-3 leading-relaxed">{note.text}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => loadFromArchive(note)}
                    className="flex-1 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors border border-indigo-500/20"
                  >
                    CARICA
                  </button>
                  <button
                    onClick={() => deleteFromArchive(note.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center py-8 text-[10px] text-adaptive-muted uppercase font-black tracking-widest">
        Salvataggio Automatico Attivo
      </div>
    </div>
  );
};

export default NotesModule;
