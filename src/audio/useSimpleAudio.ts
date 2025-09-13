/**
 * Simple React hook for the audio system
 */

import { useEffect, useRef, useState } from 'react';
import { SimpleAudio } from './SimpleAudio';

export function useSimpleAudio(playlist: string[]) {
  const audioRef = useRef<SimpleAudio | null>(null);
  const [volume, setVolumeState] = useState(0.1);
  const [muted, setMuted] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new SimpleAudio(playlist);
      setVolumeState(audioRef.current.currentVolume);
      setMuted(audioRef.current.isMuted);
      setEnabled(audioRef.current.isEnabled);
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  const start = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.start();
      } catch (error) {
        console.log('Audio start failed:', error);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.setVolume(newVolume);
      setVolumeState(newVolume);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.toggleMute();
      setMuted(audioRef.current.isMuted);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.stop();
    }
  };

  return {
    enabled,
    volume,
    muted,
    start,
    pause,
    stop,
    setVolume,
    toggleMute
  };
}