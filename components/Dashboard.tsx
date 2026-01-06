"use client";

import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Globe, FileText, MapPin, Palette,
  Sun, Moon, Search, ChefHat, Activity, Dices, Star, Image as ImageIcon,
  Mic
} from 'lucide-react';
import {
  IconConverter, IconText, IconSecurity, IconPercent,
  IconTime, IconColors, IconCurrency
} from './tools/Icons';
import ToolCard from './tools/ToolCard';
import UnitConverter from './tools/UnitConverter';
import TextAnalyzer from './tools/TextAnalyzer';
import Security from './tools/Security';
import VATModule from './tools/VATModule';
import TimeModule from './tools/TimeModule';
import ColorLabModule from './tools/ColorLabModule';
import SocialModule from './tools/SocialModule';
import NotesModule from './tools/NotesModule';
import GeoModule from './tools/GeoModule';
import CurrencyModule from './tools/CurrencyModule';
import ImageCompressorModule from './tools/ImageCompressorModule';
import WorldTimeModule from './tools/WorldTimeModule';
import PaletteExtractorModule from './tools/PaletteExtractorModule';
import RandomizerModule from './tools/RandomizerModule';
import WellnessModule from './tools/WellnessModule';
import SpeechToText from './tools/SpeechToText';

type ViewState = 'dashboard' | 'converter' | 'text' | 'security' | 'vat' | 'time' | 'colors' | 'social' | 'notes' | 'geo' | 'currency' | 'imageCompressor' | 'worldTime' | 'paletteExtractor' | 'randomizer' | 'wellness' | 'speech';



