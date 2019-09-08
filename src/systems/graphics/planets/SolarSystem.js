import { Group, Vector3 } from "three";
import Planet from "./Planet";
import PlanetGenerator from "./PlanetGenerator";

import SunGenerator from "./SunGenerator";

import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween
} from "../../../randomUtils";

import EventBus from "../../../EventBus";

import { starBackdropFactory } from "./factories";

class SolarSystem {
  static MIN_PLANETS = 3;
  static MAX_PLANETS = 10;
  // TODO - move this into Planet
  static MIN_PLANET_SIZE = 0.05;
  static MAX_PLANET_SIZE = 0.2;
  static MIN_ORBIT_DIFFERENCE = 0.01;
  static MAX_ORBIT_DIFFERENCE = 2;

  constructor() {
    this.group = new Group();
    this.entity = this.group;

    this.sun = SunGenerator.generate();
    this.add(this.sun.entity);

    this.createPlanets();
    // TODO - reanme to randomStarBackdropFactory
    this.stars = starBackdropFactory();
    this.group.add(this.stars);

    this.selectedPlanet = null;

    EventBus.on("input:mouseover", this.handleMouseOver);
    EventBus.on("input:mouseout", this.handleMouseOut);
    EventBus.on("input:click", this.handleClick);
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

  handleClick = ({ intersects }) => {
    const uiObject = intersects.find(({ type }) => type === "planet");
    const planet = this.planets.find(
      planet => planet.uiObject.id === uiObject.id
    );
    // if (planet) {
    //   EventBus.trigger("planet:select-requested", { planet });
    // }
  };

  createPlanets() {
    const { MIN_PLANETS, MAX_PLANETS } = SolarSystem;
    const planetCount = randomIntegerBetween(MIN_PLANETS, MAX_PLANETS);

    this.planets = [...new Array(planetCount)].map((num, index) =>
      PlanetGenerator.generate({
        solarSystem: this,
        planetCount,
        planetIndex: index
      })
    );

    this.planets.forEach(planet => {
      this.group.add(planet.entity);
    });
  }

  add(entity) {
    this.group.add(entity);
  }

  update(payload) {
    this.group.updateMatrixWorld();
    this.planets.forEach(planet => {
      planet.update(payload);
    });
  }
}

export default SolarSystem;
