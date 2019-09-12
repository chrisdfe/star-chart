import Tone from "tone";
import frequencyMap from "frequency-map";

import { ambiences } from "./ambience";

const chromatics = Object.keys(frequencyMap)
  .filter(note => /6$/.test(note))
  .filter(note => !note.includes("#") && !note.includes("b"))
  .reduce((accumulator, note) => {
    return {
      ...accumulator,
      [note]: frequencyMap[note]
    };
  }, {});

import EventBus from "../../EventBus";

export default class Sound {
  constructor() {
    this.initSelectionSFX();
    this.initAmbience();
  }

  initSelectionSFX = () => {
    this.selectionSFXSynth = new Tone.Synth({
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.05,
        decay: 0.05,
        sustain: 0.1,
        release: 0.01
      }
    }).toMaster();
    this.selectionSFXSynth.volume.value = -10;

    EventBus.on("planet:mouseover", ({ selectedPlanet }) => {
      const index = selectedPlanet.planetIndex;
      const note = 400 + 150 * index;
      this.selectionSFXSynth.triggerAttackRelease(note, ".01");
    });
  };

  initAmbience() {
    this.ambience = new ambiences[0]();
    this.ambience.start();

    EventBus.on("pause-state:changed", ({ paused }) => {
      Tone.Master.mute = paused;
      this.ambience.togglePause(paused);
    });
  }
}
