import { Group, Vector3 } from "three";
import Planet from "./Planet";
import Sun from "./Sun";
import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween
} from "../../../randomUtils";

import EventBus from "../../../EventBus";

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
    this.selectedPlanet = null;

    EventBus.on("mouseover", this.handleMouseOver);
    EventBus.on("mouseout", this.handleMouseOut);
  }

  handleMouseOver = ({ intersects }) => {
    const planetIntersects = intersects.filter(({ type }) => type === "planet");
    if (!planetIntersects.length) return;
    const [selectedPlanet] = planetIntersects;

    if (selectedPlanet) {
      if (this.selectedPlanet) {
        this.selectedPlanet.onMouseOut();
      }
      this.selectedPlanet = selectedPlanet.parent;
      this.selectedPlanet.onMouseOver();

      EventBus.trigger("planet:mouseover", {
        selectedPlanet: this.selectedPlanet
      });
    }
  };

  handleMouseOut = ({ intersects }) => {
    const planetIntersects = intersects.filter(({ type }) => type === "planet");

    planetIntersects.forEach(uiObject => {
      uiObject.parent.onMouseOut();
    });

    if (this.selectedPlanet) {
      EventBus.trigger("planet:mouseout", {
        selectedPlanet: this.selectedPlanet
      });
      this.selectedPlanet = null;
    }
  };

  createPlanets() {
    const planetCount = randomIntegerBetween(MIN_PLANETS, MAX_PLANETS);

    // TODO - base off of the size of the sun
    let currentOrbitSize =
      this.sun.size +
      randomFloatBetween(MIN_ORBIT_DIFFERENCE, MAX_ORBIT_DIFFERENCE);

    this.planets = [...new Array(planetCount)].map((num, index) => {
      const size = randomFloatBetween(MIN_PLANET_SIZE, MAX_PLANET_SIZE);
      const orbitSize = randomFloatBetween(
        currentOrbitSize + size + MIN_ORBIT_DIFFERENCE,
        currentOrbitSize + size + MAX_ORBIT_DIFFERENCE
      );
      currentOrbitSize = orbitSize + size;
      const order = index + 1;

      return new Planet({
        name: `Planet #${order}`,
        order,
        size,
        orbitSize
      });
    });

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
