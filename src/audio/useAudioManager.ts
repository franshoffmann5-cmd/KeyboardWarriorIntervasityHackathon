/**
 * React hook wrapper for AudioManager
 */

import { useEffect, useRef, useState } from 'react';
import { AudioManager } from './AudioManager';

interface UseAudioManagerConfig {
  defaultVolume?: number;
  crossfadeSec?: number;
}

export function useAudioManager(playlist: string[], config: UseAudioManagerConfig = {}) {
  const audioManagerRef = useRef<AudioManager | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(config.defaultVolume || 0.1);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioManagerRef.current) {
      audioManagerRef.current = new AudioManager(playlist, config);
      setEnabled(audioManagerRef.current.isEnabled);
      setVolumeState(audioManagerRef.current.currentVolume);
      setMuted(audioManagerRef.current.muted);
    }

    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.pause();
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const enableAndPlay = async () => {
    if (audioManagerRef.current) {
      await audioManagerRef.current.enableAndPlay();
      setEnabled(true);
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioManagerRef.current) {
      audioManagerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setVolume(newVolume);
      setVolumeState(newVolume);
    }
  };

  const toggleMute = () => {
    if (audioManagerRef.current) {
      audioManagerRef.current.toggleMute();
      setMuted(audioManagerRef.current.muted);
    }
  };

  return {
    enabled,
    volume,
    muted,
    isPlaying,
    enableAndPlay,
    pause,
    setVolume,
    toggleMute,
    trackIndex: audioManagerRef.current?.trackIndex || 0
  };
}
