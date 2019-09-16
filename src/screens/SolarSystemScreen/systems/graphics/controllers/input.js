import { Vector3, Raycaster } from "three";

import EventBus from "@/lib/EventBus";

// TODO - this should go in a common place
const flattenChildren = children => {
  return children.reduce((accumulator, child) => {
    if (child.children) {
      return [...accumulator, ...[child], ...flattenChildren(child.children)];
    }
    return [...accumulator, ...[child]];
  }, []);
};

export default class InputController {
  constructor(parent) {
    this.parent = parent;

    this.mouse = { x: 0, y: 0 };
    this.intersects = [];

    this.raycaster = new Raycaster();
    this.raycaster.linePrecision = 0.2;

    const starChartCanvasWrapper = document.querySelector(
      "#star-chart-canvas-wrapper"
    );
    window.addEventListener("mousemove", event => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("keydown", event => {
      if (event.code === "Space") {
        // TODO - this should go in a 'StateController'
        this.parent.isPaused = !this.parent.isPaused;
        EventBus.trigger("pause-state:changed", {
          paused: this.parent.isPaused
        });
      }
    });

    window.addEventListener("click", () => {
      const { intersects } = this;

      if (intersects.length) {
        EventBus.trigger("input:click", { intersects });
      }
    });
  }

  update = () => {
    this.checkForMouseEvents();
  };

  checkForMouseEvents = () => {
    const { mouse, raycaster } = this;
    const { scene } = this.parent;
    const { camera } = this.parent.cameraController;
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
      EventBus.trigger("input:mouseover", { intersects: this.mouseOvers });
    }

    if (this.mouseOuts.length) {
      EventBus.trigger("input:mouseout", { intersects: this.mouseOuts });
    }
  };
}
