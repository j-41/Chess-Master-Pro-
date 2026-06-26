// ChessMaster Pro — Sound Manager
// Programmatically generated sounds using Web Audio API (no external files needed)

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', decay: number = 0.3) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * decay);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not available
    }
  }

  private playNoise(duration: number, highpass: number = 1000) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(highpass, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.8);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      source.start(ctx.currentTime);
    } catch (e) {
      // Audio not available
    }
  }

  move() {
    this.playTone(800, 0.08, 'sine', 1);
    setTimeout(() => this.playNoise(0.04, 3000), 10);
  }

  capture() {
    this.playNoise(0.12, 800);
    setTimeout(() => this.playTone(400, 0.1, 'triangle', 0.8), 20);
  }

  check() {
    this.playTone(880, 0.15, 'square', 0.6);
    setTimeout(() => this.playTone(660, 0.1, 'square', 0.5), 80);
  }

  castle() {
    this.playTone(600, 0.08, 'sine', 1);
    setTimeout(() => this.playTone(800, 0.08, 'sine', 1), 80);
  }

  promote() {
    this.playTone(523, 0.1, 'sine', 0.8);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.8), 80);
    setTimeout(() => this.playTone(784, 0.15, 'sine', 0.8), 160);
  }

  gameStart() {
    this.playTone(440, 0.12, 'sine', 0.6);
    setTimeout(() => this.playTone(554, 0.12, 'sine', 0.6), 100);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.6), 200);
  }

  gameEnd() {
    this.playTone(659, 0.15, 'sine', 0.6);
    setTimeout(() => this.playTone(554, 0.15, 'sine', 0.6), 150);
    setTimeout(() => this.playTone(440, 0.25, 'sine', 0.6), 300);
  }

  illegal() {
    this.playTone(200, 0.15, 'sawtooth', 0.8);
  }

  lowTime() {
    this.playTone(1000, 0.05, 'square', 1);
  }

  puzzleCorrect() {
    this.playTone(523, 0.08, 'sine', 0.8);
    setTimeout(() => this.playTone(659, 0.08, 'sine', 0.8), 60);
    setTimeout(() => this.playTone(784, 0.08, 'sine', 0.8), 120);
    setTimeout(() => this.playTone(1047, 0.15, 'sine', 0.8), 180);
  }

  puzzleWrong() {
    this.playTone(400, 0.12, 'sawtooth', 0.6);
    setTimeout(() => this.playTone(300, 0.2, 'sawtooth', 0.6), 100);
  }

  notify() {
    this.playTone(880, 0.05, 'sine', 1);
    setTimeout(() => this.playTone(1100, 0.08, 'sine', 1), 60);
  }
}

export const soundManager = new SoundManager();
