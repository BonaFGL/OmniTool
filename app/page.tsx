"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  MessageCircle, Link as IconLink, Share2, Globe, ExternalLink,
  FileText, Trash2, Download, Copy, Bold, List, Heading,
  MapPin, Compass, Utensils, Thermometer, Scale, Coffee,
  ChevronLeft, Palette, Search, Shield, Zap, Clock,
  ChevronRight, Sun, Moon, Languages, Coins, RefreshCcw,
  ArrowLeftRight, Loader2
} from 'lucide-react';

// --- ICONS (DASHBOARD) ---

const IconConverter = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const IconText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconSecurity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const IconPercent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const IconTime = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconColors = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const IconCurrency = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- MODULE 1: CONVERTER DATA ---

type CategoryId = 'massa' | 'lunghezza' | 'dati' | 'pressione' | 'energia' | 'temperatura' | 'cucina';

interface UnitDef {
  id: string;
  label: string;
  group: string;
  toBase?: number;
  toBaseFn?: (val: number) => number;
  fromBaseFn?: (val: number) => number;
}

interface CategoryDef {
  id: CategoryId;
  label: string;
  baseUnitId: string;
  icon: React.ReactNode;
  units: UnitDef[];
  commonTargets: string[];
}

const CatIcons = {
  massa: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  lunghezza: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  dati: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  pressione: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  energia: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  temperatura: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  cucina: <Utensils className="w-4 h-4" />
};

const CATEGORIES: Record<CategoryId, CategoryDef> = {
  massa: {
    id: 'massa',
    label: "Massa",
    baseUnitId: 'g',
    icon: CatIcons.massa,
    commonTargets: ['g', 'kg', 'lb', 'oz'],
    units: [
      { id: 'mg', label: 'Milligrammi (mg)', group: 'Metriche', toBase: 0.001 },
      { id: 'g', label: 'Grammi (g)', group: 'Metriche', toBase: 1 },
      { id: 'hg', label: 'Ettogrammi (hg)', group: 'Metriche', toBase: 100 },
      { id: 'kg', label: 'Chilogrammi (kg)', group: 'Metriche', toBase: 1000 },
      { id: 't', label: 'Tonnellate (t)', group: 'Metriche', toBase: 1000000 },
      { id: 'oz', label: 'Once (oz)', group: 'Imperiali', toBase: 28.3495 },
      { id: 'lb', label: 'Libbre (lb)', group: 'Imperiali', toBase: 453.592 },
      { id: 'st', label: 'Stone (st)', group: 'Imperiali', toBase: 6350.29 },
      { id: 'ct', label: 'Carati (ct)', group: 'Preziose', toBase: 0.2 },
    ]
  },
  lunghezza: {
    id: 'lunghezza',
    label: "Lunghezza",
    baseUnitId: 'm',
    icon: CatIcons.lunghezza,
    commonTargets: ['m', 'km', 'cm', 'mi', 'ft'],
    units: [
      { id: 'mm', label: 'Millimetri (mm)', group: 'Metriche', toBase: 0.001 },
      { id: 'cm', label: 'Centimetri (cm)', group: 'Metriche', toBase: 0.01 },
      { id: 'm', label: 'Metri (m)', group: 'Metriche', toBase: 1 },
      { id: 'km', label: 'Chilometri (km)', group: 'Metriche', toBase: 1000 },
      { id: 'in', label: 'Pollici (in)', group: 'Imperiali', toBase: 0.0254 },
      { id: 'ft', label: 'Piedi (ft)', group: 'Imperiali', toBase: 0.3048 },
      { id: 'yd', label: 'Iarde (yd)', group: 'Imperiali', toBase: 0.9144 },
      { id: 'mi', label: 'Miglia (mi)', group: 'Imperiali', toBase: 1609.34 },
      { id: 'nm', label: 'Nanometri (nm)', group: 'Microscopiche', toBase: 1e-9 },
      { id: 'ang', label: 'Ångström (Å)', group: 'Microscopiche', toBase: 1e-10 },
      { id: 'nmi', label: 'Miglia Nautiche', group: 'Navigazione', toBase: 1852 },
      { id: 'au', label: 'Unità Astronomiche (AU)', group: 'Astronomiche', toBase: 1.496e11 },
      { id: 'ly', label: 'Anni Luce (ly)', group: 'Astronomiche', toBase: 9.461e15 },
      { id: 'pc', label: 'Parsec (pc)', group: 'Astronomiche', toBase: 3.086e16 },
    ]
  },
  dati: {
    id: 'dati',
    label: "Dati Digitali",
    baseUnitId: 'byte',
    icon: CatIcons.dati,
    commonTargets: ['bit', 'byte', 'mb', 'gb', 'tb'],
    units: [
      { id: 'bit', label: 'Bit (b)', group: 'Base', toBase: 0.125 },
      { id: 'byte', label: 'Byte (B)', group: 'Base', toBase: 1 },
      { id: 'kb', label: 'Kilobyte (KB)', group: 'Multipli', toBase: 1000 },
      { id: 'mb', label: 'Megabyte (MB)', group: 'Multipli', toBase: 1e6 },
      { id: 'gb', label: 'Gigabyte (GB)', group: 'Multipli', toBase: 1e9 },
      { id: 'tb', label: 'Terabyte (TB)', group: 'Multipli', toBase: 1e12 },
      { id: 'pb', label: 'Petabyte (PB)', group: 'Multipli', toBase: 1e15 },
    ]
  },
  pressione: {
    id: 'pressione',
    label: "Pressione",
    baseUnitId: 'pa',
    icon: CatIcons.pressione,
    commonTargets: ['pa', 'bar', 'psi'],
    units: [
      { id: 'pa', label: 'Pascal (Pa)', group: 'SI', toBase: 1 },
      { id: 'hpa', label: 'Ettopascal (hPa)', group: 'SI', toBase: 100 },
      { id: 'bar', label: 'Bar', group: 'Comuni', toBase: 100000 },
      { id: 'atm', label: 'Atmosfere (atm)', group: 'Fisica', toBase: 101325 },
      { id: 'psi', label: 'PSI', group: 'Imperiali', toBase: 6894.76 },
    ]
  },
  energia: {
    id: 'energia',
    label: "Energia",
    baseUnitId: 'j',
    icon: CatIcons.energia,
    commonTargets: ['j', 'cal', 'kwh'],
    units: [
      { id: 'j', label: 'Joule (J)', group: 'SI', toBase: 1 },
      { id: 'kj', label: 'Kilojoule (kJ)', group: 'SI', toBase: 1000 },
      { id: 'cal', label: 'Calorie (cal)', group: 'Alimentari', toBase: 4.184 },
      { id: 'kcal', label: 'Kilocalorie (kcal)', group: 'Alimentari', toBase: 4184 },
      { id: 'wh', label: 'Wattora (Wh)', group: 'Elettricità', toBase: 3600 },
      { id: 'kwh', label: 'Kilowattora (kWh)', group: 'Elettricità', toBase: 3.6e6 },
      { id: 'ev', label: 'Elettronvolt (eV)', group: 'Fisica', toBase: 1.602e-19 },
    ]
  },
  temperatura: {
    id: 'temperatura',
    label: "Temperatura",
    baseUnitId: 'c',
    icon: CatIcons.temperatura,
    commonTargets: ['c', 'f', 'k'],
    units: [
      { id: 'c', label: 'Celsius (°C)', group: 'Metriche', toBaseFn: v => v, fromBaseFn: v => v },
      { id: 'f', label: 'Fahrenheit (°F)', group: 'Imperiali', toBaseFn: v => (v - 32) * 5 / 9, fromBaseFn: v => (v * 9 / 5) + 32 },
      { id: 'k', label: 'Kelvin (K)', group: 'Scientifiche', toBaseFn: v => v - 273.15, fromBaseFn: v => v + 273.15 },
    ]
  },
  cucina: {
    id: 'cucina',
    label: "Cucina",
    baseUnitId: 'ml',
    icon: CatIcons.cucina,
    commonTargets: ['ml', 'cup', 'tbsp', 'tsp', 'floz', 'g'],
    units: [
      { id: 'ml', label: 'Millilitri (ml)', group: 'Metrico', toBase: 1 },
      { id: 'l', label: 'Litri (l)', group: 'Metrico', toBase: 1000 },
      { id: 'cup', label: 'Tazza (Cup)', group: 'Cucina', toBase: 236.588 },
      { id: 'tbsp', label: 'Cucchiaio (Tbsp)', group: 'Cucina', toBase: 14.7868 },
      { id: 'tsp', label: 'Cucchiaino (Tsp)', group: 'Cucina', toBase: 4.92892 },
      { id: 'floz', label: 'Once Fluide (fl oz)', group: 'Cucina', toBase: 29.5735 },
      { id: 'g', label: 'Grammi (g)', group: 'Peso (Stimato)', toBase: 1 },
    ]
  }
};

