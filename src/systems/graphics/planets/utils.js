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
import {
  createDebugShaderMaterial,
  createNoiseShaderMaterial
} from "./materials";

export const createOrbitLineMaterial = (params = {}) =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    scale: 1,
    dashSize: 0.1,
    gapSize: 0.05,
    depthWrite: false,
    ...params
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

export const createCircleLine = ({
  geometry: geometryParams,
  material: materialParams
} = {}) => {
  const geometry = createCircleGeometry({
    // radius: size + 0.0001,
    radius: 3,
    segmentCount: 32,
    ...geometryParams
  });

  const material = new LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    ...materialParams
  });

  return new Line(geometry, material);
};

export const createOrbitCircle = ({
  geometry: geometryParams,
  material: materialParams
} = {}) => {
  const geometry = createCircleGeometry({
    segmentCount: 32,
    ...geometryParams
  });
  const material = createOrbitLineMaterial({ ...materialParams });

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
  //   transparent: true
  //   // opacity: 0.01
  //   // alphaMap: createDebugPlanetTexture()
  //   // displacementMap: createDebugPlanetTexture()
  //   // image: createDebugPlanetTexture()
  // });
  // const material = createDebugShaderMaterial();
  const material = createNoiseShaderMaterial();

  return new Mesh(geometry, material);
};
