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

import * as Colors from "../Colors";

import Planet from "./Planet";

export default class Sun extends Planet {
  constructor(options = {}) {
    const { size = 1 } = options;
    super({
      size,
      name: "The Sun",
      color: Colors.WHITE,
      order: 0,
      orbitSize: 0,
      rotationSpeed: 0
    });
  }
}
