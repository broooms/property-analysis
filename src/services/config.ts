/**
 * config.ts
 * Configuration values for services and APIs
 * 
 * In a production environment, these should be loaded from environment variables
 * or a secure configuration service, not hardcoded.
 */

import { GeospatialProvider } from './GeospatialService';

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// API configuration
export const apiConfig = {
  // Geospatial service configuration
  geospatial: {
    // Default provider for each environment
    provider: {
      development: GeospatialProvider.MOCK,
      test: GeospatialProvider.MOCK,
      production: GeospatialProvider.SENTINEL_HUB, // Should be replaced with actual production API
    },
    
    // API keys (in production these should come from environment variables)
    apiKeys: {
      [GeospatialProvider.SENTINEL_HUB]: process.env.REACT_APP_SENTINEL_HUB_API_KEY || '',
      [GeospatialProvider.GOOGLE_EARTH_ENGINE]: process.env.REACT_APP_GOOGLE_EARTH_ENGINE_API_KEY || '',
      [GeospatialProvider.USGS_LANDCOVER]: process.env.REACT_APP_USGS_API_KEY || '',
    },
    
    // Enable caching in all environments
    useCache: true,
  },
  
  // Map configuration
  map: {
    defaultCenter: [39.8283, -98.5795], // Center of US
    defaultZoom: 5,
    maxZoom: 18,
    minZoom: 3,
  },
};

// Get current environment configuration
export const getCurrentConfig = () => {
  const env = isDevelopment ? 'development' : isTest ? 'test' : 'production';
  
  return {
    geospatial: {
      provider: apiConfig.geospatial.provider[env],
      apiKey: apiConfig.geospatial.apiKeys[apiConfig.geospatial.provider[env]],
      useCache: apiConfig.geospatial.useCache,
    },
    map: apiConfig.map,
  };
};

export default getCurrentConfig; 