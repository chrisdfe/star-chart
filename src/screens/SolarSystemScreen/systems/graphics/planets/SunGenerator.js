import Sun from "./Sun";

export default class SunGenerator {
  static generate = params => {
    return new SunGenerator().generate(params);
  };

  generate = params => {
    return new Sun({
      size: 1.2
    });
  };
}
