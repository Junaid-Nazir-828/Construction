// context/AppContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  CONCRETE_DIMENSION_CONSTRAINTS, 
  ANCHOR_DIMENSION_CONSTRAINTS, 
  DEFAULT_SETTINGS 
} from '../config/appConfig';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/fileUtils';

// Create context
const AppContext = createContext();

// Hook to use the app context
export const useAppContext = () => {
  return useContext(AppContext);
};

// Context provider component
export const AppProvider = ({ children }) => {
  // State for concrete dimensions
  const [concreteDimensions, setConcreteDimensions] = useState({
    width: CONCRETE_DIMENSION_CONSTRAINTS.width.default,
    height: CONCRETE_DIMENSION_CONSTRAINTS.height.default, 
    depth: CONCRETE_DIMENSION_CONSTRAINTS.depth.default,
    thickness: CONCRETE_DIMENSION_CONSTRAINTS.thickness.default
  });
  
  // State for concrete properties
  const [concreteProperties, setConcreteProperties] = useState({
    quality: 'C20/25',
    covering: 25,
    baseMaterial: 'Cracked'
  });
  
  // State for anchor dimensions
  const [anchorDimensions, setAnchorDimensions] = useState({
    width: ANCHOR_DIMENSION_CONSTRAINTS.width.default,
    height: ANCHOR_DIMENSION_CONSTRAINTS.height.default,
    depth: ANCHOR_DIMENSION_CONSTRAINTS.depth.default,
    embedDepth: ANCHOR_DIMENSION_CONSTRAINTS.embedDepth.default
  });
  
  // State for app settings
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('concrete');
  
  // State for tracking unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Load saved state from local storage on component mount
  useEffect(() => {
    if (settings.autoSave) {
      const savedData = loadFromLocalStorage();
      
      if (savedData) {
        if (savedData.concreteDimensions) {
          setConcreteDimensions(savedData.concreteDimensions);
        }
        
        if (savedData.concreteProperties) {
          setConcreteProperties(savedData.concreteProperties);
        }
        
        if (savedData.anchorDimensions) {
          setAnchorDimensions(savedData.anchorDimensions);
        }
        
        if (savedData.settings) {
          // Only load relevant settings (not UI state)
          const { showSettings, ...relevantSettings } = savedData.settings;
          setSettings(prev => ({
            ...prev,
            ...relevantSettings
          }));
        }
      }
    }
  }, []);
  
  // Auto-save state to local storage when it changes
  useEffect(() => {
    if (settings.autoSave) {
      const saveTimeout = setTimeout(() => {
        const projectData = {
          concreteDimensions,
          concreteProperties,
          anchorDimensions,
          settings: {
            ...settings,
            showSettings: false // Don't save UI state
          },
          timestamp: new Date().toISOString()
        };
        
        saveToLocalStorage(projectData);
        setHasUnsavedChanges(false);
      }, 2000); // Debounce save to avoid excessive storage operations
      
      return () => clearTimeout(saveTimeout);
    }
  }, [concreteDimensions, concreteProperties, anchorDimensions, settings]);
  
  // Mark as having unsaved changes when state changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [concreteDimensions, concreteProperties, anchorDimensions]);
  
  // Function to handle dimension changes with validation
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
  
  // Function to reset to default values
  const handleReset = () => {
    setConcreteDimensions({
      width: CONCRETE_DIMENSION_CONSTRAINTS.width.default,
      height: CONCRETE_DIMENSION_CONSTRAINTS.height.default, 
      depth: CONCRETE_DIMENSION_CONSTRAINTS.depth.default,
      thickness: CONCRETE_DIMENSION_CONSTRAINTS.thickness.default
    });
    
    setConcreteProperties({
      quality: 'C20/25',
      covering: 25,
      baseMaterial: 'Cracked'
    });
    
    setAnchorDimensions({
      width: ANCHOR_DIMENSION_CONSTRAINTS.width.default,
      height: ANCHOR_DIMENSION_CONSTRAINTS.height.default,
      depth: ANCHOR_DIMENSION_CONSTRAINTS.depth.default,
      embedDepth: ANCHOR_DIMENSION_CONSTRAINTS.embedDepth.default
    });
    
    setSettings(DEFAULT_SETTINGS);
  };
  
  // Get the current project data for export/save
  const getProjectData = () => {
    return {
      concreteDimensions,
      concreteProperties,
      anchorDimensions,
      settings: {
        ...settings,
        showSettings: false // Don't save UI state
      },
      timestamp: new Date().toISOString()
    };
  };
  
  // Import project data
  const importProjectData = (importedData) => {
    if (importedData.concreteDimensions) {
      setConcreteDimensions(importedData.concreteDimensions);
    }
    
    if (importedData.concreteProperties) {
      setConcreteProperties(importedData.concreteProperties);
    }
    
    if (importedData.anchorDimensions) {
      setAnchorDimensions(importedData.anchorDimensions);
    }
    
    if (importedData.settings) {
      // Only import relevant settings
      const { showSettings, ...relevantSettings } = importedData.settings;
      setSettings(prev => ({
        ...prev,
        ...relevantSettings
      }));
    }
    
    setHasUnsavedChanges(false);
  };
  
  // Toggle a boolean setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Value object to be provided by the context
  const contextValue = {
    // State
    concreteDimensions,
    concreteProperties,
    anchorDimensions,
    settings,
    activeTab,
    hasUnsavedChanges,
    
    // Setters
    setConcreteDimensions,
    setConcreteProperties,
    setAnchorDimensions,
    setSettings,
    setActiveTab,
    
    // Actions
    handleDimensionChange,
    handleReset,
    getProjectData,
    importProjectData,
    toggleSetting
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;