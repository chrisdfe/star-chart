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
  LineBasicMaterial
} from "three";

import OrbitControls from "orbit-controls-es6";

import { EffectComposer, RenderPass } from "postprocessing";

import * as Colors from "./Colors";
import SolarSystem from "./SolarSystem";

class Game {
  constructor() {
    this.scene = new Scene();

    this.initRenderer();
    this.initCamera();

    this.initPlanets();

    this.render();
  }

  initCamera = () => {
    this.camera = new PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.cameraControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    this.camera.position.x = 0;
    this.camera.position.y = 25;
    this.camera.position.z = 30;

    Object.assign(this.cameraControls, {
      enabled: true,
      enableDamping: true,
      dampingFactor: 0.1,
      maxDistance: 1500,
      rotateSpeed: 0.08,
      minDistance: 0,
      zoomSpeed: 0.2
    });
  };

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(Colors.BACKGROUND, 1);
    document.body.appendChild(this.renderer.domElement);
  };

  initPlanets = () => {
    this.solarSystem = new SolarSystem();
    this.scene.add(this.solarSystem.entity);
  };

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.cameraControls.update();
    // this.effectComposer.render(this.clock.getDelta());
    this.solarSystem.update();
  };
}

export default Game;
