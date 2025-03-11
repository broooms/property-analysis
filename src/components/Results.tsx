import React, { useState } from 'react';
import { AnalysisResult } from './Analysis';
import { landCoverDisplayInfo, LandCoverType } from '../constants/landCover';

interface ResultsProps {
  results: AnalysisResult | null;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  if (!results) {
    return null;
  }

  // Calculate total area (to support optional properties that may not be present)
  const totalArea = Object.values(results).reduce((sum, value) => sum + value, 0);
  
  // Calculate percentages
  const getPercentage = (value: number) => {
    return ((value / totalArea) * 100).toFixed(1);
  };

  // Filter out land cover types with 0 or undefined values
  const presentLandCoverTypes = Object.entries(results)
    .filter(([_, value]) => value && value > 0)
    .sort(([_, a], [__, b]) => (b as number) - (a as number));
  
  // Get the primary land cover type (highest percentage)
  const primaryType = presentLandCoverTypes.length > 0 ? 
    presentLandCoverTypes[0][0] as LandCoverType : 
    LandCoverType.OTHER;

  // Calculate estimated acres (very rough approximation)
  // This would be replaced with actual area calculation in a real implementation
  const estimatedAcres = totalArea * 0.1; // Just a dummy conversion for the demo

  return (
    <div className="results-container">
      <h2>Land Cover Analysis Results</h2>
      
      <div className="results-summary-box">
        <div className="primary-type" style={{ backgroundColor: landCoverDisplayInfo[primaryType].color }}>
          <h3>Primary Land Cover</h3>
          <p className="primary-value">{landCoverDisplayInfo[primaryType].label}</p>
          <p className="primary-percentage">{getPercentage(results[primaryType] || 0)}%</p>
        </div>
        
        <div className="area-estimate">
          <h3>Estimated Area</h3>
          <p className="area-value">{estimatedAcres.toFixed(2)} acres</p>
          <p className="area-note">(approximate)</p>
        </div>
      </div>
      
      <div className="results-chart">
        {presentLandCoverTypes.map(([key, value]) => {
          const landCoverType = key as LandCoverType;
          const info = landCoverDisplayInfo[landCoverType];
          
          return (
            <div 
              key={key}
              className="chart-bar-container"
            >
              <div className="chart-label">
                <div 
                  className="color-indicator" 
                  style={{ backgroundColor: info.color }}
                ></div>
                <span>{info.label}: {getPercentage(value as number)}%</span>
              </div>
              <div className="chart-bar-outer">
                <div 
                  className="chart-bar"
                  style={{
                    width: `${getPercentage(value as number)}%`,
                    backgroundColor: info.color,
                  }}
                >
                  {Number(getPercentage(value as number)) > 5 && `${getPercentage(value as number)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="results-toggle">
        <button 
          className={`toggle-button ${showDetailedView ? 'active' : ''}`}
          onClick={() => setShowDetailedView(!showDetailedView)}
        >
          {showDetailedView ? 'Show Simple View' : 'Show Detailed Information'}
        </button>
      </div>
      
      {showDetailedView && (
        <div className="detailed-results">
          <h3>Land Cover Details</h3>
          
          <div className="detailed-info">
            {presentLandCoverTypes.map(([key, value]) => {
              const landCoverType = key as LandCoverType;
              const info = landCoverDisplayInfo[landCoverType];
              
              return (
                <div key={key} className="detail-item">
                  <h4>{info.label}</h4>
                  <p>{info.description}</p>
                  <div className="detail-stats">
                    <div className="stat">
                      <span className="stat-label">Percentage:</span>
                      <span className="stat-value">{getPercentage(value as number)}%</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Est. Area:</span>
                      <span className="stat-value">
                        {((value as number / totalArea) * estimatedAcres).toFixed(2)} acres
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="usage-recommendations">
            <h3>Recommendations</h3>
            <p>Based on your property's land cover distribution:</p>
            <ul>
              {results[LandCoverType.TREES] && results[LandCoverType.TREES] > 30 && (
                <li>Your property has significant tree coverage, which can provide shade and reduce cooling costs.</li>
              )}
              {results[LandCoverType.GRASS] && results[LandCoverType.GRASS] > 40 && (
                <li>Consider implementing water-efficient landscaping practices for your large grassy areas.</li>
              )}
              {results[LandCoverType.WATER] && results[LandCoverType.WATER] > 10 && (
                <li>Be aware of water management regulations that may apply to your property.</li>
              )}
              {results[LandCoverType.BUILDINGS] && results[LandCoverType.BUILDINGS] > 50 && (
                <li>Consider adding green roofs or solar panels to your buildings to improve sustainability.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      
      <div className="export-buttons">
        <button className="export-button">Export as PDF</button>
        <button className="export-button">Download Data (CSV)</button>
      </div>
    </div>
  );
};

export default Results; 