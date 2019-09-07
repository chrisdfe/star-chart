import Planet from "./Planet";

export default class PlanetGenerator {
  static generate = () => {
    new PlanetGenerator().generate();
  };

  generate = () => {
    console.log("generating...");
  };
}
