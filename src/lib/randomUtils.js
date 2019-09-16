import seedrandom from "seedrandom";
import { Math as ThreeMath } from "three";
import uuid4 from "uuid4";

export const seed = uuid4();
const random = seedrandom(seed);

export const randomFloat = () => random();

export const randomRotation = () => ThreeMath.degToRad(randomFloat() * 360);

export const randomFloatBetween = (min, max) =>
  randomFloat() * (max - min) + min;

export const randomIntegerBetween = (min, max) =>
  Math.floor(randomFloatBetween(min, max));

export const randomItemInArray = array => {
  const index = randomIntegerBetween(0, array.length);
  return array[index];
};
