import seedrandom from "seedrandom";
import { Math as ThreeMath } from "three";
import uuid4 from "uuid4";

export const SEED = uuid4();

// TODO - ability to accept external seed
const random = seedrandom(SEED);

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
