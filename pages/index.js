// pages/index.js
"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
// import dynamic from 'next/dynamic';
import { DEFAULT_SETTINGS } from '../config/appConfig';

// Import components
import ModelControls from '../components/ModelControls';
import Toolbar from '../components/Toolbar';

// Import the 3D viewer component dynamically to avoid SSR issues
import ModelViewer from '../components/ModelViewer';
import ResultsPanel from '../components/ResultsPanel';
// const ModelViewer = dynamic(() => import('../components/ModelViewer'), { ssr: false });
// const ResultsPanel = dynamic(() => import('../components/ResultsPanel'), { ssr: false });

export default function Home() {
  // State for concrete dimensions
  const [concreteDimensions, setConcreteDimensions] = useState({
    width: 500,
    height: 500,
    depth: 500,
    thickness: 300,
  });

  // State for concrete properties
  const [concreteProperties, setConcreteProperties] = useState({
    quality: 'C20/25',
    covering: 25,
    baseMaterial: 'Cracked',
  });

  // State for anchor dimensions
  const [anchorDimensions, setAnchorDimensions] = useState({
    width: 50,
    height: 80,
    depth: 50,
    embedDepth: 70,
  });

  // State to track active tab
  const [activeTab, setActiveTab] = useState('concrete');

  // State for app settings
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Toggle settings
  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Function to reset to default values
  const handleReset = () => {
    setConcreteDimensions({
      width: 500,
      height: 500,
      depth: 500,
      thickness: 300,
    });

    setConcreteProperties({
      quality: 'C20/25',
      covering: 25,
      baseMaterial: 'Cracked',
    });

    setAnchorDimensions({
      width: 50,
      height: 80,
      depth: 50,
      embedDepth: 70,
    });
  };

  // Placeholder for undefined functions (implement these as needed)
  const getProjectData = () => {
    // TODO: Implement project data retrieval
    return {};
  };

  const handleDataImport = (data) => {
    // TODO: Implement data import logic
    console.log('Data imported:', data);
  };

  return (
    <div className="container">
      <Head>
        <title>Construction Model Viewer</title>
        <meta name="description" content="Interactive construction model viewer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <Toolbar
          projectData={getProjectData()}
          onDataImport={handleDataImport}
          onReset={handleReset}
        />

        <div className="content-layout">
          <div className="controls-layout">
            <ModelControls
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              concreteDimensions={concreteDimensions}
              setConcreteDimensions={setConcreteDimensions}
              concreteProperties={concreteProperties}
              setConcreteProperties={setConcreteProperties}
              anchorDimensions={anchorDimensions}
              setAnchorDimensions={setAnchorDimensions}
              onReset={handleReset}
            />

            {activeTab === 'result' && (
              <div className="results-container">
                <ResultsPanel
                  concreteDimensions={concreteDimensions}
                  concreteProperties={concreteProperties}
                  anchorDimensions={anchorDimensions}
                />
              </div>
            )}
          </div>

          <div className="viewer-container">
            <ModelViewer
              concreteDimensions={concreteDimensions}
              concreteProperties={concreteProperties}
              anchorDimensions={anchorDimensions}
              settings={settings}
            />
          </div>
        </div>

        {settings.showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h2>Viewer Settings</h2>
              <button
                className="close-button"
                onClick={() => toggleSetting('showSettings')}
              >
                ×
              </button>
            </div>
            <div className="settings-content">
              <div className="settings-group">
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    checked={settings.showDimensions}
                    onChange={() => toggleSetting('showDimensions')}
                  />
                  <span className="settings-slider"></span>
                  <span className="settings-label">Show Dimensions</span>
                </label>
              </div>

              <div className="settings-group">
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    checked={settings.showGrid}
                    onChange={() => toggleSetting('showGrid')}
                  />
                  <span className="settings-slider"></span>
                  <span className="settings-label">Show Grid</span>
                </label>
              </div>

              <div className="settings-group">
                <label className="settings-switch">
                  <input
                    type="checkbox"
                    checked={settings.showAxes}
                    onChange={() => toggleSetting('showAxes')}
                  />
                  <span className="settings-slider"></span>
                  <span className="settings-label">Show Axes</span>
                </label>
              </div>

              <div className="settings-group">
                <label className="settings-select">
                  <span className="settings-label">Model Quality:</span>
                  <select
                    value={settings.modelQuality}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        modelQuality: e.target.value,
                      }))
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Construction Model Viewer © {new Date().getFullYear()}</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .content-layout {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          gap: 1.5rem;
        }

        .controls-layout {
          width: 100%;
        }

        .viewer-container {
          width: 100%;
          height: 600px;
          background-color: #f0f0f0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .results-container {
          margin-top: 1rem;
        }

        .settings-panel {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          width: 300px;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          z-index: 100;
          overflow: hidden;
        }

        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .settings-header h2 {
          margin: 0;
          font-size: 1rem;
          color: #374151;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #6b7280;
          cursor: pointer;
        }

        .settings-content {
          padding: 1rem;
        }

        .settings-group {
          margin-bottom: 1rem;
        }

        .settings-switch {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .settings-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .settings-slider {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
          background-color: #e5e7eb;
          border-radius: 10px;
          margin-right: 0.75rem;
          transition: 0.4s;
        }

        .settings-slider:before {
          position: absolute;
          content: '';
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }

        .settings-switch input:checked + .settings-slider {
          background-color: #2563eb;
        }

        .settings-switch input:checked + .settings-slider:before {
          transform: translateX(16px);
        }

        .settings-label {
          font-size: 0.875rem;
          color: #4b5563;
        }

        .settings-select {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .settings-select select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .footer {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          border-top: 1px solid #eaeaea;
          font-size: 0.875rem;
          color: #6b7280;
        }

        @media (min-width: 768px) {
          .content-layout {
            flex-direction: row;
          }

          .controls-layout {
            width: 40%;
            min-width: 400px;
          }

          .viewer-container {
            flex: 1;
          }
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

          .settings-panel {
            width: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0.5rem 0.5rem 0 0;
          }
        }
      `}</style>
    </div>
  );
}