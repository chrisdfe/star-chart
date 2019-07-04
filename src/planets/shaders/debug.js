import { Clock, Vector2, ShaderMaterial } from "three";
import fragmentShader from "./gradient.glsl";

export const createDebugShaderMaterial = () => {
  const clock = new Clock();

  const mat = new ShaderMaterial({
    uniforms: {
      u_time: { type: "f", value: 1.0 },
      u_resolution: {
        type: "v2",
        value: new Vector2(window.innerWidth, window.innerHeight)
      }
    },

    fragmentShader
  });

  const updateTimeValue = () => {
    mat.uniforms.u_time.value += clock.getDelta();
    requestAnimationFrame(updateTimeValue);
  };
  requestAnimationFrame(updateTimeValue);
  return mat;
};
