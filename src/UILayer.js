import EventBus from "./EventBus";
class UILayer {
  constructor() {
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

export default UILayer;
