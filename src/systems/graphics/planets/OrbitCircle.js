import { LineDashedMaterial, Line } from "three";

import { randomFloatBetween } from "../../../randomUtils";
import { createCircleGeometry } from "./utils";

const createOrbitCircle = ({
  geometry: geometryParams,
  material: materialParams
} = {}) => {
  const geometry = createCircleGeometry({
    segmentCount: 32,
    ...geometryParams
  });
  const material = new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    dashSize: 0.1,
    gapSize: 0.05,
    depthWrite: false,
    ...materialParams
  });

  const line = new Line(geometry, material);
  line.computeLineDistances();
  return line;
};

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
