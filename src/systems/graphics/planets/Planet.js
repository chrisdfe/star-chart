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

import { randomFloatBetween } from "../../../randomUtils";

import SelectionRing from "./SelectionRing";
import OrbitCircle from "./OrbitCircle";

import uuid4 from "uuid4";
import * as Colors from "../Colors";

import EventBus from "../../../EventBus";

import {
  createOrbitLineMaterial,
  createCircleGeometry,
  createMapRing,
  createPlanetSphere,
  createCircleLine
} from "./utils";

export default class Planet {
  static MIN_ORBIT_SPEED = 0.05;
  static MAX_ORBIT_SPEED = 0.15;

  static PLANET_COLORS = [0xd7e7e8, 0xafc8c9, 0xafc8c9];

  static MIN_OPACITY = 0.8;
  static MAX_OPACITY = 0.9;

  constructor(options = {}) {
    const {
      name = "Unnamed Planet",
      size = 1,
      color = 0xffaaff,
      orbitSize = 0,
      startRotation = 0,
      rotationSpeed = 1,
      planetIndex = -1,
      moons = []
    } = options;

    Object.assign(this, {
      name,
      size,
      color,
      orbitSize,
      startRotation,
      rotationSpeed,
      planetIndex,
      moons
    });

    this.initializeInteractivity();
    this.initializePlanetGroup();
  }

  initializeInteractivity = () => {
    const { name, planetIndex } = this;
    this.isSelected = false;
    this.mouseover = false;

    // TODO - rename this to 'interactable' or something
    this.uiObject = {
      name,
      order: planetIndex,
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
      this.orbitCircle = new OrbitCircle({ parent: this, orbitSize });
      this.orbitCircle.entity.uiObject = this.uiObject;
      this.group.add(this.orbitCircle.entity);
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
    const verticalMapRingCount = Math.floor(size * 6);

    [...new Array(verticalMapRingCount)].forEach((u, index) => {
      const mapRing = createMapRing({
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

    this.moons.forEach(moon => {
      this.sphereWrapperGroup.add(moon.entity);
    });
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
    }

    this.updateOrbitCircle();
    this.updateSelectionRing();
    this.updateMoons();
  }

  updateOrbitCircle() {
    if (!this.orbitCircle) return;
    this.orbitCircle.update();
  }

  updateSelectionRing() {
    if (!this.selectionRing) return;
    this.selectionRing.update();
  }

  updateMoons = () => {
    if (!this.moons) return;

    this.moons.forEach(moon => {
      moon.update();
    });
  };

  onMouseOver() {
    this.isSelected = true;

    if (this.selectionRing) {
      this.selectionRing.select();
    }

    if (this.orbitCircle) {
      this.orbitCircle.select();
    }
  }

  onMouseOut() {
    this.isSelected = false;

    if (this.selectionRing) {
      this.selectionRing.deselect();
    }

    if (this.orbitCircle) {
      this.orbitCircle.deselect();
    }
  }
}
