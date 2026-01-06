"use client";

import React, { useState, useMemo } from 'react';
import { Copy } from 'lucide-react';

const ColorLabModule = ({ onBack }: { onBack: () => void }) => {
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
        <h2 className="text-2xl font-black text-adaptive">Laboratorio Colori</h2>
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

export default ColorLabModule;
