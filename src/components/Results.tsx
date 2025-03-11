import React from 'react';
import { AnalysisResult } from './Analysis';

interface ResultsProps {
  results: AnalysisResult | null;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  if (!results) {
    return null;
  }

  const totalArea = Object.values(results).reduce((sum, value) => sum + value, 0);
  
  // Calculate percentages
  const getPercentage = (value: number) => {
    return ((value / totalArea) * 100).toFixed(1);
  };

  // Define colors for each land cover type
  const colorMap = {
    trees: '#2E7D32', // Dark green
    grass: '#8BC34A', // Light green
    water: '#1976D2', // Blue
    buildings: '#757575', // Gray
    other: '#BDBDBD', // Light gray
  };

  return (
    <div className="results-container">
      <h2>Land Cover Analysis Results</h2>
      
      <div className="results-chart">
        {Object.entries(results).map(([key, value]) => (
          <div 
            key={key}
            className="chart-bar"
            style={{
              width: `${getPercentage(value)}%`,
              backgroundColor: colorMap[key as keyof typeof colorMap],
            }}
          >
            {getPercentage(value)}%
          </div>
        ))}
      </div>
      
      <div className="results-legend">
        {Object.entries(results).map(([key, value]) => (
          <div key={key} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: colorMap[key as keyof typeof colorMap] }}
            ></div>
            <div className="legend-label">
              {key.charAt(0).toUpperCase() + key.slice(1)}: {getPercentage(value)}%
            </div>
          </div>
        ))}
      </div>
      
      <div className="results-summary">
        <p>
          This property contains approximately {results.trees}% tree cover, 
          {results.grass}% grass, {results.water}% water, and {results.buildings}% buildings.
        </p>
      </div>
    </div>
  );
};

export default Results; 