import { randomFloatBetween } from "../../../randomUtils";

import { createOrbitCircle } from "./utils";

export default class OrbitCircle {
  static MIN_DESELECTED_OPACITY = 0.2;
  static MAX_DESELECTED_OPACITY = 0.3;
  static SELECTED_OPACITY = 0.8;

  constructor(params = {}) {
    Object.assign(this, params);

    const { orbitSize } = this;

    this.entity = createOrbitCircle({
      geometry: {
        radius: orbitSize
      }
    });

    this.isSelected = false;
  }

  update = () => {
    const {
      MIN_DESELECTED_OPACITY,
      MAX_DESELECTED_OPACITY,
      SELECTED_OPACITY
    } = OrbitCircle;

    let newOpacity;
    if (this.isSelected) {
      newOpacity = SELECTED_OPACITY;
    } else {
      newOpacity = randomFloatBetween(
        MIN_DESELECTED_OPACITY,
        MAX_DESELECTED_OPACITY
      );
    }

    this.entity.material.opacity = newOpacity;
  };

  select = () => {
    this.isSelected = true;
  };

  deselect = () => {
    this.isSelected = false;
  };
}
