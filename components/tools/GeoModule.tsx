"use client";

import React, { useState, useMemo } from 'react';
import { Compass, MapPin, Globe } from 'lucide-react';

const GeoModule = ({ onBack }: { onBack: () => void }) => {
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
        <h2 className="text-2xl font-black text-adaptive">Geo & Maps</h2>
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

export default GeoModule;
