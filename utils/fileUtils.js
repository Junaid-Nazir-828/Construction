// utils/fileUtils.js

/**
 * Utility functions for file operations
 */

/**
 * Export project data as JSON file
 * @param {Object} projectData - The project data to export
 */
export const exportAsJson = (projectData) => {
    // Create a JSON string from the data
    const jsonString = JSON.stringify(projectData, null, 2);
    
    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `construction-model-${new Date().toISOString().slice(0, 10)}.json`;
    
    // Append the link to the document
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };
  
  /**
   * Export calculation results as PDF
   * @param {Object} resultsData - The calculation results
   * @param {Object} modelData - The model data
   */
  export const exportAsPdf = (resultsData, modelData) => {
    // This is a placeholder function
    // In a real app, you would use a library like jsPDF to generate a PDF
    alert('PDF export functionality would be implemented here');
  };
  
  /**
   * Save project data to local storage
   * @param {Object} projectData - The project data to save
   */
  export const saveToLocalStorage = (projectData) => {
    try {
      localStorage.setItem('constructionModelProject', JSON.stringify(projectData));
      return true;
    } catch (error) {
      console.error('Error saving to local storage:', error);
      return false;
    }
  };
  
  /**
   * Load project data from local storage
   * @returns {Object|null} The loaded project data or null if not found
   */
  export const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('constructionModelProject');
      
      if (savedData) {
        return JSON.parse(savedData);
      }
      
      return null;
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return null;
    }
  };
  
  /**
   * Import project data from JSON file
   * @param {File} file - The JSON file to import
   * @returns {Promise<Object>} Promise resolving to the imported project data
   */
  export const importFromJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const projectData = JSON.parse(event.target.result);
          resolve(projectData);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  };
  
  export default {
    exportAsJson,
    exportAsPdf,
    saveToLocalStorage,
    loadFromLocalStorage,
    importFromJson
  };