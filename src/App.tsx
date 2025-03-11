import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/Map';
import Analysis, { AnalysisResult } from './components/Analysis';
import Results from './components/Results';

function App() {
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][] | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const handlePolygonCreated = (coordinates: number[][]) => {
    setPolygonCoordinates(coordinates);
    // Reset analysis results when a new polygon is drawn
    setAnalysisResults(null);
  };

  const handleAnalysisComplete = (results: AnalysisResult) => {
    setAnalysisResults(results);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Property Land Cover Analysis</h1>
        <p>Draw a property boundary on the map and analyze land cover types</p>
      </header>
      
      <main className="App-main">
        <div className="map-container">
          <MapComponent onPolygonCreated={handlePolygonCreated} />
        </div>
        
        <div className="sidebar">
          <Analysis 
            polygonCoordinates={polygonCoordinates} 
            onAnalysisComplete={handleAnalysisComplete} 
          />
          
          {analysisResults && <Results results={analysisResults} />}
        </div>
      </main>
      
      <footer className="App-footer">
        <p>
          This is a prototype application using open-source tools. 
          Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors.
        </p>
      </footer>
    </div>
  );
}

export default App;
