"use client";

import React, { useState, useMemo } from 'react';

const TextAnalyzer = ({ onBack }: { onBack: () => void }) => {
  const [text, setText] = useState('');

  const regexEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const regexPhone = /(?:(?:\+?39)?\s?3\d{2}\s?\d{6,7})|(?:\d{2,4}\s?\d{5,8})/g;
  const regexCF = /[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]/gi;

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readTime = Math.ceil(words / 200);

    const sensitiveFound = regexEmail.test(text) || regexPhone.test(text) || regexCF.test(text);

    const cleanText = text.toLowerCase().replace(/[.,!?;:()"]/g, '');
    const wordList = cleanText.split(/\s+/);
    const stopWords = ['il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'una', 'e', 'o', 'ma', 'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'che', 'è', 'sono', 'non', 'si'];
    const freqs: Record<string, number> = {};
    wordList.forEach(w => {
      if (w.length > 2 && !stopWords.includes(w)) {
        freqs[w] = (freqs[w] || 0) + 1;
      }
    });
    const topWords = Object.entries(freqs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(k => k[0]);

    return { chars, words, sentences, readTime, sensitiveFound, topWords };
  }, [text]);

  const handleAnonymize = () => {
    let newText = text;
    newText = newText.replace(regexEmail, '[EMAIL OSCURATA]');
    newText = newText.replace(regexPhone, '[TELEFONO OSCURATO]');
    newText = newText.replace(regexCF, '[CF OSCURATO]');
    setText(newText);
  };

  const handleClean = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Analisi Testo</h2>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6 shadow-2xl bg-fuchsia-900/10 border-fuchsia-500/20 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-black text-fuchsia-500">{stats.words}</span>
            <span className="text-[10px] uppercase font-bold text-adaptive-muted">Parole</span>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-black text-fuchsia-500">{stats.chars}</span>
            <span className="text-[10px] uppercase font-bold text-adaptive-muted">Caratteri</span>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center shadow-sm">
            <div className="flex gap-1 items-baseline">
              <span className="text-2xl font-black text-fuchsia-500">{stats.readTime}</span>
              <span className="text-xs text-adaptive-muted">min</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-adaptive-muted">Lettura</span>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
            {stats.sensitiveFound && <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            <span className={`text-xl font-bold ${stats.sensitiveFound ? 'text-red-500' : 'text-green-500'}`}>
              {stats.sensitiveFound ? 'RISCHIO' : 'SICURO'}
            </span>
            <span className="text-[10px] uppercase font-bold text-adaptive-muted">Privacy</span>
          </div>
        </div>

        <div className="relative group">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Analisi testo..." className="glass-input w-full h-64 md:h-96 rounded-2xl p-6 text-lg font-light leading-relaxed resize-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all placeholder:text-adaptive-muted shadow-sm" />
          <div className="absolute bottom-4 right-4 flex gap-2 pointer-events-none opacity-50">
            {stats.topWords.map(w => (
              <span key={w} className="px-2 py-1 bg-[var(--bg-main)] border border-[var(--glass-border)] rounded-lg text-[10px] text-adaptive-muted italic">#{w}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <button onClick={handleAnonymize} className="flex-1 px-6 py-4 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 border border-fuchsia-500/30 rounded-xl font-bold text-fuchsia-600 transition-all flex items-center justify-center gap-2 group shadow-sm">ANONIMIZZA</button>
          <button onClick={handleClean} className="flex-1 px-6 py-4 glass-panel border-[var(--glass-border)] rounded-xl font-bold text-adaptive transition-all flex items-center justify-center gap-2 shadow-sm">PULISCI</button>
          <button onClick={handleCopy} className="px-6 py-4 glass-panel border-[var(--glass-border)] rounded-xl font-bold text-adaptive transition-all shadow-sm">COPIA</button>
        </div>
      </div>
    </div>
  );
};

export default TextAnalyzer;
