"use client";

import React, { useState } from 'react';
import { Dices, RotateCw, HelpCircle } from 'lucide-react';

const RandomizerModule = ({ onBack }: { onBack: () => void }) => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [numberResult, setNumberResult] = useState<number | null>(null);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [options, setOptions] = useState<string>('');
  const [choiceResult, setChoiceResult] = useState<string | null>(null);
  const [shaking, setShaking] = useState<string | null>(null);

  const generateNumber = () => {
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    setNumberResult(result);
    triggerShake('number');
  };

  const flipCoin = () => {
    const result = Math.random() < 0.5 ? 'Testa' : 'Croce';
    setCoinResult(result);
    triggerShake('coin');
  };

  const chooseRandom = () => {
    const items = options.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (items.length === 0) return;
    const result = items[Math.floor(Math.random() * items.length)];
    setChoiceResult(result);
    triggerShake('choice');
  };

  const triggerShake = (type: string) => {
    setShaking(type);
    setTimeout(() => setShaking(null), 500);
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Randomizer Pro</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Number Generator */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-700/10 border-emerald-500/20 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full bg-emerald-500/10 text-emerald-500 ${shaking === 'number' ? 'animate-bounce' : ''}`}>
              <Dices size={24} />
            </div>
            <h3 className="text-lg font-bold text-adaptive">Generatore Numeri</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase text-adaptive-muted mb-1 block">Minimo</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-adaptive font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-adaptive-muted mb-1 block">Massimo</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-adaptive font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={generateNumber}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all mt-2"
          >
            Genera
          </button>

          {numberResult !== null && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center animate-scale-in">
              <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Risultato</span>
              <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{numberResult}</span>
            </div>
          )}
        </div>

        {/* Coin Flip */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-700/10 border-teal-500/20 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full bg-teal-500/10 text-teal-500 ${shaking === 'coin' ? 'animate-spin' : ''}`}>
              <RotateCw size={24} />
            </div>
            <h3 className="text-lg font-bold text-adaptive">Lancio Moneta</h3>
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-4 border-teal-500/30 flex items-center justify-center">
              {coinResult ? (
                <span className="text-2xl font-black text-adaptive animate-scale-in">{coinResult}</span>
              ) : (
                <span className="text-6xl">🪙</span>
              )}
            </div>
          </div>

          <button
            onClick={flipCoin}
            className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold shadow-lg transition-all"
          >
            Lancia
          </button>
        </div>

        {/* Quick Choice */}
        <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-700/10 border-emerald-500/20 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-3 rounded-full bg-emerald-500/10 text-emerald-500 ${shaking === 'choice' ? 'animate-pulse' : ''}`}>
              <HelpCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-adaptive">Scelta Rapida</h3>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-adaptive-muted mb-1 block">Opzioni (separate da virgola)</label>
            <textarea
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="Pizza, Sushi, Pasta"
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-adaptive focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <button
            onClick={chooseRandom}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg transition-all"
          >
            Scegli per me
          </button>

          {choiceResult && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-center animate-scale-in">
              <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Risultato</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{choiceResult}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomizerModule;
