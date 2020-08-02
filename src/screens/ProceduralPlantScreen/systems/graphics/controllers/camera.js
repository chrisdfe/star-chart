import { OrthographicCamera } from "three";
import { Interaction } from "three.interaction";

import OrbitControls from "orbit-controls-es6";

import EventBus from "@/lib/EventBus";

export default class CameraController {
  constructor(parent) {
    this.parent = parent;

    this.cameraTarget = null;

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera = new OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0,
      10000
    );
    this.camera.position.z = 100;

    this.mouseOvers = [];
    this.mouseOuts = [];

    window.addEventListener("resize", () => {
      this.camera.updateProjectionMatrix();
    });
  }

  update() {}
}
