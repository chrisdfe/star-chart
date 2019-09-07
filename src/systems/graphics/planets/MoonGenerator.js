import Moon from "./Moon";

export default class MoonGenerator {
  static generate = params => {
    return new MoonGenerator().generate(params);
  };

  generate = params => {
    return new Moon();
  };
}
