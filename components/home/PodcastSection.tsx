'use client';

import React, { useState } from 'react';
import { Play, Pause, Disc3, Radio, ArrowUpRight, Volume2 } from 'lucide-react';

interface Episode {
  id: string;
  number: string;
  title: string;
  guest: string;
  role: string;
  duration: string;
  image: string;
  highlight: string;
  date: string;
}

const EPISODES: Episode[] = [
  {
    id: 'ep-04',
    number: 'EP. 04',
    title: '500 GSM & Why Fast Fashion Is Dead',
    guest: 'Kenji Takahashi',
    role: 'Textile Engineer, Osaka',
    duration: '48 MIN',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    highlight: 'Knit density, French loopback terry, and why streetwear needs to return to indestructible fabrics.',
    date: 'SEPT 2026',
  },
  {
    id: 'ep-03',
    number: 'EP. 03',
    title: 'The Blueprint: Underground Drop Culture',
    guest: 'Mateo Morales',
    role: 'Creative Director & Skater',
    duration: '62 MIN',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    highlight: 'Building a cult following from a garage, zero ad spend, and selling out drops in 8 minutes.',
    date: 'AUG 2026',
  },
  {
    id: 'ep-02',
    number: 'EP. 02',
    title: 'Anime Aesthetics in Neo-Brutalist Fashion',
    guest: 'Yuna Lin',
    role: 'Digital Illustrator & Mangaka',
    duration: '41 MIN',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    highlight: 'Bridging direct-to-film printing technology with Tokyo cyber-noir cyberpunk aesthetics.',
    date: 'JULY 2026',
  },
];

export function PodcastSection() {
  const [activeEp, setActiveEp] = useState<string>('ep-04');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const selectedEpisode = EPISODES.find((e) => e.id === activeEp) || EPISODES[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#111111] text-[#FAFAF8] rounded-2xl p-6 sm:p-10 lg:p-12 overflow-hidden relative">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono text-[10px] uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Live Broadcast
              </span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                The WOCHA Podcast &bull; Culture & Sound
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase">
              By Artists, For Artists.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg">
              Unfiltered studio conversations with underground creators, athletes, designers, and rebels pushing culture forward.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs font-mono uppercase tracking-wider text-neutral-200 transition-colors cursor-pointer"
            >
              <span>Spotify</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-xs font-mono uppercase tracking-wider text-neutral-200 transition-colors cursor-pointer"
            >
              <span>YouTube</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Podcast Player & Episodes Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Main Featured Player */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700">
                <img
                  src={selectedEpisode.image}
                  alt={selectedEpisode.guest}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
                  className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </div>
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
                  <span className="text-white font-semibold bg-neutral-800 px-2 py-0.5 rounded">
                    {selectedEpisode.number}
                  </span>
                  <span>{selectedEpisode.duration}</span>
                  <span>&bull;</span>
                  <span>{selectedEpisode.date}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {selectedEpisode.title}
                </h3>
                <p className="text-xs text-neutral-300 font-mono">
                  Guest: <span className="text-white font-bold">{selectedEpisode.guest}</span> ({selectedEpisode.role})
                </p>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {selectedEpisode.highlight}
                </p>
              </div>
            </div>

            {/* Audio Waveform & Status Visualizer */}
            <div className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 h-6">
                {[12, 24, 18, 28, 14, 22, 32, 16, 26, 19, 30, 24, 15, 29, 21, 14, 25, 17, 31, 20].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-white animate-pulse'
                        : i < 8
                        ? 'bg-neutral-300'
                        : 'bg-neutral-700'
                    }`}
                    style={{
                      height: `${h}px`,
                      animationDelay: `${(i % 5) * 120}ms`,
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Volume2 className="w-4 h-4 text-white" />
                <span>{isPlaying ? 'Now Streaming Preview' : 'Click to stream conversation'}</span>
              </div>
            </div>
          </div>

          {/* Episode List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
              Select Episode
            </span>
            {EPISODES.map((ep) => {
              const isCurrent = ep.id === activeEp;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => {
                    setActiveEp(ep.id);
                    setIsPlaying(true);
                  }}
                  className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-black border-white shadow-lg'
                      : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
                    <img src={ep.image} alt={ep.guest} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={isCurrent ? 'font-bold text-black' : 'text-neutral-400'}>
                        {ep.number}
                      </span>
                      <span className={isCurrent ? 'text-black/70' : 'text-neutral-400'}>
                        {ep.duration}
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold tracking-tight truncate ${isCurrent ? 'text-black' : 'text-white'}`}>
                      {ep.title}
                    </h4>
                    <p className={`text-[11px] truncate ${isCurrent ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      w/ {ep.guest}
                    </p>
                  </div>
                  <Disc3 className={`w-4 h-4 shrink-0 ${isCurrent ? 'animate-spin text-black' : 'text-neutral-600'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
