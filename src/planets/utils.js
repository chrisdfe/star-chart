import {
  SphereGeometry,
  WireframeGeometry,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  LineBasicMaterial,
  LineDashedMaterial,
  Geometry,
  Line,
  Group,
  Vector3,
  Math as ThreeMath
} from "three";

export const createOrbitLineMaterial = () =>
  new LineDashedMaterial({
    color: 0xffffff,
    opacity: 0.4,
    transparent: true,
    linewidth: 1,
    scale: 1,
    dashSize: 0.1,
    gapSize: 0.05
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

export const createOrbitCircle = ({ radius = 2 } = {}) => {
  const geometry = createCircleGeometry({ radius });
  const material = createOrbitLineMaterial();

  const line = new Line(geometry, material);
  line.computeLineDistances();
  return line;
};

export const createPlanetSphere = ({ color = 0xffffff, size = 1 } = {}) => {
  const geometry = new SphereGeometry(size, 32, 32);

  const material = new MeshBasicMaterial({
    color,
    transparent: true
  });

  return new Mesh(geometry, material);
};
