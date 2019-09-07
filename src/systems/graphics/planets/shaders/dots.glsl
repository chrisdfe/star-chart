#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_color;
uniform vec2 u_resolution;
uniform float u_pixel_spacing;

vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main() {
  vec2 pixelCoord = gl_FragCoord.xy * u_resolution.xy;

  gl_FragColor = (
    floor(mod(pixelCoord.x, u_pixel_spacing)) < 0.5 &&
    floor(mod(pixelCoord.y, u_pixel_spacing)) < 0.5
  ) ? vec4(u_color, 1.0) : transparent;
}
