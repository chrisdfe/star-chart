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
import SolarSystemGenerator from "./planets/SolarSystemGenerator";
import FrameRenderer from "./frame/FrameRenderer";

import EventBus from "../../EventBus";

const WINDOW_FRAME_SIZE = 42;

export default class Graphics {
  previousRenderFrame = 0;

  constructor() {
    this.scene = new Scene();

    this.initRenderer();
    this.initPlanets();

    this.isPaused = false;

    this.domUIController = new DOMUIController(this);
    this.cameraController = new CameraController(this);
    this.inputController = new InputController(this);

    this.frameRenderer = new FrameRenderer(this);

    this.render();
  }

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.setRendererSize();
    window.addEventListener("resize", () => {
      this.setRendererSize();
    });
    this.renderer.setClearColor(Colors.BACKGROUND, 1);

    document
      .querySelector("#star-chart-canvas-wrapper")
      .appendChild(this.renderer.domElement);
  };

  setRendererSize = () => {
    this.renderer.setSize(
      window.innerWidth - WINDOW_FRAME_SIZE * 2 + 3,
      window.innerHeight - WINDOW_FRAME_SIZE * 2 + 3
    );
  };

  initPlanets = () => {
    this.solarSystem = SolarSystemGenerator.generate();
    this.scene.add(this.solarSystem.entity);
  };

  createRenderPayload = time => {
    const { previousRenderFrame } = this;
    this.previousRenderFrame = time;
    return {
      current: time,
      previous: previousRenderFrame,
      diff: time - previousRenderFrame
    };
  };

  render = (time = 0) => {
    const payload = this.createRenderPayload(time);
    requestAnimationFrame(this.render);

    if (this.isPaused) return;
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.cameraController.camera);

    this.cameraController.update(payload);
    this.inputController.update(payload);

    // this.effectComposer.render(this.clock.getDelta());
    this.solarSystem.update(payload);
    // this.frameRenderer.update(payload);
  };
}
