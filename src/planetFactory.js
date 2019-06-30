import {
  SphereGeometry,
  BoxBufferGeometry,
  WireframeGeometry,
  EdgesGeometry,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  Vector2,
  Vector4,
  LineBasicMaterial,
  OrbitControls
} from "three";

import * as Colors from "./Colors";

const createPlanet = ({ size = 1 } = {}) => {
  const geometry = new SphereGeometry(size, 16, 16);
  // const wireframe = new WireframeGeometry(geometry);
  // var line = new LineSegments(wireframe);
  // line.material = new LineBasicMaterial({
  //   color: 0xffffff,
  //   linewidth: 2,
  //   linecap: "round", //ignored by WebGLRenderer
  //   linejoin: "round" //ignored by WebGLRenderer
  // });
  const material = new MeshBasicMaterial({
    color: Colors.OUTLINE
  });
  const sphere = new Mesh(geometry, material);

  return sphere;
};

export default createPlanet;
