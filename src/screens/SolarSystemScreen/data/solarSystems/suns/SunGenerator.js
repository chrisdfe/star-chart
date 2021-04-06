export default class SunGenerator {
  static generate = ({ solarSystemType }) => {
    const name = "The Sun";

    // TODO - random range
    const size = 1.2;

    return { name, size };
  };
}
