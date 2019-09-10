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

import * as Colors from "../Colors";

import {
  getCameraDimensions,
  createCircle,
  createFullCircle,
  createArrow,
  createLine,
  createHorizontalLine,
  horizontallyReverseGroup,
  createInsetRectLine
} from "./utils";

const FRAME_WIDTH = 40;
// For circles
const FULL_FRAME_RADIUS = FRAME_WIDTH / 2;

const createX = (size, { x = 0, y = 0 } = {}) => {
  const group = new Group()
    .add(createLine(new Vector2(-size, -size), new Vector2(size, size)))
    .add(createLine(new Vector2(-size, size), new Vector2(size, -size)));

  group.position.set(x, y, 0);

  return group;
};

const createZigZag = ({ size = 3, count = 10 } = {}) =>
  createLine(
    ...[...new Array(count)].map((n, index) => {
      return {
        x: index * size,
        y: size * (index % 2 ? 1 : -1)
      };
    })
  );

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

    // // Bottom
    // {
    //   radius: FRAME_WIDTH / 2,
    //   position: { y: -(height / 2) + FRAME_WIDTH / 2 }
    // }

    // Top center cirles
    const TOP_MIDDLE_CENTER = height / 2 - FULL_FRAME_RADIUS;
    this.scene.add(
      createCircle(FULL_FRAME_RADIUS, {
        x: 0,
        y: TOP_MIDDLE_CENTER
      }),
      createCircle(FULL_FRAME_RADIUS - 5, {
        x: 0,
        y: TOP_MIDDLE_CENTER
      }),
      createFullCircle(5, { x: 0, y: TOP_MIDDLE_CENTER }),
      createX(FULL_FRAME_RADIUS, {
        x: 0,
        y: TOP_MIDDLE_CENTER
      })
    );

    // Top right circles
    // Right of top center
    const topRightGroup = new Group()
      .add(
        createCircle(10, {
          x: FULL_FRAME_RADIUS + 10,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createCircle(7, {
          x: FULL_FRAME_RADIUS + 10,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        (() => {
          const rightArrow = createArrow(new Vector2(0, 0), new Vector2(40, 0));
          rightArrow.position.y = height / 2 - FRAME_WIDTH / 2;
          rightArrow.position.x = 40;
          return rightArrow;
        })()
      )
      .add(
        createCircle(4, {
          x: 50,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createCircle(7, {
          x: 100,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createCircle(7, {
          x: 114,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createFullCircle(3, {
          x: 114,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createCircle(7, {
          x: 128,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        (() => {
          const line = createHorizontalLine(100);
          line.position.y = TOP_MIDDLE_CENTER;
          line.position.x = 135;
          return line;
        })()
      )
      .add(
        createCircle(5, {
          x: 240,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createX(5, {
          x: 255,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createX(5, {
          x: 265,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createX(5, {
          x: 275,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createCircle(5, {
          x: 290,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        (() => {
          const line = createHorizontalLine(100);
          line.position.y = TOP_MIDDLE_CENTER;
          line.position.x = 295;
          return line;
        })()
      )
      .add(
        createCircle(7, {
          x: 402,
          y: TOP_MIDDLE_CENTER
        })
      )
      .add(
        createFullCircle(3, {
          x: 402,
          y: TOP_MIDDLE_CENTER
        })
      );
    this.scene.add(topRightGroup);

    const topLeftGroup = horizontallyReverseGroup(topRightGroup);
    this.scene.add(topLeftGroup);

    // BOTTOM
    const BOTTOM_MIDDLE_CENTER = -(height / 2) + FRAME_WIDTH / 2;
    const bottomMiddle = new Group().add(
      createCircle(7, {
        x: 0,
        y: BOTTOM_MIDDLE_CENTER
      })
    );
    this.scene.add(bottomMiddle);

    const bottomMiddleRight = new Group().add(
      (() => {
        const zigZag = createZigZag();
        zigZag.position.x = 20;
        zigZag.position.y = BOTTOM_MIDDLE_CENTER;
        return zigZag;
      })()
    );
    this.scene.add(bottomMiddleRight);

    const bottomMiddleLeft = horizontallyReverseGroup(bottomMiddleRight);
    this.scene.add(bottomMiddleLeft);

    // Main content area border
    this.scene.add(createInsetRectLine(FRAME_WIDTH));
  };

  render = (time = 0) => {
    // requestAnimationFrame(this.render);

    this.renderer.render(this.scene, this.camera);
  };
}
