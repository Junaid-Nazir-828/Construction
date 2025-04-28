// components/ResultsPanel.js
import { useState, useEffect } from 'react';
import { 
  calculateAnchorCapacity, 
  calculateEdgeDistances,
  validateAnchorFit
} from '../utils/constructionUtils';

const ResultsPanel = ({ 
  concreteDimensions, 
  concreteProperties, 
  anchorDimensions 
}) => {
  const [results, setResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Calculate results whenever dimensions or properties change
  useEffect(() => {
    // Validate anchor fit
    const validation = validateAnchorFit(concreteDimensions, anchorDimensions);
    setValidationErrors(validation.errors);
    
    if (validation.isValid) {
      // Calculate anchor capacity
      const calculationResults = calculateAnchorCapacity(
        concreteProperties,
        concreteDimensions,
        anchorDimensions
      );
      
      setResults(calculationResults);
    } else {
      setResults(null);
    }
  }, [concreteDimensions, concreteProperties, anchorDimensions]);
  
  // If there are validation errors, show them
  if (validationErrors.length > 0) {
    return (
      <div className="results-panel validation-error">
        <h2>Validation Errors</h2>
        <div className="error-list">
          {validationErrors.map((error, index) => (
            <div key={index} className="error-item">
              <span className="error-icon">⚠️</span>
              <span className="error-message">{error}</span>
            </div>
          ))}
        </div>
        <p className="suggestion">
          Please adjust dimensions to resolve these issues before viewing results.
        </p>
        
        <style jsx>{`
          .results-panel {
            background-color: #fff8f8;
            border: 1px solid #ffcccb;
            border-radius: 0.5rem;
            padding: 1.5rem;
          }
          
          .validation-error h2 {
            color: #d32f2f;
            margin-top: 0;
          }
          
          .error-list {
            margin-bottom: 1rem;
          }
          
          .error-item {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            padding: 0.75rem;
            background-color: #ffebee;
            border-radius: 0.25rem;
          }
          
          .error-icon {
            margin-right: 0.75rem;
            font-size: 1.25rem;
          }
          
          .error-message {
            font-size: 0.875rem;
            color: #d32f2f;
          }
          
          .suggestion {
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 0;
          }
        `}</style>
      </div>
    );
  }
  
  // If calculations have not been performed yet, show loading
  if (!results) {
    return (
      <div className="results-panel loading">
        <h2>Calculating Results...</h2>
        <p>Please wait while we process the calculations.</p>
        
        <style jsx>{`
          .results-panel {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1.5rem;
          }
          
          .loading h2 {
            color: #3b82f6;
            margin-top: 0;
          }
        `}</style>
      </div>
    );
  }
  
  // Display the calculation results
  return (
    <div className="results-panel">
      <h2>Calculation Results</h2>
      
      <div className="result-section">
        <h3>Anchor Capacity</h3>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">Tension Capacity:</span>
            <span className="result-value">{results.tensionCapacity} kN</span>
          </div>
          <div className="result-item">
            <span className="result-label">Shear Capacity:</span>
            <span className="result-value">{results.shearCapacity} kN</span>
          </div>
        </div>
      </div>
      
      <div className="result-section">
        <h3>Edge Distances</h3>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">c₁,₁ (Left):</span>
            <span className="result-value">{Math.round(results.edgeDistances.c1_1)} mm</span>
          </div>
          <div className="result-item">
            <span className="result-label">c₁,₂ (Right):</span>
            <span className="result-value">{Math.round(results.edgeDistances.c1_2)} mm</span>
          </div>
          <div className="result-item">
            <span className="result-label">c₂,₁ (Front):</span>
            <span className="result-value">{Math.round(results.edgeDistances.c2_1)} mm</span>
          </div>
          <div className="result-item">
            <span className="result-label">c₂,₂ (Back):</span>
            <span className="result-value">{Math.round(results.edgeDistances.c2_2)} mm</span>
          </div>
        </div>
        <div className="edge-indicator">
          <span className="indicator-label">Edge Anchor:</span>
          <span className={`indicator-value ${results.isEdgeAnchor ? 'yes' : 'no'}`}>
            {results.isEdgeAnchor ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
      
      <div className="result-section">
        <h3>Concrete Strength</h3>
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">Cylindrical:</span>
            <span className="result-value">{results.strengthValues.cylindricalStrength} MPa</span>
          </div>
          <div className="result-item">
            <span className="result-label">Cubic:</span>
            <span className="result-value">{results.strengthValues.cubicStrength} MPa</span>
          </div>
          <div className="result-item">
            <span className="result-label">Tensile:</span>
            <span className="result-value">{results.strengthValues.tensileStrength.toFixed(2)} MPa</span>
          </div>
        </div>
      </div>
      
      <div className="disclaimer">
        <p>
          Note: These calculations are simplified estimates for demonstration purposes.
          Actual structural engineering calculations should be performed by qualified
          professionals using appropriate standards and codes.
        </p>
      </div>
      
      <style jsx>{`
        .results-panel {
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
        }
        
        h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1f2937;
          font-size: 1.25rem;
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #4b5563;
          font-size: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .result-section {
          margin-bottom: 1.5rem;
        }
        
        .result-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .result-item {
          display: flex;
          flex-direction: column;
          background-color: #fff;
          padding: 0.75rem;
          border-radius: 0.25rem;
          border: 1px solid #e5e7eb;
        }
        
        .result-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.25rem;
        }
        
        .result-value {
          font-weight: 600;
          color: #1f2937;
        }
        
        .edge-indicator {
          display: flex;
          align-items: center;
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #e5e7eb;
        }
        
        .indicator-label {
          font-size: 0.875rem;
          color: #6b7280;
          margin-right: 0.5rem;
        }
        
        .indicator-value {
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }
        
        .indicator-value.yes {
          background-color: #fef3c7;
          color: #92400e;
        }
        
        .indicator-value.no {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .disclaimer {
          margin-top: 1.5rem;
          padding: 0.75rem;
          background-color: #eff6ff;
          border-radius: 0.25rem;
          border-left: 4px solid #3b82f6;
        }
        
        .disclaimer p {
          margin: 0;
          font-size: 0.75rem;
          color: #4b5563;
          line-height: 1.4;
        }`}
      </style>
    </div>
  );
};

export default ResultsPanel;