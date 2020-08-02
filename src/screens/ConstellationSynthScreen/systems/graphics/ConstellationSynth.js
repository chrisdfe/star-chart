import { Group } from "three";

import EventBus from "@/lib/EventBus";

import { getCameraDimensions } from "./utils";

import Star from "./Star";

export default class ConstellationSynth {
  constructor(graphics) {
    this.graphics = graphics;
  }

  initialize() {
    this.group = new Group();
    this.entity = this.group;

    this.initializeCrosses();

    return this;
  }

  initializeCrosses = () => {
    this.stars = [];

    EventBus.on("input:click", ({ coords, intersects }) => {
      const { width, height } = getCameraDimensions();
      const star = new Star().initialize();

      const starPosition = {
        x: (coords.x * width) / 2,
        y: (coords.y * height) / 2
      };
      star.entity.position.x = starPosition.x;
      star.entity.position.y = starPosition.y;

      this.stars.push(star);
      this.group.add(star.entity);

      // Convert to a 0-1 scale for the sound system
      const starY = (starPosition.y + height / 2) / height;
      EventBus.trigger("constellation-synth:star-added", { y: starY });
    });

    EventBus.on("input:mouseover", ({ intersects }) => {
      this.getMatchingIntersects(intersects).forEach(star => {
        star.onMouseOver();
      });
    });

    EventBus.on("input:mouseout", ({ intersects }) => {
      this.getMatchingIntersects(intersects).forEach(star => {
        star.onMouseOut();
      });
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.clearStars();
      }
    });
  };

  getMatchingIntersects = intersects =>
    this.stars.filter(
      star => !!intersects.find(intersect => intersect.id === star.uiObject.id)
    );

  clearStars = () => {
    this.group.remove(...this.stars.map(star => star.entity));
    this.stars = [];
    EventBus.trigger("constellation-synth:stars-cleared");
  };
}
