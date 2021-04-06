import * as randomUtils from "@/lib/randomUtils";

import SunGenerator from "./suns/SunGenerator";
import PlanetGenerator from "./planets/PlanetGenerator";

const MIN_PLANETS = 3;
const MAX_PLANETS = 10;

export default class SolarSystemGenerator {
  static generate = (params) => {
    // TODO - generate solar system type
    const solarSystemType = "default";

    // TODO - base off of sun's name, or the other way around
    const name = "Solar System";

    const sun = SunGenerator.generate({ solarSystemType });

    // TODO - based off of sun's size
    const totalPlanetCount = randomUtils.randomIntegerBetween(
      MIN_PLANETS,
      MAX_PLANETS
    );

    // TODO - base this initial value off of sun size
    // (to avoid planets spawning inside of sun)
    let previousOrbitSize = sun.size / 2 + 1;
    const planets = [...new Array(totalPlanetCount)]
      .map((_, index) => index)
      .reduce((currentPlanets, planetIndex) => {
        const planet = PlanetGenerator.generate({
          solarSystemType,
          totalPlanetCount,
          planetIndex,
          currentPlanets,
          previousOrbitSize,
        });

        previousOrbitSize = planet.orbitSize;

        return [...currentPlanets, planet];
      }, []);

    return {
      name,
      solarSystemType,
      sun,
      planets,
    };
  };
}
