import SolarSystem from "./SolarSystem";

export default class SolarSystemGenerator {
  static generate = params => {
    return new SolarSystemGenerator().generate(params);
  };

  generate = params => {
    return new SolarSystem();
  };
}
