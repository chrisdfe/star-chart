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

    EventBus.on("input:click", ({ coords, intersects }) => {
      const { width, height } = getCameraDimensions();
      const x = createX(5, {
        x: (coords.x * width) / 2,
        y: (coords.y * height) / 2
      });
      this.group.add(x);
    });

    return this;
  }
}
