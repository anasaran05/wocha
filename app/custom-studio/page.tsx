'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import type { GarmentSelection } from '@/components/3d/MannequinScene';
import { useCartStore } from '@/lib/cart/store';
import { CustomizationOption } from '@/lib/data/products';

const MannequinScene = dynamic(
  () => import('@/components/3d/MannequinScene').then((mod) => mod.MannequinScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[540px] flex flex-col items-center justify-center bg-[#FAFAF8] space-y-3 select-none rounded-2xl">
        <span className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B6B6B]">
          Initializing 3D Procedural Studio Rig...
        </span>
      </div>
    ),
  }
);

interface StudioModel {
  id: GarmentSelection;
  name: string;
  category: string;
  spec: string;
  weight: string;
  price: number;
  productId: string;
  image: string;
}

const STUDIO_MODELS: StudioModel[] = [
  {
    id: 'hoodie',
    name: '01 Heavyweight Boxy Hoodie',
    category: 'Hoodie',
    spec: 'Architectural Boxy Cut, Cowl Hood, Seamless Pocket',
    weight: '480 GSM French Terry',
    price: 185,
    productId: 'hoodie-01',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tshirt',
    name: '01 Heavyweight Boxy Tee',
    category: 'T-Shirt',
    spec: 'Dense Carded Pitch, Ribbed Crew Collar, Drop Shoulders',
    weight: '280 GSM Dry Carded Jersey',
    price: 75,
    productId: 'tshirt-01',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'puffer',
    name: '01 Baffle Quilted Puffer',
    category: 'Outerwear',
    spec: 'Vacuum Down Chambers, Storm High Collar, Baffle Quilting',
    weight: '750 FP Down / Ripstop',
    price: 360,
    productId: 'puffer-01',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
  },
];

const CURATED_PALETTE = [
  { name: 'Pitch Black', hex: '#161616' },
  { name: 'Chalk Bone', hex: '#FAF8F5' },
  { name: 'Washed Charcoal', hex: '#2C2C2B' },
  { name: 'Sand Dune', hex: '#D6CEBE' },
  { name: 'Muted Clay', hex: '#B85C3E' },
  { name: 'Forest Pine', hex: '#2B382B' },
  { name: 'Deep Navy', hex: '#1A2230' },
  { name: 'Concrete Grey', hex: '#7F8284' },
];

const FONTS: { id: 'grotesk' | 'serif' | 'mono'; label: string; class: string }[] = [
  { id: 'grotesk', label: 'Grotesk Bold', class: 'font-sans font-bold tracking-tight' },
  { id: 'serif', label: 'Studio Serif', class: 'font-serif italic font-medium' },
  { id: 'mono', label: 'Technical Mono', class: 'font-mono tracking-widest' },
];

