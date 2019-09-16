import Screen from "../Screen";

import GraphicsSystem from "./systems/graphics";
import SoundSystem from "./systems/sound";

import SolarSystemGenerator from "./systems/graphics/planets/SolarSystemGenerator";

export default class SolarSystemScreen extends Screen {
  initialize() {
    this.graphics = new GraphicsSystem();
    this.sounds = new SoundSystem();
  }
}
