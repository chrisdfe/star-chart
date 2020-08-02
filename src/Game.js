import * as randomUtils from "@/lib/randomUtils";

import "./styles.css";

import SolarSystemScreen from "./screens/SolarSystemScreen";
// import ConstellationSynthScreen from "./screens/ConstellationSynthScreen";
// import ProceduralPlantScreen from "./screens/ProceduralPlantScreen";

export default class Game {
  constructor() {
    const seed = "test";
    randomUtils.seedRandom(seed);

    this.currentScreen = new SolarSystemScreen().initialize();
    // this.currentScreen = new ProceduralPlantScreen().initialize();
    // this.currentScreen = new ConstellationSynthScreen().initialize();
  }
}
