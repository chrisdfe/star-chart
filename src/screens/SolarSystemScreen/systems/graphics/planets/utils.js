import {
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  LineBasicMaterial,
  Geometry,
  Line,
  Vector3,
} from "three";

import { createDebugPlanetTexture } from "./materials/textures";

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

// TODO - refactor this to accept a 'texture' param for resuability
// TODO - factor in planet size when creating texture
// TODO - factor in planet size for polygons (smaller planets = fewer)
export const createPlanetSphere = ({
  color = 0xffffff,
  size = 1,
  polygons = 16,
  opacity = 0.4
} = {}) => {
  const geometry = new SphereGeometry(size, polygons, polygons);

  const material = new MeshBasicMaterial({
    // const material = new MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.4,
    // alphaTest: 1,
    depthWrite: false,
    alphaMap: createDebugPlanetTexture()
    // map: createDebugPlanetTexture()
  });

  return new Mesh(geometry, material);
};

export const Enum = values => {
  return values.reduce(
    (accumulator, key) => ({ ...accumulator, [key]: key }),
    {}
  );
};
