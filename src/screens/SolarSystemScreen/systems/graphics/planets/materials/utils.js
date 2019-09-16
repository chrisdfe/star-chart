import { Vector3 } from "three";

// GLSL expects color values to be 0-1
export const vec3FromColor = color =>
  new Vector3(color.r / 255, color.g / 255, color.b / 255, color.a / 255);
