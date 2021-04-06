import SolarSystemGenerator from "./solarSystems/SolarSystemGenerator";

export default class SceneDataGenerator {
  static generate = (params = {}) => {
    const solarSystem = SolarSystemGenerator.generate();

    return { solarSystem };
  };
}
