import {
  Clock,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxBufferGeometry,
  WireframeGeometry,
  EdgesGeometry,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  Vector2,
  Vector3,
  Vector4,
  Raycaster,
  LineBasicMaterial
} from "three";

import { EffectComposer, RenderPass } from "postprocessing";

import {
  CameraController,
  DOMUIController,
  InputController
} from "./controllers";

import * as Colors from "./Colors";
import SolarSystem from "./planets/SolarSystem";

import EventBus from "../../EventBus";

export default class Graphics {
  constructor() {
    this.scene = new Scene();

    this.initRenderer();
    this.initPlanets();

    this.isPaused = false;

    this.domUIController = new DOMUIController(this);
    this.cameraController = new CameraController(this);
    this.inputController = new InputController(this);

    this.render();
  }

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(Colors.BACKGROUND, 1);
    document.body.prepend(this.renderer.domElement);
  };

  initPlanets = () => {
    this.solarSystem = new SolarSystem();
    this.scene.add(this.solarSystem.entity);
  };

  render = () => {
    requestAnimationFrame(this.render);

    if (this.isPaused) return;
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.cameraController.camera);

    this.cameraController.update();
    this.inputController.update();

    // this.effectComposer.render(this.clock.getDelta());
    this.solarSystem.update();
  };
}
