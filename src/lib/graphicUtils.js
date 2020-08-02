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

const CIRCLE_SEGMENTS = 12;

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

export const createCircleGeometry = ({
  radius = 2,
  segmentCount = 64
} = {}) => {
  const geometry = new Geometry();

  for (var i = 0; i <= segmentCount; i++) {
    var theta = (i / segmentCount) * Math.PI * 2;
    geometry.vertices.push(
      new Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  return geometry;
};

export const createCircleLine = ({
  geometry: geometryParams,
  material: materialParams
} = {}) => {
  const geometry = createCircleGeometry({
    radius: 3,
    segmentCount: 32,
    ...geometryParams
  });

  const material = new LineBasicMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    ...materialParams
  });

  return new Line(geometry, material);
};

export const createRectGeometry = (offsets = []) => {
  const geometry = new Geometry();

  offsets.forEach(({ x, y }) => {
    geometry.vertices.push(new Vector3(x, y, 0));
  });

  return geometry;
};

export const createRectLine = offsets => {
  const geometry = createRectGeometry(offsets);

  const material = getLineMaterial(500);
  return new Line(geometry, material);
};

export const getCameraDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

export const createInsetRectLine = (inset = 1) => {
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

export const createCircle = (
  radius,
  { x = 0, y = 0, segmentCount = 12 } = {}
) => {
  const circle = createCircleLine({
    geometry: { radius, segmentCount }
  });
  circle.rotateX(ThreeMath.degToRad(90));
  circle.position.set(x, y, 0);

  return circle;
};

export const createFullCircle = (
  radius,
  { color = 0xffffff, x = 0, y = 0, segmentCount = 12 } = {}
) => {
  const geometry = new CircleGeometry(radius, segmentCount);
  geometry.rotateZ(ThreeMath.degToRad(90));
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  mesh.position.set(x, y, 0);
  return mesh;
};

export const createLine = (...points) => {
  const geometry = new Geometry();

  points.forEach(({ x, y }) => {
    geometry.vertices.push(new Vector3(x, y, 0));
  });

  const material = getLineMaterial();

  return new Line(geometry, material);
};

export const createX = (size, { x = 0, y = 0 } = {}) => {
  const group = new Group()
    .add(createLine(new Vector2(-size, -size), new Vector2(size, size)))
    .add(createLine(new Vector2(-size, size), new Vector2(size, -size)));

  group.position.set(x, y, 0);

  return group;
};

export const createZigZag = ({ size = 3, count = 10 } = {}) =>
  createLine(
    ...[...new Array(count)].map((n, index) => {
      return {
        x: index * size,
        y: size * (index % 2 ? 1 : -1)
      };
    })
  );

export const createHorizontalLine = length =>
  createLine(new Vector2(0, 0), new Vector2(length, 0));

// Arrow is expected to go left -> right
export const createArrow = (beginning, end) => {
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

export const horizontallyReverseGroup = group => {
  const reversedGroup = new Group();

  group.children.forEach(child => {
    const clone = child.clone();
    clone.position.x = child.position.x * -1;
    clone.rotateY(ThreeMath.degToRad(180));
    reversedGroup.add(clone);
  });

  return reversedGroup;
};
