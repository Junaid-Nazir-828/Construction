// components/ModelControls.js
import { useState } from 'react';
import {
  CONCRETE_QUALITY_OPTIONS,
  BASE_MATERIAL_OPTIONS,
  CONCRETE_DIMENSION_CONSTRAINTS,
  ANCHOR_DIMENSION_CONSTRAINTS,
  CONCRETE_COVERING_CONSTRAINTS,
  TABS
} from '../config/appConfig';

const ModelControls = ({
  activeTab,
  setActiveTab,
  concreteDimensions,
  setConcreteDimensions,
  concreteProperties,
  setConcreteProperties,
  anchorDimensions,
  setAnchorDimensions,
  onReset
}) => {
  // Function to handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Function to handle dimension changes
  const handleDimensionChange = (category, dimension, value) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) return;
    
    if (category === 'concrete') {
      const constraints = CONCRETE_DIMENSION_CONSTRAINTS[dimension];
      const clampedValue = Math.min(Math.max(parsedValue, constraints.min), constraints.max);
      
      setConcreteDimensions(prev => ({
        ...prev,
        [dimension]: clampedValue
      }));
      
      // If this is the thickness, we need to check anchor embedment depth
      if (dimension === 'thickness' && anchorDimensions.embedDepth > clampedValue - 20) {
        setAnchorDimensions(prev => ({
          ...prev,
          embedDepth: clampedValue - 20
        }));
      }
    } else if (category === 'anchor') {
      const constraints = ANCHOR_DIMENSION_CONSTRAINTS[dimension];
      let clampedValue = Math.min(Math.max(parsedValue, constraints.min), constraints.max);
      
      // Additional validation for embedDepth not exceeding concrete thickness
      if (dimension === 'embedDepth') {
        const maxEmbedDepth = concreteDimensions.thickness - 20;
        clampedValue = Math.min(clampedValue, maxEmbedDepth);
      }
      
      setAnchorDimensions(prev => ({
        ...prev,
        [dimension]: clampedValue
      }));
    }
  };

  // Function to handle property changes
  const handlePropertyChange = (property, value) => {
    // For covering, apply constraints
    if (property === 'covering') {
      const parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) return;
      
      const constraints = CONCRETE_COVERING_CONSTRAINTS;
      const clampedValue = Math.min(Math.max(parsedValue, constraints.min), constraints.max);
      
      setConcreteProperties(prev => ({
        ...prev,
        [property]: clampedValue
      }));
    } else {
      // For other properties like quality and baseMaterial
      setConcreteProperties(prev => ({
        ...prev,
        [property]: value
      }));
    }
  };

  return (
    <div className="model-controls">
      <div className="tab-container">
        <div className="tabs">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 'concrete' && (
            <div className="controls-container">
              <div className="control-panel">
                <h2>Concrete Properties</h2>
                <div className="control-group">
                  <label>
                    Concrete Quality:
                    <select 
                      value={concreteProperties.quality}
                      onChange={(e) => handlePropertyChange('quality', e.target.value)}
                    >
                      {CONCRETE_QUALITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Thickness of the concrete (mm):
                    <input 
                      type="number" 
                      value={concreteDimensions.thickness}
                      onChange={(e) => handleDimensionChange('concrete', 'thickness', e.target.value)}
                      min={CONCRETE_DIMENSION_CONSTRAINTS.thickness.min}
                      max={CONCRETE_DIMENSION_CONSTRAINTS.thickness.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Concrete covering (mm):
                    <input 
                      type="number" 
                      value={concreteProperties.covering}
                      onChange={(e) => handlePropertyChange('covering', e.target.value)}
                      min={CONCRETE_COVERING_CONSTRAINTS.min}
                      max={CONCRETE_COVERING_CONSTRAINTS.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Base material:
                    <select 
                      value={concreteProperties.baseMaterial}
                      onChange={(e) => handlePropertyChange('baseMaterial', e.target.value)}
                    >
                      {BASE_MATERIAL_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              
              <div className="control-panel">
                <h2>Concrete Dimensions</h2>
                <div className="control-group">
                  <label>
                    Width (mm):
                    <input 
                      type="number" 
                      value={concreteDimensions.width}
                      onChange={(e) => handleDimensionChange('concrete', 'width', e.target.value)}
                      min={CONCRETE_DIMENSION_CONSTRAINTS.width.min}
                      max={CONCRETE_DIMENSION_CONSTRAINTS.width.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Height (mm):
                    <input 
                      type="number" 
                      value={concreteDimensions.height}
                      onChange={(e) => handleDimensionChange('concrete', 'height', e.target.value)}
                      min={CONCRETE_DIMENSION_CONSTRAINTS.height.min}
                      max={CONCRETE_DIMENSION_CONSTRAINTS.height.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Depth (mm):
                    <input 
                      type="number" 
                      value={concreteDimensions.depth}
                      onChange={(e) => handleDimensionChange('concrete', 'depth', e.target.value)}
                      min={CONCRETE_DIMENSION_CONSTRAINTS.depth.min}
                      max={CONCRETE_DIMENSION_CONSTRAINTS.depth.max}
                    />
                  </label>
                </div>
              </div>
              
              <div className="control-panel">
                <h2>Edges</h2>
                <div className="edge-controls">
                  <div className="edge-grid">
                    <div className="edge-cell">c1,1: {concreteDimensions.width/2} mm</div>
                    <div className="edge-cell">c1,2: {concreteDimensions.width/2} mm</div>
                    <div className="edge-cell">c2,1: {concreteDimensions.depth/2} mm</div>
                    <div className="edge-cell">c2,2: {concreteDimensions.depth/2} mm</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'anchor' && (
            <div className="controls-container">
              <div className="control-panel">
                <h2>Anchor Properties</h2>
                <div className="control-group">
                  <label>
                    Width (mm):
                    <input 
                      type="number" 
                      value={anchorDimensions.width}
                      onChange={(e) => handleDimensionChange('anchor', 'width', e.target.value)}
                      min={ANCHOR_DIMENSION_CONSTRAINTS.width.min}
                      max={ANCHOR_DIMENSION_CONSTRAINTS.width.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Height (mm):
                    <input 
                      type="number" 
                      value={anchorDimensions.height}
                      onChange={(e) => handleDimensionChange('anchor', 'height', e.target.value)}
                      min={ANCHOR_DIMENSION_CONSTRAINTS.height.min}
                      max={ANCHOR_DIMENSION_CONSTRAINTS.height.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Depth (mm):
                    <input 
                      type="number" 
                      value={anchorDimensions.depth}
                      onChange={(e) => handleDimensionChange('anchor', 'depth', e.target.value)}
                      min={ANCHOR_DIMENSION_CONSTRAINTS.depth.min}
                      max={ANCHOR_DIMENSION_CONSTRAINTS.depth.max}
                    />
                  </label>
                </div>
                <div className="control-group">
                  <label>
                    Embed Depth (mm):
                    <input 
                      type="number" 
                      value={anchorDimensions.embedDepth}
                      onChange={(e) => handleDimensionChange('anchor', 'embedDepth', e.target.value)}
                      min={ANCHOR_DIMENSION_CONSTRAINTS.embedDepth.min}
                      max={concreteDimensions.thickness - 20}
                    />
                    <span className="input-help">
                      Max: {concreteDimensions.thickness - 20} mm
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reinforcement' && (
            <div className="controls-container">
              <div className="control-panel">
                <h2>Reinforcement</h2>
                <p>Reinforcement options will be available in a future update.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'load' && (
            <div className="controls-container">
              <div className="control-panel">
                <h2>Load Parameters</h2>
                <p>Load parameter options will be available in a future update.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'result' && (
            <div className="controls-container">
              <div className="control-panel" style={{ flex: 1 }}>
                {/* Results component will be imported and rendered here */}
                <h2>Calculation Results</h2>
                <p>Results will be calculated based on your inputs.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .model-controls {
          width: 100%;
        }
        
        .tab-container {
          width: 100%;
        }
        
        .tabs {
          display: flex;
          gap: 0.25rem;
          border-bottom: 1px solid #ddd;
          margin-bottom: 1rem;
        }
        
        .tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #666;
          transition: all 0.2s;
        }
        
        .tab:hover {
          color: #333;
        }
        
        .tab.active {
          color: #2563eb;
          border-bottom-color: #2563eb;
        }
        
        .controls-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .control-panel {
          flex: 1;
          min-width: 250px;
          background-color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border: 1px solid #eee;
        }
        
        .control-panel h2 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #4b5563;
        }
        
        .control-group {
          margin-bottom: 1rem;
        }
        
        .control-group label {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #4b5563;
        }
        
        .control-group input, .control-group select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          width: 100%;
        }
        
        .control-group input:focus, .control-group select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        
        .input-help {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }
        
        .edge-controls {
          padding: 0.5rem;
        }
        
        .edge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 0.5rem;
          text-align: center;
        }
        
        .edge-cell {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 0.25rem;
          background-color: #f0f0f0;
          font-size: 0.875rem;
        }
        
        @media (max-width: 768px) {
          .controls-container {
            flex-direction: column;
          }
          
          .control-panel {
            min-width: 100%;
          }
          
          .tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          
          .tab {
            padding: 0.5rem 1rem;
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default ModelControls;