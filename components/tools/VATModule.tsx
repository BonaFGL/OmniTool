"use client";

import React, { useState, useMemo } from 'react';

const VATModule = ({ onBack }: { onBack: () => void }) => {
  const [vatAmount, setVatAmount] = useState('');
  const [vatRate, setVatRate] = useState(22);
  const [vatMode, setVatMode] = useState<'add' | 'remove'>('add');
  const [discountPrice, setDiscountPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');

  const vatResults = useMemo(() => {
    const val = parseFloat(vatAmount);
    const rate = parseFloat(vatRate as any);
    if (!Number.isFinite(val) || !Number.isFinite(rate) || val === 0) return { net: 0, vat: 0, total: 0 };

    if (vatMode === 'add') {
      const vat = val * (rate / 100);
      return { net: val, vat: vat, total: val + vat };
    } else {
      const net = val / (1 + rate / 100);
      return { net: net, vat: val - net, total: val };
    }
  }, [vatAmount, vatRate, vatMode]);

  const discResults = useMemo(() => {
    const val = parseFloat(discountPrice);
    const pct = parseFloat(discountPercent);
    if (!Number.isFinite(val) || !Number.isFinite(pct) || val === 0) return { save: 0, final: 0 };

    const save = val * (pct / 100);
    return { save, final: val - save };
  }, [discountPrice, discountPercent]);

  const fmt = (n: number) => {
    if (!Number.isFinite(n)) return "€ 0,00";
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Calcolo IVA & Sconto</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-amber-900/10 border-amber-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Calcolo IVA</h3>
          </div>
          <div className="flex gap-2 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-1 rounded-xl shadow-inner">
            <button onClick={() => setVatMode('add')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${vatMode === 'add' ? 'bg-amber-500 text-white shadow-md' : 'text-adaptive-muted hover:text-adaptive'}`}>AGGIUNGI IVA</button>
            <button onClick={() => setVatMode('remove')} className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${vatMode === 'remove' ? 'bg-amber-500 text-white shadow-md' : 'text-adaptive-muted hover:text-adaptive'}`}>SCORPORA IVA</button>
          </div>
          <div className="space-y-4">
            <input type="number" value={vatAmount} onChange={e => setVatAmount(e.target.value)} placeholder="0.00" className="glass-input w-full text-4xl p-4 rounded-xl shadow-sm" />
            <div className="flex flex-wrap gap-2 mt-2">
              {[4, 5, 10, 22].map(r => (
                <button key={r} onClick={() => setVatRate(r)} className={`flex-1 px-4 py-3 rounded-xl border font-bold transition-all ${vatRate === r ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-transparent text-adaptive border-[var(--glass-border)] hover:bg-[var(--glass-card-hover)]'}`}>{r}%</button>
              ))}
              <div className="flex-1 relative min-w-[80px]">
                <input type="number" value={vatRate} onChange={e => setVatRate(parseFloat(e.target.value))} className="w-full h-full glass-input rounded-xl text-center font-bold px-2 focus:ring-1 focus:ring-amber-500 outline-none shadow-sm" placeholder="altri" />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-[var(--bg-main)] border border-[var(--glass-border)] rounded-2xl p-6 space-y-3 shadow-inner">
            <div className="flex justify-between text-sm text-adaptive-muted"><span>Imponibile</span><span className="text-adaptive">{fmt(vatResults.net)}</span></div>
            <div className="flex justify-between text-sm text-adaptive-muted"><span>IVA ({vatRate}%)</span><span className="text-adaptive">{fmt(vatResults.vat)}</span></div>
            <div className="h-px bg-[var(--glass-border)] my-2" />
            <div className="flex justify-between text-xl font-black text-amber-500"><span>TOTALE</span><span>{fmt(vatResults.total)}</span></div>
          </div>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-yellow-900/10 border-yellow-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Calcolo Sconti</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-adaptive-muted ml-2">Prezzo Originale</label>
              <input type="number" value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} placeholder="0.00" className="glass-input w-full text-2xl p-4 rounded-xl shadow-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-adaptive-muted ml-2">Sconto %</label>
              <input type="number" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} placeholder="20" className="glass-input w-full text-2xl p-4 rounded-xl shadow-sm" />
            </div>
          </div>
          <div className="mt-auto bg-[var(--bg-main)] border border-[var(--glass-border)] rounded-2xl p-6 grid grid-cols-2 gap-4 text-center shadow-inner">
            <div><span className="block text-[10px] uppercase font-bold text-adaptive-muted mb-1">Risparmio</span><span className="text-xl font-bold text-red-500">{fmt(discResults.save)}</span></div>
            <div><span className="block text-[10px] uppercase font-bold text-adaptive-muted mb-1">Prezzo Finale</span><span className="text-xl font-black text-yellow-600 dark:text-yellow-400">{fmt(discResults.final)}</span></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VATModule;
