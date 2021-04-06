import * as randomUtils from "@/lib/randomUtils";

import MoonGenerator from "./moons/MoonGenerator";

// TODO - units for converting real life units to THREE.js units
const MIN_ORBIT_SPEED = 0.05;
const MAX_ORBIT_SPEED = 0.4;

const MIN_ROTATION_SPEED = 0.5;
const MAX_ROTATION_SPEED = 4;

const MIN_PLANET_SIZE = 0.01;
const MAX_PLANET_SIZE = 0.2;

const MIN_ORBIT_DIFFERENCE = 0.2;
const MAX_ORBIT_DIFFERENCE = 2;

const MIN_MOON_COUNT = 0;
const MAX_MOON_COUNT = 4;

export default class PlanetGenerator {
  static generate = ({
    solarSystemType,
    totalPlanetCount,
    planetIndex,
    currentPlanets,
    previousOrbitSize,
  }) => {
    // TODO - generate type
    const type = "default";

    const name = `Planet #${planetIndex + 1}`;

    // TODO - base this off of planetCount/planetIndex
    // (middle -> outer edges = more likely for there to be large planets)
    const size = randomUtils.randomFloatBetween(
      MIN_PLANET_SIZE,
      MAX_PLANET_SIZE
    );

    // TODO - based off of size
    const orbitSpeed = randomUtils.randomFloatBetween(
      MIN_ORBIT_SPEED,
      MAX_ORBIT_SPEED
    );

    // TODO - take moons into account
    const orbitDifference = randomUtils.randomFloatBetween(
      MIN_ORBIT_DIFFERENCE,
      MAX_ORBIT_DIFFERENCE
    );
    const orbitSize = previousOrbitSize + orbitDifference;

    // TODO - based off of size
    const rotationSpeed = randomUtils.randomFloatBetween(
      MIN_ROTATION_SPEED,
      MAX_ROTATION_SPEED
    );

    // TODO - this should be based off of planet size
    // (larger planet = more moons)
    const totalMoonCount = randomUtils.randomIntegerBetween(
      MIN_MOON_COUNT,
      MAX_MOON_COUNT
    );

    // TODO -
    // const hasMoons = randomFloat() > 0.4;
    const moons = [...new Array(totalMoonCount)]
      .map((_, index) => index)
      .reduce((currentMoons, moonIndex) => {
        const moon = MoonGenerator.generate({
          planet: { type, name, size },
          currentMoons,
          moonIndex,
        });

        return [...currentMoons, moon];
      }, []);

    return { type, name, size, orbitSpeed, orbitSize, rotationSpeed, moons };
  };
}
