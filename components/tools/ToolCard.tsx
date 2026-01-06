"use client";

import React from 'react';
import { ChevronLeft, Star } from 'lucide-react';

interface ToolCardProps {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const ToolCard = ({
  icon,
  title,
  desc,
  active = false,
  onClick,
  isFavorite,
  onToggleFavorite
}: ToolCardProps) => (
  <div
    onClick={onClick}
    className={`group relative p-6 rounded-3xl border transition-all duration-500 text-left h-full flex flex-col glass-card w-full cursor-pointer ${active
      ? 'border-[var(--glass-border)] shadow-lg scale-[1.02]'
      : 'border-[var(--glass-border)] hover:scale-[1.02]'
      }`}
  >
    {onToggleFavorite && (
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 p-2 rounded-full bg-[var(--glass-input-bg)] hover:bg-yellow-500/20 transition-all z-10 group/star"
        aria-label="Toggle favorite"
      >
        <Star
          size={18}
          className={`transition-all ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-adaptive-muted group-hover/star:text-yellow-500'}`}
        />
      </button>
    )}
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
  </div>
);

export default ToolCard;
