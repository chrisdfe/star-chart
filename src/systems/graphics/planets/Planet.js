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

import Moon from "./Moon";
import SelectionRing from "./SelectionRing";

import uuid4 from "uuid4";
import * as Colors from "../Colors";
import {
  randomFloat,
  randomRotation,
  randomFloatBetween,
  randomItemInArray
} from "../../../randomUtils";

import EventBus from "../../../EventBus";

import {
  createOrbitLineMaterial,
  createCircleGeometry,
  createOrbitCircle,
  createPlanetSphere
} from "./utils";

export default class Planet {
  static MIN_ORBIT_SPEED = 0.05;
  static MAX_ORBIT_SPEED = 0.15;

  static PLANET_COLORS = [0xd7e7e8, 0xafc8c9, 0xafc8c9];

  static MIN_OPACITY = 0.8;
  static MAX_OPACITY = 0.9;

  static MIN_ORBIT_CIRCLE_OPACITY = 0.2;
  static MAX_ORBIT_CIRCLE_OPACITY = 0.3;

  constructor(options = {}) {
    const { MIN_ORBIT_SPEED, MAX_ORBIT_SPEED, PLANET_COLORS } = Planet;

    const {
      name,
      size = 1,
      color = randomItemInArray(PLANET_COLORS),
      orbitSize = 2,
      position = new Vector3(0, 0, 0),
      startRotation = randomRotation(),
      rotationSpeed = randomFloatBetween(MIN_ORBIT_SPEED, MAX_ORBIT_SPEED),
      order = 1
    } = options;

    Object.assign(this, {
      name,
      color,
      size,
      orbitSize,
      rotationSpeed,
      order
    });

    this.isSelected = false;

    // TODO - rename this to 'interactable' or something
    this.uiObject = {
      name,
      order,
      type: "planet",
      isInteractable: true,
      id: uuid4(),
      parent: this
    };

    this.group = new Group();

    this.planetGroup = new Group();
    this.planetGroup.rotation.y = startRotation;

    this.sphereWrapperGroup = new Group();
    this.sphereWrapperGroup.position.z = orbitSize;

    this.sphere = createPlanetSphere({ color, size });
    this.sphere.uiObject = this.uiObject;
    this.sphereWrapperGroup.add(this.sphere);

    this.selectionRing = new SelectionRing(size + 0.2);
    this.sphereWrapperGroup.add(this.selectionRing.entity);

    // this.mapRings = new Group();
    // const mapRingCount = 8;
    // [...new Array(mapRingCount)].forEach((u, index) => {
    //   const mapRing = createOrbitCircle({ radius: size + 0.0001 });
    //   mapRing.rotateZ(ThreeMath.degToRad(-90));
    //   mapRing.rotateX(ThreeMath.degToRad((360 / mapRingCount) * index));
    //   this.mapRings.add(mapRing);
    // });
    // this.sphereWrapperGroup.add(this.mapRings);

    this.moons = [];
    const hasMoon = randomFloat() > 0.4;

    if (hasMoon) {
      this.moons.push(new Moon());
      this.moons.forEach(moon => {
        this.sphereWrapperGroup.add(moon.entity);
      });
    }

    this.planetGroup.add(this.sphereWrapperGroup);
    this.group.add(this.planetGroup);

    if (orbitSize > 0) {
      this.orbitCircle = createOrbitCircle({ radius: orbitSize });
      this.orbitCircle.uiObject = this.uiObject;
      this.group.add(this.orbitCircle);
    }

    this.entity = this.group;
    this.mouseover = false;
  }

  update() {
    const {
      MIN_OPACITY,
      MAX_OPACITY,
      MIN_ORBIT_CIRCLE_OPACITY,
      MAX_ORBIT_CIRCLE_OPACITY
    } = Planet;

    this.planetGroup.rotateY(ThreeMath.degToRad(1 * this.rotationSpeed));

    if (!this.isSelected) {
      this.sphere.material.opacity = randomFloatBetween(
        MIN_OPACITY,
        MAX_OPACITY
      );

      if (this.orbitCircle) {
        const newOpacity = randomFloatBetween(
          MIN_ORBIT_CIRCLE_OPACITY,
          MAX_ORBIT_CIRCLE_OPACITY
        );
        this.orbitCircle.material.opacity = newOpacity;

        if (this.moonOrbitCircle) {
          this.moonOrbitCircle.material.opacity = newOpacity;
        }
      }
    }

    this.selectionRing.update();

    this.moons.forEach(moon => {
      moon.moonOrbitCircle.rotateY(-ThreeMath.degToRad(1 * this.rotationSpeed));
      moon.update();
    });
  }

  onMouseOver() {
    this.isSelected = true;

    this.sphere.material.opacity = 1;
    if (this.orbitCircle) {
      this.orbitCircle.material.opacity = 1;

      if (this.moonOrbitCircle) {
        this.moonOrbitCircle.material.opacity = 1;
      }
    }

    this.selectionRing.select();
  }

  onMouseOut() {
    this.isSelected = false;

    this.selectionRing.deselect();
  }
}
