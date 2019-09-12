import GraphicsSystem from "./systems/graphics";
import SoundSystem from "./systems/sound";

export default class Game {
  constructor() {
    this.graphics = new GraphicsSystem();
    this.sounds = new SoundSystem();
  }
}
