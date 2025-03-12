import React, { useState, useEffect } from 'react';
import geospatialService, { GeospatialProvider } from '../services/GeospatialService';
import { LandCoverType } from '../constants/landCover';

interface AnalysisProps {
  polygonCoordinates: number[][] | null;
  onAnalysisComplete?: (results: AnalysisResult) => void;
}

export interface AnalysisResult {
  [LandCoverType.TREES]: number;
  [LandCoverType.GRASS]: number;
  [LandCoverType.WATER]: number;
  [LandCoverType.BUILDINGS]: number;
  [LandCoverType.OTHER]: number;
  // Optional extended types that may be present depending on the analysis provider
  [LandCoverType.CROPS]?: number;
  [LandCoverType.BARREN]?: number;
  [LandCoverType.SHRUBLAND]?: number;
  [LandCoverType.WETLANDS]?: number;
  [LandCoverType.SNOW_ICE]?: number;
}

const Analysis: React.FC<AnalysisProps> = ({ polygonCoordinates, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<GeospatialProvider>(GeospatialProvider.MOCK);
  
  useEffect(() => {
    console.log('Analysis component - polygonCoordinates:', polygonCoordinates);
    console.log('Button should be enabled:', !isAnalyzing && !!polygonCoordinates);
  }, [polygonCoordinates, isAnalyzing]);

  const performAnalysis = async () => {
    if (!polygonCoordinates || polygonCoordinates.length === 0) {
      setError('No polygon selected. Please draw a property boundary on the map.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Set the selected provider before analysis
      geospatialService.setProvider(selectedProvider);
      
      // Perform the land cover analysis using our service
      const results = await geospatialService.analyzeLandCover(polygonCoordinates);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(e.target.value as GeospatialProvider);
  };

  return (
    <div className="analysis-container">
      <div className="analysis-options">
        <label htmlFor="provider-select">Data Source:</label>
        <select 
          id="provider-select" 
          value={selectedProvider} 
          onChange={handleProviderChange}
          disabled={isAnalyzing}
        >
          <option value={GeospatialProvider.MOCK}>Simulated Data (Demo)</option>
          <option value={GeospatialProvider.SENTINEL_HUB}>Sentinel Hub</option>
          <option value={GeospatialProvider.GOOGLE_EARTH_ENGINE}>Google Earth Engine</option>
          <option value={GeospatialProvider.USGS_LANDCOVER}>USGS Land Cover</option>
        </select>
      </div>
      
      <button 
        onClick={performAnalysis} 
        disabled={isAnalyzing || !polygonCoordinates}
        className={`analyze-button ${isAnalyzing ? 'analyzing' : ''}`}
      >
        {isAnalyzing ? (
          <>
            <span className="spinner"></span>
            Analyzing...
          </>
        ) : (
          'Analyze Property'
        )}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="analysis-info">
        <p>Select a property boundary on the map and click "Analyze Property" to identify land cover types.</p>
        <p className="provider-note">
          {selectedProvider === GeospatialProvider.MOCK ? (
            <span className="note">Note: Using simulated data for demonstration purposes.</span>
          ) : (
            <span className="note">Using satellite imagery to analyze actual land cover.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default Analysis; 