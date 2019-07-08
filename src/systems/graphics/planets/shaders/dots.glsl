#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_color;
uniform vec2 u_resolution;

float pixelSpacing = 5.0;
void main() {
  vec2 pixelCoord = gl_FragCoord.xy * u_resolution.xy;
  vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);
  gl_FragColor = (
    mod(floor(pixelCoord.x), pixelSpacing) == 0.0 &&
    mod(floor(pixelCoord.y), pixelSpacing) == 0.0
  ) ? vec4(u_color, 1.0) : transparent;
}
