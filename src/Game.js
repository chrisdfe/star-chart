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
  Vector3,
  Vector4,
  LineBasicMaterial
} from "three";
import { Interaction } from "three.interaction";

import OrbitControls from "orbit-controls-es6";

import { EffectComposer, RenderPass } from "postprocessing";

import * as Colors from "./Colors";
import SolarSystem from "./SolarSystem";

import EventBus from "./EventBus";

class Game {
  constructor() {
    this.scene = new Scene();

    this.initRenderer();
    this.initCamera();
    this.initPlanets();

    this.interaction = new Interaction(this.renderer, this.scene, this.camera);

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

    EventBus.on("planet-highlight:requested", ({ planet }) => {
      this.scene.updateMatrixWorld();
      let targetPosition = new Vector3();
      // TODO - don't access this directly
      planet.sphere.getWorldPosition(targetPosition);
      this.cameraControls.target = targetPosition;
      this.cameraControls.update();
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
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.cameraControls.update();
    // this.effectComposer.render(this.clock.getDelta());
    this.solarSystem.update();
  };
}

export default Game;
