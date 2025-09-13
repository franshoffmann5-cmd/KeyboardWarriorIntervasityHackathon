/**
 * Lightweight Audio Manager for Fortify
 * Handles chiptune playlist with crossfades using Web Audio API
 */

interface AudioManagerConfig {
  defaultVolume?: number;
  crossfadeSec?: number;
  storageKeys?: {
    volume: string;
    enabled: string;
  };
}

interface AudioTrack {
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode | null;
}

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGainNode: GainNode | null = null;
  private playlist: string[] = [];
  private tracks: Map<string, AudioBuffer> = new Map();
  private currentTrack: AudioTrack | null = null;
  private nextTrack: AudioTrack | null = null;
  private currentIndex = 0;
  private isLoading = false;
  private isTransitioning = false;
  private isInitializing = false;
  private crossfadeDuration: number;
  private volume: number;
  private isMuted = false;
  private enabled = false;
  private storageKeys: { volume: string; enabled: string };

  constructor(playlist: string[], config: AudioManagerConfig = {}) {
    this.playlist = playlist;
    this.crossfadeDuration = config.crossfadeSec || 2.0;
    this.storageKeys = config.storageKeys || {
      volume: 'fortify.volume',
      enabled: 'fortify.soundEnabled'
    };

    // Load persisted settings
    this.volume = this.loadVolume(config.defaultVolume || 0.1);
    this.enabled = this.loadEnabled();
    
    // Start preloading first track immediately for faster startup
    this.preloadFirstTrack();
  }

  private loadVolume(defaultValue: number): number {
    try {
      const stored = localStorage.getItem(this.storageKeys.volume);
      return stored ? parseFloat(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveVolume(): void {
    try {
      localStorage.setItem(this.storageKeys.volume, this.volume.toString());
    } catch {
      // Ignore storage errors
    }
  }

  private loadEnabled(): boolean {
    try {
      const stored = localStorage.getItem(this.storageKeys.enabled);
      // Default to true if no preference stored (auto-enable music)
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true; // Default to enabled
    }
  }

  private saveEnabled(): void {
    try {
      localStorage.setItem(this.storageKeys.enabled, this.enabled.toString());
    } catch {
      // Ignore storage errors
    }
  }

  private async preloadFirstTrack(): Promise<void> {
    if (this.playlist.length === 0) return;
    
    // Preload first track using simple fetch without decoding (faster)
    try {
      const response = await fetch(this.playlist[0]);
      if (response.ok) {
        // Cache the response for later use
        const arrayBuffer = await response.arrayBuffer();
        // Store as raw data, will decode when audio context is ready
        (window as any).preloadedFirstTrack = arrayBuffer;
      }
    } catch {
      // Silent fail - not critical
    }
  }

  async initialize(): Promise<void> {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGainNode = this.audioContext.createGain();
      this.masterGainNode.connect(this.audioContext.destination);
      this.updateGain();

      // Handle page visibility changes
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    } catch (error) {
      console.warn('Web Audio API not available, music disabled:', error);
    }
  }

  private handleVisibilityChange(): void {
    if (!this.audioContext) return;

    if (document.hidden && this.audioContext.state === 'running') {
      this.audioContext.suspend();
    } else if (!document.hidden && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private async loadTrack(url: string): Promise<AudioBuffer | null> {
    if (this.tracks.has(url)) {
      return this.tracks.get(url) || null;
    }

    try {
      let arrayBuffer: ArrayBuffer;
      
      // Check if this is the first track and we have preloaded data
      if (url === this.playlist[0] && (window as any).preloadedFirstTrack) {
        arrayBuffer = (window as any).preloadedFirstTrack;
        // Clear the preloaded data
        delete (window as any).preloadedFirstTrack;
      } else {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        arrayBuffer = await response.arrayBuffer();
      }
      
      if (!this.audioContext) {
        throw new Error('AudioContext not initialized');
      }

      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.tracks.set(url, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load track: ${url}`, error);
      return null;
    }
  }

  private createTrack(buffer: AudioBuffer): AudioTrack {
    if (!this.audioContext || !this.masterGainNode) {
      throw new Error('AudioContext not initialized');
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.masterGainNode);

    return { buffer, source, gainNode };
  }

  private updateGain(): void {
    if (!this.masterGainNode) return;
    
    const targetGain = this.isMuted ? 0 : this.volume;
    this.masterGainNode.gain.setValueAtTime(targetGain, this.audioContext!.currentTime);
  }

  private scheduleNextTrack(): void {
    if (!this.currentTrack?.source || !this.audioContext) return;

    const nextIndex = (this.currentIndex + 1) % this.playlist.length;
    const nextUrl = this.playlist[nextIndex];

    // Schedule loading 3 seconds before current track ends
    const currentTime = this.audioContext.currentTime;
    const trackDuration = this.currentTrack.buffer?.duration || 0;
    const loadTime = Math.max(0, trackDuration - 3);

    setTimeout(async () => {
      const nextBuffer = await this.loadTrack(nextUrl);
      if (nextBuffer && this.audioContext) {
        this.nextTrack = this.createTrack(nextBuffer);
        
        // Start crossfade
        const fadeStartTime = trackDuration - this.crossfadeDuration;
        setTimeout(() => this.crossfade(nextIndex), fadeStartTime * 1000);
      }
    }, loadTime * 1000);
  }

  private crossfade(nextIndex: number): void {
    if (!this.audioContext || !this.currentTrack || !this.nextTrack) return;

    this.isTransitioning = true;
    const currentTime = this.audioContext.currentTime;
    const fadeEndTime = currentTime + this.crossfadeDuration;

    // Fade out current track
    this.currentTrack.gainNode!.gain.setValueAtTime(1, currentTime);
    this.currentTrack.gainNode!.gain.linearRampToValueAtTime(0, fadeEndTime);

    // Fade in next track
    this.nextTrack.gainNode!.gain.setValueAtTime(0, currentTime);
    this.nextTrack.gainNode!.gain.linearRampToValueAtTime(1, fadeEndTime);

    // Start next track
    this.nextTrack.source!.start(currentTime);
    this.nextTrack.source!.onended = () => this.onTrackEnded();

    // Stop current track after fade
    this.currentTrack.source!.stop(fadeEndTime);

    // Update state
    this.currentIndex = nextIndex;
    this.currentTrack = this.nextTrack;
    this.nextTrack = null;

    // Schedule next track and clear transition flag
    setTimeout(() => {
      this.isTransitioning = false;
      this.scheduleNextTrack();
    }, this.crossfadeDuration * 1000);
  }

  private onTrackEnded(): void {
    // Only proceed to next track if we're not in the middle of a transition
    if (!this.isTransitioning) {
      this.playNext();
    }
  }

  private async playNext(): Promise<void> {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    await this.playTrack(this.currentIndex);
  }

  private async playTrack(index: number): Promise<void> {
    if (this.isLoading || !this.audioContext || this.isTransitioning) return;

    this.isLoading = true;
    const url = this.playlist[index];
    
    try {
      const buffer = await this.loadTrack(url);
      if (!buffer) {
        // Skip failed track
        await this.playNext();
        return;
      }

      // Stop current track if playing
      if (this.currentTrack?.source) {
        this.isTransitioning = true;
        this.currentTrack.source.stop();
        setTimeout(() => this.isTransitioning = false, 100);
      }

      // Create and start new track
      this.currentTrack = this.createTrack(buffer);
      this.currentTrack.source!.start();
      this.currentTrack.source!.onended = () => this.onTrackEnded();
      this.currentIndex = index;

      // Schedule next track
      this.scheduleNextTrack();
    } catch (error) {
      console.warn(`Failed to play track ${index}:`, error);
      await this.playNext();
    } finally {
      this.isLoading = false;
    }
  }

  // Public API
  async enableAndPlay(): Promise<void> {
    // Prevent multiple simultaneous initialization attempts
    if (this.isInitializing) return;
    
    if (!this.enabled) {
      this.enabled = true;
      this.saveEnabled();
    }

    this.isInitializing = true;
    try {
      await this.initialize();
      
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      // Only start playing if no track is currently playing and we have tracks
      if (!this.currentTrack && this.playlist.length > 0 && this.audioContext?.state === 'running') {
        await this.playTrack(0);
      }
    } catch (error) {
      console.error('Failed to enable and play audio:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  pause(): void {
    if (this.currentTrack?.source) {
      this.currentTrack.source.stop();
      this.currentTrack = null;
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.saveVolume();
    this.updateGain();
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.updateGain();
  }

  // Getters
  get isEnabled(): boolean { return this.enabled; }
  get isPlaying(): boolean { return !!this.currentTrack?.source; }
  get currentVolume(): number { return this.volume; }
  get muted(): boolean { return this.isMuted; }
  get trackIndex(): number { return this.currentIndex; }
}
