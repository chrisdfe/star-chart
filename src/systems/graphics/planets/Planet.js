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
  createPlanetSphere,
  createCircleLine
} from "./utils";

// TODO - map ring should be its own class
const createMapRingMaterial = (params = {}) =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    dashSize: 0.1,
    gapSize: 0.05,
    depthWrite: false,
    ...params
  });

const createMapRing = ({
  geometry: geometryParams,
  material: materialParams
} = {}) => {
  const geometry = createCircleGeometry({
    segmentCount: 32,
    ...geometryParams
  });
  const material = createMapRingMaterial({ ...materialParams });

  const line = new Line(geometry, material);
  line.computeLineDistances();
  return line;
};

export default class Planet {
  static MIN_ORBIT_SPEED = 0.05;
  static MAX_ORBIT_SPEED = 0.4;

  static MIN_ROTATION_SPEED = 0.5;
  static MAX_ROTATION_SPEED = 4;

  static MIN_PLANET_SIZE = 0.05;
  static MAX_PLANET_SIZE = 0.2;
  static MIN_ORBIT_DIFFERENCE = 0.01;
  static MAX_ORBIT_DIFFERENCE = 2;

  static MIN_OPACITY = 0.8;
  static MAX_OPACITY = 0.9;

  static PLANET_COLORS = [0xd7e7e8, 0xafc8c9, 0xafc8c9];

  elapsed = 0;

  constructor(options = {}) {
    const {
      name = "Unnamed Planet",
      size = 1,
      color = 0xffaaff,
      orbitSize = 0,
      startRotation = 0,
      rotationSpeed = 1,
      orbitSpeed = 1,
      planetIndex = -1,
      selectable = true,
      moons = []
    } = options;

    Object.assign(this, {
      name,
      size,
      color,
      orbitSize,
      startRotation,
      rotationSpeed,
      orbitSpeed,
      planetIndex,
      selectable,
      moons
    });

    if (selectable) {
      this.initializeInteractivity();
    }
    this.initializePlanetGroup();
  }

  initializeInteractivity = () => {
    const { name, planetIndex } = this;
    this.isSelected = false;
    this.mouseover = false;

    // TODO - rename this to 'interactable' or something
    // TODO - interactable should be generic; have attached 'data' object
    // that has whatever in it (e.g order)
    this.uiObject = {
      name,
      type: "planet",
      isInteractable: true,
      id: uuid4(),
      parent: this
    };
  };

  initializePlanetGroup = () => {
    const { name, color, size, orbitSize, orbitSpeed, startRotation } = this;
    this.group = new Group();

    this.planetGroup = new Group();
    this.planetGroup.rotation.y = startRotation;

    this.sphereWrapperGroup = new Group();
    this.sphereWrapperGroup.position.z = orbitSize;

    this.sphere = createPlanetSphere({ color, size });
    this.sphere.uiObject = this.uiObject;
    this.sphereWrapperGroup.add(this.sphere);

    this.initializeMapRings();
    this.initializeMoons();

    if (this.selectable) {
      this.initializeSelectionRing();
    }

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

  initializeMoons = () => {
    if (!this.sphereWrapperGroup) {
      throw new Error("sphereWrapperGroup is required to call initializeMoons");
    }

    this.moons.forEach(moon => {
      this.sphereWrapperGroup.add(moon.entity);
    });
  };

  update = ({ diff }) => {
    this.elapsed += diff;

    this.updateSelectionRing();
    this.updateOrbitCircle();

    // Add some jitteriness to orbit
    if (this.elapsed > 100) {
      this.elapsed = 0;

      this.orbit();
      this.rotate();
      this.updateOpacity();

      this.updateMoons();
    }
  };

  orbit = () => {
    this.planetGroup.rotateY(ThreeMath.degToRad(1 * this.orbitSpeed));
  };

  rotate = () => {
    this.sphere.rotateY(ThreeMath.degToRad(1 * this.rotationSpeed));
  };

  updateOpacity = () => {
    const { MIN_OPACITY, MAX_OPACITY } = Planet;

    let newOpacity;
    if (this.isSelected) {
      newOpacity = MAX_OPACITY;
    } else {
      newOpacity = randomFloatBetween(MIN_OPACITY, MAX_OPACITY);
    }

    this.sphere.material.opacity = newOpacity;
  };

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
