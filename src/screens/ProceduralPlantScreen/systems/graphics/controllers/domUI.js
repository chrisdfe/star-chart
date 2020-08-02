import EventBus from "@/lib/EventBus";

export default class DOMUIController {
  constructor(parent) {
    this.parent = parent;

    this.elements = {
      planetNameLabel: document.querySelector(".ui-planet-name")
    };

    EventBus.on("planet:mouseover", ({ selectedPlanet }) => {
      this.elements.planetNameLabel.innerHTML = selectedPlanet.name;
    });

    EventBus.on("planet:mouseout", () => {
      this.elements.planetNameLabel.innerHTML = "";
    });
  }
}

