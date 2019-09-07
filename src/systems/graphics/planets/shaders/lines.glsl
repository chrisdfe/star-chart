#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_color;
uniform vec2 u_resolution;
uniform float u_pixel_spacing;
uniform float u_alpha;

void main() {
  vec2 pixelCoord = gl_FragCoord.xy * u_resolution.xy;

  gl_FragColor = vec4(
    1.0,
    1.0,
    1.0,
    mod(pixelCoord.x, u_pixel_spacing) > 0.7 ? 0.0 : u_alpha
  );
}
