import SimplexNoise from "simplex-noise";

import { seed, randomFloat } from "../../../../../randomUtils";

const rgbaByte = ({ r = 0, g = 0, b = 0, a = 0 }) => [r, g, b, a];

const rgbByteToAlpha = (...args) => rgbaByte({ ...args, a: 255.0 });

const simplex = new SimplexNoise(seed);

const alphaRGBByte = alpha => rgbaByte({ a: alpha });
const grayscaleRGBAByte = value =>
  rgbaByte({ r: value * 255, g: value * 255, b: value * 255, a: 255 });

// Only the g channel gets used in alpha maps
// https://threejs.org/docs/#api/en/materials/MeshBasicMaterial.alphaMap
const alphaMapByte = opacity => rgbaByte({ g: Math.round(opacity * 255) });

// Warning - mutates uint8clampedArray
const copyByteDataTo = (byteData, uint8clampedArray) => {
  for (let i = 0; i < byteData.length; i += 1) {
    uint8clampedArray[i] = byteData[i];
  }
};

const getImageDataFrom = (arr, width, height) => {
  const byteSize = 4;
  const clampedArray = new Uint8ClampedArray(byteSize * width * height);

  // prettier-ignore
  const rawByteData = arr.reduce(
    (accumulator, opacity) => [...accumulator, ...alphaMapByte(opacity)],
    // (accumulator, opacity) => [...accumulator, ...grayscaleRGBAByte(opacity)],
    []
  );

  copyByteDataTo(rawByteData, clampedArray);

  return new ImageData(clampedArray, width, height);
};

// prettier-ignore
const DEBUG_IMAGE_DATA_ARRAY = [
  1, 0, 1, 0,
  0, 1, 0, 1,
  1, 0, 1, 0,
  0, 1, 0, 1,
]

// TODO - why does width have to be height * 2
export const getDebugImageData = ({ width = 4 } = {}) => {
  return getImageDataFrom(DEBUG_IMAGE_DATA_ARRAY, width, width / 2);
};

export const getNoiseImageData = (width = 4) => {
  const height = width / 2;
  let arr = [];

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < height; y += 1) {
      const alpha = Math.abs(simplex.noise2D(x, y));
      arr.push(alpha);
    }
  }

  return getImageDataFrom(arr, width, height);
};
