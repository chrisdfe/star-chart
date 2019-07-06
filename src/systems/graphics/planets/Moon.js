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
} from "../../../randomUtils";

import {
  createOrbitLineMaterial,
  createCircleGeometry,
  createOrbitCircle,
  createPlanetSphere
} from "./utils";

export default class Moon {
  static MIN_MOON_ORBIT_SPEED = 0.4;
  static MAX_MOON_ORBIT_SPEED = 0.9;

  static MIN_MOON_ORBIT_SIZE = 0.2;
  static MAX_MOON_ORBIT_SIZE = 1;

  static MIN_MOON_SIZE = 0.02;
  static MAX_MOON_SIZE = 0.07;

  constructor(options = {}) {
    const {
      MIN_MOON_ORBIT_SPEED,
      MAX_MOON_ORBIT_SPEED,
      MIN_MOON_SIZE,
      MAX_MOON_SIZE,
      MIN_MOON_ORBIT_SIZE,
      MAX_MOON_ORBIT_SIZE
    } = Moon;

    const {
      moonRotationSpeed = randomFloatBetween(
        MIN_MOON_ORBIT_SPEED,
        MAX_MOON_ORBIT_SPEED
      )
    } = options;

    Object.assign(this, {
      moonRotationSpeed
    });

    this.group = new Group();
    this.entity = this.group;
    const moonRadius = randomFloatBetween(
      MIN_MOON_ORBIT_SIZE,
      MAX_MOON_ORBIT_SIZE
    );

    this.moonOrbitCircle = createOrbitCircle({
      geometry: {
        radius: moonRadius
      }
    });
    this.group.add(this.moonOrbitCircle);

    this.moonSphereWrapperGroup = new Group();
    const moonSize = randomFloatBetween(MIN_MOON_SIZE, MAX_MOON_SIZE);
    this.moonSphere = createPlanetSphere({ size: moonSize, color: 0xffffff });
    this.moonSphere.position.z = moonRadius;
    this.moonSphereWrapperGroup.add(this.moonSphere);
    this.group.add(this.moonSphereWrapperGroup);
  }

  update() {
    this.moonSphereWrapperGroup.rotateY(
      ThreeMath.degToRad(1 * this.moonRotationSpeed)
    );
  }
}
