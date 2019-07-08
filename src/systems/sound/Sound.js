import Tone from "tone";
import frequencyMap from "frequency-map";

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
    //create a synth and connect it to the master output (your speakers)
    // const synth = new Tone.Synth().toMaster();
    // const loop = new Tone.Loop(function(time) {
    //   synth.triggerAttackRelease("C2", "8n", time);
    // }, "4n");
    // loop.start("1m");
    // Tone.Transport.start();

    this.initSelectionSFX();
    // this.initAmbience();
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
      const index = selectedPlanet.order + 1 || -1;
      const note = 400 + 150 * index;
      this.selectionSFXSynth.triggerAttackRelease(note, ".01");
    });
  };

  initAmbience() {
    const drone = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 1,
        decay: 0.1,
        sustain: 1,
        release: 1
      }
    }).toMaster();

    new Tone.LFO({
      frequency: 0.1,
      type: "sine",
      min: -50,
      max: -15
    })
      .connect(drone.volume)
      .start();

    const drone2 = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 1,
        decay: 0.1,
        sustain: 1,
        release: 1
      }
    }).toMaster();

    new Tone.LFO({
      frequency: 0.2,
      type: "sine",
      min: -50,
      max: -15
    })
      .connect(drone.volume)
      .start();

    drone.triggerAttack("C2");
    drone2.triggerAttack("A#1");

    const noise = new Tone.Noise({
      type: "brown",
      volume: -20
    }).start();

    noise
      .connect(
        new Tone.AutoFilter({
          frequency: 0.1,
          baseFrequency: 600
        })
          .toMaster()
          .start()
      )
      .connect(
        new Tone.Filter({
          type: "lowpass",
          baseFrequency: 200
        })
      )
      .connect(
        new Tone.Filter({
          type: "highpass",
          baseFrequency: 800
        })
      );

    EventBus.on("pause-state:changed", ({ paused }) => {
      console.log("paused", paused);
      Tone.Master.mute = paused;
      drone.volume.mute = paused;
      drone2.volume.mute = paused;
      noise.volume.mute = paused;
    });
  }
}
