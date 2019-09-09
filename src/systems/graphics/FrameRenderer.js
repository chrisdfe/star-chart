import {
  Scene,
  WebGLRenderer,
  Geometry,
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Line,
  Vector2,
  Vector3,
  LineBasicMaterial,
  LineDashedMaterial,
  OrthographicCamera,
  Group,
  Math as ThreeMath
} from "three";

import * as Colors from "./Colors";

// TODO - this should get moved to a top level 'utils'
import { createCircleLine } from "./planets/utils";

const FRAME_WIDTH = 40;
// For circles
const FULL_FRAME_RADIUS = FRAME_WIDTH / 2;
const CIRCLE_SEGMENTS = 12;

const getCameraDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

// TODO - put in common place to be shared with stuff in star chart
const getLineMaterial = () =>
  new LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true
  });

const getDashedLineMaterial = (dashSize = 10) =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    dashSize: dashSize,
    gapSize: dashSize / 2,
    depthWrite: false
  });

const createRectGeometry = (offsets = []) => {
  const geometry = new Geometry();

  offsets.forEach(({ x, y }) => {
    geometry.vertices.push(new Vector3(x, y, 0));
  });

  return geometry;
};

const createRectLine = offsets => {
  const geometry = createRectGeometry(offsets);

  const material = getLineMaterial(500);
  return new Line(geometry, material);
};

const createInsetRectLine = (inset = 1) => {
  const { width, height } = getCameraDimensions();

  const offsets = [
    new Vector2(-(width / 2) + inset, -(height / 2) + inset),
    new Vector2(width / 2 - inset, -(height / 2) + inset),
    new Vector2(width / 2 - inset, height / 2 - inset),
    new Vector2(-(width / 2) + inset, height / 2 - inset),
    new Vector2(-(width / 2) + inset, -(height / 2) + inset)
  ];

  return createRectLine(offsets);
};

const createCircle = (radius, { x = 0, y = 0 }) => {
  const circle = createCircleLine({
    geometry: { radius, segmentCount: CIRCLE_SEGMENTS }
  });
  circle.rotateX(ThreeMath.degToRad(90));
  circle.position.set(x, y, 0);

  return circle;
};

const createFullCircle = (radius, { x = 0, y = 0 }) => {
  const geometry = new CircleGeometry(radius, CIRCLE_SEGMENTS);
  geometry.rotateZ(ThreeMath.degToRad(90));
  const material = new MeshBasicMaterial({ color: 0xffffff });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, 0);
  return mesh;
};

const createLine = (...points) => {
  const geometry = new Geometry();

  points.forEach(({ x, y }) => {
    geometry.vertices.push(new Vector3(x, y, 0));
  });

  const material = getLineMaterial();

  return new Line(geometry, material);
};

// Arrow is expected to go left -> right
const createArrow = (beginning, end) => {
  const arrowSize = 3;
  const group = new Group();
  group.add(createLine(beginning, end));
  group.add(
    createLine(
      new Vector2(end.x - arrowSize * 2, end.y - arrowSize),
      end,
      new Vector2(end.x - arrowSize * 2, end.y + arrowSize)
    )
  );
  return group;
};

export default class FrameRenderer {
  constructor(graphics) {
    this.graphics = graphics;
    this.scene = new Scene();

    // const width = window.innerWidth;
    this.initCamera();
    window.addEventListener("resize", () => {
      this.camera = null;
      this.initCamera();
    });

    this.initRenderer();
    this.initialize();
    this.render();
  }

  initCamera = () => {
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
  };

  initRenderer = () => {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.setRendererSize();
    window.addEventListener("resize", () => {
      this.setRendererSize();
    });
    this.renderer.setClearColor(Colors.BACKGROUND, 1);

    document
      .querySelector("#frame-wrapper")
      .appendChild(this.renderer.domElement);
  };

  setRendererSize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  initialize = () => {
    const { width, height } = getCameraDimensions();

    [
      // Top
      // Top center
      {
        radius: FULL_FRAME_RADIUS,
        position: { x: 0, y: height / 2 - FULL_FRAME_RADIUS }
      },
      {
        radius: 5,
        position: { x: 0, y: height / 2 - FULL_FRAME_RADIUS },
        isFilled: true
      },
      // Left of top center
      {
        radius: 10,
        position: {
          x: -FULL_FRAME_RADIUS - 10,
          y: height / 2 - FULL_FRAME_RADIUS
        }
      },

      // Right of top center
      {
        radius: 10,
        position: {
          x: FULL_FRAME_RADIUS + 10,
          y: height / 2 - FULL_FRAME_RADIUS
        }
      },

      // Bottom
      {
        radius: FRAME_WIDTH / 2,
        position: { y: -(height / 2) + FRAME_WIDTH / 2 }
      }
    ].forEach(({ radius, position, isFilled }) => {
      const createMethod = isFilled ? createFullCircle : createCircle;
      this.scene.add(createMethod(radius, position));
    });

    const rightArrow = createArrow(
      new Vector2(0, height / 2 - FRAME_WIDTH / 2),
      new Vector2(100, height / 2 - FRAME_WIDTH / 2)
    );
    rightArrow.position.x = 40;
    const leftArrow = createArrow(
      new Vector2(0, height / 2 - FRAME_WIDTH / 2),
      new Vector2(100, height / 2 - FRAME_WIDTH / 2)
    );
    this.scene.add(rightArrow);

    leftArrow.rotateY(ThreeMath.degToRad(180));
    leftArrow.position.x = -40;
    this.scene.add(leftArrow);

    this.scene.add(createInsetRectLine(FRAME_WIDTH));
  };

  render = (time = 0) => {
    // requestAnimationFrame(this.render);

    this.renderer.render(this.scene, this.camera);
  };
}
