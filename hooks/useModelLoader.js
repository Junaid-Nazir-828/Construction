// hooks/useModelLoader.js
import { useState, useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

/**
 * Custom hook to load GLB/GLTF models with error handling
 * @param {string} modelPath - Path to the GLB/GLTF model
 * @param {object} dimensions - Object containing model dimensions to scale
 * @param {function} onLoad - Callback function when model is loaded
 * @returns {object} Object containing model, loading state and error
 */
export const useModelLoader = (modelPath, dimensions, onLoad = () => {}) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        try {
          // Clone the model to avoid modifying the cached version
          const modelClone = gltf.scene.clone();
          
          // Apply scaling if dimensions are provided
          if (dimensions) {
            const box = new THREE.Box3().setFromObject(modelClone);
            const size = box.getSize(new THREE.Vector3());
            
            const scaleX = dimensions.width ? dimensions.width / size.x : 1;
            const scaleY = dimensions.height ? dimensions.height / size.y : 1;
            const scaleZ = dimensions.depth ? dimensions.depth / size.z : 1;
            
            modelClone.scale.set(scaleX, scaleY, scaleZ);
          }
          
          // Center the model
          const box = new THREE.Box3().setFromObject(modelClone);
          const center = box.getCenter(new THREE.Vector3());
          modelClone.position.sub(center);
          
          // Traverse all children to enable shadows
          modelClone.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
              
              // Ensure materials are properly set up
              if (node.material) {
                if (Array.isArray(node.material)) {
                  node.material.forEach((material) => {
                    material.side = THREE.DoubleSide;
                  });
                } else {
                  node.material.side = THREE.DoubleSide;
                }
              }
            }
          });
          
          setModel(modelClone);
          setIsLoading(false);
          onLoad(modelClone);
        } catch (err) {
          console.error('Error processing loaded model:', err);
          setError('Failed to process loaded model');
          setIsLoading(false);
        }
      },
      // Progress callback
      (progress) => {
        // You could update a progress indicator here
      },
      // Error callback
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load 3D model');
        setIsLoading(false);
      }
    );
    
    // Clean up function
    return () => {
      // Abort loading if component unmounts
      // Note: GLTFLoader doesn't have a built-in abort method,
      // but we can clean up our state
      setModel(null);
      setIsLoading(false);
      setError(null);
    };
  }, [modelPath, dimensions, onLoad]);
  
  return { model, isLoading, error };
};

export default useModelLoader;