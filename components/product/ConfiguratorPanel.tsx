'use client';

import React, { useState } from 'react';
import { CustomizationOption } from '@/lib/data/products';

interface ConfiguratorPanelProps {
  initialConfig?: CustomizationOption;
  onChange: (config: CustomizationOption) => void;
}

const BASE_COLORS = [
  { name: 'Vintage White', hex: '#FAF8F5', ink: '#111111' },
  { name: 'Washed Black', hex: '#1E1E1E', ink: '#EBEAE6' },
  { name: 'Sand Dune', hex: '#D6CEBE', ink: '#181818' },
  { name: 'Muted Clay', hex: '#B85C3E', ink: '#FFFFFF' },
];

const FONTS: { id: 'grotesk' | 'serif' | 'mono'; label: string; class: string }[] = [
  { id: 'grotesk', label: 'Grotesk Bold', class: 'font-sans font-bold tracking-tight' },
  { id: 'serif', label: 'Studio Serif', class: 'font-serif italic font-medium tracking-normal' },
  { id: 'mono', label: 'Technical Mono', class: 'font-mono tracking-widest' },
];

const PLACEMENTS: { id: 'left-chest' | 'center-chest' | 'upper-back'; label: string }[] = [
  { id: 'left-chest', label: 'Left Chest' },
  { id: 'center-chest', label: 'Center Chest' },
  { id: 'upper-back', label: 'Upper Back' },
];

const GRAPHIC_PRESETS = [
  { id: 'WOCHA STUDIO', label: 'WOCHA STUDIO' },
  { id: 'SYSTEM ARCHIVE', label: 'ARCHIVE 01' },
  { id: 'ESSENTIAL FORM', label: 'ESSENTIAL FORM' },
];

export function ConfiguratorPanel({ initialConfig, onChange }: ConfiguratorPanelProps) {
  const [config, setConfig] = useState<CustomizationOption>(
    initialConfig || {
      baseColor: '#FAF8F5',
      text: 'WOCHA STUDIO',
      placement: 'center-chest',
      font: 'grotesk',
    }
  );

  const updateConfig = (patch: Partial<CustomizationOption>) => {
    const updated = { ...config, ...patch };
    setConfig(updated);
    onChange(updated);
  };

  const activeColorObj = BASE_COLORS.find((c) => c.hex === config.baseColor) || BASE_COLORS[0];

  return (
    <div className="bg-white hairline-border rounded-xl p-5 space-y-6">
      <div className="hairline-bottom pb-3">
        <span className="text-[10px] font-mono text-[#6B6B6B] uppercase tracking-widest block">
          Studio Configurator
        </span>
        <h3 className="text-sm font-semibold text-[#111111]">
          Bespoke Garment Specification
        </h3>
      </div>

      {/* 2D LIVE VISUAL PREVIEW OF THE T-SHIRT */}
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[280px] aspect-[4/5] bg-[#FAFAF8] hairline-border rounded-lg p-4 flex items-center justify-center overflow-hidden">
          {/* SVG Stylized T-shirt Base */}
          <svg
            viewBox="0 0 300 340"
            className="w-full h-full drop-shadow-sm transition-colors duration-300"
            style={{ color: config.baseColor }}
          >
            {/* Main T-shirt Silhouette Body */}
            <path
              d="M 95 30 
                 Q 150 55 205 30 
                 L 275 65 
                 L 250 120 
                 L 218 105 
                 L 218 310 
                 L 82 310 
                 L 82 105 
                 L 50 120 
                 L 25 65 Z"
              fill="currentColor"
              stroke="#D4D2CA"
              strokeWidth="2"
            />
            {/* Collar Cutout */}
            <path
              d="M 100 30 Q 150 72 200 30"
              fill="none"
              stroke="#B3B0A6"
              strokeWidth="3.5"
            />
            {/* Subtle Hem stitch lines */}
            <line x1="82" y1="300" x2="218" y2="300" stroke="#C4C1B6" strokeWidth="1.5" strokeDasharray="4 2" />
          </svg>

          {/* Live Dynamic Text & Graphics Overlay on the T-shirt */}
          <div
            className={`absolute transition-all duration-300 pointer-events-none select-none text-center ${
              config.placement === 'left-chest'
                ? 'top-[36%] left-[45%] -translate-x-1/2'
                : config.placement === 'center-chest'
                ? 'top-[42%] left-1/2 -translate-x-1/2'
                : 'top-[30%] left-1/2 -translate-x-1/2'
            }`}
            style={{ color: activeColorObj.ink }}
          >
            <div className="border border-current px-2 py-0.5 inline-block opacity-90 rounded">
              <span
                className={`text-[10px] sm:text-xs uppercase block leading-none ${
                  config.font === 'grotesk'
                    ? 'font-sans font-bold tracking-tight'
                    : config.font === 'serif'
                    ? 'font-serif italic font-medium'
                    : 'font-mono tracking-widest'
                }`}
              >
                {config.text || 'YOUR TEXT'}
              </span>
            </div>
            <span className="text-[7px] font-mono tracking-widest opacity-60 block mt-0.5">
              WOCHA ARCHIVE
            </span>
          </div>

          {/* Live Placement Watermark */}
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[#6B6B6B] uppercase">
            Preview // {config.placement}
          </div>
        </div>
      </div>

      {/* Control 1: Base Garment Fabric Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#111111] block">
          1. Base Fabric Color: <span className="font-semibold">{activeColorObj.name}</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BASE_COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => updateConfig({ baseColor: color.hex })}
              className={`p-2 hairline-border rounded-md text-center flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                config.baseColor === color.hex
                  ? 'ring-1 ring-[#111111] bg-[#FAFAF8]'
                  : 'hover:bg-[#FAFAF8]'
              }`}
            >
              <span
                className="w-5 h-5 rounded-full hairline-border"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[10px] font-mono text-[#111111] leading-tight">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Control 2: Custom Text Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-mono uppercase tracking-wider text-[#111111]">
            2. Personal Inscription / Motif:
          </label>
          <span className="text-[10px] font-mono text-[#6B6B6B]">
            {config.text.length}/20 max
          </span>
        </div>
        <input
          type="text"
          maxLength={20}
          value={config.text}
          onChange={(e) => updateConfig({ text: e.target.value.toUpperCase() })}
          placeholder="ENTER TEXT (E.G. BERLIN ATELIER)"
          className="w-full bg-[#FAFAF8] hairline-border rounded-md px-3 py-2 text-xs font-mono uppercase text-[#111111] focus:outline-none focus:border-[#111111]"
        />

        {/* Preset suggestions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {GRAPHIC_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => updateConfig({ text: preset.id })}
              className="text-[10px] font-mono px-2 py-0.5 hairline-border rounded bg-white text-[#6B6B6B] hover:text-[#111111] hover:border-[#111111]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control 3: Typography System */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#111111] block">
          3. Typography System:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => updateConfig({ font: font.id })}
              className={`py-2 px-2 hairline-border rounded-md text-center text-xs transition-colors cursor-pointer ${
                config.font === font.id
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#FAFAF8] text-[#111111] hover:bg-white'
              }`}
            >
              <span className={font.class}>{font.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Control 4: Placement */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#111111] block">
          4. Placement:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PLACEMENTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => updateConfig({ placement: p.id })}
              className={`py-2 px-2 hairline-border rounded-md text-center text-xs font-mono transition-colors cursor-pointer ${
                config.placement === p.id
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#FAFAF8] text-[#111111] hover:bg-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
