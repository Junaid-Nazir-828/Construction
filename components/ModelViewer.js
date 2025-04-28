// components/ModelViewer.js
import { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  Text, 
  Line, 
  Html,
  useHelper
} from '@react-three/drei';
import * as THREE from 'three';

// Import custom components
import AnchorModel from './AnchorModel';

// Component for dimension arrows
const Arrow = ({ start, end, color = '#ff0000' }) => {
  const direction = useMemo(() => {
    return new THREE.Vector3().subVectors(end, start).normalize();
  }, [start, end]);
  
  const length = useMemo(() => {
    return new THREE.Vector3().subVectors(end, start).length();
  }, [start, end]);
  
  const position = useMemo(() => {
    return new THREE.Vector3().addVectors(
      start,
      direction.clone().multiplyScalar(length / 2)
    );
  }, [start, direction, length]);
  
  const points = useMemo(() => {
    return [
      [0, 0, 0],
      [length, 0, 0]
    ];
  }, [length]);
  
  // Calculate rotation to point from start to end
  const rotation = useMemo(() => {
    const arrowDirection = new THREE.Vector3().subVectors(end, start);
    const axis = new THREE.Vector3(1, 0, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      axis,
      arrowDirection.normalize()
    );
    const euler = new THREE.Euler().setFromQuaternion(quaternion);
    return [euler.x, euler.y, euler.z];
  }, [start, end]);
  
  return (
    <group position={start.toArray()} rotation={rotation}>
      <Line
        points={points}
        color={color}
        lineWidth={2}
      />
      {/* Arrow head at start */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[5, 15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Arrow head at end */}
      <mesh position={[length, 0, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[5, 15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

// Component for dimension lines with labels
const DimensionLine = ({ start, end, text, color = '#ff0000', offset = 20 }) => {
  const vec = useMemo(() => {
    return new THREE.Vector3().subVectors(end, start);
  }, [start, end]);
  
  const length = useMemo(() => {
    return vec.length();
  }, [vec]);
  
  const center = useMemo(() => {
    return new THREE.Vector3().addVectors(
      start,
      vec.clone().multiplyScalar(0.5)
    );
  }, [start, vec]);
  
  // Create offset for the dimension line
  const directionVector = useMemo(() => {
    // For horizontal lines, offset vertically
    if (Math.abs(vec.y) < 0.1) {
      return new THREE.Vector3(0, offset, 0);
    } 
    // For vertical lines, offset horizontally
    else if (Math.abs(vec.x) < 0.1) {
      return new THREE.Vector3(offset, 0, 0);
    } 
    // For depth lines
    else {
      return new THREE.Vector3(0, 0, offset);
    }
  }, [vec, offset]);
  
  const startOffset = useMemo(() => {
    return start.clone().add(directionVector);
  }, [start, directionVector]);
  
  const endOffset = useMemo(() => {
    return end.clone().add(directionVector);
  }, [end, directionVector]);
  
  const centerOffset = useMemo(() => {
    return center.clone().add(directionVector);
  }, [center, directionVector]);
  
  // Extension lines that connect the object corners to the dimension line
  const startExtension = [start.toArray(), startOffset.toArray()];
  const endExtension = [end.toArray(), endOffset.toArray()];
  
  return (
    <group>
      {/* Main dimension line */}
      <Arrow start={startOffset} end={endOffset} color={color} />
      
      {/* Extension lines */}
      <Line points={startExtension} color={color} lineWidth={1} />
      <Line points={endExtension} color={color} lineWidth={1} />
      
      {/* Dimension text */}
      <Html position={centerOffset.toArray()}>
        <div 
          style={{ 
            background: 'white', 
            padding: '2px 5px', 
            borderRadius: '3px', 
            border: `1px solid ${color}`,
            color: color,
            fontWeight: 'bold',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {text} mm
        </div>
      </Html>
    </group>
  );
};

// Component to render the concrete block with dimensions
const ConcreteModel = ({ dimensions, properties, children }) => {
  const { width, height, depth, thickness } = dimensions;
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const halfThickness = thickness / 2;
  
  // Corner positions for the concrete block
  const corners = useMemo(() => {
    return {
      frontBottomLeft: new THREE.Vector3(-halfWidth, -halfThickness, halfDepth),
      frontBottomRight: new THREE.Vector3(halfWidth, -halfThickness, halfDepth),
      frontTopLeft: new THREE.Vector3(-halfWidth, halfThickness, halfDepth),
      frontTopRight: new THREE.Vector3(halfWidth, halfThickness, halfDepth),
      backBottomLeft: new THREE.Vector3(-halfWidth, -halfThickness, -halfDepth),
      backBottomRight: new THREE.Vector3(halfWidth, -halfThickness, -halfDepth),
      backTopLeft: new THREE.Vector3(-halfWidth, halfThickness, -halfDepth),
      backTopRight: new THREE.Vector3(halfWidth, halfThickness, -halfDepth),
    };
  }, [halfWidth, halfThickness, halfDepth]);
  
  return (
    <group>
      {/* Concrete block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, thickness, depth]} />
        <meshStandardMaterial 
          color="#cccccc" 
          transparent={true} 
          opacity={0.8} 
          roughness={0.7}
        />
      </mesh>
      
      {/* Pass any children (like the anchor) */}
      {children}
      
      {/* Dimension lines */}
      <DimensionLine 
        start={corners.frontBottomLeft} 
        end={corners.frontBottomRight} 
        text={width.toString()}
        color="#ff0000"
        offset={50}
      />
      
      <DimensionLine 
        start={corners.frontBottomLeft} 
        end={corners.backBottomLeft} 
        text={depth.toString()}
        color="#0000ff"
        offset={50}
      />
      
      <DimensionLine 
        start={corners.frontBottomLeft} 
        end={corners.frontTopLeft} 
        text={thickness.toString()}
        color="#00aa00"
        offset={50}
      />
      
      {/* Property indicator */}
      <Html position={[0, halfThickness + 50, 0]}>
        <div style={{ 
          background: 'rgba(255,255,255,0.8)', 
          padding: '8px', 
          borderRadius: '5px',
          boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          width: '200px',
          transform: 'translate(-50%, -50%)',
        }}>
          {properties.quality} | {properties.baseMaterial}
          <br />
          Covering: {properties.covering} mm
        </div>
      </Html>
    </group>
  );
};

// Scene setup with lighting and controls
const Scene = ({ concreteDimensions, concreteProperties, anchorDimensions }) => {
  const { camera } = useThree();
  
  // Set up camera position based on model size
  useEffect(() => {
    const maxDimension = Math.max(
      concreteDimensions.width,
      concreteDimensions.height,
      concreteDimensions.depth
    );
    camera.position.set(maxDimension * 1.5, maxDimension, maxDimension * 1.5);
    camera.lookAt(0, 0, 0);
  }, [camera, concreteDimensions]);
  
  // Enable shadows on lights
  const mainLightRef = useRef();
  useHelper(mainLightRef, THREE.DirectionalLightHelper, 0.5, 'white');
  
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        ref={mainLightRef}
        position={[500, 500, 500]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />
      <directionalLight position={[-500, 500, -500]} intensity={0.3} />
      <directionalLight position={[0, -500, 0]} intensity={0.2} />
      
      {/* Scene floor for shadow receiving */}
      <mesh 
        rotation={[-Math.PI/2, 0, 0]} 
        position={[0, -concreteDimensions.thickness/2 - 10, 0]} 
        receiveShadow
      >
        <planeGeometry args={[5000, 5000]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      
      {/* Concrete model with anchor inside */}
      <ConcreteModel 
        dimensions={concreteDimensions}
        properties={concreteProperties}
      >
        <AnchorModel 
          dimensions={anchorDimensions}
          embedDepth={anchorDimensions.embedDepth}
        />
      </ConcreteModel>
      
      {/* Helper elements */}
      <gridHelper args={[2000, 20]} />
      <axesHelper args={[500]} />
    </>
  );
};

// Main component for the 3D viewer
const ModelViewer = ({ concreteDimensions, concreteProperties, anchorDimensions = { width: 50, height: 80, depth: 50, embedDepth: 70 } }) => {
  return (
    <Canvas 
      shadows 
      dpr={[1, 2]} 
      gl={{ antialias: true }}
      camera={{ position: [1000, 1000, 1000], fov: 50 }}
    >
      <color attach="background" args={['#f0f0f0']} />
      <Scene 
        concreteDimensions={concreteDimensions}
        concreteProperties={concreteProperties}
        anchorDimensions={anchorDimensions}
      />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        makeDefault
      />
    </Canvas>
  );
};

export default ModelViewer;