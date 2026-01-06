"use client";

import React, { useState } from 'react';
import { Activity, Droplets } from 'lucide-react';

const WellnessModule = ({ onBack }: { onBack: () => void }) => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(70);

  const calculateBMI = () => {
    if (!height || !weight) return 0;
    return (weight / Math.pow(height / 100, 2));
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Sottopeso', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30' };
    if (bmi < 25) return { label: 'Normale', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    if (bmi < 30) return { label: 'Sovrappeso', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { label: 'Obeso', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
  };

  const calculateWater = () => {
    if (!weight) return 0;
    return (weight * 0.03).toFixed(1);
  };

  const bmi = calculateBMI();
  const category = getBMICategory(bmi);
  const water = calculateWater();

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Wellness & BMI</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* BMI Calculator */}
        <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-sky-400/10 to-blue-600/10 border-sky-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-sky-500/10 text-sky-500">
              <Activity size={28} />
            </div>
            <h3 className="text-xl font-bold text-adaptive">BMI Calculator</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-adaptive-muted mb-2 block">Altezza (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-adaptive font-mono text-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-adaptive-muted mb-2 block">Peso (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-adaptive font-mono text-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {bmi > 0 && (
            <div className="mt-4 space-y-4">
              <div className={`p-6 rounded-2xl ${category.bg} border ${category.border} text-center`}>
                <span className="text-xs uppercase font-bold text-adaptive-muted block mb-2">Il tuo BMI</span>
                <span className={`text-5xl font-black ${category.color} font-mono block mb-2`}>{bmi.toFixed(1)}</span>
                <span className={`text-lg font-bold ${category.color}`}>{category.label}</span>
              </div>

              {/* BMI Visual Indicator */}
              <div className="relative h-3 bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-300"
                  style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-adaptive-muted">
                <span>15</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
              </div>
            </div>
          )}
        </div>

        {/* Hydration Tracker */}
        <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-sky-400/10 to-blue-600/10 border-blue-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Droplets size={28} />
            </div>
            <h3 className="text-xl font-bold text-adaptive">Idratazione</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/20 to-sky-500/20 border-4 border-blue-500/30 flex items-center justify-center animate-pulse">
                <Droplets size={64} className="text-blue-500" />
              </div>
            </div>

            <div className="mt-8 text-center space-y-2">
              <p className="text-xs uppercase font-bold text-adaptive-muted">Litri d'acqua al giorno</p>
              <p className="text-6xl font-black text-blue-500 font-mono">{water}</p>
              <p className="text-sm font-bold text-adaptive-muted">Litri</p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center max-w-xs">
              <p className="text-xs text-adaptive-muted leading-relaxed">
                💧 Basato su peso corporeo ({weight}kg) × 0.03 L/kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessModule;
