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
  Math as ThreeMath,
} from "three";

import OrbitCircle from "./OrbitCircle";

import {
  createOrbitLineMaterial,
  createCircleGeometry,
  createPlanetSphere,
} from "./utils";

// TODO - clean this whole file up and have Moon inherit Planet
export default class Moon {
  constructor(attributes = {}) {
    this.attributes = attributes;

    this.group = new Group();
    this.entity = this.group;

    const { size, orbitRadius, orbitSize } = this.attributes;
    this.moonOrbitCircle = new OrbitCircle({
      parent: this,
      orbitSize,
    });
    this.group.add(this.moonOrbitCircle.entity);

    this.moonSphereWrapperGroup = new Group();

    this.moonSphere = createPlanetSphere({ size, color: 0xffffff });
    this.moonSphere.position.z = orbitSize;
    this.moonSphereWrapperGroup.add(this.moonSphere);
    this.group.add(this.moonSphereWrapperGroup);
  }

  update() {
    // TODO - adjust roation speed
    // this.moonOrbitCircle.entity.rotateY(
    //   -ThreeMath.degToRad(1 * this.parent.rotationSpeed)
    // );
    const { rotationSpeed } = this.attributes;

    this.moonSphereWrapperGroup.rotateY(
      ThreeMath.degToRad(1 * this.moonRotationSpeed)
    );
  }
}
