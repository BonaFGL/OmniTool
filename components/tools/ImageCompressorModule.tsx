"use client";

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Minimize, Download, Image as IconImage } from 'lucide-react';

const ImageCompressorModule = ({ onBack }: { onBack: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png)/)) return;

    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = () => {
    if (!image) return;
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      setCompressedImage(dataUrl);
      
      // Calculate size roughly
      const head = 'data:image/jpeg;base64,';
      const size = Math.round((dataUrl.length - head.length) * 3 / 4);
      setCompressedSize(size);
    };
  };

  useEffect(() => {
    if (image) processImage();
  }, [image, quality]);

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

  const downloadImage = () => {
    if (!compressedImage) return;
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-xl glass-panel hover:bg-[var(--glass-card-hover)] transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-adaptive-muted group-hover:text-adaptive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-adaptive">Compressore Immagini</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {!image ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`col-span-2 glass-panel rounded-[2.5rem] border-2 border-dashed p-12 flex flex-col items-center justify-center gap-6 transition-all min-h-[400px] ${
              isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--glass-border)] hover:border-indigo-500/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <div className="p-6 rounded-full bg-indigo-500/10 text-indigo-500 animate-bounce">
              <UploadCloud size={48} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-adaptive mb-2">Carica immagine</h3>
              <p className="text-adaptive-muted">Drag & Drop or <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>browse</span></p>
              <p className="text-xs text-adaptive-muted mt-2">JPG, PNG (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <>
            <div className="glass-panel p-6 rounded-[2.5rem] bg-[var(--glass-bg)] border border-[var(--glass-border)] flex flex-col items-center justify-center relative overflow-hidden shadow-sm min-h-[400px]">
              <img src={compressedImage || image} alt="Preview" className="max-w-full max-h-[500px] object-contain rounded-xl shadow-lg" />
              <button 
                onClick={() => { setImage(null); setCompressedImage(null); }}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
              >
                <Minimize size={20} />
              </button>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] bg-indigo-900/10 border-indigo-500/20 flex flex-col gap-8 shadow-sm h-full justify-center">
              <h3 className="text-xl font-bold text-adaptive flex items-center gap-2">
                 <IconImage className="text-indigo-500" /> Impostazioni
              </h3>
              
              <div className="space-y-6">
                 <div>
                   <div className="flex justify-between mb-2">
                     <span className="text-xs font-bold uppercase text-adaptive-muted">Qualità</span>
                     <span className="text-xs font-bold text-indigo-500">{Math.round(quality * 100)}%</span>
                   </div>
                   <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={quality} 
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 h-2 bg-[var(--glass-input-bg)] rounded-lg appearance-none cursor-pointer"
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-center">
                       <span className="block text-[10px] uppercase font-bold text-adaptive-muted mb-1">Peso originale</span>
                       <span className="text-lg font-mono font-bold text-adaptive">{formatBytes(originalSize)}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--glass-input-bg)] border border-[var(--glass-border)] text-center relative overflow-hidden">
                       <span className="block text-[10px] uppercase font-bold text-adaptive-muted mb-1">Peso stimato</span>
                       <span className="text-lg font-mono font-bold text-indigo-500">{formatBytes(compressedSize)}</span>
                       <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all" style={{ width: `${(compressedSize / originalSize) * 100}%` }} />
                    </div>
                 </div>

                 <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex justify-between items-center">
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Risparmio</span>
                    <span className="text-xl font-black text-green-600 dark:text-green-400">
                      {Math.round((1 - compressedSize / originalSize) * 100)}%
                    </span>
                 </div>
              </div>

              <button 
                onClick={downloadImage}
                className="mt-auto w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
              >
                <Download size={20} /> Scarica
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCompressorModule;
