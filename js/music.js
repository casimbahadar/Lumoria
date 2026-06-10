// ============================================================
// LUMORIA - Procedural Music Engine (Web Audio API)
// Generates chiptune-style music for different game contexts
// ============================================================

const MusicEngine = (() => {
  let audioCtx = null;
  let masterGain = null;
  let currentTrack = null;
  let currentTrackName = null;
  let isPlaying = false;
  let loopTimer = null;
  let volume = 0.3;
  let muted = false;

  // Note frequencies (octave 4 base)
  const NOTES = {
    C: 261.63, Cs: 277.18, D: 293.66, Ds: 311.13, E: 329.63,
    F: 349.23, Fs: 369.99, G: 392.00, Gs: 415.30, A: 440.00,
    As: 466.16, B: 493.88
  };

  function noteFreq(note, octave = 4) {
    const base = NOTES[note];
    if (!base) return 440;
    return base * Math.pow(2, octave - 4);
  }

  function init() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }

  function ensureContext() {
    if (!audioCtx) init();
    if (audioCtx.state === "suspended") audioCtx.resume();
  }

  // Play a single note with given waveform
  function playNote(freq, startTime, duration, wave = "square", vol = 0.15) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.95);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Play a drum hit (noise burst)
  function playDrum(startTime, type = "kick") {
    if (!audioCtx) return;
    if (type === "kick") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, startTime);
      osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.12);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    } else if (type === "snare") {
      const bufferSize = audioCtx.sampleRate * 0.08;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
      src.connect(gain);
      gain.connect(masterGain);
      src.start(startTime);
    } else if (type === "hihat") {
      const bufferSize = audioCtx.sampleRate * 0.03;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 8000;
      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      src.start(startTime);
    }
  }

  // Play a sequence of notes (melody pattern)
  function playSequence(notes, startTime, tempo, wave = "square", vol = 0.12) {
    const beatDur = 60 / tempo;
    let t = startTime;
    for (const n of notes) {
      if (n.note && n.note !== "R") {
        playNote(noteFreq(n.note, n.oct || 4), t, beatDur * n.dur * 0.9, wave, vol);
      }
      t += beatDur * n.dur;
    }
    return t;
  }

  // Play bass line
  function playBass(notes, startTime, tempo) {
    return playSequence(notes, startTime, tempo, "sawtooth", 0.08);
  }

  // Play drum pattern
  function playDrumPattern(pattern, startTime, tempo) {
    const beatDur = 60 / tempo;
    let t = startTime;
    for (const hit of pattern) {
      if (hit.type) playDrum(t, hit.type);
      t += beatDur * hit.dur;
    }
    return t;
  }

  // ---- TRACK DEFINITIONS ----

  // Generate a battle melody based on a key and mood
  function battleTrack(key, tempo, mood) {
    const scales = {
      minor: [0, 2, 3, 5, 7, 8, 10],
      major: [0, 2, 4, 5, 7, 9, 11],
      phrygian: [0, 1, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10]
    };
    const noteNames = ["C", "Cs", "D", "Ds", "E", "F", "Fs", "G", "Gs", "A", "As", "B"];
    const keyIdx = noteNames.indexOf(key);
    const scale = scales[mood] || scales.minor;

    function scaleNote(degree, octave) {
      const idx = (keyIdx + scale[((degree % scale.length) + scale.length) % scale.length]) % 12;
      const oct = octave + Math.floor(degree / scale.length);
      return { note: noteNames[idx], oct };
    }

    return { scaleNote, tempo, key, mood };
  }

  // Wild battle music
  const TRACKS = {
    wild_battle(startTime) {
      const bt = battleTrack("A", 140, "minor");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(0, 5), dur: 0.5 }, { ...sn(2, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.5 }, { ...sn(3, 5), dur: 0.5 },
        { ...sn(2, 5), dur: 1 },   { ...sn(0, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.5 },
        { ...sn(5, 5), dur: 0.5 }, { ...sn(4, 5), dur: 0.5 },
        { ...sn(3, 5), dur: 0.5 }, { ...sn(2, 5), dur: 0.5 },
        { ...sn(1, 5), dur: 1 },   { note: "R", dur: 0.5 },
        { ...sn(0, 5), dur: 0.5 },
      ];
      const bass = [
        { ...sn(0, 3), dur: 1 }, { ...sn(0, 3), dur: 1 },
        { ...sn(5, 2), dur: 1 }, { ...sn(5, 2), dur: 1 },
        { ...sn(3, 3), dur: 1 }, { ...sn(3, 3), dur: 1 },
        { ...sn(4, 3), dur: 1 }, { ...sn(4, 3), dur: 1 },
      ];
      const drums = [
        { type: "kick", dur: 0.5 }, { type: "hihat", dur: 0.5 },
        { type: "snare", dur: 0.5 }, { type: "hihat", dur: 0.5 },
        { type: "kick", dur: 0.5 }, { type: "hihat", dur: 0.5 },
        { type: "snare", dur: 0.5 }, { type: "kick", dur: 0.25 },
        { type: "hihat", dur: 0.25 },
      ];

      playSequence(melody, startTime, tempo, "square", 0.1);
      playBass(bass, startTime, tempo);
      playDrumPattern(drums, startTime, tempo);
      // Repeat drums
      const beatDur = 60 / tempo;
      playDrumPattern(drums, startTime + beatDur * 4, tempo);

      return beatDur * 8;
    },

    gym_battle(startTime) {
      const bt = battleTrack("E", 150, "phrygian");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(0, 5), dur: 0.25 }, { ...sn(1, 5), dur: 0.25 },
        { ...sn(2, 5), dur: 0.25 }, { ...sn(4, 5), dur: 0.75 },
        { ...sn(3, 5), dur: 0.5 },  { ...sn(2, 5), dur: 0.5 },
        { ...sn(1, 5), dur: 0.5 },  { ...sn(0, 5), dur: 1 },
        { ...sn(4, 5), dur: 0.25 }, { ...sn(5, 5), dur: 0.25 },
        { ...sn(6, 5), dur: 0.5 },  { ...sn(5, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.5 },  { ...sn(2, 5), dur: 0.5 },
        { ...sn(0, 5), dur: 1.5 },  { note: "R", dur: 0.5 },
      ];
      const bass = [
        { ...sn(0, 3), dur: 1 }, { ...sn(0, 3), dur: 0.5 }, { ...sn(1, 3), dur: 0.5 },
        { ...sn(5, 2), dur: 1 }, { ...sn(4, 2), dur: 1 },
        { ...sn(3, 3), dur: 1 }, { ...sn(2, 3), dur: 1 },
        { ...sn(0, 3), dur: 1 }, { ...sn(0, 3), dur: 1 },
      ];
      const drums = [
        { type: "kick", dur: 0.25 }, { type: "kick", dur: 0.25 },
        { type: "hihat", dur: 0.25 }, { type: "snare", dur: 0.25 },
        { type: "kick", dur: 0.5 }, { type: "snare", dur: 0.5 },
        { type: "kick", dur: 0.25 }, { type: "hihat", dur: 0.25 },
        { type: "snare", dur: 0.5 }, { type: "kick", dur: 0.25 },
        { type: "kick", dur: 0.25 }, { type: "hihat", dur: 0.5 },
      ];

      playSequence(melody, startTime, tempo, "square", 0.1);
      playBass(bass, startTime, tempo);
      playDrumPattern(drums, startTime, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 4, tempo);

      return (60 / tempo) * 8;
    },

    champion_battle(startTime) {
      const bt = battleTrack("C", 160, "minor");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(0, 5), dur: 0.25 }, { ...sn(2, 5), dur: 0.25 },
        { ...sn(4, 5), dur: 0.25 }, { ...sn(6, 5), dur: 0.75 },
        { ...sn(5, 5), dur: 0.25 }, { ...sn(4, 5), dur: 0.25 },
        { ...sn(3, 5), dur: 0.5 },  { ...sn(2, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.25 }, { ...sn(5, 5), dur: 0.25 },
        { ...sn(6, 5), dur: 0.5 },  { ...sn(7, 5), dur: 1 },
        { ...sn(6, 5), dur: 0.25 }, { ...sn(5, 5), dur: 0.25 },
        { ...sn(4, 5), dur: 0.25 }, { ...sn(2, 5), dur: 0.25 },
        { ...sn(0, 5), dur: 1.5 },  { note: "R", dur: 0.5 },
      ];
      // Arpeggiated bass
      const bass = [
        { ...sn(0, 3), dur: 0.5 }, { ...sn(2, 3), dur: 0.5 },
        { ...sn(4, 3), dur: 0.5 }, { ...sn(2, 3), dur: 0.5 },
        { ...sn(5, 2), dur: 0.5 }, { ...sn(0, 3), dur: 0.5 },
        { ...sn(5, 2), dur: 0.5 }, { ...sn(4, 2), dur: 0.5 },
        { ...sn(3, 3), dur: 0.5 }, { ...sn(4, 3), dur: 0.5 },
        { ...sn(5, 3), dur: 0.5 }, { ...sn(4, 3), dur: 0.5 },
        { ...sn(0, 3), dur: 1 },   { ...sn(0, 3), dur: 0.5 },
        { ...sn(4, 3), dur: 0.5 },
      ];
      const drums = [
        { type: "kick", dur: 0.25 }, { type: "hihat", dur: 0.25 },
        { type: "kick", dur: 0.25 }, { type: "snare", dur: 0.25 },
        { type: "kick", dur: 0.25 }, { type: "hihat", dur: 0.25 },
        { type: "snare", dur: 0.25 }, { type: "kick", dur: 0.25 },
      ];

      playSequence(melody, startTime, tempo, "square", 0.11);
      // Harmony line
      const harmony = melody.map(n => n.note === "R" ? n : { ...sn((Object.keys(NOTES).indexOf(n.note) + 2) % 7, (n.oct || 4)), dur: n.dur });
      playSequence(harmony, startTime, tempo, "triangle", 0.05);
      playBass(bass, startTime, tempo);
      playDrumPattern(drums, startTime, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 2, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 4, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 6, tempo);

      return (60 / tempo) * 8;
    },

    rival_battle(startTime) {
      const bt = battleTrack("D", 145, "dorian");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(0, 5), dur: 0.5 },  { ...sn(3, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.5 },  { ...sn(5, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 0.5 },  { ...sn(3, 5), dur: 0.5 },
        { ...sn(2, 5), dur: 0.5 },  { ...sn(0, 5), dur: 0.5 },
        { ...sn(5, 5), dur: 0.5 },  { ...sn(6, 5), dur: 0.5 },
        { ...sn(4, 5), dur: 1 },
        { ...sn(2, 5), dur: 0.5 },  { ...sn(0, 5), dur: 1.5 },
      ];
      const bass = [
        { ...sn(0, 3), dur: 1 }, { ...sn(2, 3), dur: 1 },
        { ...sn(3, 3), dur: 1 }, { ...sn(4, 3), dur: 1 },
        { ...sn(5, 2), dur: 1 }, { ...sn(3, 3), dur: 1 },
        { ...sn(0, 3), dur: 2 },
      ];
      const drums = [
        { type: "kick", dur: 0.5 }, { type: "snare", dur: 0.5 },
        { type: "kick", dur: 0.5 }, { type: "hihat", dur: 0.25 },
        { type: "snare", dur: 0.25 },
        { type: "kick", dur: 0.5 }, { type: "snare", dur: 0.5 },
        { type: "kick", dur: 0.25 }, { type: "kick", dur: 0.25 },
        { type: "snare", dur: 0.5 },
      ];

      playSequence(melody, startTime, tempo, "square", 0.1);
      playBass(bass, startTime, tempo);
      playDrumPattern(drums, startTime, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 4, tempo);

      return (60 / tempo) * 8;
    },

    umbra_battle(startTime) {
      const bt = battleTrack("D", 135, "phrygian");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(0, 4), dur: 1 },    { ...sn(1, 4), dur: 0.5 },
        { ...sn(0, 4), dur: 0.5 },  { ...sn(6, 3), dur: 1 },
        { ...sn(0, 4), dur: 0.5 },  { ...sn(3, 4), dur: 0.5 },
        { ...sn(2, 4), dur: 0.5 },  { ...sn(1, 4), dur: 0.5 },
        { ...sn(0, 4), dur: 1 },    { note: "R", dur: 0.5 },
        { ...sn(4, 4), dur: 0.5 },  { ...sn(3, 4), dur: 0.5 },
        { ...sn(1, 4), dur: 0.5 },
      ];
      const bass = [
        { ...sn(0, 2), dur: 2 }, { ...sn(6, 1), dur: 2 },
        { ...sn(5, 2), dur: 2 }, { ...sn(0, 2), dur: 2 },
      ];
      const drums = [
        { type: "kick", dur: 1 }, { type: "snare", dur: 0.5 },
        { type: "hihat", dur: 0.5 },
        { type: "kick", dur: 0.5 }, { type: "kick", dur: 0.5 },
        { type: "snare", dur: 1 },
      ];

      playSequence(melody, startTime, tempo, "sawtooth", 0.08);
      playBass(bass, startTime, tempo);
      playDrumPattern(drums, startTime, tempo);
      playDrumPattern(drums, startTime + (60 / tempo) * 4, tempo);

      return (60 / tempo) * 8;
    },

    elite_battle(startTime) {
      const bt = battleTrack("F", 155, "minor");
      const tempo = bt.tempo;
      const sn = bt.scaleNote;

      const melody = [
        { ...sn(4, 5), dur: 0.25 }, { ...sn(5, 5), dur: 0.25 },
        { ...sn(6, 5), dur: 0.5 },  { ...sn(4, 5), dur: 0.5 },
        { ...sn(3, 5), dur: 0.25 }, { ...sn(2, 5), dur: 0.25 },
        { ...sn(0, 5), dur: 1 },
        { ...sn(2, 5), dur: 0.25 }, { ...sn(4, 5), dur: 0.25 },
        { ...sn(5, 5), dur: 0.5 },  { ...sn(6, 5), dur: 1 },
        { ...sn(5, 5), dur: 0.5 },  { ...sn(4, 5), dur: 0.5 },
        { ...sn(2, 5), dur: 0.5 },  { ...sn(0, 5), dur: 1.5 },
      ];
      const bass = [
        { ...sn(0, 3), dur: 0.5 }, { ...sn(4, 3), dur: 0.5 },
        { ...sn(0, 3), dur: 0.5 }, { ...sn(5, 2), dur: 0.5 },
        { ...sn(3, 3), dur: 0.5 }, { ...sn(4, 3), dur: 0.5 },
        { ...sn(3, 3), dur: 0.5 }, { ...sn(0, 3), dur: 0.5 },
        { ...sn(5, 2), dur: 1 },   { ...sn(4, 2), dur: 1 },
        { ...sn(0, 3), dur: 2 },
      ];
      const drums = [
        { type: "kick", dur: 0.25 }, { type: "kick", dur: 0.25 },
        { type: "snare", dur: 0.25 }, { type: "hihat", dur: 0.25 },
        { type: "kick", dur: 0.5 }, { type: "snare", dur: 0.5 },
      ];

      playSequence(melody, startTime, tempo, "square", 0.1);
      playBass(bass, startTime, tempo);
      for (let i = 0; i < 4; i++) {
        playDrumPattern(drums, startTime + (60 / tempo) * 2 * i, tempo);
      }
      return (60 / tempo) * 8;
    },

    // Overworld ambient music (calm, explorative)
    overworld(startTime) {
      const tempo = 100;
      const melody = [
        { note: "C", oct: 5, dur: 1 }, { note: "E", oct: 5, dur: 0.5 },
        { note: "G", oct: 5, dur: 0.5 }, { note: "A", oct: 5, dur: 1 },
        { note: "G", oct: 5, dur: 0.5 }, { note: "E", oct: 5, dur: 0.5 },
        { note: "D", oct: 5, dur: 1 }, { note: "C", oct: 5, dur: 1 },
        { note: "E", oct: 5, dur: 0.5 }, { note: "F", oct: 5, dur: 0.5 },
        { note: "G", oct: 5, dur: 1 }, { note: "E", oct: 5, dur: 1 },
        { note: "D", oct: 5, dur: 0.5 }, { note: "C", oct: 5, dur: 1.5 },
      ];
      const bass = [
        { note: "C", oct: 3, dur: 2 }, { note: "A", oct: 2, dur: 2 },
        { note: "F", oct: 2, dur: 2 }, { note: "G", oct: 2, dur: 2 },
      ];

      playSequence(melody, startTime, tempo, "triangle", 0.07);
      playBass(bass, startTime, tempo);

      return (60 / tempo) * 10;
    }
  };

  // Map battle context to track name
  function getTrackForContext(context) {
    if (!context) return "overworld";
    if (context.isChampion) return "champion_battle";
    if (context.isEliteFour) return "elite_battle";
    if (context.isRival) return "rival_battle";
    if (context.isUmbra) return "umbra_battle";
    if (context.isGym || context.isQuest) return "gym_battle";
    if (context.isWild) return "wild_battle";
    if (context.isPvP) return "rival_battle";   // async/FFA/live PvP get a battle theme
    return "overworld";
  }

  function play(trackName) {
    if (muted) return;
    if (currentTrackName === trackName && isPlaying) return;
    stop();
    ensureContext();

    currentTrackName = trackName;
    isPlaying = true;

    function scheduleLoop() {
      if (!isPlaying || muted) return;
      const track = TRACKS[trackName];
      if (!track) return;
      const now = audioCtx.currentTime + 0.05;
      const duration = track(now);
      loopTimer = setTimeout(scheduleLoop, duration * 1000 - 100);
    }
    scheduleLoop();
  }

  function stop() {
    isPlaying = false;
    currentTrackName = null;
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
  }

  function playForBattle(battleCtx) {
    const track = getTrackForContext(battleCtx);
    play(track);
  }

  function playOverworld() {
    play("overworld");
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.value = muted ? 0 : volume;
  }

  function toggleMute() {
    muted = !muted;
    if (masterGain) masterGain.gain.value = muted ? 0 : volume;
    if (muted) stop();
    return muted;
  }

  function isMuted() { return muted; }

  return { init, play, stop, playForBattle, playOverworld, setVolume, toggleMute, isMuted };
})();
