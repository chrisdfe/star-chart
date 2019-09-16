import Tone from "tone";
import frequencyMap from "frequency-map";

import Ambience from "./Ambience";

export default class Ambience1 extends Ambience {
  start() {
    this.drone = new Tone.Synth({
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
      .connect(this.drone.volume)
      .start();

    this.drone2 = new Tone.Synth({
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
      .connect(this.drone2.volume)
      .start();

    this.drone.triggerAttack("C2");
    this.drone2.triggerAttack("G2");

    this.noise = new Tone.Noise({
      type: "brown",
      volume: -20
    }).start();

    this.noise
      .connect(
        new Tone.AutoFilter({
          frequency: 0.05,
          baseFrequency: 200
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
  }

  pause = () => {
    this.drone.volume.mute = true;
    this.drone2.volume.mute = true;
    this.noise.volume.mute = true;
  };

  unpause = () => {
    this.drone.volume.mute = false;
    this.drone2.volume.mute = false;
    this.noise.volume.mute = false;
  };
}
