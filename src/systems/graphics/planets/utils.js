import {
  SphereGeometry,
  WireframeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  RawShaderMaterial,
  LineBasicMaterial,
  LineDashedMaterial,
  ParticleBasicMaterial,
  Geometry,
  Line,
  Group,
  Vector3,
  Math as ThreeMath,
  AdditiveBlending,
  Texture,
  RepeatWrapping
} from "three";

import { createDebugPlanetTexture } from "./textures";
import { createDebugShaderMaterial } from "./shaders/debug";

export const createOrbitLineMaterial = () =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    scale: 1,
    dashSize: 0.1,
    gapSize: 0.05
  });

export const createCircleGeometry = ({
  radius = 2,
  segmentCount = 64
} = {}) => {
  const geometry = new Geometry();

  for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
      new Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  return geometry;
};

export const createOrbitCircle = ({ radius = 2 } = {}) => {
  const geometry = createCircleGeometry({ radius, segmentCount: 32 });
  const material = createOrbitLineMaterial();

  const line = new Line(geometry, material);
  line.computeLineDistances();
  return line;
};

export const createPlanetSphere = ({
  color = 0xffffff,
  size = 1,
  polygons = 16
} = {}) => {
  const geometry = new SphereGeometry(size, polygons, polygons);

  // const material = new MeshBasicMaterial({
  //   // const material = new MeshStandardMaterial({
  //   color,
  //   transparent: true,
  //   alphaMap: createDebugPlanetTexture()
  //   // displacementMap: createDebugPlanetTexture()
  //   // image: createDebugPlanetTexture()
  // });
  const material = createDebugShaderMaterial();

  return new Mesh(geometry, material);
};
