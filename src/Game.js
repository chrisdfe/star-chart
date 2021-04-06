import * as randomUtils from "@/lib/randomUtils";

import Store from "@/lib/Store";

import SolarSystemScreen from "./screens/SolarSystemScreen";
// import ConstellationSynthScreen from "./screens/ConstellationSynthScreen";
// import ProceduralPlantScreen from "./screens/ProceduralPlantScreen";

import "./styles.css";

export default class Game {
  constructor() {
    const seed = "test";
    randomUtils.seedRandom(seed);

    Store.set("test", 4);

    this.currentScreen = new SolarSystemScreen(this).initialize();
    // this.currentScreen = new ProceduralPlantScreen().initialize();
    // this.currentScreen = new ConstellationSynthScreen().initialize();
  }
}
