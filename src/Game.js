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

import { EffectComposer, RenderPass } from "postprocessing";

import * as Colors from "./Colors";
import createPlanet from "./planetFactory";

class Game {
  constructor() {
    this.scene = new Scene();

    this.initCamera();
    this.initRenderer();
    // this.initComposer();

    this.initPlanets();

    this.render();
  }

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  };

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(Colors.BACKGROUND, 1);
    document.body.appendChild(this.renderer.domElement);
  };

  initComposer = () => {
    this.effectComposer = new EffectComposer(this.renderer);

    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));

    this.clock = new Clock();
  };

  initPlanets = () => {
    const planet = createPlanet();
    console.log("planet", planet);
    this.scene.add(planet);

    const smallerPlanet = createPlanet({ size: 0.2 });
    smallerPlanet.position.x = 2;
    this.scene.add(smallerPlanet);
  };

  render = () => {
    requestAnimationFrame(this.render);
    // line.rotation.x += 0.01;
    // line.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update();
    // this.effectComposer.render(this.clock.getDelta());
  };
}

export default Game;
