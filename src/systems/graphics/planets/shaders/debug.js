import { Clock, Color, Vector2, Vector3, ShaderMaterial } from "three";
// import fragmentShader from "./gradient.glsl";
import fragmentShader from "./flat.glsl";

// GLSL expects color values to be 0-1
const vec3FromColor = color =>
  new Vector3(color.r / 255, color.g / 255, color.b / 255, color.a / 255);

export const createDebugShaderMaterial = () => {
  // const clock = new Clock();

  // const uniforms = {
  //     u_time: { type: "f", value: 1.0 },
  //     u_resolution: {
  //       type: "v2",
  //       value: new Vector2(window.innerWidth, window.innerHeight)
  //     }
  //   },

  const uniforms = {
    color: { type: "v3", value: vec3FromColor(new Color(0, 40, 255)) }
  };

  const mat = new ShaderMaterial({
    uniforms,
    fragmentShader
  });

  // const updateTimeValue = () => {
  //   mat.uniforms.u_time.value += clock.getDelta();
  //   requestAnimationFrame(updateTimeValue);
  // };
  // requestAnimationFrame(updateTimeValue);
  return mat;
};
