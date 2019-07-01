import { Group, Vector3 } from "three";
import Planet, { Sun } from "./Planet";
import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween
} from "./randomUtils";

export const MIN_PLANETS = 3;
export const MAX_PLANETS = 10;
// TODO - move this into Planet
export const MIN_PLANET_SIZE = 0.05;
export const MAX_PLANET_SIZE = 0.2;
export const MIN_ORBIT_DIFFERENCE = 0.01;
export const MAX_ORBIT_DIFFERENCE = 2;

class SolarSystem {
  constructor() {
    this.group = new Group();

    this.sun = new Sun({
      size: 1
    });
    this.group.add(this.sun.entity);

    this.createPlanets();

    this.entity = this.group;
  }

  createPlanets() {
    const planetCount = randomIntegerBetween(MIN_PLANETS, MAX_PLANETS);

    // TODO - base off of the size of the sun
    let currentOrbitSize =
      this.sun.size +
      randomFloatBetween(MIN_ORBIT_DIFFERENCE, MAX_ORBIT_DIFFERENCE);

    console.log("currentOrbitSize", currentOrbitSize);

    this.planets = [...new Array(planetCount)].map(() => {
      const size = randomFloatBetween(MIN_PLANET_SIZE, MAX_PLANET_SIZE);
      const orbitSize = randomFloatBetween(
        currentOrbitSize + size + MIN_ORBIT_DIFFERENCE,
        currentOrbitSize + size + MAX_ORBIT_DIFFERENCE
      );
      currentOrbitSize = orbitSize + size;

      return new Planet({
        size,
        orbitSize
      });
    });
    console.log("planets", this.planets);

    this.planets.forEach(planet => {
      this.group.add(planet.entity);
    });
  }

  add(entity) {
    this.group.add(entity);
  }

  update() {
    this.planets.forEach(planet => {
      planet.update();
    });
  }
}

export default SolarSystem;
