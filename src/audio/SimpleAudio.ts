/**
 * Ultra-lightweight audio system for Fortify
 * Uses HTML Audio elements for maximum compatibility and speed
 */

export class SimpleAudio {
  private playlist: string[] = [];
  private currentIndex = 0;
  private audio: HTMLAudioElement | null = null;
  private volume = 0.1;
  private muted = false;
  private enabled = false;

  constructor(playlist: string[]) {
    console.log('🎵 SimpleAudio constructor called with playlist:', playlist);
    this.playlist = playlist;
    this.loadSettings();
    console.log('🎵 SimpleAudio initialized - enabled:', this.enabled, 'volume:', this.volume);
  }

  private loadSettings() {
    try {
      const savedVolume = localStorage.getItem('fortify.volume');
      const savedEnabled = localStorage.getItem('fortify.enabled');
      
      console.log('🎵 Loading settings - savedVolume:', savedVolume, 'savedEnabled:', savedEnabled);
      
      if (savedVolume) this.volume = parseFloat(savedVolume);
      if (savedEnabled !== null) this.enabled = savedEnabled === 'true';
      else this.enabled = true; // Default to enabled
      
      console.log('🎵 Settings loaded - volume:', this.volume, 'enabled:', this.enabled);
    } catch (error) {
      console.log('🎵 Error loading settings:', error);
      this.enabled = true;
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('fortify.volume', this.volume.toString());
      localStorage.setItem('fortify.enabled', this.enabled.toString());
    } catch {
      // Ignore storage errors
    }
  }

  async start(): Promise<void> {
    console.log('🎵 Start called - enabled:', this.enabled, 'playlist length:', this.playlist.length);
    
    if (!this.enabled || this.playlist.length === 0) {
      console.log('🎵 Start aborted - not enabled or empty playlist');
      return;
    }

    // If already playing, don't start again
    if (this.audio && !this.audio.paused) {
      console.log('🎵 Music already playing');
      return;
    }

    try {
      // Clean up any existing audio element
      if (this.audio) {
        console.log('🎵 Cleaning up existing audio element');
        this.audio.pause();
        this.audio.removeEventListener('ended', this.playNext);
        this.audio = null;
      }

      // Create new audio element
      const audioUrl = this.playlist[this.currentIndex];
      console.log('🎵 Creating audio element for:', audioUrl);
      this.audio = new Audio(audioUrl);
      this.audio.volume = this.muted ? 0 : this.volume;
      this.audio.loop = false;
      
      console.log('🎵 Audio element created, volume set to:', this.audio.volume);
      
      // Add error handling
      this.audio.addEventListener('error', (e) => {
        console.error('🎵 Audio error:', e, 'URL:', audioUrl);
      });
      
      this.audio.addEventListener('loadstart', () => {
        console.log('🎵 Audio load started');
      });
      
      this.audio.addEventListener('canplay', () => {
        console.log('🎵 Audio can play');
      });
      
      // Auto-advance to next track
      this.audio.addEventListener('ended', this.playNext);

      // Start playing
      console.log('🎵 Attempting to play audio...');
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('🎵 Music started successfully');
      } else {
        console.log('🎵 Play returned undefined (old browser)');
      }
    } catch (error) {
      console.error('🎵 Failed to start music:', error);
      
      // Check if it's an autoplay error
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log('🎵 Autoplay blocked by browser - user interaction required');
      }
      
      throw error;
    }
  }

  private playNext = () => {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.playTrack(this.currentIndex);
  }

  private async playTrack(index: number) {
    if (!this.enabled || !this.playlist[index]) return;

    try {
      // Clean up current audio element
      if (this.audio) {
        this.audio.pause();
        this.audio.removeEventListener('ended', this.playNext);
        this.audio.currentTime = 0;
      }

      // Create new audio element
      this.audio = new Audio(this.playlist[index]);
      this.audio.volume = this.muted ? 0 : this.volume;
      this.audio.addEventListener('ended', this.playNext);

      await this.audio.play();
    } catch (error) {
      console.log('🎵 Failed to play track:', error);
      // Try next track on error
      this.playNext();
    }
  }

  setVolume(newVolume: number) {
    this.volume = Math.max(0, Math.min(1, newVolume));
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
    this.saveSettings();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.audio) {
      this.audio.volume = this.muted ? 0 : this.volume;
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('ended', this.playNext);
      this.audio = null;
    }
  }

  // Getters
  get currentVolume() { return this.volume; }
  get isMuted() { return this.muted; }
  get isEnabled() { return this.enabled; }
}
