"use client";

import React, { useState, useRef } from 'react';
import { Palette, UploadCloud, Minimize, Copy } from 'lucide-react';

const PaletteExtractorModule = ({ onBack }: { onBack: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const extractColors = (imgSrc: string) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Downscale for performance
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Color quantization - round to nearest 20 to reduce noise
      const colorMap: Record<string, number> = {};
      for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.round(pixels[i] / 20) * 20;
        const g = Math.round(pixels[i + 1] / 20) * 20;
        const b = Math.round(pixels[i + 2] / 20) * 20;
        const key = `${r},${g},${b}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
      }

      // Sort by frequency and get top 6
      const sorted = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return rgbToHex(r, g, b);
        });

      setPalette(sorted);
    };
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png)/)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgSrc = e.target?.result as string;
      setImage(imgSrc);
      extractColors(imgSrc);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Estrattore Palette</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {!image ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`col-span-2 glass-panel rounded-[2.5rem] border-2 border-dashed p-12 flex flex-col items-center justify-center gap-6 transition-all min-h-[400px] ${
              isDragging ? 'border-rose-500 bg-rose-500/10' : 'border-[var(--glass-border)] hover:border-rose-500/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <div className="p-6 rounded-full bg-rose-500/10 text-rose-500 animate-bounce">
              <UploadCloud size={48} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-adaptive mb-2">Carica immagine per estrarre colori</h3>
              <p className="text-adaptive-muted">Drag & Drop or <span className="text-rose-400 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>browse</span></p>
              <p className="text-xs text-adaptive-muted mt-2">JPG, PNG</p>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-panel p-6 rounded-[2.5rem] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex items-center justify-center relative overflow-hidden shadow-sm">
              <img src={image} alt="Preview" className="max-w-full max-h-[300px] object-contain rounded-xl shadow-lg" />
              <button 
                onClick={() => { setImage(null); setPalette([]); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
              >
                <Minimize size={20} />
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-rose-500/10 to-orange-400/10 border-rose-500/20 flex flex-col gap-6 shadow-sm">
              <h3 className="text-xl font-bold text-adaptive flex items-center gap-2">
                <Palette className="text-rose-500" /> Palette estratta
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {palette.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <button
                      onClick={() => copyToClipboard(color)}
                      className="w-20 h-20 rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer border-4 border-white/20 hover:border-white/40 relative group"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-xl">
                        <Copy size={20} className="text-white" />
                      </div>
                    </button>
                    <code 
                      onClick={() => copyToClipboard(color)}
                      className="text-xs font-mono font-bold text-adaptive bg-[var(--glass-input-bg)] px-3 py-1 rounded-lg cursor-pointer hover:bg-rose-500/20 transition-colors"
                    >
                      {color}
                    </code>
                    {copiedColor === color && (
                      <span className="text-[10px] uppercase font-bold text-green-500 animate-bounce">Copiato!</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaletteExtractorModule;
