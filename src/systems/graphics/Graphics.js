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
import { Interaction } from "three.interaction";

import OrbitControls from "orbit-controls-es6";

import { EffectComposer, RenderPass } from "postprocessing";

import * as Colors from "./Colors";
import SolarSystem from "./planets/SolarSystem";

import EventBus from "../../EventBus";

import UILayer from "./UILayer";

const flattenChildren = children => {
  return children.reduce((accumulator, child) => {
    if (child.children) {
      return [...accumulator, ...[child], ...flattenChildren(child.children)];
    }
    return [...accumulator, ...[child]];
  }, []);
};

export default class Graphics {
  constructor() {
    this.scene = new Scene();

    this.initRenderer();
    this.initCamera();
    this.initPlanets();

    this.raycaster = new Raycaster();
    this.raycaster.linePrecision = 0.2;
    this.mouse = { x: 0, y: 0 };
    this.intersects = [];

    this.isPaused = false;

    this.uiLayer = new UILayer();

    window.addEventListener("mousemove", event => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // TODO - emit event
    window.addEventListener("keydown", event => {
      if (event.code === "Space") {
        this.isPaused = !this.isPaused;
      }
    });

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

    this.mouseOvers = [];
    this.mouseOuts = [];

    Object.assign(this.cameraControls, {
      enabled: true,
      enableDamping: true,
      dampingFactor: 0.1,
      maxDistance: 1500,
      rotateSpeed: 0.08,
      minDistance: 0,
      zoomSpeed: 0.2
    });

    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    window.addEventListener("click", () => {
      if (this.intersects.length) {
        const uiObject = this.intersects[0];
        EventBus.trigger("click", { uiObject });
      }
    });
  };

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

  checkForMouseEvents = () => {
    const { mouse, raycaster, camera, scene } = this;
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    const vector = new Vector3(mouse.x, mouse.y, 1);
    const flattenedChildren = flattenChildren(scene.children);

    const oldIntersects = this.intersects;
    const newIntersects = raycaster
      .intersectObjects(flattenedChildren)
      .filter(({ object }) => {
        return object && object.uiObject && object.uiObject.isInteractable;
      })
      .map(({ object }) => object.uiObject);

    this.mouseOuts = oldIntersects.filter(
      uiObject => !newIntersects.includes(uiObject)
    );

    this.mouseOvers = newIntersects.filter(
      uiObject => !oldIntersects.includes(uiObject)
    );

    this.intersects = newIntersects;

    if (this.mouseOvers.length) {
      EventBus.trigger("mouseover", { intersects: this.mouseOvers });
    }

    if (this.mouseOuts.length) {
      EventBus.trigger("mouseout", { intersects: this.mouseOuts });
    }
  };

  render = () => {
    requestAnimationFrame(this.render);

    if (this.isPaused) return;
    this.checkForMouseEvents();
    this.scene.updateMatrixWorld();
    this.renderer.render(this.scene, this.camera);
    // required if controls.enableDamping or controls.autoRotate are set to true
    this.cameraControls.update();
    // this.effectComposer.render(this.clock.getDelta());
    this.solarSystem.update();
  };
}

