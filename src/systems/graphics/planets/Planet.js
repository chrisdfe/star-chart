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
  createPlanetSphere,
  createCircleLine
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
      startRotation = randomRotation(),
      rotationSpeed = randomFloatBetween(MIN_ORBIT_SPEED, MAX_ORBIT_SPEED),
      order = 1
    } = options;

    Object.assign(this, {
      name,
      size,
      color,
      orbitSize,
      startRotation,
      rotationSpeed,
      order
    });

    this.initializeInteractivity();
    this.initializePlanetGroup();
  }

  initializeInteractivity = () => {
    const { name, order } = this;
    this.isSelected = false;
    this.mouseover = false;

    // TODO - rename this to 'interactable' or something
    this.uiObject = {
      name,
      order,
      type: "planet",
      isInteractable: true,
      id: uuid4(),
      parent: this
    };
  };

  initializePlanetGroup = () => {
    const { name, color, size, orbitSize, startRotation, rotationSpeed } = this;
    this.group = new Group();

    this.planetGroup = new Group();
    this.planetGroup.rotation.y = startRotation;

    this.sphereWrapperGroup = new Group();
    this.sphereWrapperGroup.position.z = orbitSize;

    this.sphere = createPlanetSphere({ color, size });
    this.sphere.uiObject = this.uiObject;
    this.sphereWrapperGroup.add(this.sphere);

    this.initializeMapRings();
    this.initializeSelectionRing();
    this.initializeMoons();

    this.planetGroup.add(this.sphereWrapperGroup);
    this.group.add(this.planetGroup);

    if (orbitSize > 0) {
      this.orbitCircle = createOrbitCircle({
        geometry: {
          radius: orbitSize
        }
      });
      this.orbitCircle.uiObject = this.uiObject;
      this.group.add(this.orbitCircle);
    }

    this.entity = this.group;
  };

  initializeMapRings = () => {
    if (!this.sphereWrapperGroup) {
      throw new Error(
        "sphereWrapperGroup is required to call initializeMapRings"
      );
    }
    const { size } = this;
    this.mapRings = new Group();
    const verticalMapRingCount = Math.floor(size * 10);

    [...new Array(verticalMapRingCount)].forEach((u, index) => {
      const mapRing = createOrbitCircle({
        geometry: {
          radius: size + 0.0001
        },
        material: {
          opacity: index % 4 === 0 ? 0.3 : 0.1
        }
      });
      mapRing.rotateZ(ThreeMath.degToRad(-90));
      mapRing.rotateX(ThreeMath.degToRad((360 / verticalMapRingCount) * index));
      this.mapRings.add(mapRing);
    });

    const equatorMapRing = createCircleLine({
      geometry: { radius: size + 0.0001 }
    });

    this.mapRings.add(equatorMapRing);
    this.sphereWrapperGroup.add(this.mapRings);
  };

  initializeSelectionRing = () => {
    if (!this.sphereWrapperGroup) {
      throw new Error(
        "sphereWrapperGroup is required to call initializeSelectionRing"
      );
    }

    const { size } = this;

    this.selectionRing = new SelectionRing(size + 0.2);
    this.sphereWrapperGroup.add(this.selectionRing.entity);
  };

  initializeMoons() {
    if (!this.sphereWrapperGroup) {
      throw new Error("sphereWrapperGroup is required to call initializeMoons");
    }

    this.moons = [];
    const hasMoon = randomFloat() > 0.4;

    if (hasMoon) {
      this.moons.push(new Moon());
      this.moons.forEach(moon => {
        this.sphereWrapperGroup.add(moon.entity);
      });
    }
  }

  update() {
    const {
      MIN_OPACITY,
      MAX_OPACITY,
      MIN_ORBIT_CIRCLE_OPACITY,
      MAX_ORBIT_CIRCLE_OPACITY
    } = Planet;

    this.planetGroup.rotateY(ThreeMath.degToRad(1 * this.rotationSpeed));

    // if (!this.isSelected) {
    //   this.sphere.material.opacity = randomFloatBetween(
    //     MIN_OPACITY,
    //     MAX_OPACITY
    //   );

    //   if (this.orbitCircle) {
    //     const newOpacity = randomFloatBetween(
    //       MIN_ORBIT_CIRCLE_OPACITY,
    //       MAX_ORBIT_CIRCLE_OPACITY
    //     );
    //     this.orbitCircle.material.opacity = newOpacity;

    //     if (this.moonOrbitCircle) {
    //       this.moonOrbitCircle.material.opacity = newOpacity;
    //     }
    //   }
    // }

    this.updateSelectionRing();
    this.updateMoons();
  }

  updateSelectionRing() {
    if (!this.selectionRing) return;
    this.selectionRing.update();
  }

  updateMoons = () => {
    if (!this.moons) return;
    this.moons.forEach(moon => {
      moon.moonOrbitCircle.rotateY(-ThreeMath.degToRad(1 * this.rotationSpeed));
      moon.update();
    });
  };

  onMouseOver() {
    this.isSelected = true;

    // this.sphere.material.opacity = 1;
    // if (this.orbitCircle) {
    //   this.orbitCircle.material.opacity = 1;

    //   if (this.moonOrbitCircle) {
    //     this.moonOrbitCircle.material.opacity = 1;
    //   }
    // }

    if (this.selectionRing) {
      this.selectionRing.select();
    }
  }

  onMouseOut() {
    this.isSelected = false;

    if (this.selectionRing) {
      this.selectionRing.deselect();
    }
  }
}
