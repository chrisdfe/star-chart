import { Group, Vector3 } from "three";

import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween,
} from "@/lib/randomUtils";

import EventBus from "@/lib/EventBus";

import Sun from "./Sun";
import Planet from "./Planet";

import { Enum } from "./utils";

import { starBackdropFactory } from "./factories";

export default class SolarSystem {
  static MIN_PLANETS = 3;
  static MAX_PLANETS = 10;

  constructor(attributes) {
    this.attributes = attributes;

    this.group = new Group();
    this.entity = this.group;

    // TODO - rename to randomStarBackdropFactory
    // this.stars = starBackdropFactory();
    // this.group.add(this.stars);

    // TODO - this should be managed by something else
    // this.selectedPlanet = null;

    // this.initializeInputHandlers();
  }

  initialize = () => {
    const {
      sun: sunAttributes,
      planets: planetAttributesList,
    } = this.attributes;

    this.sun = new Sun(sunAttributes);
    this.add(this.sun.entity);

    this.planets = planetAttributesList.map((attributes) => {
      return new Planet(attributes);
    });

    this.planets.forEach((planet) => {
      this.add(planet.entity);
    });

    return this;
  };

  initializeInputHandlers = () => {
    EventBus.on("input:mouseover", this.handleMouseOver);
    EventBus.on("input:mouseout", this.handleMouseOut);
    EventBus.on("input:click", this.handleClick);
  };

  destroyInputHandlers = () => {
    EventBus.off("input:mouseover", this.handleMouseOver);
    EventBus.off("input:mouseout", this.handleMouseOut);
    EventBus.off("input:click", this.handleClick);
  };

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
        selectedPlanet: this.selectedPlanet,
      });
    }
  };

  handleMouseOut = ({ intersects }) => {
    const planetIntersects = intersects.filter(({ type }) => type === "planet");

    planetIntersects.forEach((uiObject) => {
      uiObject.parent.onMouseOut();
    });

    if (this.selectedPlanet) {
      EventBus.trigger("planet:mouseout", {
        selectedPlanet: this.selectedPlanet,
      });
      this.selectedPlanet = null;
    }
  };

  handleClick = ({ intersects }) => {
    const uiObject = intersects.find(({ type }) => type === "planet");
    const planet = this.planets.find(
      (planet) => planet.uiObject.id === uiObject.id
    );

    if (planet) {
      EventBus.trigger("planet:select-requested", { planet });
    }
  };

  add(entity) {
    this.group.add(entity);
  }

  update(payload) {
    this.group.updateMatrixWorld();

    this.planets.forEach((planet) => {
      planet.update(payload);
    });
  }
}
