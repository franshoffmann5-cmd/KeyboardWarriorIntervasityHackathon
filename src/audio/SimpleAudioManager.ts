/**
 * Simple Audio Manager for Fortify - Lightweight version
 * Uses basic HTML Audio for better performance
 */

export interface SimpleAudioState {
  isPlaying: boolean;
  currentIndex: number;
  volume: number;
  muted: boolean;
  enabled: boolean;
}

export class SimpleAudioManager {
  private audio: HTMLAudioElement | null = null;
  private playlist: string[] = [];
  private currentIndex = 0;
  private volume = 0.6;
  private muted = false;
  private enabled = false;
  private isPlaying = false;
  
  private stateListeners: Set<(state: SimpleAudioState) => void> = new Set();

  constructor(playlist: string[], defaultVolume = 0.6) {
    this.playlist = playlist;
    this.volume = defaultVolume;
    this.loadPersistedSettings();
  }

  private loadPersistedSettings(): void {
    try {
      const saved = localStorage.getItem('fortify-audio-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.volume = settings.volume ?? 0.6;
        this.muted = settings.muted ?? false;
      }
    } catch (e) {
      console.warn('Failed to load audio settings:', e);
    }
  }

  private persistSettings(): void {
    try {
      localStorage.setItem('fortify-audio-settings', JSON.stringify({
        volume: this.volume,
        muted: this.muted
      }));
    } catch (e) {
      console.warn('Failed to save audio settings:', e);
    }
  }

  private notifyStateChange(): void {
    const state = this.getState();
    this.stateListeners.forEach(listener => listener(state));
  }

  private setupAudio(): void {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = false;
      this.audio.volume = this.muted ? 0 : this.volume;
      
      this.audio.addEventListener('ended', () => {
        this.playNext();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e);
        this.playNext(); // Try next track on error
      });
    }
  }

  public async enableAndPlay(): Promise<void> {
    this.enabled = true;
    this.setupAudio();
    await this.play();
  }

  public async play(): Promise<void> {
    if (!this.enabled || this.playlist.length === 0) return;

    this.setupAudio();
    
    if (this.audio) {
      try {
        this.audio.src = this.playlist[this.currentIndex];
        this.audio.volume = this.muted ? 0 : this.volume;
        await this.audio.play();
        this.isPlaying = true;
        this.notifyStateChange();
      } catch (error) {
        console.warn('Failed to play audio:', error);
        this.isPlaying = false;
        this.notifyStateChange();
      }
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notifyStateChange();
    }
  }

  public playNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    }
    this.notifyStateChange();
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
    this.persistSettings();
    this.notifyStateChange();
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
    this.persistSettings();
    this.notifyStateChange();
  }

  public getState(): SimpleAudioState {
    return {
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      volume: this.volume,
      muted: this.muted,
      enabled: this.enabled,
    };
  }

  public getCurrentTrackName(): string {
    if (this.playlist.length === 0) return 'No track';
    const track = this.playlist[this.currentIndex];
    return track.split('/').pop()?.replace('.mp3', '') || 'Unknown';
  }

  public addStateListener(listener: (state: SimpleAudioState) => void): void {
    this.stateListeners.add(listener);
  }

  public removeStateListener(listener: (state: SimpleAudioState) => void): void {
    this.stateListeners.delete(listener);
  }

  public destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.stateListeners.clear();
  }
}
