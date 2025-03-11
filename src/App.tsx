import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/Map';
import Analysis, { AnalysisResult } from './components/Analysis';
import Results from './components/Results';
import { getCurrentConfig } from './services/config';

function App() {
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][] | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isMapLayerVisible, setIsMapLayerVisible] = useState(true);

  const handlePolygonCreated = (coordinates: number[][]) => {
    setPolygonCoordinates(coordinates);
    // Reset analysis results when a new polygon is drawn
    setAnalysisResults(null);
  };

  const handleAnalysisComplete = (results: AnalysisResult) => {
    setAnalysisResults(results);
  };

  const toggleMapLayerVisibility = () => {
    setIsMapLayerVisible(!isMapLayerVisible);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Property Land Cover Analysis</h1>
        <p>Draw a property boundary on the map and analyze land cover types</p>
      </header>
      
      <main className="App-main">
        <div className="map-container">
          <MapComponent 
            onPolygonCreated={handlePolygonCreated} 
            landCoverData={isMapLayerVisible ? analysisResults : null} 
          />
        </div>
        
        <div className="sidebar">
          <Analysis 
            polygonCoordinates={polygonCoordinates} 
            onAnalysisComplete={handleAnalysisComplete} 
          />
          
          {analysisResults && (
            <>
              <Results results={analysisResults} />
              
              <div className="map-overlay-toggle">
                <button 
                  className={`overlay-toggle-button ${isMapLayerVisible ? 'active' : ''}`}
                  onClick={toggleMapLayerVisibility}
                >
                  {isMapLayerVisible ? 'Hide Map Overlay' : 'Show Map Overlay'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>
          This application uses {getCurrentConfig().geospatial.provider === 'mock' ? 
            'simulated data for demonstration purposes' : 
            'satellite imagery from real geospatial providers'}.
          <br />
          Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors.
        </p>
      </footer>
    </div>
  );
}

export default App;
