/**
 * landCover.ts
 * Constants and types related to land cover classification
 */

// Land cover types
export enum LandCoverType {
  TREES = 'trees',
  GRASS = 'grass',
  WATER = 'water',
  BUILDINGS = 'buildings',
  CROPS = 'crops',
  BARREN = 'barren',
  SHRUBLAND = 'shrubland',
  WETLANDS = 'wetlands',
  SNOW_ICE = 'snowIce',
  OTHER = 'other'
}

// Interface for detailed land cover breakdown
export interface DetailedLandCover {
  // Forest/Trees subcategories
  deciduousForest?: number;
  evergreenForest?: number;
  mixedForest?: number;
  
  // Grass/Low vegetation subcategories
  grassland?: number;
  lawn?: number;
  pasture?: number;
  
  // Water subcategories
  lake?: number;
  river?: number;
  ocean?: number;
  pond?: number;
  
  // Urban/Buildings subcategories
  residentialBuildings?: number;
  commercialBuildings?: number;
  industrialAreas?: number;
  roads?: number;
  
  // Agriculture subcategories
  cropland?: number;
  orchard?: number;
  vineyard?: number;
  
  // Other subcategories
  barrenLand?: number;
  shrubland?: number;
  wetlands?: number;
  snowIce?: number;
  other?: number;
}

// Display information for land cover types
export interface LandCoverDisplay {
  label: string;
  color: string;
  description: string;
}

// Display information map
export const landCoverDisplayInfo: Record<LandCoverType, LandCoverDisplay> = {
  [LandCoverType.TREES]: {
    label: 'Trees',
    color: '#2E7D32', // Dark green
    description: 'Areas covered by trees and forest'
  },
  [LandCoverType.GRASS]: {
    label: 'Grass',
    color: '#8BC34A', // Light green
    description: 'Grasslands, lawns, and low vegetation'
  },
  [LandCoverType.WATER]: {
    label: 'Water',
    color: '#1976D2', // Blue
    description: 'Lakes, rivers, ponds, and other water bodies'
  },
  [LandCoverType.BUILDINGS]: {
    label: 'Buildings',
    color: '#757575', // Gray
    description: 'Buildings, structures, and developed areas'
  },
  [LandCoverType.CROPS]: {
    label: 'Crops',
    color: '#FBC02D', // Yellow
    description: 'Agricultural areas, croplands, and fields'
  },
  [LandCoverType.BARREN]: {
    label: 'Barren',
    color: '#BCAAA4', // Tan
    description: 'Bare soil, sand, or rocks with minimal vegetation'
  },
  [LandCoverType.SHRUBLAND]: {
    label: 'Shrubland',
    color: '#558B2F', // Olive
    description: 'Areas dominated by shrubs and small woody plants'
  },
  [LandCoverType.WETLANDS]: {
    label: 'Wetlands',
    color: '#0097A7', // Teal
    description: 'Marshes, swamps, and areas with saturated soil'
  },
  [LandCoverType.SNOW_ICE]: {
    label: 'Snow/Ice',
    color: '#E0E0E0', // Light gray
    description: 'Areas covered by permanent or seasonal snow and ice'
  },
  [LandCoverType.OTHER]: {
    label: 'Other',
    color: '#BDBDBD', // Light gray
    description: 'Unclassified or mixed land cover types'
  }
};

export default landCoverDisplayInfo; 