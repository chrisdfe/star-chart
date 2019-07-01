import { Math as ThreeMath } from "three";

// TODO - seeded random
export const randomFloat = () => Math.random();

export const randomRotation = () => ThreeMath.degToRad(Math.random() * 360);

export const randomFloatBetween = (min, max) =>
  randomFloat() * (max - min) + min;

export const randomIntegerBetween = (min, max) =>
  Math.floor(randomFloatBetween(min, max));

export const randomItemInArray = array => {
  const index = randomIntegerBetween(0, array.length);
  return array[index];
};
