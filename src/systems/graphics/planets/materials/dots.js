import { Clock, Color, Vector2, Vector3, ShaderMaterial } from "three";
import fragmentShader from "./shaders/dots.glsl";
import { vec3FromColor } from "./utils";

const createDotsShaderMaterial = ({
  color = new Color(50, 255, 255),
  pixelSpacing = 7
} = {}) => {
  const uniforms = {
    u_color: {
      type: "v3",
      value: vec3FromColor(color)
    },
    u_resolution: {
      type: "v2",
      value: new Vector2(window.innerWidth, window.innerHeight)
    },
    u_pixel_spacing: {
      type: "float",
      value: 7.0
    }
  };

  return new ShaderMaterial({
    uniforms,
    fragmentShader,
    transparent: true,
    alphaTest: 1,
    depthWrite: false
  });
};

export default createDotsShaderMaterial;
