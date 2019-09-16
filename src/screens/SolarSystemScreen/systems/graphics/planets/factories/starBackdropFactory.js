import {
  Group,
  Geometry,
  SphereGeometry,
  Mesh,
  Line,
  Euler,
  Vector2,
  Vector3,
  LineBasicMaterial,
  MeshBasicMaterial,
  ShaderMaterial,
  Color
} from "three";
import * as THREE from "three";
import {
  randomIntegerBetween,
  randomFloat,
  randomFloatBetween,
  randomRotation
} from "@/lib/randomUtils";

import { noiseStars, flat } from "../materials/shaders";

// GLSL expects color values to be 0-1
const vec3FromColor = color =>
  new Vector3(color.r / 255, color.g / 255, color.b / 255, color.a / 255);

const createStarBackdropMaterial = () => {
  const uniforms = {
    u_color: {
      type: "v3",
      value: vec3FromColor(new Color(255, 255, 255))
    },
    u_opacity: {
      type: "float",
      value: 0.7
    },
    u_resolution: {
      type: "v2",
      value: new Vector2(window.innerWidth, window.innerHeight)
    },
    u_clip: {
      type: "float",
      value: 0.99
    },
    u_scale: {
      type: "float",
      value: 200
    }
  };

  const vertexShader = `
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
  `;
  // const fragmentShader = flat;
  const fragmentShader = noiseStars;

  return new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    alphaTest: 1,
    depthWrite: false
  });
};

const starBackdropFactory = () => {
  const group = new Group();

  const color = 0xff0000;
  const size = 5000;
  // const size = 5;
  const polygons = 32;
  const geometry = new SphereGeometry(size, polygons, polygons);

  // const material = new MeshBasicMaterial({
  //   color,
  //   transparent: true,
  //   opacity: 1,
  //   alphaTest: 1,
  //   depthWrite: false
  // });
  const material = createStarBackdropMaterial();

  material.side = THREE.BackSide;
  // geometry.scale.x = -1;
  return new Mesh(geometry, material);
};

export default starBackdropFactory;
