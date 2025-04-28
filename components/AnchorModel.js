// components/AnchorModel.js
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';

/**
 * Component to render and manage the anchor model
 */
const AnchorModel = ({ 
  position = [0, 0, 0],
  dimensions = { width: 50, height: 80, depth: 50 },
  embedDepth = 70,
  rotation = [0, 0, 0],
  color = '#aa3333',
  wireframe = false,
  modelPath = null
}) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(!!modelPath);
  const [error, setError] = useState(null);
  
  // Try to load the model if path is provided
  useEffect(() => {
    if (!modelPath) return;
    
    setLoading(true);
    
    // This would be replaced with actual model loading code
    // using useGLTF or similar
    const timer = setTimeout(() => {
      // Simulate successful loading
      setLoading(false);
      
      // In a real implementation, you'd set the actual loaded model
      // setModel(loadedModel);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [modelPath]);
  
  // Create a simple box representation of the anchor if no model
  const anchorGeometry = useMemo(() => {
    return new THREE.BoxGeometry(
      dimensions.width,
      dimensions.height, 
      dimensions.depth
    );
  }, [dimensions]);
  
  return (
    <group position={position} rotation={rotation}>
      {loading ? (
        // Loading indicator
        <mesh>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial color="#999999" wireframe />
        </mesh>
      ) : model ? (
        // Use the loaded model
        <primitive object={model} />
      ) : (
        // Fallback to simple geometry
        <mesh castShadow>
          <boxGeometry 
            args={[dimensions.width, dimensions.height, dimensions.depth]} 
          />
          <meshStandardMaterial 
            color={color} 
            wireframe={wireframe} 
            roughness={0.7}
            metalness={0.5}
          />
        </mesh>
      )}
      
      {/* Visual indicator for embedment depth */}
      <mesh position={[0, -dimensions.height/2 - 10, 0]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[dimensions.width + 20, dimensions.depth + 20]} />
        <meshBasicMaterial 
          color="#44aa44" 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Embedment depth label */}
      <group position={[dimensions.width/2 + 30, -dimensions.height/2, 0]}>
        <mesh>
          <boxGeometry args={[40, 20, 1]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* In a real implementation, you'd use Text from drei here */}
      </group>
    </group>
  );
};

export default AnchorModel;