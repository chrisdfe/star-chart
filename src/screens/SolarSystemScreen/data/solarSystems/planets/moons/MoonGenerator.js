import * as randomUtils from "@/lib/randomUtils";

const MIN_ORBIT_SPEED = 0.4;
const MAX_ORBIT_SPEED = 0.9;

const MIN_ORBIT_SIZE = 0.2;
const MAX_ORBIT_SIZE = 1;

const MIN_SIZE = 0.02;
const MAX_SIZE = 0.07;

export default class MoonGenerator {
  static generate = ({ planet, currentMoons, moonIndex }) => {
    const name = `${planet.name} moon ${moonIndex + 1}`;

    // TODO - generate moon type (barren, jungle, etc)
    const type = "default";

    // TODO - base off of planet
    const size = randomUtils.randomFloatBetween(MIN_SIZE, MAX_SIZE);

    // TODO - base off of planet orbit speed
    const orbitSpeed = randomUtils.randomFloatBetween(
      MIN_ORBIT_SPEED,
      MAX_ORBIT_SPEED
    );

    // TODO - base off of planet
    const orbitSize = randomUtils.randomFloatBetween(
      MIN_ORBIT_SIZE,
      MAX_ORBIT_SIZE
    );

    return { name, type, size, orbitSpeed, orbitSize };
  };
}
