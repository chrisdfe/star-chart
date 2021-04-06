import Screen from "../Screen";

import SceneDataGenerator from "./data/SceneDataGenerator";
import GraphicsSystem from "./systems/graphics";
import SoundSystem from "./systems/sound";

import Store from "@/lib/Store";

// import SolarSystemGenerator from "./systems/graphics/planets/SolarSystemGenerator";

export default class SolarSystemScreen extends Screen {
  initialize() {
    const sceneData = SceneDataGenerator.generate();
    Store.set("sceneData", sceneData);

    // TODO -
    // this.inputSystem
    // this.UISystem
    // this.frameSystem (?)
    this.graphics = new GraphicsSystem();
    this.sounds = new SoundSystem();
  }
}
