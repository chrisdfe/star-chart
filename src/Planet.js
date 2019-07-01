import {
  SphereGeometry,
  WireframeGeometry,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  LineDashedMaterial,
  Geometry,
  Line,
  Group,
  Vector3,
  Math as ThreeMath
} from "three";

import * as Colors from "./Colors";
import {
  randomRotation,
  randomFloatBetween,
  randomItemInArray
} from "./randomUtils";

export const MIN_ORBIT_SPEED = 0.01;
export const MAX_ORBIT_SPEED = 0.15;

export const PLANET_COLORS = [0xd7e7e8, 0xafc8c9, 0xafc8c9];

const createOrbitLineMaterial = () =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    scale: 1,
    dashSize: 0.1,
    gapSize: 0.05
  });

const createCircleGeometry = ({ radius = 2, segmentCount = 64 } = {}) => {
  const geometry = new Geometry();

  for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
      new Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  return geometry;
};

const createOrbitCircle = ({ orbitSize = 2 }) => {
  const geometry = createCircleGeometry({ radius: orbitSize });
  const material = createOrbitLineMaterial();

  const line = new Line(geometry, material);
  line.computeLineDistances();
  return line;
};

class Planet {
  constructor(options = {}) {
    const {
      size = 1,
      color = randomItemInArray(PLANET_COLORS),
      orbitSize = 2,
      position = new Vector3(0, 0, 0),
      startRotation = randomRotation(),
      rotationSpeed = randomFloatBetween(MIN_ORBIT_SPEED, MAX_ORBIT_SPEED)
    } = options;

    Object.assign(this, {
      size,
      orbitSize,
      rotationSpeed
    });

    this.group = new Group();

    this.planetGroup = new Group();

    this.geometry = new SphereGeometry(size, 32, 32);

    this.material = new MeshBasicMaterial({
      color
    });

    this.sphere = new Mesh(this.geometry, this.material);
    this.sphere.position.z = orbitSize;

    this.planetGroup.add(this.sphere);
    this.planetGroup.rotation.y = startRotation;
    this.group.add(this.planetGroup);

    if (orbitSize > 0) {
      this.group.add(createOrbitCircle({ orbitSize }));
    }

    this.entity = this.group;
  }

  update() {
    this.planetGroup.rotation.y =
      this.planetGroup.rotation.y + ThreeMath.degToRad(1 * this.rotationSpeed);
  }
}

export default Planet;

export class Sun extends Planet {
  constructor(options = {}) {
    const { size = 1 } = options;
    super({ size, color: Colors.WHITE, orbitSize: 0, rotationSpeed: 0 });
  }
}
