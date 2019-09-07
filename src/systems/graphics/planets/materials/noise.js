import { Vector2, Vector3, Color, ShaderMaterial } from "three";
import fragmentShader from "../shaders/noise.glsl";

const createNoiseShaderMaterial = ({
  clip = 0.4,
  color = new Color(0xff0000),
  scale = 200,
  alpha = 1.0
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
    },
    scale: {
      type: "float",
      value: scale
    },
    alpha: {
      type: "float",
      value: alpha
    }
  };

  return new ShaderMaterial({
    uniforms,
    fragmentShader,
    transparent: true,
    depthWrite: false
  });
};

export default createNoiseShaderMaterial;