const INGREDIENTS: Record<string, { label: string, density: number }> = {
  acqua: { label: 'Acqua', density: 1.0 },
  farina: { label: 'Farina 00', density: 0.53 },
  zucchero: { label: 'Zucchero Semolato', density: 0.85 },
  riso: { label: 'Riso Crudo', density: 0.85 },
  olio: { label: 'Olio', density: 0.92 },
  latte: { label: 'Latte Intero', density: 1.03 },
};

const formatVal = (num: number) => {
  if (isNaN(num)) return "-";
  if (num === 0) return "0";
  const abs = Math.abs(num);
  if (abs < 0.0001 || abs > 1000000) {
    return num.toExponential(4).replace('.', ',');
  }
  return new Intl.NumberFormat('it-IT', { maximumFractionDigits: 4 }).format(num);
};

// --- COMPONENTS ---

const SelectOptGroups = ({ units, value, onChange, className }: { units: UnitDef[], value: string, onChange: (e: any) => void, className: string }) => {
  const groups = units.reduce((acc, unit) => {
    if (!acc[unit.group]) acc[unit.group] = [];
    acc[unit.group].push(unit);
    return acc;
  }, {} as Record<string, UnitDef[]>);

  return (
    <select value={value} onChange={onChange} className={className}>
      {Object.entries(groups).map(([groupName, groupUnits]) => (
        <optgroup key={groupName} label={groupName} className="bg-[var(--bg-main)] text-adaptive font-bold">
          {groupUnits.map(u => (
            <option key={u.id} value={u.id} className="bg-[var(--bg-main)] text-adaptive font-normal pl-4">
              {u.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

// --- MODULE 1: CONVERTER ---

const UnitConverterModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('massa');
  const [inputValue, setInputValue] = useState<string>('');
  const [sourceUnitId, setSourceUnitId] = useState<string>('');
  const [advTargetUnitId, setAdvTargetUnitId] = useState<string>('');
  const [ingredient, setIngredient] = useState('acqua');

  useEffect(() => {
    const cat = CATEGORIES[activeCategory];
    setSourceUnitId(cat.units[0].id);
    setAdvTargetUnitId(cat.units[1]?.id || cat.units[0].id);
    setInputValue('');
  }, [activeCategory]);

  const catData = CATEGORIES[activeCategory];
  const sourceUnit = useMemo(() => catData.units.find(u => u.id === sourceUnitId) || catData.units[0], [catData, sourceUnitId]);
  const advTargetUnit = useMemo(() => catData.units.find(u => u.id === advTargetUnitId) || catData.units[0], [catData, advTargetUnitId]);

  const results = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || inputValue === '') return { error: null, grid: [], advanced: null };

    const density = INGREDIENTS[ingredient].density;

    let baseVal = 0;
    try {
      if (activeCategory === 'temperatura') {
        baseVal = sourceUnit.toBaseFn ? sourceUnit.toBaseFn(val) : val;
        if (baseVal < -273.1501) return { error: 'Temp. impossibile', grid: [], advanced: null };
      } else if (activeCategory === 'cucina' && sourceUnitId === 'g') {
        baseVal = val / density;
      } else {
        baseVal = val * (sourceUnit.toBase ?? 1);
      }

      const grid = catData.commonTargets.map(tId => {
        const u = catData.units.find(un => un.id === tId);
        if (!u) return null;
        let res = 0;
        if (activeCategory === 'temperatura') {
          res = u.fromBaseFn ? u.fromBaseFn(baseVal) : baseVal;
        } else if (activeCategory === 'cucina' && tId === 'g') {
          res = baseVal * density;
        } else {
          res = baseVal / (u.toBase || 1);
        }
        return { ...u, result: formatVal(res) };
      }).filter(Boolean);

      let advRes = 0;
      if (activeCategory === 'temperatura') {
        advRes = advTargetUnit.fromBaseFn ? advTargetUnit.fromBaseFn(baseVal) : baseVal;
      } else if (activeCategory === 'cucina' && advTargetUnitId === 'g') {
        advRes = baseVal * density;
      } else {
        advRes = baseVal / (advTargetUnit.toBase || 1);
      }

      return { error: null, grid, advanced: formatVal(advRes) };
    } catch {
      return { error: "Errore", grid: [], advanced: null };
    }
  }, [inputValue, sourceUnit, advTargetUnit, activeCategory, catData, ingredient, sourceUnitId, advTargetUnitId]);

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">{t.modules.converter.title}</h2>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-6 shadow-2xl flex flex-col gap-8">
        <nav className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-2 p-2 bg-[var(--glass-input-bg)] rounded-2xl border border-[var(--glass-border)] backdrop-blur-md">
          {(Object.keys(CATEGORIES) as CategoryId[]).map((cId) => (
            <button
              key={cId}
              onClick={() => setActiveCategory(cId)}
              className={`px-2 py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 uppercase tracking-wider ${activeCategory === cId ? 'bg-[var(--glass-card-hover)] text-adaptive shadow-inner ring-1 ring-[var(--glass-border)]' : 'text-adaptive-muted hover:text-adaptive'
                }`}
            >
              <div className="scale-125 md:scale-110 mb-1 md:mb-0 text-current">{CATEGORIES[cId].icon}</div>
              <span className="text-center">{CATEGORIES[cId].label}</span>
            </button>
          ))}
        </nav>

        {activeCategory === 'cucina' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 bg-orange-500/5 border border-orange-500/20 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-3 text-orange-400 shrink-0">
              <Utensils size={20} />
              <span className="text-xs font-black uppercase tracking-widest whitespace-nowrap">Seleziona Ingrediente:</span>
            </div>
            <select
              value={ingredient}
              onChange={e => setIngredient(e.target.value)}
              className="glass-input flex-1 py-2 px-4 rounded-xl font-bold appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-sm"
            >
              {Object.entries(INGREDIENTS).map(([key, data]) => (
                <option key={key} value={key} className="bg-[var(--bg-main)] text-adaptive">{data.label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-adaptive-muted uppercase tracking-[0.2em] ml-2">Valore</label>
            <input value={inputValue} onChange={e => setInputValue(e.target.value)} type="number" placeholder="0" className="glass-input w-full text-4xl font-light py-5 px-6 rounded-2xl shadow-sm" />
          </div>
          <div className="w-full md:w-64 space-y-2">
            <label className="text-[10px] font-black text-adaptive-muted uppercase tracking-[0.2em] ml-2">Unità Input</label>
            <div className="relative">
              <SelectOptGroups units={catData.units} value={sourceUnitId} onChange={e => setSourceUnitId(e.target.value)} className="glass-input w-full appearance-none py-5 px-6 rounded-2xl font-bold cursor-pointer shadow-sm" />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30"><svg className="w-4 h-4 text-adaptive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></div>
            </div>
          </div>
        </div>

        {results.error && <p className="text-center text-red-500 font-bold uppercase text-xs">{results.error}</p>}

        <div className="overflow-x-auto -mx-2 px-2 pb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[300px]">
            {results.grid.map((r: any) => (
              <div key={r.id} className="glass-card p-4 rounded-2xl shadow-sm">
                <span className="text-[10px] text-adaptive-muted uppercase font-bold">{r.label}</span>
                <div className="text-xl font-bold text-adaptive truncate break-words">{r.result} <span className="text-xs opacity-50 font-normal">{r.id}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE 2: TEXT ANALYZER ---

const TextAnalyzerModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
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
        <h2 className="text-2xl font-black text-adaptive">{t.modules.text.title}</h2>
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

// --- MODULE 3: SECURITY & QR ---

const SecurityModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdOpts, setPwdOpts] = useState({ upper: true, lower: true, num: true, sym: true });
  const [password, setPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

  const [qrValue, setQrValue] = useState('https://google.com');
  const [qrColor, setQrColor] = useState('#ffffff');

  const generatePassword = () => {
    let charset = "";
    if (pwdOpts.upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (pwdOpts.lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (pwdOpts.num) charset += "0123456789";
    if (pwdOpts.sym) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") return;

    let retVal = "";
    for (let i = 0, n = charset.length; i < pwdLength; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);

    let score = 0;
    if (pwdLength > 10) score++;
    if (pwdLength > 14) score++;
    let variety = 0;
    if (pwdOpts.upper) variety++;
    if (pwdOpts.lower) variety++;
    if (pwdOpts.num) variety++;
    if (pwdOpts.sym) variety++;
    if (variety > 2) score++;

    setPwdStrength(score >= 3 ? 2 : score >= 1 ? 1 : 0);
  };

  useEffect(() => {
    generatePassword();
  }, [pwdLength, pwdOpts]);

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qrcode.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">{t.modules.security.title}</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-emerald-900/10 border-emerald-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Generatore Password</h3>
          </div>
          <div className="bg-[var(--bg-main)] p-6 rounded-2xl relative group overflow-hidden break-all border border-[var(--glass-border)] shadow-inner">
            <p className="text-2xl font-mono text-emerald-500 font-bold">{password}</p>
            <button onClick={() => navigator.clipboard.writeText(password)} className="absolute top-4 right-4 p-2 glass-panel hover:bg-[var(--glass-card-hover)] rounded-lg text-adaptive opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold">COPIA</button>
            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${pwdStrength === 2 ? 'bg-emerald-500 w-full' : pwdStrength === 1 ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <input type="range" min="8" max="64" value={pwdLength} onChange={(e) => setPwdLength(parseInt(e.target.value))} className="flex-1 accent-emerald-500 h-2 bg-[var(--glass-input-bg)] rounded-lg appearance-none cursor-pointer" />
              <span className="min-w-[2.5rem] text-center font-mono text-emerald-500 font-black bg-emerald-500/10 py-1 rounded-lg border border-emerald-500/20">{pwdLength}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { id: 'upper', label: 'ABC' }, { id: 'lower', label: 'abc' },
                { id: 'num', label: '123' }, { id: 'sym', label: '#@!' }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-3 p-3 bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-xl cursor-pointer hover:bg-[var(--glass-card-hover)] transition-colors shadow-sm">
                  <input type="checkbox" checked={(pwdOpts as any)[opt.id]} onChange={(e) => setPwdOpts(p => ({ ...p, [opt.id]: e.target.checked }))} className="w-5 h-5 rounded border-[var(--glass-border)] text-emerald-500 bg-[var(--bg-main)]" />
                  <span className="text-sm font-bold text-adaptive">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={generatePassword} className="mt-auto w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all">RIGENERA</button>
        </section>

        <section className="glass-panel rounded-[2.5rem] p-8 shadow-2xl bg-cyan-900/10 border-cyan-500/20 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-adaptive">Generatore QR</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-[var(--glass-input-bg)] border border-[var(--glass-border)] rounded-3xl p-6 relative shadow-inner">
            <div className="bg-white p-4 rounded-xl shadow-lg transition-transform hover:scale-105">
              <QRCodeCanvas id="qr-code-canvas" value={qrValue} size={200} fgColor={qrColor === '#ffffff' ? '#000000' : qrColor} bgColor={"#ffffff"} level={"H"} />
            </div>
          </div>
          <div className="space-y-4">
            <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="glass-input w-full p-4 rounded-xl shadow-sm text-adaptive" placeholder="https://..." />
            <div className="flex gap-2">
              <button onClick={() => setQrColor('#ffffff')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#ffffff' ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-adaptive border-[var(--glass-border)] hover:bg-[var(--glass-card-hover)]'}`}>Nero</button>
              <button onClick={() => setQrColor('#0ea5e9')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#0ea5e9' ? 'bg-sky-500 text-white border-sky-500' : 'bg-transparent text-sky-500 border-sky-500/20 hover:bg-sky-500/10'}`}>Blu</button>
              <button onClick={() => setQrColor('#db2777')} className={`flex-1 py-3 rounded-lg border transition-all font-bold ${qrColor === '#db2777' ? 'bg-pink-600 text-white border-pink-600' : 'bg-transparent text-pink-600 border-pink-600/20 hover:bg-pink-600/10'}`}>Rosa</button>
            </div>
            <button onClick={downloadQR} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2">SCARICA PNG</button>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- MODULE 4: VAT & DISCOUNTS ---

const VATModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
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
        <h2 className="text-2xl font-black text-adaptive">{t.modules.vat.title}</h2>
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

// --- MODULE 5: TIMER & PRODUCTIVITY ---

const TimeModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('timer');

  // Stopwatch
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (swRunning) {
      interval = setInterval(() => setSwTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  const fmtSw = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${c.toString().padStart(2, '0')}`;
  };

  // Timer
  const [tmTime, setTmTime] = useState(25 * 60);
  const [tmRunning, setTmRunning] = useState(false);
  const [tmInitial, setTmInitial] = useState(25 * 60);
  const [tmFinished, setTmFinished] = useState(false);

  // Manual Input State
  const [manMin, setManMin] = useState('');
  const [manSec, setManSec] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (tmRunning && tmTime > 0) {
      interval = setInterval(() => setTmTime(t => t - 1), 1000);
      document.title = `${fmtTm(tmTime)} - OmniTool`;
    } else {
      document.title = "OmniTool"; // Reset title when paused or finished
      if (tmTime === 0 && tmRunning) {
        setTmRunning(false);
        setTmFinished(true);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [tmRunning, tmTime]);

  useEffect(() => {
    return () => { document.title = "OmniTool"; }
  }, []);

  const fmtTm = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = (min: number) => {
    const sec = min * 60;
    setTmInitial(sec);
    setTmTime(sec);
    setTmRunning(true);
    setTmFinished(false);
  };

  const setManualTime = () => {
    const m = parseInt(manMin) || 0;
    const s = parseInt(manSec) || 0;
    if (m <= 0 && s <= 0) return;

    const totalSec = m * 60 + s;
    setTmInitial(totalSec);
    setTmTime(totalSec);
    setTmRunning(false);
    setTmFinished(false);
    setManMin('');
    setManSec('');
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">{t.modules.time.title}</h2>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-1 rounded-2xl flex gap-1 shadow-inner">
          <button onClick={() => setActiveTab('timer')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'timer' ? 'bg-orange-500 text-white shadow-md' : 'text-adaptive-muted hover:text-adaptive'}`}>Pomodoro</button>
          <button onClick={() => setActiveTab('stopwatch')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'stopwatch' ? 'bg-orange-500 text-white shadow-md' : 'text-adaptive-muted hover:text-adaptive'}`}>Cronometro</button>
        </div>
      </div>

      {activeTab === 'timer' ? (
        <div className={`glass-panel rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl bg-orange-900/10 border-orange-500/20 text-center transition-all duration-500 ${tmFinished ? 'shadow-red-500/50 border-red-500 animate-pulse' : ''} shadow-sm`}>
          <div className="text-6xl md:text-[12rem] font-black leading-none tracking-tighter tabular-nums mb-8 bg-[var(--bg-main)] border border-[var(--glass-border)] text-adaptive rounded-[2rem] md:rounded-[3rem] py-6 md:py-8 whitespace-nowrap overflow-hidden text-ellipsis shadow-inner">
            {fmtTm(tmTime)}
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <div className="flex gap-2 items-center bg-[var(--glass-input-bg)] p-2 rounded-2xl border border-[var(--glass-border)] shadow-sm">
              <input type="number" value={manMin} onChange={e => setManMin(e.target.value)} placeholder="min" className="w-20 bg-transparent text-center text-xl font-bold placeholder:text-adaptive-muted outline-none border-b border-transparent focus:border-orange-500 transition-colors text-adaptive" />
              <span className="text-adaptive-muted font-bold">:</span>
              <input type="number" value={manSec} onChange={e => setManSec(e.target.value)} placeholder="sec" className="w-20 bg-transparent text-center text-xl font-bold placeholder:text-adaptive-muted outline-none border-b border-transparent focus:border-orange-500 transition-colors text-adaptive" />
              <button onClick={setManualTime} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold text-sm shadow-lg transition-all">IMPOSTA</button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button onClick={() => startTimer(25)} className="px-8 py-4 glass-card rounded-2xl font-bold flex flex-col items-center shadow-sm">
              <span className="text-2xl">🍅</span>
              <span className="text-xs uppercase mt-1 text-adaptive-muted font-bold tracking-wider">Focus 25'</span>
            </button>
            <button onClick={() => startTimer(5)} className="px-8 py-4 glass-card rounded-2xl font-bold flex flex-col items-center shadow-sm">
              <span className="text-2xl">☕</span>
              <span className="text-xs uppercase mt-1 text-adaptive-muted font-bold tracking-wider">Break 5'</span>
            </button>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setTmRunning(!tmRunning)} className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all ${tmRunning ? 'bg-orange-500/20 hover:bg-orange-500/40 text-orange-500' : 'bg-green-500 text-white hover:scale-110 shadow-lg shadow-green-500/30'}`}>
              {tmRunning ? '⏸' : '▶'}
            </button>
            <button onClick={() => { setTmRunning(false); setTmTime(tmInitial); setTmFinished(false); }} className="w-24 h-24 rounded-full glass-panel hover:bg-[var(--glass-card-hover)] flex items-center justify-center text-2xl transition-all text-adaptive">
              ↺
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl bg-orange-900/10 border-orange-500/20 flex flex-col items-center shadow-sm">
          <div className="text-5xl md:text-[9rem] font-black leading-none tracking-tighter tabular-nums mb-8 text-orange-500 dark:text-orange-200 whitespace-nowrap overflow-hidden text-ellipsis">
            {fmtSw(swTime)}
          </div>

          <div className="flex gap-4 mb-12 flex-wrap justify-center">
            <button onClick={() => setSwRunning(!swRunning)} className={`px-8 py-4 rounded-2xl font-bold text-xl min-w-[140px] shadow-lg transition-all ${swRunning ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-green-500 text-white hover:bg-green-400'}`}>
              {swRunning ? 'STOP' : 'START'}
            </button>
            <button onClick={() => setLaps(l => [swTime, ...l])} disabled={!swRunning} className="px-8 py-4 glass-panel border-[var(--glass-border)] rounded-2xl font-bold text-xl text-adaptive disabled:opacity-30 shadow-sm">
              LAP
            </button>
            <button onClick={() => { setSwRunning(false); setSwTime(0); setLaps([]); }} className="px-8 py-4 glass-panel border-[var(--glass-border)] rounded-2xl font-bold text-xl hover:bg-red-500/20 hover:text-red-500 transition-colors text-adaptive shadow-sm">
              RESET
            </button>
          </div>

          <div className="w-full max-w-lg space-y-2">
            {laps.slice(0, 5).map((l, i) => (
              <div key={laps.length - i} className="flex justify-between items-center p-4 bg-[var(--glass-input-bg)] rounded-xl border border-[var(--glass-border)] animate-fade-in shadow-sm">
                <span className="text-adaptive-muted font-bold">Giro {laps.length - i}</span>
                <span className="font-mono font-bold text-xl text-orange-500 dark:text-orange-200">{fmtSw(l)}</span>
                <span className="text-xs text-adaptive-muted font-bold">+{fmtSw(l - (laps[i + 1] || 0))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- MODULE 6: COLOR LAB ---

const ColorLabModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 239, s: 84, l: 67 });

  // Helpers
  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

  // Update State from Hex
  const updateFromHex = (h: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(h)) {
      const { r, g, b } = hexToRgb(h);
      setRgb({ r, g, b });
      setHsl(rgbToHsl(r, g, b));
      setHex(h);
    }
  };

  // Harmonies
  const harmonies = useMemo(() => {
    const { h, s, l } = hsl;

    const makeColor = (hNew: number, sNew: number, lNew: number) => {
      hNew = (hNew + 360) % 360;
      const { r, g, b } = hslToRgb(hNew, sNew, lNew);
      return rgbToHex(r, g, b);
    };

    return {
      complementary: [hex, makeColor(h + 180, s, l)],
      analogous: [makeColor(h - 30, s, l), hex, makeColor(h + 30, s, l)],
      triadic: [hex, makeColor(h + 120, s, l), makeColor(h + 240, s, l)],
      monochromatic: [
        makeColor(h, s, Math.max(0, l - 30)),
        hex,
        makeColor(h, s, Math.min(100, l + 30))
      ]
    };
  }, [hex, hsl]);

  // Contrast
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrast = (lum1: number, lum2: number) => {
    const bright = Math.max(lum1, lum2);
    const dark = Math.min(lum1, lum2);
    return (bright + 0.05) / (dark + 0.05);
  };

  const contrastData = useMemo(() => {
    const lumi = getLuminance(rgb.r, rgb.g, rgb.b);
    const whiteLumi = 1; // getLuminance(255,255,255)
    const blackLumi = 0; // getLuminance(0,0,0)

    const whiteRatio = getContrast(whiteLumi, lumi);
    const blackRatio = getContrast(blackLumi, lumi);

    return { white: whiteRatio, black: blackRatio };
  }, [rgb]);

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">{t.modules.colors.title}</h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="glass-panel lg:col-span-1 rounded-[2.5rem] p-6 md:p-8 shadow-2xl bg-indigo-900/10 border-indigo-500/20 flex flex-col gap-6 shadow-sm">
          <h3 className="text-xl font-bold text-adaptive">Selettore</h3>

          <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-inner ring-1 ring-[var(--glass-border)] group">
            <input
              type="color"
              value={hex}
              onChange={e => updateFromHex(e.target.value)}
              className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer p-0 border-0 outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-4 rounded-xl flex items-center justify-between group shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-adaptive-muted block">HEX</span>
                <input className="font-mono font-bold text-lg bg-transparent text-adaptive outline-none w-24 uppercase" value={hex} onChange={e => updateFromHex(e.target.value)} maxLength={7} />
              </div>
              <button onClick={() => copyToClipboard(hex)} className="p-2 glass-panel hover:bg-[var(--glass-card-hover)] rounded-lg text-adaptive-muted hover:text-adaptive transition-colors">
                <Copy size={16} />
              </button>
            </div>

            <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-4 rounded-xl flex items-center justify-between group shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-adaptive-muted block">RGB</span>
                <span className="font-mono font-bold text-lg text-adaptive">{rgb.r}, {rgb.g}, {rgb.b}</span>
              </div>
              <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="p-2 glass-panel hover:bg-[var(--glass-card-hover)] rounded-lg text-adaptive-muted hover:text-adaptive transition-colors">
                <Copy size={16} />
              </button>
            </div>

            <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-4 rounded-xl flex items-center justify-between group shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-adaptive-muted block">HSL</span>
                <span className="font-mono font-bold text-lg text-adaptive">{hsl.h}°, {hsl.s}%, {hsl.l}%</span>
              </div>
              <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="p-2 glass-panel hover:bg-[var(--glass-card-hover)] rounded-lg text-adaptive-muted hover:text-adaptive transition-colors">
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-2xl bg-violet-900/10 border-violet-500/20 shadow-sm">
            <h3 className="text-xl font-bold text-adaptive mb-6">Armonie</h3>
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-adaptive-muted mb-2 block">Complementare</span>
                <div className="flex gap-2 h-16">
                  {harmonies.complementary.map((c, i) => (
                    <button key={i} onClick={() => updateFromHex(c)} className="flex-1 rounded-xl transition-transform hover:scale-105 hover:shadow-xl ring-1 ring-[var(--glass-border)]" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-adaptive-muted mb-2 block">Analogo</span>
                <div className="flex gap-2 h-16">
                  {harmonies.analogous.map((c, i) => (
                    <button key={i} onClick={() => updateFromHex(c)} className="flex-1 rounded-xl transition-transform hover:scale-105 hover:shadow-xl ring-1 ring-[var(--glass-border)]" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-adaptive-muted mb-2 block">Triade</span>
                <div className="flex gap-2 h-16">
                  {harmonies.triadic.map((c, i) => (
                    <button key={i} onClick={() => updateFromHex(c)} className="flex-1 rounded-xl transition-transform hover:scale-105 hover:shadow-xl ring-1 ring-[var(--glass-border)]" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-adaptive-muted mb-2 block">Monocromatico</span>
                <div className="flex gap-2 h-16">
                  {harmonies.monochromatic.map((c, i) => (
                    <button key={i} onClick={() => updateFromHex(c)} className="flex-1 rounded-xl transition-transform hover:scale-105 hover:shadow-xl ring-1 ring-[var(--glass-border)]" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2.5rem] p-6 md:p-8 shadow-2xl bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-sm">
            <h3 className="text-xl font-bold text-adaptive mb-6">Accessibilità (Contrasto)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-6 flex flex-col justify-center items-center gap-2 transition-colors border border-[var(--glass-border)]" style={{ backgroundColor: hex }}>
                <span className="text-2xl font-bold" style={{ color: 'white' }}>Testo Bianco</span>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-black/40 rounded-full backdrop-blur-sm">
                  <span className="text-white font-mono font-bold">{contrastData.white.toFixed(2)}:1</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${contrastData.white >= 4.5 ? 'bg-green-500 text-black' : (contrastData.white >= 3 ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white')}`}>
                    {contrastData.white >= 4.5 ? 'AAA' : (contrastData.white >= 3 ? 'AA' : 'FAIL')}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl p-6 flex flex-col justify-center items-center gap-2 transition-colors border border-[var(--glass-border)]" style={{ backgroundColor: hex }}>
                <span className="text-2xl font-bold" style={{ color: 'black' }}>Testo Nero</span>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-white/40 rounded-full backdrop-blur-sm">
                  <span className="text-black font-mono font-bold">{contrastData.black.toFixed(2)}:1</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${contrastData.black >= 4.5 ? 'bg-green-500 text-white' : (contrastData.black >= 3 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white')}`}>
                    {contrastData.black >= 4.5 ? 'AAA' : (contrastData.black >= 3 ? 'AA' : 'FAIL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODULE 7: WHATSAPP & SOCIAL ---

const SocialModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
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
        <h2 className="text-2xl font-black text-adaptive">{t.modules.social.title}</h2>
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

// --- MODULE 8: NOTES ---

const NotesModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
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
        <h2 className="text-2xl font-black text-adaptive">{t.modules.notes.title}</h2>
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

// --- MODULE 10: CURRENCY EXCHANGE ---

const CurrencyModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
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
        setError(t.modules.currency.error || "Errore caricamento tassi");
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, [t]);

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
        <h2 className="text-2xl font-black text-adaptive">{t.modules.currency.title}</h2>
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

// --- MODULE 9: GEO & MAPS ---

const GeoModule = ({ onBack, t }: { onBack: () => void, t: any }) => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const isValidLat = useMemo(() => {
    if (!lat) return true;
    const n = parseFloat(lat);
    return !isNaN(n) && n >= -90 && n <= 90;
  }, [lat]);

  const isValidLon = useMemo(() => {
    if (!lon) return true;
    const n = parseFloat(lon);
    return !isNaN(n) && n >= -180 && n <= 180;
  }, [lon]);

  const toDMS = (deg: number, type: 'lat' | 'lon') => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    let card = '';
    if (type === 'lat') card = deg >= 0 ? 'N' : 'S';
    if (type === 'lon') card = deg >= 0 ? 'E' : 'W';

    return `${degrees}° ${minutes}' ${seconds}" ${card}`;
  };

  const dmsResult = useMemo(() => {
    const l = parseFloat(lat);
    const g = parseFloat(lon);
    if (isNaN(l) || isNaN(g) || !isValidLat || !isValidLon) return { lat: '-', lon: '-' };
    return {
      lat: toDMS(l, 'lat'),
      lon: toDMS(g, 'lon')
    };
  }, [lat, lon, isValidLat, isValidLon]);

  const handleOpenMap = (service: 'google' | 'apple' | 'waze') => {
    const l = parseFloat(lat);
    const g = parseFloat(lon);
    if (isNaN(l) || isNaN(g) || !isValidLat || !isValidLon) return;

    let url = '';
    if (service === 'google') url = `https://www.google.com/maps/search/?api=1&query=${l},${g}`;
    if (service === 'apple') url = `http://maps.apple.com/?ll=${l},${g}`;
    if (service === 'waze') url = `https://waze.com/ul?ll=${l},${g}&navigate=yes`;

    window.open(url, '_blank');
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">{t.modules.geo.title}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="glass-panel p-6 md:p-8 rounded-[2.5rem] bg-cyan-900/10 border-cyan-500/20 flex flex-col gap-6 shadow-sm">
          <h3 className="text-xl font-bold text-adaptive flex items-center gap-2">
            <Compass className="text-cyan-500 dark:text-cyan-400" /> Input Coordinate
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black text-adaptive-muted mb-1 block">Latitudine (-90 / 90)</label>
              <input
                type="number"
                value={lat}
                onChange={e => setLat(e.target.value)}
                placeholder="45.4642"
                className={`glass-input w-full p-4 rounded-xl text-xl font-mono transition-all shadow-sm ${!isValidLat ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {!isValidLat && <span className="text-xs text-red-500 font-bold mt-1 block">Valore non valido</span>}
            </div>
            <div>
              <label className="text-[10px] uppercase font-black text-adaptive-muted mb-1 block">Longitudine (-180 / 180)</label>
              <input
                type="number"
                value={lon}
                onChange={e => setLon(e.target.value)}
                placeholder="9.1900"
                className={`glass-input w-full p-4 rounded-xl text-xl font-mono transition-all shadow-sm ${!isValidLon ? 'border-red-500/50 focus:ring-red-500' : ''}`}
              />
              {!isValidLon && <span className="text-xs text-red-500 font-bold mt-1 block">Valore non valido</span>}
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-8">
          <section className="glass-panel p-6 md:p-8 rounded-[2.5rem] bg-[var(--glass-bg)] border border-[var(--glass-border)] relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <MapPin size={100} className="text-adaptive" />
            </div>
            <h3 className="text-xl font-bold text-adaptive mb-6">Formato DMS</h3>
            <div className="space-y-4 relative z-10">
              <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-4 rounded-xl flex justify-between items-center shadow-inner">
                <span className="text-2xl font-mono text-cyan-600 dark:text-cyan-300 font-bold">{dmsResult.lat}</span>
                <span className="text-[10px] uppercase font-bold text-adaptive-muted">LAT</span>
              </div>
              <div className="bg-[var(--glass-input-bg)] border border-[var(--glass-border)] p-4 rounded-xl flex justify-between items-center shadow-inner">
                <span className="text-2xl font-mono text-cyan-600 dark:text-cyan-300 font-bold">{dmsResult.lon}</span>
                <span className="text-[10px] uppercase font-bold text-adaptive-muted">LON</span>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleOpenMap('google')} className="p-4 rounded-2xl bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 transition-all font-bold text-cyan-600 dark:text-cyan-100 flex flex-col items-center gap-2 group shadow-sm">
              <Globe className="group-hover:scale-110 transition-transform" />
              Google Maps
            </button>
            <button onClick={() => handleOpenMap('apple')} className="p-4 rounded-2xl glass-panel border border-[var(--glass-border)] hover:bg-[var(--glass-card-hover)] transition-all font-bold text-adaptive flex flex-col items-center gap-2 group shadow-sm">
              <MapPin className="group-hover:scale-110 transition-transform text-adaptive" />
              Apple Maps
            </button>
            <button onClick={() => handleOpenMap('waze')} className="col-span-2 p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/30 transition-all font-bold text-blue-600 dark:text-blue-200 flex items-center justify-center gap-2 shadow-sm">
              <Compass size={20} /> Apri in Waze
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD (HOME) ---

const DashboardCard = ({
  icon,
  title,
  desc,
  active = false,
  onClick
}: {
  icon: React.ReactNode,
  title: string,
  desc: string,
  active?: boolean,
  onClick?: () => void
}) => (
  <button
    onClick={onClick}
    className={`group relative p-6 rounded-3xl border transition-all duration-500 text-left h-full flex flex-col glass-card w-full ${active
      ? 'border-[var(--glass-border)] shadow-lg scale-[1.02]'
      : 'border-[var(--glass-border)] hover:scale-[1.02]'
      }`}
  >
    <div className={`p-4 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${active ? 'bg-[var(--glass-input-bg)]' : 'bg-[var(--glass-input-bg)]'}`}>
      <div className="text-adaptive">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-2 text-adaptive group-hover:text-blue-500 transition-colors">{title}</h3>
    <p className="text-sm text-adaptive-muted group-hover:text-adaptive transition-colors leading-relaxed h-12 overflow-hidden">{desc}</p>

    <div className="mt-auto pt-6 flex justify-end">
      <div className="w-8 h-8 rounded-full bg-[var(--glass-input-bg)] flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white group-hover:translate-x-1 transition-all">
        <ChevronLeft className="rotate-180 text-adaptive-muted group-hover:text-white" size={16} />
      </div>
    </div>
  </button>
);

// --- MAIN CONTROLLER ---

type ViewState = 'dashboard' | 'converter' | 'text' | 'security' | 'vat' | 'time' | 'colors' | 'social' | 'notes' | 'geo' | 'currency';

// --- TRANSLATIONS ---

const translations = {
  it: {
    title: "OmniTool",
    subtitle: "La tua suite professionale di utility digitali.",
    searchPlaceholder: "Cerca modulo...",
    noResults: "Nessun modulo trovato per",
    showAll: "Mostra tutti",
    footerText: "Suite di utility digitali • 2024",
    modules: {
      converter: { title: "Convertitore Universale", desc: "Unità, valute e misure per ogni esigenza." },
      text: { title: "Analisi Testo", desc: "Statistiche, pulizia e manipolazione stringhe." },
      security: { title: "Sicurezza & QR", desc: "Password sicure e generazione QR Code." },
      vat: { title: "Calcolo IVA & Sconto", desc: "Scorporo/Aggiunta IVA e calcolatore sconti." },
      time: { title: "Timer & Produttività", desc: "Pomodoro timer e gestione tempo." },
      colors: { title: "Laboratorio Colori", desc: "Generatore di palette armoniche e accessibilità." },
      social: { title: "WhatsApp & Social", desc: "Generatore link rapidi WA e strumenti URL." },
      notes: { title: "Note Veloci", desc: "Editor persistente con supporto Markdown." },
      geo: { title: "Geo & Maps", desc: "Convertitore coordinate e link mappe." },
      currency: { title: "Cambio Valute", desc: "Tassi di cambio in tempo reale." },
    }
  },
  en: {
    title: "OmniTool",
    subtitle: "Your professional digital utilities suite.",
    searchPlaceholder: "Search modules...",
    noResults: "No modules found for",
    showAll: "Show all",
    footerText: "Digital Utility Suite • 2024",
    modules: {
      converter: { title: "Universal Converter", desc: "Units, currencies, and measurements." },
      text: { title: "Text Analysis", desc: "Statistics, cleaning, and string manipulation." },
      security: { title: "Security & QR", desc: "Secure passwords and QR generation." },
      vat: { title: "VAT & Discount", desc: "Tax calculations and discount tools." },
      time: { title: "Timer & Productivity", desc: "Pomodoro timer and time management." },
      colors: { title: "Color Lab", desc: "Harmonic palette generator and accessibility." },
      social: { title: "WhatsApp & Social", desc: "WA quick links and URL tools." },
      notes: { title: "Quick Notes", desc: "Persistent editor with Markdown support." },
      geo: { title: "Geo & Maps", desc: "Coordinate converter and map links." },
      currency: { title: "Currency Exchange", desc: "Real-time international exchange rates." },
    }
  }
};

function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'it' | 'en'>('it');

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'it' ? 'en' : 'it');
  };

  const modules = [
    { id: 'converter' as ViewState, title: t.modules.converter.title, desc: t.modules.converter.desc, icon: <IconConverter /> },
    { id: 'text' as ViewState, title: t.modules.text.title, desc: t.modules.text.desc, icon: <IconText /> },
    { id: 'security' as ViewState, title: t.modules.security.title, desc: t.modules.security.desc, icon: <IconSecurity /> },
    { id: 'vat' as ViewState, title: t.modules.vat.title, desc: t.modules.vat.desc, icon: <IconPercent /> },
    { id: 'time' as ViewState, title: t.modules.time.title, desc: t.modules.time.desc, icon: <IconTime /> },
    { id: 'colors' as ViewState, title: t.modules.colors.title, desc: t.modules.colors.desc, icon: <IconColors /> },
    { id: 'social' as ViewState, title: t.modules.social.title, desc: t.modules.social.desc, icon: <div className="text-adaptive"><MessageCircle size={40} strokeWidth={1.5} /></div> },
    { id: 'notes' as ViewState, title: t.modules.notes.title, desc: t.modules.notes.desc, icon: <div className="text-adaptive"><FileText size={40} strokeWidth={1.5} /></div> },
    { id: 'geo' as ViewState, title: t.modules.geo.title, desc: t.modules.geo.desc, icon: <div className="text-adaptive"><MapPin size={40} strokeWidth={1.5} /></div> },
    { id: 'currency' as ViewState, title: t.modules.currency.title, desc: t.modules.currency.desc, icon: <IconCurrency /> },
  ];

  const filteredModules = modules.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen font-sans text-adaptive relative flex flex-col overflow-x-hidden max-w-[100vw]">
      <div className="mesh-background fixed inset-0 z-[-1]" />

      {view === 'dashboard' ? (
        <div className="max-w-7xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-top-4 duration-1000 flex-1">
          <div className="flex flex-col items-center mb-12 space-y-6">
            <div className="relative text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-400 dark:from-white dark:via-white dark:to-white/40">
                Omni<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-600">Tool</span>
              </h1>
              <p className="text-lg md:text-2xl text-adaptive-muted font-medium max-w-2xl leading-relaxed mx-auto">
                {t.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-adaptive-muted group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input border border-[var(--glass-border)] focus:ring-2 focus:ring-blue-500/50 placeholder:text-adaptive-muted"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleLang}
                  className="p-3 rounded-xl glass-panel hover:bg-white/10 transition-all active:scale-95 text-adaptive flex items-center gap-2 font-bold text-sm"
                  aria-label="Toggle Language"
                >
                  <Languages className="w-5 h-5" />
                  <span className="hidden sm:inline uppercase">{lang}</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-xl glass-panel hover:bg-white/10 transition-all active:scale-95 text-adaptive"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-300" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 relative z-10 transition-all duration-500">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <div key={module.id} className="animate-scale-in h-full">
                  <DashboardCard
                    active
                    onClick={() => setView(module.id)}
                    icon={module.icon}
                    title={module.title}
                    desc={module.desc}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center animate-fade-in glass-panel rounded-3xl p-8">
                <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                  <Search className="w-8 h-8 text-adaptive-muted" />
                </div>
                <p className="text-lg font-medium text-adaptive-muted">{t.noResults} "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t.showAll}
                </button>
              </div>
            )}
          </div>

          <footer className="mt-24 pb-12 text-center border-t border-[var(--glass-border)] pt-12">
            <p className="text-adaptive-muted text-xs font-bold tracking-widest uppercase mb-2">OmniTool Dashboard</p>
            <p className="text-adaptive-muted text-[10px]">{t.footerText}</p>
          </footer>
        </div>
      ) : view === 'converter' ? (
        <UnitConverterModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'text' ? (
        <TextAnalyzerModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'security' ? (
        <SecurityModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'vat' ? (
        <VATModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'time' ? (
        <TimeModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'colors' ? (
        <ColorLabModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'social' ? (
        <SocialModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'notes' ? (
        <NotesModule onBack={() => setView('dashboard')} t={t} />
      ) : view === 'geo' ? (
        <GeoModule onBack={() => setView('dashboard')} t={t} />
      ) : (
        <CurrencyModule onBack={() => setView('dashboard')} t={t} />
      )}
    </main>
  );
}

export default App;
