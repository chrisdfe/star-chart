import {
  Group,
  Geometry,
  SphereGeometry,
  Mesh,
  Line,
  Euler,
  Vector3,
  LineBasicMaterial,
  MeshBasicMaterial
} from "three";
import {
  randomIntegerBetween,
  randomFloat,
  randomFloatBetween,
  randomRotation
} from "../../../../randomUtils";

const createStarSphere = () => {
  const color = 0xffffff;
  const size = 0.2;
  const polygons = 2;
  const geometry = new SphereGeometry(size, polygons, polygons);

  const material = new MeshBasicMaterial({
    color
  });

  return new Mesh(geometry, material);
};

const createStarLine = () => {
  const geometry = new Geometry();

  [new Vector3(0, 0, 0), new Vector3(0, 0, 1)].forEach(vector => {
    geometry.vertices.push(vector);
  });

  const material = new LineBasicMaterial();

  return new Line(geometry, material);
};

const starBackdropFactory = () => {
  const group = new Group();

  const starCount = randomIntegerBetween(500, 2000);

  [...new Array(starCount)].forEach((u, index) => {
    // const line = createStarLine();
    const line = createStarSphere();
    const rotation = new Euler(
      randomRotation(),
      randomRotation(),
      randomRotation(),
      "XYZ"
    );
    line.rotation.copy(rotation);
    console.log("line.rotation", line.rotation);
    line.translateZ(randomFloatBetween(100, 1500));
    group.add(line);
  });
  console.log("line group", group.children.map(child => child.position.z));

  return group;
};

export default starBackdropFactory;
