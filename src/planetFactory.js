import {
  Clock,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  BoxBufferGeometry,
  WireframeGeometry,
  EdgesGeometry,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  Vector2,
  Vector4,
  LineBasicMaterial,
  OrbitControls
} from "three";

const geometry = new SphereGeometry(2, 16, 16);
// const wireframe = new WireframeGeometry(geometry);
// var line = new LineSegments(wireframe);
// line.material = new LineBasicMaterial({
//   color: 0xffffff,
//   linewidth: 2,
//   linecap: "round", //ignored by WebGLRenderer
//   linejoin: "round" //ignored by WebGLRenderer
// });
const material = new MeshBasicMaterial({
  color: Colors.BACKGROUND
});
const sphere = new Mesh(geometry, material);
scene.add(sphere);

const otherSphere = new Mesh(
  new SphereGeometry(1, 16, 16),
  new MeshBasicMaterial({
    color: Colors.BACKGROUND
  })
);

otherSphere.position.x = -3;
otherSphere.position.z = -2;
scene.add(otherSphere);
