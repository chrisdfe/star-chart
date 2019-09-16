import "./styles.css";

import SolarSystemScreen from "./screens/SolarSystemScreen";

export default class Game {
  constructor() {
    this.currentScreen = new SolarSystemScreen().initialize();
  }
}
