import Tone from "tone";
import frequencyMap from "frequency-map";

import Ambience from "./Ambience";

export default class Ambience2 extends Ambience {
  start() {
    Tone.Transport.bpm.value = 85;
    // const loop = new Tone.Loop(time => {
    //triggered every eighth note.

    this.initBeat();
    this.initArp();
    // this.initArp2();
    // this.initArp3();
    this.initBass();
    this.initDrones();

    Tone.Transport.start();
  }

  initBeat() {
    const synth = new Tone.NoiseSynth({
      oscillator: {
        type: "white"
      },
      envelope: {
        attack: 0.005,
        decay: 0.07,
        sustain: 0.01,
        release: 0.1
      }
    }).toMaster();
    synth.volume.value = -30;

    // var reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
    // var delay = new Tone.FeedbackDelay(0.5);
    // synth.chain(reverb, delay);

    const loop = new Tone.Loop(time => {
      synth.triggerAttackRelease("1m");
    }, "1m").start("2n");
  }

  initArp() {
    const synth = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.005,
        decay: 0.7,
        sustain: 0.1,
        release: 0.1
      }
    }).toMaster();
    synth.volume.value = -45;

    const reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
    const delay = new Tone.FeedbackDelay(0.2);
    synth.chain(reverb, delay);

    const pattern = new Tone.Pattern(
      (time, note) => {
        synth.triggerAttackRelease(note, 0.01);
      },
      ["C6", "D6", "Eb6", "G6", "Ab6", "C7", "D7", "Eb7", "Ab7"],
      "random"
    ).start(0);
    pattern.interval = "32n";
  }

  initArp2() {
    const synth = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.01,
        decay: 0.7,
        sustain: 0.1,
        release: 0.5
      }
    }).toMaster();
    synth.volume.value = -25;

    // const reverb = new Tone.JCReverb(0.9).connect(Tone.Master);
    // const delay = new Tone.FeedbackDelay(0.5);
    // synth.chain(reverb, delay);

    const pattern = new Tone.Pattern(
      (time, note) => {
        synth.triggerAttackRelease(note, 0.01);
      },
      ["C6", "Eb6", "G6", "Ab6", "C7"],
      "upDown"
    ).start(0);
    pattern.interval = "16n";
  }

  initArp3() {
    const synth = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.001,
        decay: 1.7,
        sustain: 0.1,
        release: 1
      }
    }).toMaster();
    synth.volume.value = -25;

    // const reverb = new Tone.JCReverb(0.9).connect(Tone.Master);
    // const delay = new Tone.FeedbackDelay(0.5);
    // synth.chain(reverb, delay);

    const pattern = new Tone.Pattern(
      (time, note) => {
        synth.triggerAttackRelease(note, 0.01);
      },
      ["C5", "D5", "Eb5", "G5"],
      "up"
    ).start(0);
    pattern.interval = "16n";
  }

  initBass() {
    const synth = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 0.05,
        decay: 0.1,
        sustain: 0.5,
        release: 0.2
      }
    }).toMaster();
    // synth.volume.value = 10;

    const dist = new Tone.Distortion(0.3).toMaster();
    // const vibrato = new Tone.Vibrato(0.2, 0.2).toMaster();
    // synth.chain(dist, vibrato);
    synth.chain(dist);

    const pattern = new Tone.Pattern(
      (time, note) => {
        //the order of the notes passed in depends on the pattern
        synth.triggerAttackRelease(note, "2m");
      },
      ["C2", "F1"],
      "up"
    ).start(0);
    pattern.interval = "2m";
  }

  initDrones() {
    const drone = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 2,
        decay: 0.1,
        sustain: 0.5,
        release: 0.2
      }
    }).toMaster();

    const note = new Tone.Frequency("C3").toFrequency();
    const variance = 5;
    const lfo = new Tone.LFO(0.2, note - variance, note + variance)
      .connect(drone.frequency)
      .start();

    drone.triggerAttack(lfo.frequency.value);
  }

  pause() {}

  unpause() {}
}
