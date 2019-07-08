import { Vector2, Vector3, Color, ShaderMaterial } from "three";
import fragmentShader from "../shaders/noise.glsl";

export const createNoiseShaderMaterial = ({
  clip = 0.4,
  color = new Color(0xff0000)
} = {}) => {
  const uniforms = {
    u_resolution: {
      type: "v2",
      value: new Vector2(window.innerWidth, window.innerHeight)
    },
    color: {
      type: "v3",
      value: color
    },
    clip: {
      type: "float",
      value: clip
    }
  };

  return new ShaderMaterial({
    uniforms,
    fragmentShader,
    transparent: true,
    depthWrite: false
  });
};
