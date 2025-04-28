// config/appConfig.js

/**
 * Application configuration constants and settings
 */

// Concrete quality options
export const CONCRETE_QUALITY_OPTIONS = [
    { value: 'C20/25', label: 'C20/25' },
    { value: 'C25/30', label: 'C25/30' },
    { value: 'C30/37', label: 'C30/37' },
    { value: 'C35/45', label: 'C35/45' },
    { value: 'C40/50', label: 'C40/50' },
    { value: 'C45/55', label: 'C45/55' },
    { value: 'C50/60', label: 'C50/60' }
  ];
  
  // Base material options
  export const BASE_MATERIAL_OPTIONS = [
    { value: 'Cracked', label: 'Cracked' },
    { value: 'Non-cracked', label: 'Non-cracked' }
  ];
  
  // Dimension constraints for concrete
  export const CONCRETE_DIMENSION_CONSTRAINTS = {
    width: { min: 100, max: 2000, default: 500 },
    height: { min: 100, max: 2000, default: 500 },
    depth: { min: 100, max: 2000, default: 500 },
    thickness: { min: 100, max: 1000, default: 300 }
  };
  
  // Dimension constraints for anchor
  export const ANCHOR_DIMENSION_CONSTRAINTS = {
    width: { min: 20, max: 200, default: 50 },
    height: { min: 40, max: 300, default: 80 },
    depth: { min: 20, max: 200, default: 50 },
    embedDepth: { min: 20, max: 280, default: 70 }
  };
  
  // Concrete covering constraints
  export const CONCRETE_COVERING_CONSTRAINTS = {
    min: 10,
    max: 100,
    default: 25
  };
  
  // Tab configuration
  export const TABS = [
    { id: 'concrete', label: 'Concrete' },
    { id: 'anchor', label: 'Anchor' },
    { id: 'reinforcement', label: 'Reinforcement' },
    { id: 'load', label: 'Load' },
    { id: 'result', label: 'Result' }
  ];
  
  // Color configuration
  export const COLORS = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    text: {
      primary: '#1f2937',
      secondary: '#4b5563',
      light: '#9ca3af'
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      hover: '#f3f4f6'
    },
    border: '#e5e7eb'
  };
  
  // API endpoints (for future implementation)
  export const API_ENDPOINTS = {
    saveProject: '/api/projects/save',
    loadProject: '/api/projects/load',
    exportResults: '/api/projects/export'
  };
  
  // Default app settings
  export const DEFAULT_SETTINGS = {
    units: 'mm', // Default unit of measurement
    autoSave: true, // Whether to enable autosave
    autosaveInterval: 5 * 60 * 1000, // Autosave every 5 minutes
    showDimensions: true, // Show dimension lines
    showGrid: true, // Show grid
    showAxes: true, // Show axes
    modelQuality: 'medium' // Model rendering quality
  };
  
  export default {
    CONCRETE_QUALITY_OPTIONS,
    BASE_MATERIAL_OPTIONS,
    CONCRETE_DIMENSION_CONSTRAINTS,
    ANCHOR_DIMENSION_CONSTRAINTS,
    CONCRETE_COVERING_CONSTRAINTS,
    TABS,
    COLORS,
    API_ENDPOINTS,
    DEFAULT_SETTINGS
  };