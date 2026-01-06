"use client";

import React, { useState, useEffect } from 'react';

const TimeModule = ({ onBack }: { onBack: () => void }) => {
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
        <h2 className="text-2xl font-black text-adaptive">Timer & Produttività</h2>
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
              <span className="text-2xl">⚡</span>
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

export default TimeModule;
