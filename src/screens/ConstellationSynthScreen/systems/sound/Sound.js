import Tone from "tone";
import frequencyMap from "frequency-map";
import EventBus from "@/lib/EventBus";

import { randomItemInArray } from "@/lib/randomUtils";

const chromatics = Object.keys(frequencyMap)
  .filter(note => /4$/.test(note))
  .filter(note => !note.includes("#") && !note.includes("b"))
  .reduce((accumulator, note) => {
    return {
      ...accumulator,
      [note]: frequencyMap[note]
    };
  }, {});

export default class Sound {
  constructor() {
    this.initializeTones();
  }

  initializeTones() {
    const scale = ["C", "D", "Eb", "F", "G", "Ab", "B"];
    const octaves = [3, 4, 5, 6];
    this.scale = octaves
      .map(octave => scale.map(note => `${note}${octave}`))
      .flat();

    this.tone = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.8
      }
    }).toMaster();
    this.tone.volume.value = -1;

    EventBus.on("constellation-synth:star-added", ({ y }) => {
      // const note = randomItemInArray(this.scale);
      // const note = randomItemInArray(["C4", "Eb4", "G4", "B4"]);
      const index = Math.floor(y * this.scale.length);
      const note = this.scale[index];
      this.tone.triggerAttackRelease(note, 0.1);
    });

    EventBus.on("constellation-synth:stars-added", () => {});
  }
}
