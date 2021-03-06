import {
  PerspectiveCamera,
} from "three";

// import { Interaction } from "three.interaction";

import OrbitControls from "orbit-controls-es6";

import EventBus from "@/lib/EventBus";

export default class CameraController {
  constructor(parent) {
    this.parent = parent;

    this.cameraTarget = null;

    this.camera = new PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    this.orbitControls = new OrbitControls(
      this.camera,
      this.parent.renderer.domElement
    );

    this.camera.position.x = 0;
    this.camera.position.y = 35;
    this.camera.position.z = 60;

    this.mouseOvers = [];
    this.mouseOuts = [];

    Object.assign(this.orbitControls, {
      enabled: true,
      enableDamping: true,
      dampingFactor: 0.1,
      maxDistance: 1500,
      rotateSpeed: 0.08,
      minDistance: 0,
      zoomSpeed: 0.2,
    });

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    EventBus.on("planet:select-requested", ({ planet }) => {
      // this.orbitControls.enabled = false;
      // planet.entity.updateMatrixWorld();
      // const worldMatrix = planet.sphereWrapperGroup.matrixWorld;
      // const planetPosition = new Vector3().getPositionFromMatrix(worldMatrix);
      // this.cameraTarget = planet.sphereWrapperGroup;
    });
  }

  update() {
    if (this.orbitControls.enabled) {
      this.orbitControls.update();
    }

    if (this.cameraTarget) {
      this.camera.lookAt(this.cameraTarget.getWorldPosition());
    }
  }
}
