"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const CITIES = [
  { id: 'rome', label: 'Roma', zone: 'Europe/Rome' },
  { id: 'london', label: 'Londra', zone: 'Europe/London' },
  { id: 'ny', label: 'New York', zone: 'America/New_York' },
  { id: 'tokyo', label: 'Tokyo', zone: 'Asia/Tokyo' },
  { id: 'dubai', label: 'Dubai', zone: 'Asia/Dubai' },
  { id: 'sydney', label: 'Sydney', zone: 'Australia/Sydney' },
  { id: 'la', label: 'Los Angeles', zone: 'America/Los_Angeles' },
  { id: 'saopaulo', label: 'San Paolo', zone: 'America/Sao_Paulo' },
  { id: 'hongkong', label: 'Hong Kong', zone: 'Asia/Hong_Kong' },
  { id: 'nairobi', label: 'Nairobi', zone: 'Africa/Nairobi' },
  { id: 'delhi', label: 'Nuova Delhi', zone: 'Asia/Kolkata' },
  { id: 'mexico', label: 'Città del Messico', zone: 'America/Mexico_City' },
];

const WorldTimeModule = ({ onBack }: { onBack: () => void }) => {
  const [time, setTime] = useState<number>(Date.now());
  const [offset, setOffset] = useState<number>(0);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Optional NTP Sync
    fetch('https://worldtimeapi.org/api/ip')
      .then(res => res.json())
      .then(data => {
        const serverTime = new Date(data.datetime).getTime();
        const localTime = Date.now();
        setOffset(serverTime - localTime);
        setSynced(true);
      })
      .catch((err) => console.log('NTP Sync failed, using system time', err));

    const interval = setInterval(() => {
      setTime(Date.now()); // We apply offset during render
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getCityTime = (zone: string) => {
    const now = new Date(time + offset);
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);
  };

  const isDay = (zone: string) => {
    const now = new Date(time + offset);
    // Rough estimate using hour
    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      hour: 'numeric',
      hour12: false
    }).format(now));
    return hour >= 6 && hour < 18;
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">World Time Pro</h2>
        {synced && <span className="text-[10px] uppercase font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">Sincronizzato via NTP</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CITIES.map(city => {
            const day = isDay(city.zone);
            return (
              <div key={city.id} className="glass-panel p-6 rounded-3xl bg-slate-800/20 border-slate-500/20 flex items-center justify-between hover:scale-[1.02] transition-transform shadow-sm group relative overflow-hidden">
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-1000 ${day ? 'bg-yellow-400' : 'bg-indigo-600'}`} />
                <div>
                  <h3 className="text-adaptive font-bold mb-1">{city.label}</h3>
                  <p className="text-3xl font-black font-mono text-adaptive tabular-nums tracking-tight">
                    {getCityTime(city.zone)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${day ? 'bg-yellow-500/10 text-yellow-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                  {day ? <Sun size={24} /> : <Moon size={24} />}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default WorldTimeModule;
