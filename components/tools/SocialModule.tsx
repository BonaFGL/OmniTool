"use client";

import React, { useState, useMemo } from 'react';
import { MessageCircle, Link as IconLink, ExternalLink, Globe } from 'lucide-react';

const SocialModule = ({ onBack }: { onBack: () => void }) => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // URL Encoder State
  const [urlInput, setUrlInput] = useState('');
  const [urlResult, setUrlResult] = useState('');

  const cleanPhone = useMemo(() => {
    return phone.replace(/[^0-9+]/g, '');
  }, [phone]);

  const waLink = useMemo(() => {
    const p = cleanPhone || '390000000000';
    const m = encodeURIComponent(message);
    return `https://wa.me/${p}${m ? `?text=${m}` : ''}`;
  }, [cleanPhone, message]);

  const handleTest = () => {
    window.open(waLink, '_blank');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUrlEncode = () => {
    try { setUrlResult(encodeURIComponent(urlInput)); } catch { setUrlResult('Errore'); }
  };

  const handleUrlDecode = () => {
    try { setUrlResult(decodeURIComponent(urlInput)); } catch { setUrlResult('Errore'); }
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8 text-adaptive">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">WhatsApp & Social</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-2xl bg-lime-900/10 border-lime-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-lime-500/20 text-lime-500"><MessageCircle size={24} /></div>
            <h3 className="text-xl font-bold text-adaptive">WhatsApp Link Generator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] bg-[var(--glass-input-bg)] border border-[var(--glass-border)] px-2 py-1 rounded text-lime-600 dark:text-lime-400 uppercase font-black tracking-wider mb-2 inline-block">Numero Telefono</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-adaptive-muted font-bold">+</span>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="39 333 1234567"
                  className="glass-input w-full pl-8 py-4 rounded-xl text-lg font-mono placeholder:text-adaptive-muted shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] bg-[var(--glass-input-bg)] border border-[var(--glass-border)] px-2 py-1 rounded text-lime-600 dark:text-lime-400 uppercase font-black tracking-wider mb-2 inline-block">Messaggio Predefinito</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Ciao! Vorrei maggiori informazioni..."
                className="glass-input w-full h-32 rounded-xl text-base p-4 resize-none placeholder:text-adaptive-muted shadow-sm"
              />
            </div>
          </div>

          <div className="bg-lime-500/10 border border-lime-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 overflow-hidden shadow-inner">
            <div className="w-full truncate font-mono text-xs text-lime-700 dark:text-lime-200/70 select-all break-all whitespace-pre-wrap">{waLink}</div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleCopy(waLink)} className="p-2 rounded-lg bg-lime-500/20 hover:bg-lime-500/40 text-lime-600 dark:text-lime-400 transition-colors" title="Copia"><IconLink size={18} /></button>
              <button onClick={handleTest} className="p-2 rounded-lg bg-lime-500 hover:bg-lime-400 text-white font-bold transition-colors flex items-center gap-2 shadow-md" title="Apri">
                <span className="text-xs hidden sm:inline uppercase">Prova</span> <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-8">
          <section className="glass-panel p-6 rounded-[2.5rem] bg-[#0b141a] dark:bg-[#0b141a]/80 border-[var(--glass-border)] relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 w-full h-16 bg-[#202c33] flex items-center px-4 gap-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-slate-400/20" />
              <div className="flex flex-col">
                <div className="w-24 h-3 bg-white/10 rounded mb-1" />
                <div className="w-16 h-2 bg-white/5 rounded" />
              </div>
            </div>
            <div className="mt-20 flex flex-col items-end space-y-2">
              {message ? (
                <div
                  className="bg-[#005c4b] text-[#e9edef] p-3 rounded-tr-none rounded-2xl max-w-[85%] shadow-md text-sm leading-relaxed relative break-words whitespace-pre-wrap"
                  style={{ wordBreak: 'break-word' }}
                >
                  {message}
                  <span className="text-[10px] text-white/40 block text-right mt-1">15:00</span>
                </div>
              ) : (
                <div className="text-center w-full text-white/20 text-sm italic mt-8">Anteprima messaggio...</div>
              )}
            </div>
          </section>

          <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-emerald-900/5 border-[var(--glass-border)] flex-1 flex flex-col shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-[var(--glass-input-bg)] text-adaptive-muted"><Globe size={20} /></div>
              <h3 className="text-lg font-bold text-adaptive">URL Encoder / Decoder</h3>
            </div>
            <input
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="Incolla URL o testo sporco..."
              className="glass-input w-full p-4 rounded-xl text-sm mb-4 font-mono shadow-sm"
            />
            <div className="flex gap-2 mb-4">
              <button onClick={handleUrlEncode} className="flex-1 py-3 glass-panel hover:bg-[var(--glass-card-hover)] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">Encode</button>
              <button onClick={handleUrlDecode} className="flex-1 py-3 glass-panel hover:bg-[var(--glass-card-hover)] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm">Decode</button>
            </div>
            <div className="mt-auto bg-[var(--bg-main)] border border-[var(--glass-border)] p-4 rounded-xl relative group shadow-inner">
              <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 break-all pr-8 h-20 overflow-y-auto custom-scrollbar">
                {urlResult || <span className="text-adaptive-muted italic">Risultato...</span>}
              </div>
              <button onClick={() => handleCopy(urlResult)} className="absolute top-2 right-2 p-2 text-adaptive-muted hover:text-adaptive transition-colors"><IconLink size={14} /></button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SocialModule;
