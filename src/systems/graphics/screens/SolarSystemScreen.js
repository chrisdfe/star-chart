import Screen from "./Screen";

import SolarSystemGenerator from "../planets/SolarSystemGenerator";

export default class SolarSystemScreen extends Screen {
  initialize() {
    this.solarSystem = SolarSystemGenerator.generate();
    this.parent.scene.add(this.solarSystem.entity);
    return this;
  }

  update(payload) {
    this.solarSystem.update(payload);
  }
}