export default function Dashboard() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side mounting check to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (isMounted) {
      const savedFavorites = localStorage.getItem('omnitool-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, [isMounted]);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('omnitool-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isMounted]);

  const toggleFavorite = (moduleId: string) => {
    setFavorites(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleFavoritesFilter = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites) {
      setSearchQuery('');
    }
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const modules = [
    { id: 'converter' as ViewState, title: "Convertitore Universale", desc: "Unità, valute e misure per ogni esigenza.", icon: <IconConverter /> },
    { id: 'text' as ViewState, title: "Analisi Testo", desc: "Statistiche, pulizia e manipolazione stringhe.", icon: <IconText /> },
    { id: 'security' as ViewState, title: "Sicurezza & QR", desc: "Password sicure e generazione QR Code.", icon: <IconSecurity /> },
    { id: 'vat' as ViewState, title: "Calcolo IVA & Sconto", desc: "Scorporo/Aggiunta IVA e calcolatore sconti.", icon: <IconPercent /> },
    { id: 'time' as ViewState, title: "Timer & Produttività", desc: "Pomodoro timer e gestione tempo.", icon: <IconTime /> },
    { id: 'colors' as ViewState, title: "Laboratorio Colori", desc: "Generatore di palette armoniche e accessibilità.", icon: <IconColors /> },
    { id: 'social' as ViewState, title: "WhatsApp & Social", desc: "Generatore link rapidi WA e strumenti URL.", icon: <div className="text-adaptive"><MessageCircle size={40} strokeWidth={1.5} /></div> },
    { id: 'notes' as ViewState, title: "Note Veloci", desc: "Editor persistente con supporto Markdown.", icon: <div className="text-adaptive"><FileText size={40} strokeWidth={1.5} /></div> },
    { id: 'geo' as ViewState, title: "Geo & Maps", desc: "Convertitore coordinate e link mappe.", icon: <div className="text-adaptive"><MapPin size={40} strokeWidth={1.5} /></div> },
    { id: 'currency' as ViewState, title: "Cambio Valute", desc: "Tassi di cambio in tempo reale.", icon: <IconCurrency /> },
    { id: 'imageCompressor' as ViewState, title: "Compressore Immagini", desc: "Ottimizza JPG/PNG in locale.", icon: <div className="text-adaptive"><ImageIcon size={40} strokeWidth={1.5} /></div> },
    { id: 'worldTime' as ViewState, title: "World Time Pro", desc: "Orologio mondiale in tempo reale.", icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-adaptive" /> },
    { id: 'paletteExtractor' as ViewState, title: "Estrattore Palette", desc: "Estrai colori dominanti da immagini.", icon: <Palette className="w-8 h-8 md:w-10 md:h-10 text-adaptive" /> },
    { id: 'randomizer' as ViewState, title: "Randomizer Pro", desc: "Numeri, moneta e scelte casuali.", icon: <Dices className="w-8 h-8 md:w-10 md:h-10 text-adaptive" /> },
    { id: 'wellness' as ViewState, title: "Wellness & BMI", desc: "Calcola BMI e idratazione.", icon: <Activity className="w-8 h-8 md:w-10 md:h-10 text-adaptive" /> },
    { id: 'speech' as ViewState, title: "Dettato Vocale", desc: "Trasforma la tua voce in testo.", icon: <Mic className="w-8 h-8 md:w-10 md:h-10 text-adaptive" /> },
  ];

  const filteredModules = modules.filter(m => {
    if (showFavorites) {
      return favorites.includes(m.id);
    }
    return m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
                La tua suite professionale di utility digitali.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-adaptive-muted group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Cerca modulo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input border border-[var(--glass-border)] focus:ring-2 focus:ring-blue-500/50 placeholder:text-adaptive-muted"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleFavoritesFilter}
                  className={`p-3 rounded-xl glass-panel transition-all active:scale-95 flex items-center gap-2 ${showFavorites ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-adaptive hover:bg-white/10'}`}
                  aria-label="Toggle Favorites"
                >
                  <ChefHat className={`w-5 h-5 ${showFavorites ? 'animate-bounce' : ''}`} />
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto relative z-10 transition-all duration-500">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <div key={module.id} className="animate-scale-in h-full">
                  <ToolCard
                    id={module.id}
                    active
                    onClick={() => setView(module.id)}
                    icon={module.icon}
                    title={module.title}
                    desc={module.desc}
                    isFavorite={favorites.includes(module.id)}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      toggleFavorite(module.id);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center animate-fade-in glass-panel rounded-3xl p-8">
                <div className="inline-block p-4 rounded-full bg-white/5 mb-4">
                  {showFavorites ? <Star className="w-8 h-8 text-yellow-500" /> : <Search className="w-8 h-8 text-adaptive-muted" />}
                </div>
                <p className="text-lg font-medium text-adaptive-muted">
                  {showFavorites ? "Non hai ancora aggiunto preferiti. Clicca sulla stella nei moduli per aggiungerli qui!" : `Nessun modulo trovato per "${searchQuery}"`}
                </p>
                {!showFavorites && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mostra tutti
                  </button>
                )}
              </div>
            )}
          </div>

          <footer className="mt-24 pb-12 text-center border-t border-[var(--glass-border)] pt-12">
            <p className="text-adaptive-muted text-xs font-bold tracking-widest uppercase mb-2">OmniTool Dashboard</p>
            <p className="text-adaptive-muted text-[10px]">Suite di utility digitali • 2024</p>
          </footer>
        </div>
      ) : view === 'converter' ? (
        <UnitConverter onBack={() => setView('dashboard')} />
      ) : view === 'text' ? (
        <TextAnalyzer onBack={() => setView('dashboard')} />
      ) : view === 'security' ? (
        <Security onBack={() => setView('dashboard')} />
      ) : view === 'vat' ? (
        <VATModule onBack={() => setView('dashboard')} />
      ) : view === 'time' ? (
        <TimeModule onBack={() => setView('dashboard')} />
      ) : view === 'colors' ? (
        <ColorLabModule onBack={() => setView('dashboard')} />
      ) : view === 'social' ? (
        <SocialModule onBack={() => setView('dashboard')} />
      ) : view === 'notes' ? (
        <NotesModule onBack={() => setView('dashboard')} />
      ) : view === 'geo' ? (
        <GeoModule onBack={() => setView('dashboard')} />
      ) : view === 'currency' ? (
        <CurrencyModule onBack={() => setView('dashboard')} />
      ) : view === 'imageCompressor' ? (
        <ImageCompressorModule onBack={() => setView('dashboard')} />
      ) : view === 'worldTime' ? (
        <WorldTimeModule onBack={() => setView('dashboard')} />
      ) : view === 'paletteExtractor' ? (
        <PaletteExtractorModule onBack={() => setView('dashboard')} />
      ) : view === 'randomizer' ? (
        <RandomizerModule onBack={() => setView('dashboard')} />
      ) : view === 'wellness' ? (
        <WellnessModule onBack={() => setView('dashboard')} />
      ) : view === 'speech' ? (
        <SpeechToText onBack={() => setView('dashboard')} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Modulo in caricamento...</h2>
          <button onClick={() => setView('dashboard')} className="p-2 glass-panel rounded-xl">Torna alla Dashboard</button>
        </div>
      )}
    </main>
  );
}
