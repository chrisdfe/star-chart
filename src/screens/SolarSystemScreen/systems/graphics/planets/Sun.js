import * as Colors from "../Colors";

import Planet from "./Planet";

export default class Sun extends Planet {
  constructor(attributes = {}) {
    super({
      size: 1.2,
      name: "The Sun",
      // TODO - semantic/theme colors
      color: Colors.WHITE,
      order: 0,
      orbitSize: 0,
      rotationSpeed: 0,
      ...attributes,
    });
  }
}
