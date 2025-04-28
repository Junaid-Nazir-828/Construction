// components/Toolbar.js
import { useState, useRef } from 'react';
import {
  exportAsJson,
  exportAsPdf,
  saveToLocalStorage,
  loadFromLocalStorage,
  importFromJson
} from '../utils/fileUtils';

const Toolbar = ({ 
  projectData, 
  onDataImport,
  onReset
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);
  
  // Function to handle file export
  const handleExport = (format) => {
    if (format === 'json') {
      exportAsJson(projectData);
    } else if (format === 'pdf') {
      exportAsPdf(projectData.results, projectData);
    }
    
    // Close dropdown
    setShowDropdown(false);
    
    // Show notification
    showNotification(`Project exported as ${format.toUpperCase()}`);
  };
  
  // Function to handle file import
  const handleImport = () => {
    // Trigger file input click
    fileInputRef.current.click();
    
    // Close dropdown
    setShowDropdown(false);
  };
  
  // Function to handle file input change
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    
    if (file) {
      try {
        // Import data from the file
        const importedData = await importFromJson(file);
        
        // Call the onDataImport callback
        onDataImport(importedData);
        
        // Show notification
        showNotification('Project imported successfully');
      } catch (error) {
        // Show error notification
        showNotification(`Import error: ${error.message}`, 'error');
      }
      
      // Reset file input value
      event.target.value = null;
    }
  };
  
  // Function to handle save to local storage
  const handleSave = () => {
    // Save to local storage
    const success = saveToLocalStorage(projectData);
    
    // Close dropdown
    setShowDropdown(false);
    
    // Show notification
    if (success) {
      showNotification('Project saved to browser storage');
    } else {
      showNotification('Failed to save project', 'error');
    }
  };
  
  // Function to handle load from local storage
  const handleLoad = () => {
    // Load from local storage
    const loadedData = loadFromLocalStorage();
    
    // Close dropdown
    setShowDropdown(false);
    
    if (loadedData) {
      // Call the onDataImport callback
      onDataImport(loadedData);
      
      // Show notification
      showNotification('Project loaded from browser storage');
    } else {
      // Show error notification
      showNotification('No saved project found', 'error');
    }
  };
  
  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button 
          className="toolbar-button primary"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          File
        </button>
        
        {showDropdown && (
          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={handleSave}
            >
              Save Project
            </button>
            <button 
              className="dropdown-item"
              onClick={handleLoad}
            >
              Load Project
            </button>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item"
              onClick={handleImport}
            >
              Import...
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleExport('json')}
            >
              Export as JSON
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleExport('pdf')}
            >
              Export as PDF
            </button>
            <div className="dropdown-divider"></div>
            <button 
              className="dropdown-item danger"
              onClick={() => {
                onReset();
                setShowDropdown(false);
                showNotification('Project reset to defaults');
              }}
            >
              Reset Project
            </button>
          </div>
        )}
        
        {/* Hidden file input for import */}
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
      
      <div className="toolbar-center">
        <div className="project-title">
          Construction Model Project
        </div>
      </div>
      
      <div className="toolbar-right">
        <button className="toolbar-button">Help</button>
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
        </div>
      )}
      
      <style jsx>{`
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 0.5rem 1rem;
          position: relative;
        }
        
        .toolbar-left,
        .toolbar-right {
          display: flex;
          align-items: center;
        }
        
        .toolbar-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .project-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
        }
        
        .toolbar-button {
          padding: 0.375rem 0.75rem;
          background-color: transparent;
          border: 1px solid transparent;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .toolbar-button:hover {
          background-color: #f3f4f6;
        }
        
        .toolbar-button.primary {
          background-color: #eff6ff;
          border-color: #dbeafe;
          color: #2563eb;
        }
        
        .toolbar-button.primary:hover {
          background-color: #dbeafe;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 1rem;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.25rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 12rem;
          margin-top: 0.25rem;
          overflow: hidden;
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          background: none;
          border: none;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .dropdown-item:hover {
          background-color: #f9fafb;
        }
        
        .dropdown-item.danger {
          color: #b91c1c;
        }
        
        .dropdown-item.danger:hover {
          background-color: #fee2e2;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e5e7eb;
          margin: 0.25rem 0;
        }
        
        .notification {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 50;
          animation: slideUp 0.3s ease-out;
        }
        
        .notification.success {
          background-color: #ecfdf5;
          border-left: 4px solid #10b981;
        }
        
        .notification.error {
          background-color: #fef2f2;
          border-left: 4px solid #ef4444;
        }
        
        .notification-message {
          font-size: 0.875rem;
          color: #1f2937;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 1rem);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @media (max-width: 768px) {
          .toolbar-center {
            display: none;
          }
          
          .toolbar {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Toolbar;