const PLACEMENTS: { id: 'left-chest' | 'center-chest' | 'upper-back'; label: string }[] = [
  { id: 'left-chest', label: 'Left Chest' },
  { id: 'center-chest', label: 'Center Chest' },
  { id: 'upper-back', label: 'Upper Back' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const PRESET_MOTIFS = ['WOCHA ATELIER', 'ARCHIVE 2026', 'STRUCTURAL FORM', 'BERLIN ATELIER'];

const BRAND_GRAPHICS = [
  { id: 'crest', name: 'WOCHA Heritage Crest', url: '/wocha-original.png' },
  { id: 'logo', name: 'Atelier Signature Mark', url: '/wocha.png' },
];

type ActiveModalType = 'model' | 'color' | 'motif' | 'size' | null;

export default function CustomStudioPage() {
  const [activeModel, setActiveModel] = useState<GarmentSelection>('hoodie');
  const [activeColor, setActiveColor] = useState('#B85C3E');
  const [colorName, setColorName] = useState('Muted Clay');
  const [selectedSize, setSelectedSize] = useState('M');
  const [customText, setCustomText] = useState('WOCHA ATELIER');
  const [selectedFont, setSelectedFont] = useState<'grotesk' | 'serif' | 'mono'>('grotesk');
  const [selectedPlacement, setSelectedPlacement] = useState<'left-chest' | 'center-chest' | 'upper-back'>('center-chest');
  const [graphicSourceType, setGraphicSourceType] = useState<'text' | 'image' | 'none'>('text');
  const [selectedGraphicUrl, setSelectedGraphicUrl] = useState<string>('/wocha-original.png');
  const [graphicScale, setGraphicScale] = useState<number>(1.0);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  const { addItem, toggleDrawer } = useCartStore();

  const currentModelData = STUDIO_MODELS.find((m) => m.id === activeModel) || STUDIO_MODELS[0];
  const currentFontData = FONTS.find((f) => f.id === selectedFont) || FONTS[0];
  const currentPlacementData = PLACEMENTS.find((p) => p.id === selectedPlacement) || PLACEMENTS[1];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectColor = (name: string, hex: string) => {
    setActiveColor(hex);
    setColorName(name);
  };

  const handleCustomColorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setActiveColor(val);
    setColorName('Custom Tone');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedGraphicUrl(event.target.result as string);
          setGraphicSourceType('image');
          setUploadedImageName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customization: CustomizationOption = {
      baseColor: activeColor,
      text: graphicSourceType === 'text' ? customText : (uploadedImageName || 'Custom Artwork'),
      font: selectedFont,
      placement: selectedPlacement,
      graphicPreset: graphicSourceType === 'image' ? (uploadedImageName || selectedGraphicUrl) : undefined,
    };

    addItem({
      productId: currentModelData.productId,
      name: `Bespoke ${currentModelData.name}`,
      price: currentModelData.price,
      size: selectedSize,
      color: `${colorName} (${activeColor})`,
      image: currentModelData.image,
      quantity,
      customization,
    });

    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      toggleDrawer();
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
      {/* Main Studio Arena: Left Options, Center 3D Mannequin, Right Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Selected Silhouette & Selected Pigment */}
        <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
          {/* Card 1: Selected Silhouette */}
          <div
            onClick={() => setActiveModal('model')}
            className="group bg-white hairline-border rounded-xl p-4 cursor-pointer hover:border-[#111111] hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">
                01 &bull; Silhouette
              </span>
              <span className="text-[10px] font-mono text-[#111111] group-hover:underline flex items-center gap-1 font-medium">
                Change <span>&rarr;</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 bg-[#F0EFEA] rounded-lg overflow-hidden shrink-0 hairline-border">
                <Image
                  src={currentModelData.image}
                  alt={currentModelData.name}
                  fill
                  sizes="56px"
                  className="object-cover object-center grayscale group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-semibold text-[#111111] truncate">
                  {currentModelData.name}
                </h2>
                <p className="text-[11px] font-mono text-[#6B6B6B] truncate mt-0.5">
                  {currentModelData.weight}
                </p>
                <span className="text-xs font-mono font-medium text-[#111111] mt-1 block">
                  ${currentModelData.price}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Selected Pigment */}
          <div
            onClick={() => setActiveModal('color')}
            className="group bg-white hairline-border rounded-xl p-4 cursor-pointer hover:border-[#111111] hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">
                02 &bull; Fabric Pigment
              </span>
              <span className="text-[10px] font-mono text-[#111111] group-hover:underline flex items-center gap-1 font-medium">
                Change <span>&rarr;</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl hairline-border shadow-xs shrink-0 ring-2 ring-[#111111]/10"
                style={{ backgroundColor: activeColor }}
              />
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-[#111111] truncate">
                  {colorName}
                </h3>
                <p className="text-[11px] font-mono text-[#6B6B6B] uppercase mt-0.5">
                  {activeColor}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live 3D Applied
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: 3D EDITORIAL MANNEQUIN STAGE */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          {/* Centered 3D Viewport */}
          <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] max-h-[660px] w-full bg-white hairline-border rounded-2xl overflow-hidden shadow-xs">
            <MannequinScene
              activeGarment={activeModel}
              garmentColor={activeColor}
              showAngleControls={true}
              graphicType={graphicSourceType}
              graphicUrl={selectedGraphicUrl}
              customText={customText}
              customFont={selectedFont}
              graphicPlacement={selectedPlacement}
              graphicScale={graphicScale}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Typographic Motif, Selected Size & Bespoke Total / Add to Bag */}
        <div className="lg:col-span-3 space-y-4 order-3">
          {/* Card 3: Selected Typographic Motif & Graphic Decal */}
          <div
            onClick={() => setActiveModal('motif')}
            className="group bg-white hairline-border rounded-xl p-4 cursor-pointer hover:border-[#111111] hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">
                03 &bull; Atelier Motif & Decal
              </span>
              <span className="text-[10px] font-mono text-[#111111] group-hover:underline flex items-center gap-1 font-medium">
                Customize <span>&rarr;</span>
              </span>
            </div>

            <div className="bg-[#FAFAF8] hairline-border rounded-lg p-3 text-center min-h-[58px] flex items-center justify-center">
              {graphicSourceType === 'text' ? (
                <span className={`text-xs block text-[#111111] truncate ${currentFontData.class}`}>
                  &ldquo;{customText || 'NO MOTIF'}&rdquo;
                </span>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded bg-[#111111] p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={selectedGraphicUrl}
                      alt="Graphic Decal"
                      className="max-h-full max-w-full object-contain filter invert"
                    />
                  </div>
                  <span className="text-xs font-mono font-medium text-[#111111] truncate">
                    {uploadedImageName || BRAND_GRAPHICS.find((b) => b.url === selectedGraphicUrl)?.name || 'Custom Emblem'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1 text-[11px] font-mono text-[#6B6B6B]">
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-semibold text-[#111111] uppercase">
                  {graphicSourceType === 'text' ? 'Typography' : 'Curved Decal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Placement:</span>
                <span className="font-semibold text-[#111111]">{currentPlacementData.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Scale:</span>
                <span className="font-semibold text-[#111111]">{graphicScale.toFixed(1)}x Proportional</span>
              </div>
            </div>
          </div>

          {/* Card 4: Selected Size & Fit */}
          <div
            onClick={() => setActiveModal('size')}
            className="group bg-white hairline-border rounded-xl p-4 cursor-pointer hover:border-[#111111] hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6B6B]">
                04 &bull; Selected Sizing
              </span>
              <span className="text-[10px] font-mono text-[#111111] group-hover:underline flex items-center gap-1 font-medium">
                Change <span>&rarr;</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#111111] text-white flex items-center justify-center font-mono font-bold text-sm shrink-0">
                {selectedSize}
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-semibold text-[#111111]">
                  Size {selectedSize}
                </h3>
                <p className="text-[11px] font-mono text-[#6B6B6B] mt-0.5">
                  Architectural Boxy Cut
                </p>
                <span className="text-[10px] font-mono text-[#6B6B6B] block mt-1">
                  True to size oversized
                </span>
              </div>
            </div>
          </div>

          {/* Bespoke Total & Add to Bag Action Card */}
          <div className="bg-white hairline-border rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#6B6B6B] uppercase">Bespoke Total:</span>
              <span className="text-lg font-bold text-[#111111]">
                ${currentModelData.price * quantity}
              </span>
            </div>

            <div className="text-[11px] font-mono text-[#6B6B6B]">
              {currentModelData.category} &bull; {selectedSize} &bull; {colorName}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                {/* Stepper */}
                <div className="flex items-center hairline-border rounded-lg bg-white h-10 px-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-sm text-[#111111] hover:bg-[#FAFAF8] rounded transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-xs font-mono text-[#111111] font-medium">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 text-sm text-[#111111] hover:bg-[#FAFAF8] rounded transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 wocha-btn rounded-lg h-10 text-xs uppercase tracking-wider text-white font-medium cursor-pointer"
                >
                  Add to Bag &bull; ${currentModelData.price * quantity}
                </button>
              </div>

              {/* Added Toast */}
              {addedToast && (
                <div className="p-2.5 bg-[#FAFAF8] hairline-border rounded-lg text-center text-xs font-mono text-[#111111] animate-in fade-in duration-200">
                  &check; Bespoke {currentModelData.name} added to bag.
                </div>
              )}
            </div>

            <div className="pt-1 text-[10px] font-mono text-[#6B6B6B] space-y-0.5">
              <div>&bull; Tailored upon consignment dispatch</div>
              <div>&bull; Made in Portugal &bull; 100% Organic</div>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP / MODAL OVERLAYS */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white hairline-border rounded-2xl p-5 sm:p-6 w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="hairline-bottom pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  {activeModal === 'model' && '1. Select Silhouette Model'}
                  {activeModal === 'color' && '2. Live 3D Color Changer'}
                  {activeModal === 'motif' && '3. Atelier Typographic Motif'}
                  {activeModal === 'size' && '4. Select Sizing'}
                </h2>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  {activeModal === 'model' && 'Choose your base garment to preview on the 3D rig.'}
                  {activeModal === 'color' && 'Pick an atelier shade or select a custom tone.'}
                  {activeModal === 'motif' && 'Specify custom inscription, font style, and placement.'}
                  {activeModal === 'size' && 'Select your tailored architectural proportion.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full hairline-border flex items-center justify-center text-[#111111] hover:bg-[#FAFAF8] transition-colors cursor-pointer text-sm"
                aria-label="Close popup"
              >
                &times;
              </button>
            </div>

            {/* Modal Content: MODEL */}
            {activeModal === 'model' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2.5">
                  {STUDIO_MODELS.map((model) => {
                    const isSelected = activeModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          setActiveModel(model.id);
                        }}
                        className={`p-3 rounded-xl hairline-border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#FAFAF8] ring-1 ring-[#111111] border-[#111111]'
                            : 'bg-white hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 bg-[#F0EFEA] rounded-lg overflow-hidden shrink-0 hairline-border">
                            <Image
                              src={model.image}
                              alt={model.name}
                              fill
                              sizes="56px"
                              className="object-cover object-center grayscale"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-semibold text-[#111111]">{model.name}</h3>
                              {isSelected && (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#111111] text-white rounded">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#6B6B6B] mt-0.5">{model.weight}</p>
                            <p className="text-[10px] text-[#6B6B6B] mt-0.5">{model.spec}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-medium text-[#111111] ml-2">
                          ${model.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modal Content: COLOR */}
            {activeModal === 'color' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#6B6B6B]">Selected Tone:</span>
                  <span className="font-semibold text-[#111111]">
                    {colorName} <span className="text-[#6B6B6B]">({activeColor})</span>
                  </span>
                </div>

                {/* Curated Swatches Grid */}
                <div className="grid grid-cols-4 gap-2.5">
                  {CURATED_PALETTE.map((c) => {
                    const isSelected = activeColor.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelectColor(c.name, c.hex)}
                        className={`p-2.5 rounded-xl hairline-border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-1.5 ring-[#111111] bg-[#FAFAF8] shadow-xs'
                            : 'bg-white hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <span
                          className="w-7 h-7 rounded-full hairline-border shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[10px] font-mono text-[#111111] text-center leading-tight">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Picker input */}
                <div className="hairline-top pt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={activeColor}
                      onChange={handleCustomColorInput}
                      className="w-9 h-9 rounded-lg hairline-border cursor-pointer p-0.5 bg-white shadow-2xs"
                      title="Choose custom shade"
                    />
                    <span className="text-xs font-mono text-[#6B6B6B]">
                      Custom Tone Picker:
                    </span>
                  </div>
                  <input
                    type="text"
                    value={activeColor}
                    onChange={(e) => {
                      setActiveColor(e.target.value);
                      setColorName('Custom Hex');
                    }}
                    maxLength={7}
                    placeholder="#161616"
                    className="w-24 bg-[#FAFAF8] hairline-border rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase text-[#111111] focus:outline-none focus:border-[#111111] text-center"
                  />
                </div>
              </div>
            )}

            {/* Modal Content: MOTIF & ARTWORK */}
            {activeModal === 'motif' && (
              <div className="space-y-4">
                {/* Mode Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#FAFAF8] hairline-border rounded-xl">
                  <button
                    type="button"
                    onClick={() => setGraphicSourceType('text')}
                    className={`py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      graphicSourceType === 'text'
                        ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    Typography
                  </button>
                  <button
                    type="button"
                    onClick={() => setGraphicSourceType('image')}
                    className={`py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      graphicSourceType === 'image' && !uploadedImageName
                        ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    Brand Emblems
                  </button>
                  <button
                    type="button"
                    onClick={() => setGraphicSourceType('image')}
                    className={`py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      uploadedImageName
                        ? 'bg-white text-[#111111] shadow-2xs font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#111111]'
                    }`}
                  >
                    Upload Design
                  </button>
                </div>

                {/* TAB 1: TYPOGRAPHY */}
                {graphicSourceType === 'text' && (
                  <>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <label className="text-xs font-mono uppercase text-[#6B6B6B]">
                          Custom Inscription:
                        </label>
                        <span className="text-[10px] font-mono text-[#6B6B6B]">
                          {customText.length}/24 max
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={24}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                        placeholder="ENTER CUSTOM INSCRIPTION"
                        className="w-full bg-[#FAFAF8] hairline-border rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase text-[#111111] focus:outline-none focus:border-[#111111]"
                      />
                    </div>

                    {/* Preset Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_MOTIFS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCustomText(preset)}
                          className="text-[10px] font-mono px-2.5 py-1 hairline-border rounded-md bg-white text-[#6B6B6B] hover:text-[#111111] hover:border-[#111111] transition-colors cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    {/* Font Style Selection */}
                    <div className="pt-2">
                      <label className="text-[11px] font-mono uppercase text-[#6B6B6B] block mb-1.5">
                        Typography System:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {FONTS.map((font) => (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => setSelectedFont(font.id)}
                            className={`py-2 px-2 hairline-border rounded-xl text-center text-xs transition-colors cursor-pointer ${
                              selectedFont === font.id
                                ? 'bg-[#111111] text-white'
                                : 'bg-[#FAFAF8] text-[#111111] hover:bg-white'
                            }`}
                          >
                            <span className={font.class}>{font.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* TAB 2 & 3: BRAND EMBLEMS OR CUSTOM FILE UPLOAD */}
                {graphicSourceType === 'image' && (
                  <div className="space-y-3">
                    {/* Brand Graphics Selection */}
                    <div>
                      <label className="text-[11px] font-mono uppercase text-[#6B6B6B] block mb-2">
                        Atelier Signature Emblems:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BRAND_GRAPHICS.map((brand) => {
                          const isSelected = selectedGraphicUrl === brand.url;
                          return (
                            <button
                              key={brand.id}
                              type="button"
                              onClick={() => {
                                setSelectedGraphicUrl(brand.url);
                                setUploadedImageName(null);
                              }}
                              className={`p-3 rounded-xl hairline-border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                                isSelected && !uploadedImageName
                                  ? 'ring-1.5 ring-[#111111] bg-[#FAFAF8]'
                                  : 'bg-white hover:bg-[#FAFAF8]'
                              }`}
                            >
                              <div className="w-12 h-12 bg-[#111111] rounded-lg p-1.5 flex items-center justify-center">
                                <img
                                  src={brand.url}
                                  alt={brand.name}
                                  className="max-h-full max-w-full object-contain filter invert"
                                />
                              </div>
                              <span className="text-[10px] font-mono text-[#111111] text-center leading-tight">
                                {brand.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom File Upload Box */}
                    <div className="pt-2 hairline-top">
                      <label className="text-[11px] font-mono uppercase text-[#6B6B6B] block mb-1.5">
                        Upload Your Own Artwork (PNG / JPG / SVG):
                      </label>
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#E5E5E0] hover:border-[#111111] rounded-xl p-4 cursor-pointer bg-[#FAFAF8] hover:bg-white transition-all">
                        <span className="text-xs font-mono text-[#111111] font-semibold">
                          {uploadedImageName ? `Uploaded: ${uploadedImageName}` : 'Click to Upload Artwork'}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6B6B] mt-1">
                          Transparent background recommended &bull; Max 10MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Placement Selection */}
                <div className="pt-2 hairline-top">
                  <label className="text-[11px] font-mono uppercase text-[#6B6B6B] block mb-1.5">
                    Decal 3D Projection Placement:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PLACEMENTS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPlacement(p.id)}
                        className={`py-2 px-2 hairline-border rounded-xl text-center text-xs font-mono transition-colors cursor-pointer ${
                          selectedPlacement === p.id
                            ? 'bg-[#111111] text-white'
                            : 'bg-[#FAFAF8] text-[#111111] hover:bg-white'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Graphic Scale Slider */}
                <div className="pt-2">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <label className="text-[11px] font-mono uppercase text-[#6B6B6B]">
                      Graphic Dimension:
                    </label>
                    <span className="text-[11px] font-mono text-[#111111] font-semibold">
                      {graphicScale.toFixed(1)}x
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.6"
                      max="1.5"
                      step="0.1"
                      value={graphicScale}
                      onChange={(e) => setGraphicScale(parseFloat(e.target.value))}
                      className="w-full cursor-pointer accent-[#111111]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content: SIZE */}
            {activeModal === 'size' && (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono uppercase text-[#6B6B6B]">Select Size:</span>
                  <span className="text-[11px] font-mono text-[#6B6B6B] uppercase">
                    Fit: Architectural / Boxy
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-mono text-center hairline-border rounded-xl transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#111111] text-white font-bold'
                          : 'bg-white text-[#111111] hover:bg-[#FAFAF8]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <div className="bg-[#FAFAF8] hairline-border rounded-xl p-3 text-[11px] font-mono text-[#6B6B6B] space-y-1">
                  <div className="font-semibold text-[#111111]">Fitting Notes:</div>
                  <div>&bull; Silhouette is cut with intentionally dropped shoulders and relaxed chest.</div>
                  <div>&bull; Choose your standard size for the intended architectural drape.</div>
                </div>
              </div>
            )}

            {/* Modal Footer: Close / Done */}
            <div className="hairline-top pt-4">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-full wocha-btn rounded-xl py-2.5 text-xs uppercase tracking-wider text-white cursor-pointer"
              >
                Apply &amp; Return to Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

