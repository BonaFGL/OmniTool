"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, Coins, ArrowLeftRight, Globe, RefreshCcw } from 'lucide-react';

const CurrencyModule = ({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('EUR');
  const [to, setTo] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Fetch rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
        if (!res.ok) throw new Error('Network error');
        const data = await res.json();
        const allRates = { [data.base]: 1, ...data.rates };
        setRates(allRates);
        setLastUpdated(data.date);
        setError('');
      } catch (err) {
        console.error(err);
        setError("Errore caricamento tassi");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convertedValue = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || !rates[from] || !rates[to]) return '---';
    // Logic: Convert From -> EUR -> To
    // rates[X] is X per 1 EUR.
    // So 1 unit of From = (1 / rates[from]) EUR
    // Then multiply by rates[to] to get To units.
    const result = (val / rates[from]) * rates[to];
    return result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }, [amount, from, to, rates]);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const currencyList = useMemo(() => Object.keys(rates).sort(), [rates]);

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Cambio Valute</h2>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl bg-emerald-900/10 border-emerald-500/20 shadow-sm relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            <p className="text-adaptive-muted font-bold animate-pulse">Aggiornamento tassi...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-bold text-xl">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-500/10 text-red-500 rounded-xl font-bold hover:bg-red-500/20 transition-all">
              Riprova
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8 relative z-10">
            {/* Amount Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-widest pl-2">Importo</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-2xl p-6 text-4xl md:text-6xl font-black text-adaptive outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all text-center shadow-inner"
                placeholder="0.00"
              />
            </div>

            {/* Currency Selectors */}
            <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
              <div className="relative group">
                <select
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  className="w-full appearance-none bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-xl md:text-2xl font-bold text-adaptive outline-none cursor-pointer hover:bg-[var(--glass-card-hover)] transition-all shadow-sm pl-12"
                >
                  {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {/* Flag placeholder or icon if we had flags, using simple Coin icon for now */}
                  <Coins className="text-emerald-500" size={20} />
                </div>
              </div>

              <button
                onClick={handleSwap}
                className="p-4 rounded-full bg-amber-400/20 hover:bg-amber-400/40 text-amber-600 dark:text-amber-400 hover:scale-110 active:rotate-180 transition-all duration-300 shadow-lg border border-amber-400/20"
                title="Inverti valute"
              >
                <ArrowLeftRight size={24} />
              </button>

              <div className="relative group">
                <select
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  className="w-full appearance-none bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-2xl p-4 text-xl md:text-2xl font-bold text-adaptive outline-none cursor-pointer hover:bg-[var(--glass-card-hover)] transition-all shadow-sm pl-12 text-right"
                  style={{ textAlignLast: 'end' }} // For Chrome
                >
                  {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Coins className="text-amber-500" size={20} />
                </div>
              </div>
            </div>

            {/* Result Display */}
            <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-3xl p-8 flex flex-col items-center justify-center gap-2 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-adaptive-muted font-medium text-lg z-10">{amount} {from} =</p>
              <h3 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500 dark:from-emerald-400 dark:to-amber-300 z-10">
                {convertedValue} <span className="text-lg md:text-2xl text-adaptive font-bold">{to}</span>
              </h3>
            </div>

            {/* Footer / Last Updated */}
            <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-adaptive-muted px-4">
              <span className="flex items-center gap-1"><Globe size={12} /> Tassi di mercato medio</span>
              <span className="flex items-center gap-1"><RefreshCcw size={12} /> Aggiornato: {lastUpdated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyModule;
