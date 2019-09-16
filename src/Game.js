import "./styles.css";

// import SolarSystemScreen from "./screens/SolarSystemScreen";
import ConstellationSynthScreen from "./screens/ConstellationSynthScreen";

export default class Game {
  constructor() {
    this.currentScreen = new ConstellationSynthScreen().initialize();
  }
}
