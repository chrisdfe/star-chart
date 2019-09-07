import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween,
  randomRotation,
  randomItemInArray
} from "../../../randomUtils";

import SolarSystem from "./SolarSystem";
import Planet from "./Planet";
import Moon from "./Moon";

export default class PlanetGenerator {
  static generate = params => {
    return new PlanetGenerator().generate(params);
  };

  // TODO - 'currentOrbitsize' should be dependent on the size of other planets + moon orbit sizes
  //        figure out whether to handle solarSystem statefulness in this, and if so then how
  generate = ({ solarSystem, planetCount, planetIndex } = params) => {
    if (!solarSystem.sun) {
      throw new Error(
        "solarSystem must have a Sun to use PlanetGenerator.generate"
      );
    }

    Object.assign(this, {
      solarSystem,
      planetCount,
      planetIndex
    });

    this.generatePlanetSize();
    this.generateOrbitSize();
    this.generatePlanetName();
    this.generatePlanetColor();
    this.generatePlanetRotationSpeed();
    this.generatePlanetMoons();

    const order = planetIndex + 1;
    const startRotation = randomRotation();

    const {
      planetSize,
      planetColor,
      planetName,
      planetRotationSpeed,
      planetMoons,
      orbitSize
    } = this;

    return new Planet({
      name: planetName,
      size: planetSize,
      color: planetColor,
      rotationSpeed: planetRotationSpeed,
      startRotation,
      orbitSize,
      order,
      moons: planetMoons
    });
  };

  generatePlanetColor = () => {
    const { PLANET_COLORS } = Planet;
    // TODO - use solar system type to determine this.
    this.planetColor = randomItemInArray(PLANET_COLORS);
  };

  generatePlanetSize = () => {
    const { MIN_PLANET_SIZE, MAX_PLANET_SIZE } = SolarSystem;
    this.planetSize = randomFloatBetween(MIN_PLANET_SIZE, MAX_PLANET_SIZE);
  };

  generateOrbitSize = () => {
    const { solarSystem, planetIndex, planetSize } = this;
    const { MIN_ORBIT_DIFFERENCE, MAX_ORBIT_DIFFERENCE } = SolarSystem;

    const currentOrbitSize =
      solarSystem.sun.size + MAX_ORBIT_DIFFERENCE * planetIndex;

    this.orbitSize = randomFloatBetween(
      currentOrbitSize + planetSize + MIN_ORBIT_DIFFERENCE,
      currentOrbitSize + planetSize + MAX_ORBIT_DIFFERENCE
    );
  };

  generatePlanetName = () => {
    this.planetName = `Planet #${this.planetIndex + 1}`;
  };

  generatePlanetRotationSpeed = () => {
    const { MIN_ORBIT_SPEED, MAX_ORBIT_SPEED } = Planet;

    this.planetRotationSpeed = randomFloatBetween(
      MIN_ORBIT_SPEED,
      MAX_ORBIT_SPEED
    );
  };

  generatePlanetMoons = () => {
    this.planetMoons = [];
    const hasMoons = randomFloat() > 0.4;

    if (hasMoons) {
      // TODO - MoonGenerator
      this.planetMoons.push(new Moon());
    }
  };
}
