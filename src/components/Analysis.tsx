import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

interface AnalysisProps {
  polygonCoordinates: number[][] | null;
  onAnalysisComplete?: (results: AnalysisResult) => void;
}

export interface AnalysisResult {
  trees: number;
  grass: number;
  water: number;
  buildings: number;
  other: number;
}

const Analysis: React.FC<AnalysisProps> = ({ polygonCoordinates, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate polygon area (approximate)
  const calculatePolygonArea = (coords: number[][]): number => {
    if (!coords || coords.length < 3) return 0;
    
    // Simple approximation for small areas
    // In a real implementation, we would use proper geospatial calculations
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i][0] * coords[j][1];
      area -= coords[j][0] * coords[i][1];
    }
    
    return Math.abs(area / 2);
  };

  const performAnalysis = async () => {
    if (!polygonCoordinates || polygonCoordinates.length === 0) {
      setError('No polygon selected. Please draw a property boundary on the map.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // In a real implementation, we would:
      // 1. Capture the satellite imagery within the polygon
      // 2. Process it using TensorFlow.js
      // 3. Classify the land cover types
      
      // For this prototype, we'll simulate the analysis with semi-random data
      // based on the polygon size and shape
      await tf.ready();
      
      // Simulate processing time (would be longer for larger areas)
      const area = calculatePolygonArea(polygonCoordinates);
      const processingTime = Math.min(3000, 1000 + area * 100);
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate somewhat realistic distribution for San Francisco area (urban with some green space)
      // We adjust the random ranges based on the polygon size to simulate more realistic results
      const isLargeArea = area > 0.001; // Arbitrary threshold
      
      const results: AnalysisResult = {
        // Large areas tend to have more trees, smaller urban plots have fewer
        trees: Math.round(Math.random() * (isLargeArea ? 40 : 20)),
        
        // More grass in larger areas
        grass: Math.round(Math.random() * (isLargeArea ? 30 : 15)),
        
        // Only significant water if larger area (might include coastline)
        water: Math.round(Math.random() * (isLargeArea ? 15 : 5)),
        
        // More buildings in smaller urban areas
        buildings: Math.round(Math.random() * (isLargeArea ? 20 : 60)),
        
        other: 0
      };
      
      // Ensure the total adds up to 100%
      const totalArea = 100; // Percentages should sum to 100
      const sum = results.trees + results.grass + results.water + results.buildings;
      results.other = Math.max(0, totalArea - sum);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    } catch (err) {
      setError(`Analysis failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="analysis-container">
      <button 
        onClick={performAnalysis} 
        disabled={isAnalyzing || !polygonCoordinates}
        className="analyze-button"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Property'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="analysis-info">
        <p>Select a property boundary on the map and click "Analyze Property" to identify land cover types.</p>
      </div>
    </div>
  );
};

export default Analysis; 