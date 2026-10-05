/**
 * AFRIKAFUN - IMMERSIVE AUDIO SYSTEM
 * 
 * Architecture sonore narrative progressive synchronisée au scroll & aux interactions :
 * 01 LE RÊVE -> 02 LA CONCEPTION -> 03 LE PROJET -> 04 L'EXPÉRIENCE -> 
 * 05 LA TENSION & LIGHTS OUT -> 06 LA COURSE -> 07 LE FINAL & BOUCLE NARRATIVE.
 * 
 * - Son désactivé par défaut au chargement (respect autoplay browser).
 * - Contrôles de volume indépendants : Musique, Ambiances, Effets Sonores (SFX).
 * - Synthèse procédurale Web Audio haute fidélité (aucun problème de droits ou fichiers manquants).
 * - Prêt pour l'injection des fichiers audio définitifs dans /assets/audio/
 */

export interface AudioMixerState {
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  ambienceVolume: number;
  sfxVolume: number;
  currentSection: string;
}

// Emplacement des futurs fichiers définitifs
export const AUDIO_FILE_PATHS = {
  ambienceEarth: "/assets/audio/ambience-earth.mp3",
  kartChild: "/assets/audio/kart-child.mp3",
  design: "/assets/audio/design.mp3",
  buildUp: "/assets/audio/build-up.mp3",
  countdown: "/assets/audio/countdown.mp3",
  race: "/assets/audio/race.mp3",
  final: "/assets/audio/final.mp3",
  musicTheme: "/assets/audio/music-theme.mp3",
};

type Listener = (state: AudioMixerState) => void;

class CinematicAudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // OFF by default
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  // Volumes (0 to 1)
  private masterVol = 0.8;
  private musicVol = 0.7;
  private ambienceVol = 0.75;
  private sfxVol = 0.85;

  private currentSection = "01_reve";
  private listeners: Listener[] = [];

  // Active audio nodes
  private activeWindNoise: AudioNode | null = null;
  private activeMusicOscs: OscillatorNode[] = [];
  private activeHeartbeatInterval: number | null = null;
  private activeEngineNode: AudioNode | null = null;

  constructor() {
    // Initialized on first user interaction
  }

  public subscribe(fn: Listener) {
    this.listeners.push(fn);
    fn(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((l) => l(st));
  }

  public getState(): AudioMixerState {
    return {
      isMuted: this.isMuted,
      masterVolume: this.masterVol,
      musicVolume: this.musicVol,
      ambienceVolume: this.ambienceVol,
      sfxVolume: this.sfxVol,
      currentSection: this.currentSection,
    };
  }

  private initAudio() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master bus
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Ambience bus
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(this.ambienceVol, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // SFX bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // --- CONTROLS ---

  public toggleSound(): boolean {
    this.initAudio();
    this.isMuted = !this.isMuted;

    if (this.ctx && this.masterGain) {
      const target = this.isMuted ? 0 : this.masterVol;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.15);
    }

    if (!this.isMuted) {
      // Re-trigger sound for current section
      this.updateSectionSound(this.currentSection);
    } else {
      this.stopContinuousSounds();
    }

    this.notify();
    return !this.isMuted;
  }

  public setMasterVolume(val: number) {
    this.masterVol = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
    }
    this.notify();
  }

  public setMusicVolume(val: number) {
    this.musicVol = Math.max(0, Math.min(1, val));
    if (this.ctx && this.musicGain) {
      this.musicGain.gain.setValueAtTime(this.musicVol, this.ctx.currentTime);
    }
    this.notify();
  }

  public setAmbienceVolume(val: number) {
    this.ambienceVol = Math.max(0, Math.min(1, val));
    if (this.ctx && this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(this.ambienceVol, this.ctx.currentTime);
    }
    this.notify();
  }

  public setSfxVolume(val: number) {
    this.sfxVol = Math.max(0, Math.min(1, val));
    if (this.ctx && this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
    }
    this.notify();
  }

  // --- NARRATIVE PROGRESSION BY SCROLL ---

  public updateSectionSound(sectionId: string) {
    if (this.currentSection === sectionId && this.activeMusicOscs.length > 0) return;
    this.currentSection = sectionId;
    this.notify();

    if (this.isMuted) return;
    this.initAudio();
    if (!this.ctx) return;

    this.stopContinuousSounds();

    switch (sectionId) {
      case "01_reve":
        // SECTION 01 — LE RÊVE
        // vent léger, ambiance extérieure, terre, petits roulements du kart artisanal en bois
        this.startWindAmbience(180, 0.08);
        this.playWoodenKartRoll();
        this.startGentlePad([220, 277.18, 329.63], 0.05); // Warm A minor triad
        break;

      case "02_forme":
        // SECTION 02 — LE RÊVE PREND FORME
        // crayon sur papier, clics très subtils, début de la musique originale
        this.startGentlePad([261.63, 329.63, 392], 0.09); // C major chord
        this.playPencilSketchSound();
        break;

      case "03_circuit":
        // SECTION 03 — LE CIRCUIT PREND VIE
        // Montée progressive de la musique, basse légère, énergie mécanique
        this.startBassDrone(65.41, 0.14); // Low C
        this.startGentlePad([196, 261.63, 392, 493.88], 0.12);
        this.startWindAmbience(350, 0.06);
        break;

      case "04_experience":
        // SECTION 04 — L'EXPÉRIENCE
        // Ambiance familiale, conversations très discrètes, moteur lointain en arrière-plan
        this.startGentlePad([220, 329.63, 440], 0.1);
        this.startDistantEngine(110, 0.04);
        break;

      case "05_lights_out":
        // SECTION 05 — LIGHTS OUT
        // Disparition de l'ambiance, respiration, battement sourd, moteur au ralenti
        this.startHeartbeatPulse();
        this.startKartIdleEngine();
        break;

      case "06_race":
        // SECTION 06 — ENTER THE RACE
        // Explosion sonore : moteurs, accélération, vent, passages rapides
        this.startRaceAtmosphere();
        break;

      case "07_realite":
      default:
        // SECTION 07 — LE RÊVE DEVIENT RÉALITÉ
        // Redescendre l'intensité, ambiance émotionnelle, rappel sonore du début (boucle narrative)
        this.startWindAmbience(200, 0.07);
        this.startGentlePad([220, 277.18, 329.63, 440], 0.08); // Noble resolution
        // Petit rappel sonore du kart artisanal qui fusionne avec le kart de course
        this.playWoodenKartRoll(true);
        break;
    }
  }

  // --- PROCEDURAL AUDIO GENERATORS ---

  /**
   * Generates warm organic wind / coastal atmosphere
   */
  private startWindAmbience(cutoff = 220, gainVal = 0.06) {
    if (!this.ctx || !this.ambienceGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02; // Pink-brown filter
        data[i] = lastOut * 1.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(cutoff, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambienceGain);

      noise.start();
      this.activeWindNoise = noise;
    } catch {
      // Audio fallback
    }
  }

  /**
   * Sound of child's handcrafted wooden kart wheels rolling on red clay
   */
  public playWoodenKartRoll(isMergedWithRace = false) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(180, now + 1.2);
      osc.frequency.linearRampToValueAtTime(120, now + 2.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 2.6);

      if (isMergedWithRace) {
        // Subtle hint of a high-tech engine purr fading in to close the narrative loop
        const rev = this.ctx.createOscillator();
        const revGain = this.ctx.createGain();
        rev.type = "sawtooth";
        rev.frequency.setValueAtTime(80, now + 0.8);
        rev.frequency.exponentialRampToValueAtTime(220, now + 2.2);
        revGain.gain.setValueAtTime(0.001, now);
        revGain.gain.linearRampToValueAtTime(0.05, now + 1.8);
        revGain.gain.linearRampToValueAtTime(0.001, now + 2.6);
        rev.connect(revGain);
        revGain.connect(this.sfxGain);
        rev.start(now + 0.8);
        rev.stop(now + 2.7);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Sound of pencil sketching architectural lines on draft pad
   */
  public playPencilSketchSound() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      for (let s = 0; s < 3; s++) {
        const offset = now + s * 0.45;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, offset);
        gain.gain.setValueAtTime(0.001, offset);
        gain.gain.linearRampToValueAtTime(0.03, offset + 0.05);
        gain.gain.linearRampToValueAtTime(0.001, offset + 0.22);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(offset);
        osc.stop(offset + 0.25);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * Deep heartbeat tension pulse for Section 05
   */
  private startHeartbeatPulse() {
    if (!this.ctx || !this.sfxGain) return;
    if (this.activeHeartbeatInterval) {
      clearInterval(this.activeHeartbeatInterval);
    }

    const triggerPulse = () => {
      if (!this.ctx || !this.sfxGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      // Dub 1
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(gain1);
      gain1.connect(this.sfxGain);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Dub 2
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(65, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(40, now + 0.32);
      gain2.gain.setValueAtTime(0.14, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(this.sfxGain);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.36);
    };

    triggerPulse();
    this.activeHeartbeatInterval = window.setInterval(triggerPulse, 1200);
  }

  /**
   * Low kart idle engine
   */
  private startKartIdleEngine() {
    if (!this.ctx || !this.sfxGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(48, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      this.activeEngineNode = osc;
    } catch {
      // Ignore
    }
  }

  /**
   * Distant engine in customer area
   */
  private startDistantEngine(freq = 110, volume = 0.04) {
    if (!this.ctx || !this.ambienceGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambienceGain);

      osc.start();
      this.activeEngineNode = osc;
    } catch {
      // Ignore
    }
  }

  /**
   * Play dedicated sound design for a specific slide (1 to 9)
   */
  public playSlideSoundDesign(slideId: number) {
    this.initAudio();
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (this.isMuted) {
      this.toggleSound();
    }

    const now = this.ctx.currentTime;

    switch (slideId) {
      case 1:
        // SLIDE 01: Trailer Arc (breath, distant hum, revving swell, sustained finish)
        this.playSlide01TrailerArc(now);
        break;
      case 2:
        // SLIDE 02 (RÊVER · OSER): Bois, ficelle, sifflement des roues, mélodie simple et murmure "vroum"
        this.playSlide02ReverOser(now);
        break;
      case 3:
        // SLIDE 03 (JOUER · RENCONTRER): Poussière, moteur imité par l'enfant, silence suspendu, tasse qui vibre
        this.playSlide03JouerRencontrer(now);
        break;
      case 4:
        // SLIDE 04 (IMAGINER · DESSINER): Crissement du crayon montant en régime, clavier, nappe
        this.playSlide04ImaginerDessiner(now);
        break;
      case 5:
        // SLIDE 05 (CONCEVOIR · BÂTIR): Percussions précises, roulement miniature, grondement qui dépasse la maquette
        this.playSlide05ConcevoirBatir(now);
        break;
      case 6:
        // SLIDE 06 (S'ÉQUIPER · FRÉMIR): Battements de cœur, visière, 2 coups d'accélérateur, 5 feux rouges
        this.playSlide06SEquiperFremir(now);
        break;
      case 7:
        // SLIDE 07 (S'ENGAGER · SE DÉPASSER): 4 rapports pleins gaz, crissement de pneus, effet Doppler
        this.playContinuousAccelerationSequence();
        break;
      case 8:
        // SLIDE 08 (RASSEMBLER · VIBRER): Percussions amples, foule, basse tellurique qui fait trembler les barrières
        this.playSlide08RassemblerVibrer(now);
        break;
      case 9:
        // SLIDE 09 (TRANSMETTRE · S'ÉLEVER): Moteur qui rentre au stand, montée de grue, note suspendue, "vroum" d'enfant
        this.playSlide09TransmettreSElever(now);
        break;
      default:
        this.playContinuousAccelerationSequence();
        break;
    }
  }

  // --- INDIVIDUAL SLIDE SOUND SYNTHESIZERS ---

  private playSlide01TrailerArc(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // 1. Soft breath
    const breath = this.createNoiseBufferNode(1.2);
    const bFilter = this.ctx.createBiquadFilter();
    bFilter.type = "bandpass";
    bFilter.frequency.setValueAtTime(450, now);
    const bGain = this.ctx.createGain();
    bGain.gain.setValueAtTime(0.001, now);
    bGain.gain.linearRampToValueAtTime(0.08, now + 0.5);
    bGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    breath.connect(bFilter);
    bFilter.connect(bGain);
    bGain.connect(this.sfxGain);
    breath.start(now);

    // 2. Distant engine rumble at +1.3s
    const rumble = this.ctx.createOscillator();
    const rGain = this.ctx.createGain();
    rumble.type = "sawtooth";
    rumble.frequency.setValueAtTime(55, now + 1.3);
    rumble.frequency.exponentialRampToValueAtTime(140, now + 2.8);
    rGain.gain.setValueAtTime(0.001, now + 1.3);
    rGain.gain.linearRampToValueAtTime(0.12, now + 2.2);
    rGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    rumble.connect(rGain);
    rGain.connect(this.sfxGain);
    rumble.start(now + 1.3);
    rumble.stop(now + 3.3);

    // 3. Acceleration burst at +3.2s
    setTimeout(() => {
      this.playContinuousAccelerationSequence();
    }, 3200);
  }

  private playSlide02ReverOser(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // Wood percussion clicks (assembling wooden kart)
    [0.1, 0.35, 0.65, 0.95].forEach((t, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420 + i * 80, now + t);
      osc.frequency.exponentialRampToValueAtTime(120, now + t + 0.08);
      gain.gain.setValueAtTime(0.15, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.09);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + t);
      osc.stop(now + t + 0.1);
    });

    // Wheels whistling friction
    const whistle = this.ctx.createOscillator();
    const wGain = this.ctx.createGain();
    whistle.type = "triangle";
    whistle.frequency.setValueAtTime(520, now + 1.2);
    whistle.frequency.exponentialRampToValueAtTime(980, now + 2.2);
    wGain.gain.setValueAtTime(0.001, now + 1.2);
    wGain.gain.linearRampToValueAtTime(0.08, now + 1.7);
    wGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
    whistle.connect(wGain);
    wGain.connect(this.sfxGain);
    whistle.start(now + 1.2);
    whistle.stop(now + 2.5);

    // Innocent whispered "vroum" motor sound at 2.6s
    const vroum = this.ctx.createOscillator();
    const vFilter = this.ctx.createBiquadFilter();
    const vGain = this.ctx.createGain();
    vroum.type = "sawtooth";
    vroum.frequency.setValueAtTime(75, now + 2.6);
    vroum.frequency.exponentialRampToValueAtTime(130, now + 3.1);
    vroum.frequency.exponentialRampToValueAtTime(60, now + 3.6);
    vFilter.type = "lowpass";
    vFilter.frequency.setValueAtTime(280, now + 2.6);
    vGain.gain.setValueAtTime(0.001, now + 2.6);
    vGain.gain.linearRampToValueAtTime(0.12, now + 2.9);
    vGain.gain.exponentialRampToValueAtTime(0.001, now + 3.7);
    vroum.connect(vFilter);
    vFilter.connect(vGain);
    vGain.connect(this.sfxGain);
    vroum.start(now + 2.6);
    vroum.stop(now + 3.8);
  }

  private playSlide03JouerRencontrer(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // Child running in dust - rhythmic steps
    [0.1, 0.3, 0.5, 0.7, 0.9, 1.1].forEach((t) => {
      const step = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      step.type = "sine";
      step.frequency.setValueAtTime(140, now + t);
      step.frequency.exponentialRampToValueAtTime(50, now + t + 0.07);
      gain.gain.setValueAtTime(0.12, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);
      step.connect(gain);
      gain.connect(this.sfxGain!);
      step.start(now + t);
      step.stop(now + t + 0.09);
    });

    // Sudden halt & suspension at 1.4s
    // Distant rumble vibrating the architect's tea cup on desk (42 Hz)
    const rumble = this.ctx.createOscillator();
    const rGain = this.ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(42, now + 1.6);
    rGain.gain.setValueAtTime(0.001, now + 1.6);
    rGain.gain.linearRampToValueAtTime(0.16, now + 2.5);
    rGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
    rumble.connect(rGain);
    rGain.connect(this.sfxGain);
    rumble.start(now + 1.6);
    rumble.stop(now + 4.0);

    // Subtle porcelain tea cup vibration chink
    [2.1, 2.3, 2.6, 2.85].forEach((t) => {
      const chink = this.ctx!.createOscillator();
      const cGain = this.ctx!.createGain();
      chink.type = "triangle";
      chink.frequency.setValueAtTime(2400, now + t);
      cGain.gain.setValueAtTime(0.04, now + t);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04);
      chink.connect(cGain);
      cGain.connect(this.sfxGain!);
      chink.start(now + t);
      chink.stop(now + t + 0.05);
    });
  }

  private playSlide04ImaginerDessiner(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // Graphite pencil sketching friction rising in pitch like an engine rev
    const pencil = this.createNoiseBufferNode(2.5);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 1.8);
    filter.frequency.exponentialRampToValueAtTime(1100, now + 2.4);
    const pGain = this.ctx.createGain();
    pGain.gain.setValueAtTime(0.001, now);
    pGain.gain.linearRampToValueAtTime(0.14, now + 0.8);
    pGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    pencil.connect(filter);
    filter.connect(pGain);
    pGain.connect(this.sfxGain);
    pencil.start(now);

    // Warm architectural ambient chord
    [220, 277, 330].forEach((freq) => {
      const chord = this.ctx!.createOscillator();
      const cGain = this.ctx!.createGain();
      chord.type = "sine";
      chord.frequency.setValueAtTime(freq, now + 0.2);
      cGain.gain.setValueAtTime(0.001, now + 0.2);
      cGain.gain.linearRampToValueAtTime(0.04, now + 1.0);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
      chord.connect(cGain);
      cGain.connect(this.sfxGain!);
      chord.start(now + 0.2);
      chord.stop(now + 3.2);
    });
  }

  private playSlide05ConcevoirBatir(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // 1. Precise clockwork / architectural percussions
    [0.1, 0.35, 0.6, 0.85, 1.1, 1.35].forEach((t, i) => {
      const click = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(800 - i * 60, now + t);
      gain.gain.setValueAtTime(0.09, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.05);
      click.connect(gain);
      gain.connect(this.sfxGain!);
      click.start(now + t);
      click.stop(now + t + 0.06);
    });

    // 2. Toy kart rolling onto diorama at 1.5s
    const toy = this.ctx.createOscillator();
    const tGain = this.ctx.createGain();
    toy.type = "sawtooth";
    toy.frequency.setValueAtTime(110, now + 1.5);
    toy.frequency.exponentialRampToValueAtTime(180, now + 2.2);
    tGain.gain.setValueAtTime(0.001, now + 1.5);
    tGain.gain.linearRampToValueAtTime(0.08, now + 1.9);
    toy.connect(tGain);
    tGain.connect(this.sfxGain);
    toy.start(now + 1.5);
    toy.stop(now + 2.3);

    // 3. MOPRH: Real roaring 3D engine swells out of the toy at 2.4s!
    const engine = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const eGain = this.ctx.createGain();
    engine.type = "sawtooth";
    engine.frequency.setValueAtTime(65, now + 2.4);
    engine.frequency.exponentialRampToValueAtTime(240, now + 3.8);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now + 2.4);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 3.8);
    eGain.gain.setValueAtTime(0.01, now + 2.4);
    eGain.gain.linearRampToValueAtTime(0.24, now + 3.4);
    eGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
    engine.connect(filter);
    filter.connect(eGain);
    eGain.connect(this.sfxGain);
    engine.start(now + 2.4);
    engine.stop(now + 4.6);
  }

  private playSlide06SEquiperFremir(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // 1. Two deep tense heartbeats
    [0.1, 0.8].forEach((t) => {
      const hb = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      hb.type = "sine";
      hb.frequency.setValueAtTime(75, now + t);
      hb.frequency.exponentialRampToValueAtTime(35, now + t + 0.12);
      gain.gain.setValueAtTime(0.2, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.18);
      hb.connect(gain);
      gain.connect(this.sfxGain!);
      hb.start(now + t);
      hb.stop(now + t + 0.2);
    });

    // 2. Helmet visor snap click at 1.4s
    const visor = this.ctx.createOscillator();
    const vGain = this.ctx.createGain();
    visor.type = "triangle";
    visor.frequency.setValueAtTime(1200, now + 1.4);
    visor.frequency.exponentialRampToValueAtTime(200, now + 1.48);
    vGain.gain.setValueAtTime(0.18, now + 1.4);
    vGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    visor.connect(vGain);
    vGain.connect(this.sfxGain);
    visor.start(now + 1.4);
    visor.stop(now + 1.52);

    // 3. Two sharp throttle revs (brap... braaap!) at 1.8s & 2.6s
    [
      { t: 1.8, dur: 0.45, startF: 90, endF: 220 },
      { t: 2.6, dur: 0.65, startF: 95, endF: 290 },
    ].forEach((b) => {
      const rev = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      rev.type = "sawtooth";
      rev.frequency.setValueAtTime(b.startF, now + b.t);
      rev.frequency.exponentialRampToValueAtTime(b.endF, now + b.t + b.dur * 0.7);
      rev.frequency.exponentialRampToValueAtTime(b.startF, now + b.t + b.dur);
      gain.gain.setValueAtTime(0.01, now + b.t);
      gain.gain.linearRampToValueAtTime(0.2, now + b.t + b.dur * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + b.t + b.dur);
      rev.connect(gain);
      gain.connect(this.sfxGain!);
      rev.start(now + b.t);
      rev.stop(now + b.t + b.dur + 0.05);
    });

    // 4. Five rising starting lights countdown at 3.6s, 4.3s, 5.0s, 5.7s, 6.4s
    [1, 2, 3, 4, 5].forEach((lightNum, i) => {
      const lightTime = now + 3.6 + i * 0.7;
      const beep = this.ctx!.createOscillator();
      const bGain = this.ctx!.createGain();
      beep.type = "triangle";
      beep.frequency.setValueAtTime(700 + lightNum * 60, lightTime);
      bGain.gain.setValueAtTime(0.2, lightTime);
      bGain.gain.exponentialRampToValueAtTime(0.001, lightTime + 0.16);
      beep.connect(bGain);
      bGain.connect(this.sfxGain!);
      beep.start(lightTime);
      beep.stop(lightTime + 0.18);
    });
  }

  private playSlide08RassemblerVibrer(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // 1. Warm African celebratory percussion pattern
    [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0].forEach((t, i) => {
      const drum = this.ctx!.createOscillator();
      const dGain = this.ctx!.createGain();
      drum.type = "sine";
      const f = i % 2 === 0 ? 110 : 85;
      drum.frequency.setValueAtTime(f, now + t);
      drum.frequency.exponentialRampToValueAtTime(35, now + t + 0.14);
      dGain.gain.setValueAtTime(0.18, now + t);
      dGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.16);
      drum.connect(dGain);
      dGain.connect(this.sfxGain!);
      drum.start(now + t);
      drum.stop(now + t + 0.18);
    });

    // 2. Sub-bass vibration making track barriers tremble (36 Hz)
    const sub = this.ctx.createOscillator();
    const sGain = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(36, now);
    sGain.gain.setValueAtTime(0.01, now);
    sGain.gain.linearRampToValueAtTime(0.25, now + 1.2);
    sGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    sub.connect(sGain);
    sGain.connect(this.sfxGain);
    sub.start(now);
    sub.stop(now + 3.2);

    // 3. Fast high-speed kart pass-by flyby in background at 1.4s
    this.playDopplerPassBy();
  }

  private playSlide09TransmettreSElever(now: number) {
    if (!this.ctx || !this.sfxGain) return;
    // 1. Kart winding down as it enters pitlane, engine drops to idle and cuts off
    const engine = this.ctx.createOscillator();
    const eGain = this.ctx.createGain();
    engine.type = "sawtooth";
    engine.frequency.setValueAtTime(140, now);
    engine.frequency.exponentialRampToValueAtTime(65, now + 1.5);
    engine.frequency.setValueAtTime(45, now + 1.8);
    eGain.gain.setValueAtTime(0.15, now);
    eGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
    eGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); // ignition cuts
    engine.connect(eGain);
    eGain.connect(this.sfxGain);
    engine.start(now);
    engine.stop(now + 2.05);

    // 2. Ethereal soaring synth chord as crane / drone rises over the beach at sunset
    [261, 329, 392, 523].forEach((f) => {
      const ethereal = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      ethereal.type = "sine";
      ethereal.frequency.setValueAtTime(f, now + 2.0);
      ethereal.frequency.exponentialRampToValueAtTime(f * 1.05, now + 4.0);
      gain.gain.setValueAtTime(0.001, now + 2.0);
      gain.gain.linearRampToValueAtTime(0.06, now + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);
      ethereal.connect(gain);
      gain.connect(this.sfxGain!);
      ethereal.start(now + 2.0);
      ethereal.stop(now + 5.0);
    });

    // 3. Brief silence, then the nostalgic child's "vroum" returns at 4.2s (la boucle est bouclée!)
    const childVroum = this.ctx.createOscillator();
    const cGain = this.ctx.createGain();
    childVroum.type = "triangle";
    childVroum.frequency.setValueAtTime(95, now + 4.2);
    childVroum.frequency.exponentialRampToValueAtTime(160, now + 4.6);
    childVroum.frequency.exponentialRampToValueAtTime(75, now + 5.1);
    cGain.gain.setValueAtTime(0.001, now + 4.2);
    cGain.gain.linearRampToValueAtTime(0.14, now + 4.5);
    cGain.gain.exponentialRampToValueAtTime(0.001, now + 5.2);
    childVroum.connect(cGain);
    cGain.connect(this.sfxGain);
    childVroum.start(now + 4.2);
    childVroum.stop(now + 5.3);
  }

  /**
   * Helper to create a noise buffer
   */
  private createNoiseBufferNode(durationSeconds: number): AudioBufferSourceNode {
    const bufferSize = Math.max(1, Math.floor((this.ctx?.sampleRate || 44100) * durationSeconds));
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx!.createBufferSource();
    whiteNoise.buffer = buffer;
    return whiteNoise;
  }

  private startRaceAtmosphere() {
    if (!this.ctx || !this.musicGain) return;
    try {
      // Fast rhythmic tension bassline
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(110, now);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(220, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.musicGain);

      osc1.start();
      osc2.start();
      this.activeMusicOscs.push(osc1, osc2);

      // Trigger first continuous acceleration pull immediately
      this.playContinuousAccelerationSequence();

      // Launch continuous background racing laps
      this.startContinuousRaceLoop();
    } catch {
      // Ignore
    }
  }

  private activeRaceInterval: number | null = null;

  private startContinuousRaceLoop() {
    if (this.activeRaceInterval) clearInterval(this.activeRaceInterval);
    this.activeRaceInterval = window.setInterval(() => {
      if (this.currentSection === "06_race" && !this.isMuted) {
        this.playContinuousAccelerationSequence();
      }
    }, 7500);
  }

  /**
   * Continuous 4-Gear Kart Acceleration Pull with shifting, exhaust pops & tire scrub
   */
  public playContinuousAccelerationSequence() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;

      // Master oscillator for engine tone
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sawtooth";
      sub.type = "triangle";

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);

      // --- GEAR 1 (0.0s - 1.2s) ---
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 1.1);
      sub.frequency.setValueAtTime(37, now);
      sub.frequency.exponentialRampToValueAtTime(90, now + 1.1);
      filter.frequency.exponentialRampToValueAtTime(900, now + 1.1);

      // Shift 1 -> 2 (1.1s - 1.25s) : Rev drop & exhaust crackle
      osc.frequency.setValueAtTime(110, now + 1.25);
      sub.frequency.setValueAtTime(55, now + 1.25);

      // --- GEAR 2 (1.25s - 2.8s) ---
      osc.frequency.exponentialRampToValueAtTime(260, now + 2.7);
      sub.frequency.exponentialRampToValueAtTime(130, now + 2.7);
      filter.frequency.exponentialRampToValueAtTime(1600, now + 2.7);

      // Shift 2 -> 3 (2.7s - 2.85s) : Quick clutch shift
      osc.frequency.setValueAtTime(170, now + 2.85);
      sub.frequency.setValueAtTime(85, now + 2.85);

      // --- GEAR 3 (2.85s - 4.6s) --- High RPM Screamer
      osc.frequency.exponentialRampToValueAtTime(360, now + 4.5);
      sub.frequency.exponentialRampToValueAtTime(180, now + 4.5);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 4.5);

      // --- GEAR 4 & SPRINT (4.6s - 6.5s) --- Peak straightaway speed
      osc.frequency.setValueAtTime(250, now + 4.6);
      osc.frequency.exponentialRampToValueAtTime(440, now + 6.2);
      sub.frequency.setValueAtTime(125, now + 4.6);
      sub.frequency.exponentialRampToValueAtTime(220, now + 6.2);

      // Volume envelope over the 6.5s pull
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.8);
      gain.gain.setValueAtTime(0.18, now + 1.15); // shift 1
      gain.gain.linearRampToValueAtTime(0.28, now + 2.4);
      gain.gain.setValueAtTime(0.20, now + 2.75); // shift 2
      gain.gain.linearRampToValueAtTime(0.32, now + 4.4);
      gain.gain.linearRampToValueAtTime(0.35, now + 5.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 6.8);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 6.9);
      sub.stop(now + 6.9);

      // Tire screech sound at corner apex (at 2.8s)
      this.playTireScreech(now + 2.7, 0.6);
    } catch {
      // Ignore
    }
  }

  /**
   * Tire scrub / kerb vibration sound
   */
  private playTireScreech(startTime: number, duration = 0.5) {
    if (!this.ctx || !this.sfxGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, startTime);
      osc.frequency.linearRampToValueAtTime(1100, startTime + duration * 0.5);
      osc.frequency.linearRampToValueAtTime(650, startTime + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(900, startTime);
      filter.Q.setValueAtTime(3, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.09, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch {
      // Ignore
    }
  }

  /**
   * Sound of kart screaming past camera (Doppler effect)
   */
  public playDopplerPassBy() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      // Doppler pitch drop: high approach to low departure
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.35); // Approach
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.9); // Departure

      // Volume envelope: rises then dips
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Ignore
    }
  }

  /**
   * 5 Red Lights countdown beep with pitch rise
   */
  public playCountdownStep(stepIndex: number) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      // Step 1 to 5 rise: 600, 660, 720, 780, 840 Hz
      osc.frequency.setValueAtTime(580 + stepIndex * 60, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  /**
   * Green light launch / GO explosion
   */
  public playGreenLightLaunch() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;

      // High bell tone
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bell.type = "sine";
      bell.frequency.setValueAtTime(1200, now);
      bellGain.gain.setValueAtTime(0.35, now);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      bell.connect(bellGain);
      bellGain.connect(this.sfxGain);
      bell.start(now);
      bell.stop(now + 0.85);

      // Low engine rev burst
      const roar = this.ctx.createOscillator();
      const roarGain = this.ctx.createGain();
      roar.type = "sawtooth";
      roar.frequency.setValueAtTime(85, now);
      roar.frequency.exponentialRampToValueAtTime(320, now + 0.6);
      roarGain.gain.setValueAtTime(0.3, now);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      roar.connect(roarGain);
      roarGain.connect(this.sfxGain);
      roar.start(now);
      roar.stop(now + 1.1);
    } catch {
      // Ignore
    }
  }

  /**
   * Ambient harmonic pad
   */
  private startGentlePad(freqs: number[], vol = 0.08) {
    if (!this.ctx || !this.musicGain) return;
    try {
      freqs.forEach((f) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
        gain.gain.setValueAtTime(vol / freqs.length, this.ctx!.currentTime);
        osc.connect(gain);
        gain.connect(this.musicGain!);
        osc.start();
        this.activeMusicOscs.push(osc);
      });
    } catch {
      // Ignore
    }
  }

  private startBassDrone(freq = 65, vol = 0.12) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.musicGain);
      osc.start();
      this.activeMusicOscs.push(osc);
    } catch {
      // Ignore
    }
  }

  private stopContinuousSounds() {
    if (this.activeWindNoise) {
      try {
        (this.activeWindNoise as AudioScheduledSourceNode).stop();
      } catch {
        // Ignore
      }
      this.activeWindNoise = null;
    }
    if (this.activeEngineNode) {
      try {
        (this.activeEngineNode as AudioScheduledSourceNode).stop();
      } catch {
        // Ignore
      }
      this.activeEngineNode = null;
    }
    if (this.activeHeartbeatInterval) {
      clearInterval(this.activeHeartbeatInterval);
      this.activeHeartbeatInterval = null;
    }
    this.activeMusicOscs.forEach((o) => {
      try {
        o.stop();
      } catch {
        // Ignore
      }
    });
    this.activeMusicOscs = [];
  }
}

export const audioSystem = new CinematicAudioSystem();
