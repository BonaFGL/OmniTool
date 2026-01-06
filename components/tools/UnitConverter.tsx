"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Utensils, Loader2, Minimize, UploadCloud, Image as IconImage } from 'lucide-react';

// --- DATA & TYPES ---

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
  cucina: <Utensils className="w-4 h-4" />,
  loader: <Loader2 className="w-8 h-8 md:w-10 md:h-10" />,
  minimize: <Minimize className="w-8 h-8 md:w-10 md:h-10" />,
  upload: <UploadCloud className="w-8 h-8 md:w-10 md:h-10" />,
  image: <IconImage className="w-8 h-8 md:w-10 md:h-10" />
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

const UnitConverter = ({ onBack }: { onBack: () => void }) => {
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
        <h2 className="text-2xl font-black text-adaptive">Convertitore Universale</h2>
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

export default UnitConverter;
