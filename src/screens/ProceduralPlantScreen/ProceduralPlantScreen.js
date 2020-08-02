import Screen from "../Screen";

import GraphicsSystem from "./systems/graphics";

export default class ProceduralPlantScreen extends Screen {
  initialize() {
    this.graphics = new GraphicsSystem();
  }
}
