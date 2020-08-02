import { Group } from "three";

import EventBus from "@/lib/EventBus";

import { getCameraDimensions } from "@/lib/graphicUtils";
import { randomIntegerBetween } from "@/lib/randomUtils";

export default class ProceduralPlant {
  constructor(graphics) {
    this.graphics = graphics;
  }

  initialize() {
    this.group = new Group();
    this.entity = this.group;

    this.segmentCount = randomIntegerBetween(3, 7);

    console.log("hello", this.segmentCount);

    return this;
  }
}
