import { Enum } from "./utils";

// TODO - this file should go somewhere else since it's not coupled to Graphics
// TODO - 'calculated' attributes - e.g ''
export const PlanetBiomeTypes = Enum([
  "JUNGLE",
  "DESERT",
  "WATER",
  "ICE",
  "TROPICAL",
  "GAS"
]);

// TODO - proximity to sun should dicate probability of these
export const PlanetBiomes = {
  [PlanetBiomeTypes.JUNGLE]: {
    name: "Jungle"
  },
  [PlanetBiomeTypes.DESERT]: {
    name: "Desert"
  },
  [PlanetBiomeTypes.WATER]: {
    name: "Water"
  },
  [PlanetBiomeTypes.ICE]: {
    name: "Ice"
  },
  [PlanetBiomeTypes.TROPICAL]: {
    name: "Tropical"
  },
  [PlanetBiomeTypes.GAS]: {
    name: "Gas"
  }
};

// Inherit from SolarSystem?
export const PlanetVibeTypes = Enum([
  "HELLSCAPE",
  "SAD",
  "BROODING",
  "LIVELY",
  "THRIVING",
  "UTOPIAN"
]);

export const PlanetVibes = {};

// TODO - rename
export const PlanetPopulationTypes = Enum([
  "UNPOPULATED",
  "EXTINCT",
  "ANCIENT",
  "SPARSE",
  "POPULATED",
  "CROWDED",
  "COSMOPOLITAN"
]);

export const PlanetPopulations = {
  [PlanetPopulationTypes.UNPOPULATED]: {},
  [PlanetPopulationTypes.EXTINCT]: {
    name: "Ancient",
    // TODO - different descriptions depending on biome type
    description: `A civilization once made this place their home, but
                  now the only remnants of this are crumbling cities that dot the planet's surface.`
  },
  [PlanetPopulationTypes.ANCIENT]: {},
  [PlanetPopulationTypes.SPARSE]: {},
  [PlanetPopulationTypes.POPULATED]: {},
  [PlanetPopulationTypes.CROWDED]: {},
  [PlanetPopulationTypes.COSMOPOLITAN]: {}
};
