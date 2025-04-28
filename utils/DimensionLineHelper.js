// utils/DimensionLineHelper.js
import * as THREE from 'three';

/**
 * Class to create and manage dimension lines with arrows
 */
export class DimensionLineHelper {
  /**
   * Create a new dimension line
   * @param {THREE.Vector3} start - Starting point
   * @param {THREE.Vector3} end - Ending point
   * @param {string} text - Text to display (usually dimension in mm)
   * @param {object} options - Configuration options
   */
  static createDimensionLine(scene, start, end, text, options = {}) {
    const {
      color = 0xff0000,
      offset = 20,
      arrowSize = 10,
      lineWidth = 1,
      fontSize = 12
    } = options;
    
    // Create group to hold all elements
    const group = new THREE.Group();
    
    // Calculate direction vector
    const direction = new THREE.Vector3().subVectors(end, start).normalize();
    const length = new THREE.Vector3().subVectors(end, start).length();
    
    // Create offset vector perpendicular to the dimension line
    let offsetVector;
    
    // Determine if the line is mostly horizontal, vertical, or depth-oriented
    const absX = Math.abs(direction.x);
    const absY = Math.abs(direction.y);
    const absZ = Math.abs(direction.z);
    
    if (absX > absY && absX > absZ) {
      // Line is primarily along X axis
      offsetVector = new THREE.Vector3(0, offset, 0);
    } else if (absY > absX && absY > absZ) {
      // Line is primarily along Y axis
      offsetVector = new THREE.Vector3(offset, 0, 0);
    } else {
      // Line is primarily along Z axis
      offsetVector = new THREE.Vector3(0, offset, 0);
    }
    
    // Calculate offset points
    const startOffset = start.clone().add(offsetVector);
    const endOffset = end.clone().add(offsetVector);
    
    // Create dimension line
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      startOffset,
      endOffset
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: color,
      linewidth: lineWidth 
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    group.add(line);
    
    // Create extension lines connecting the object to dimension line
    const extLine1Geometry = new THREE.BufferGeometry().setFromPoints([
      start,
      startOffset
    ]);
    const extLine2Geometry = new THREE.BufferGeometry().setFromPoints([
      end,
      endOffset
    ]);
    
    const extLine1 = new THREE.Line(extLine1Geometry, lineMaterial);
    const extLine2 = new THREE.Line(extLine2Geometry, lineMaterial);
    
    group.add(extLine1);
    group.add(extLine2);
    
    // Create arrow heads
    const arrowGeometry = new THREE.ConeGeometry(arrowSize / 2, arrowSize, 8);
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: color });
    
    // Start arrow
    const startArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    startArrow.position.copy(startOffset);
    
    // Find rotation for the arrow to point along the line
    const arrowDirection = new THREE.Vector3().subVectors(endOffset, startOffset).normalize();
    startArrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDirection);
    group.add(startArrow);
    
    // End arrow
    const endArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    endArrow.position.copy(endOffset);
    endArrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), arrowDirection);
    group.add(endArrow);
    
    // Create text for dimension
    // Note: In a real app, you'd use HTML or 3D text
    // For simplicity, we'll use a placeholder approach here
    const textPosition = new THREE.Vector3().addVectors(
      startOffset,
      new THREE.Vector3().subVectors(endOffset, startOffset).multiplyScalar(0.5)
    );
    
    // Add to scene
    scene.add(group);
    
    return {
      group,
      update(newStart, newEnd, newText) {
        // Update implementation for dynamic resizing
        // This would update all the geometries and positions
        // based on new start/end points
      },
      remove() {
        // Clean up method
        scene.remove(group);
        group.children.forEach(child => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }
}

export default DimensionLineHelper;