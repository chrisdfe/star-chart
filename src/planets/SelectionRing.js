import {
  SphereGeometry,
  WireframeGeometry,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  LineBasicMaterial,
  LineDashedMaterial,
  Geometry,
  Line,
  Group,
  Vector3,
  Math as ThreeMath
} from "three";

import {
  randomFloat,
  randomFloatBetween,
  randomIntegerBetween
} from "../randomUtils";

import {
  createOrbitLineMaterial,
  createCircleGeometry,
  createOrbitCircle,
  createPlanetSphere
} from "./utils";

export default class SelectionRing {
  static MIN_OPACITY = 0.6;
  static MAX_OPACITY = 0.9;
  static ROTATION_SPEED = -0.5;
  static COLOR = 0xffffff;

  static createMaterial = () => {
    new LineBasicMaterial({
      color: 0x00ffff,
      opacity: 1,
      transparent: true,
      linewidth: 1,
      scale: 1
    });
  };

  constructor(radius) {
    this.isSelected = false;
    this.group = new Group();
    this.entity = this.group;

    this.material = new LineBasicMaterial({
      color: SelectionRing.COLOR,
      opacity: 1,
      transparent: true,
      linewidth: 1,
      scale: 1
    });

    this.circle = new Line(
      createCircleGeometry({ radius, segmentCount: 16 }),
      this.material
    );
    this.group.add(this.circle);

    const lineLength = 0.1;
    this.lines = [...new Array(4)].map((num, index) => {
      var geometry = new Geometry();
      geometry.vertices.push(new Vector3(0, 0, radius - lineLength / 2));
      geometry.vertices.push(new Vector3(0, 0, radius + lineLength / 2));
      const line = new Line(geometry, this.material);
      line.rotateY(ThreeMath.degToRad(90 * index));
      return line;
    });

    this.lines.forEach(line => {
      this.group.add(line);
    });
  }

  select() {
    this.isSelected = true;
    this.material.opacity = SelectionRing.MAX_OPACITY;
  }

  deselect() {
    this.isSelected = false;
    this.material.opacity = 0;
  }

  update() {
    if (!this.isSelected) return;
    const { MIN_OPACITY, MAX_OPACITY, ROTATION_SPEED } = SelectionRing;
    this.group.rotateY(ThreeMath.degToRad(1 * ROTATION_SPEED));

    const newOpacity = randomFloatBetween(MIN_OPACITY, MAX_OPACITY);
    this.material.opacity = newOpacity;
  }
}
