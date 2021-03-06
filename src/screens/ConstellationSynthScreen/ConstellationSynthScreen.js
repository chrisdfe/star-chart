import Screen from "../Screen";

import GraphicsSystem from "./systems/graphics";
import SoundSystem from "./systems/sound";

export default class ConstellationSynth extends Screen {
  initialize() {
    this.graphics = new GraphicsSystem();
    this.sounds = new SoundSystem();
  }
}
