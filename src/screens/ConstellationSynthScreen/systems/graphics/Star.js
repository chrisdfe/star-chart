import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Group,
  Color
} from "three";
import { createX } from "./utils";

const createTransparentSphere = ({ radius = 10 } = {}) => {
  const geometry = new SphereGeometry(radius, 16, 16);
  const material = new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
  });
  return new Mesh(geometry, material);
};

export default class Star {
  initialize = () => {
    this.group = new Group();
    this.entity = this.group;

    const sphere = createTransparentSphere();

    this.group.add(sphere);
    this.cross = createX(5);
    this.cross.position.z = -10;
    this.group.add(this.cross);

    this.uiObject = {
      name,
      type: "star",
      isInteractable: true,
      id: uuid4(),
      parent: this
    };
    sphere.uiObject = this.uiObject;

    return this;
  };

  setCrossLineColor = color => {
    this.cross.children.forEach(line => {
      line.material.color = new Color(color);
    });
  };

  onMouseOver = () => {
    // TODO - get this color from Colors
    this.setCrossLineColor(0xff0000);
  };

  onMouseOut = () => {
    // TODO - get this color from Colors
    this.setCrossLineColor(0xffffff);
  };
}
