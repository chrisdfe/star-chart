import {
  MeshBasicMaterial,
  MeshStandardMaterial,
  RawShaderMaterial,
  Math as ThreeMath,
  AdditiveBlending,
  Texture,
  RepeatWrapping
} from "three";

import * as THREE from "three";

import { getNoiseImageData } from "./imageData";

export const createDebugPlanetTexture = ({ size = 32 } = {}) => {
  const aspectRadio = size / 1;
  const arr = getNoiseImageData(size);
  const repeat = 8;

  const texture = new Texture(arr);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.repeat.set(repeat, repeat);
  return texture;
};
