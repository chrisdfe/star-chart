import {
  Scene,
  WebGLRenderer,
} from "three";

// import { EffectComposer, RenderPass } from "postprocessing";

import Store from "@/lib/Store";

import {
  CameraController,
  DOMUIController,
  InputController,
} from "./controllers";

import * as Colors from "./Colors";

import SolarSystem from "./planets/SolarSystem";
import FrameRenderer from "./frame/FrameRenderer";

const WINDOW_FRAME_SIZE = 42;

const generateSolarSystemFromStore = () => {
  const sceneData = Store.get("sceneData");
  const { solarSystem: solarSystemData } = sceneData;

  const solarSystem = new SolarSystem(solarSystemData).initialize();

  return solarSystem;
};

export default class Graphics {
  previousRenderFrame = 0;

  constructor() {
    this.scene = new Scene();

    this.initRenderer();

    // TODO - this should go in 'state controller';
    this.isPaused = false;

    // TODO - all of these should probably go up a level - 'Game' should create them,
    //  not this Graphics class
    this.domUIController = new DOMUIController(this);
    this.cameraController = new CameraController(this);
    this.inputController = new InputController(this);

    this.solarSystem = generateSolarSystemFromStore();
    this.scene.add(this.solarSystem.entity);

    this.frameRenderer = new FrameRenderer(this);

    this.render();
  }

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.setRendererSize();

    // TODO - this doesn't resize properly
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

  createRenderPayload = (time) => {
    const { previousRenderFrame } = this;
    this.previousRenderFrame = time;

    return {
      current: time,
      previous: previousRenderFrame,
      diff: time - previousRenderFrame,
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

    this.solarSystem.update(payload);
    this.frameRenderer.update(payload);
  };
}
