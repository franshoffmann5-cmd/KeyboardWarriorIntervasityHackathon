"use client"

import { useState } from 'react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
}

export default function VolumeControl({ volume, muted, onChange, onToggleMute }: VolumeControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onChange(newVolume);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onChange(Math.max(0, volume - 0.1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onChange(Math.min(1, volume + 0.1));
    }
  };

  const volumePercentage = Math.round(volume * 100);
  const displayVolume = muted ? 0 : volumePercentage;

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-blueprint-dark/90 border border-blueprint-cyan p-2 transition-all duration-200"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Speaker Icon / Mute Button */}
      <button
        onClick={onToggleMute}
        className="text-blueprint-cyan hover:text-white transition-colors p-1 min-w-[24px]"
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted || displayVolume === 0 ? (
          // Muted icon
          <svg width="16" height="16" viewBox="0 0 16 16" className="pixelated">
            <path fill="currentColor" d="M8 2L5 5H2v6h3l3 3V2zM12 7l2 2-2 2m0-4l2-2-2 2" stroke="currentColor" strokeWidth="1"/>
          </svg>
        ) : displayVolume < 50 ? (
          // Low volume icon
          <svg width="16" height="16" viewBox="0 0 16 16" className="pixelated">
            <path fill="currentColor" d="M8 2L5 5H2v6h3l3 3V2zM12 8h2"/>
          </svg>
        ) : (
          // High volume icon
          <svg width="16" height="16" viewBox="0 0 16 16" className="pixelated">
            <path fill="currentColor" d="M8 2L5 5H2v6h3l3 3V2zM12 6v4m2-5v6"/>
          </svg>
        )}
      </button>

      {/* Volume Slider - expands on hover */}
      <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleSliderChange}
          onKeyDown={handleKeyDown}
          className="volume-slider w-full h-2 bg-blueprint-dark border border-blueprint-cyan appearance-none cursor-pointer"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={volumePercentage}
          aria-valuetext={`Volume ${volumePercentage}%`}
        />
      </div>

      {/* Volume Percentage */}
      <span className="text-blueprint-cyan font-pixel text-xs min-w-[32px] text-right">
        {displayVolume}%
      </span>

      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }

        .volume-slider {
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--blueprint-cyan);
          border: 1px solid var(--blueprint-cyan);
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--blueprint-cyan);
          border: 1px solid var(--blueprint-cyan);
          border-radius: 0;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-track {
          background: var(--blueprint-dark);
          border: 1px solid var(--blueprint-cyan);
          height: 8px;
        }

        .volume-slider::-moz-range-track {
          background: var(--blueprint-dark);
          border: 1px solid var(--blueprint-cyan);
          height: 6px;
        }
      `}</style>
    </div>
  );
}
