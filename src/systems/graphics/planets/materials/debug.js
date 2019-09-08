import { Clock, Color, Vector2, Vector3, ShaderMaterial } from "three";
// import fragmentShader from "./gradient.glsl";
import fragmentShader from "./shaders/dots.glsl";

// GLSL expects color values to be 0-1
const vec3FromColor = color =>
  new Vector3(color.r / 255, color.g / 255, color.b / 255, color.a / 255);

const createDebugShaderMaterial = () => {
  // const clock = new Clock();

  const uniforms = {
    u_color: {
      type: "v3",
      // value: vec3FromColor(new Color(0, 40, 255))
      value: vec3FromColor(new Color(50, 255, 255))
    },
    u_resolution: {
      type: "v2",
      value: new Vector2(window.innerWidth, window.innerHeight)
    },
    u_pixel_spacing: {
      type: "float",
      value: 4.0
    }
  };

  const mat = new ShaderMaterial({
    uniforms,
    fragmentShader,
    transparent: true,
    alphaTest: 1,
    depthWrite: false
  });

  // const updateTimeValue = () => {
  //   mat.uniforms.u_time.value += clock.getDelta();
  //   requestAnimationFrame(updateTimeValue);
  // };
  // requestAnimationFrame(updateTimeValue);
  return mat;
};

export default createDebugShaderMaterial;
