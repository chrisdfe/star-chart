import { Group } from "three";

import EventBus from "@/lib/EventBus";

import { createX, getCameraDimensions } from "./utils";

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
    this.crosses = [];
    EventBus.on("input:click", ({ coords, intersects }) => {
      const { width, height } = getCameraDimensions();
      const crossPosition = {
        x: (coords.x * width) / 2,
        y: (coords.y * height) / 2
      };
      const cross = createX(5, crossPosition);
      this.crosses.push(cross);
      this.group.add(cross);

      // Convert to a 0-1 scale for the sound system
      const crossY = (crossPosition.y + height / 2) / height;
      EventBus.trigger("constellation-synth:star-added", { y: crossY });
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.clearCrosses();
      }
    });
  };

  clearCrosses = () => {
    this.group.remove(...this.crosses);
    this.crosses = [];
    EventBus.trigger("constellation-synth:stars-cleared");
  };
}
