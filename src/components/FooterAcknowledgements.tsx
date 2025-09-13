"use client"

import { useState } from 'react';

export default function FooterAcknowledgements() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {isExpanded ? (
        <div className="bg-blueprint-dark/95 border border-blueprint-cyan p-3 max-w-sm">
          <button
            onClick={() => setIsExpanded(false)}
            className="float-right text-blueprint-cyan hover:text-white text-lg leading-none mb-2"
            aria-label="Close"
          >
            ×
          </button>
          <div className="text-blueprint-text font-pixel text-xs leading-relaxed">
            <h4 className="text-blueprint-cyan mb-2">Music Attribution</h4>
            <p className="mb-2">
              Pixel chiptunes inspired by Pixverses — 
              <br />
              <a 
                href="https://www.youtube.com/@Pixverses" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blueprint-cyan hover:text-white underline"
              >
                https://www.youtube.com/@Pixverses
              </a>
            </p>
            <p className="text-gray-400 text-[10px]">
              This is a prototype; a production version would not ship with royalty-free music out of respect for the artist.
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-blueprint-dark/90 border border-blueprint-cyan px-2 py-1 text-blueprint-cyan hover:text-white font-pixel text-xs transition-colors"
          aria-label="Show music attribution"
        >
          ♪ Info
        </button>
      )}
    </div>
  );
}
