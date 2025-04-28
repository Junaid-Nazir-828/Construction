// utils/constructionUtils.js

/**
 * Construction model utility functions for calculations and validations
 */

/**
 * Calculate the maximum allowed embedment depth for an anchor
 * @param {Object} concreteDimensions - The concrete dimensions
 * @param {Object} anchorDimensions - The anchor dimensions
 * @returns {number} - Maximum embedment depth
 */
export const calculateMaxEmbedmentDepth = (concreteDimensions, anchorDimensions) => {
    // Max embedment is concrete thickness minus safety margin
    const safetyMargin = 10; // 10mm minimum distance from bottom
    return concreteDimensions.thickness - safetyMargin;
  };
  
  /**
   * Validate that anchor dimensions fit within concrete dimensions
   * @param {Object} concreteDimensions - The concrete dimensions
   * @param {Object} anchorDimensions - The anchor dimensions
   * @returns {Object} - Validation result with errors if any
   */
  export const validateAnchorFit = (concreteDimensions, anchorDimensions) => {
    const errors = [];
    
    // Check that anchor width fits within concrete width
    if (anchorDimensions.width > concreteDimensions.width) {
      errors.push('Anchor width exceeds concrete width');
    }
    
    // Check that anchor depth fits within concrete depth
    if (anchorDimensions.depth > concreteDimensions.depth) {
      errors.push('Anchor depth exceeds concrete depth');
    }
    
    // Check that embedment depth isn't too deep
    const maxEmbedmentDepth = calculateMaxEmbedmentDepth(concreteDimensions, anchorDimensions);
    if (anchorDimensions.embedDepth > maxEmbedmentDepth) {
      errors.push(`Embedment depth exceeds maximum allowed (${maxEmbedmentDepth}mm)`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Calculate concrete strength based on concrete quality
   * @param {string} concreteQuality - The concrete quality grade (e.g. 'C20/25')
   * @returns {Object} - Concrete strength properties
   */
  export const calculateConcreteStrength = (concreteQuality) => {
    // Extract values from concrete quality string
    // Format is typically "C{cylindrical strength}/{cubic strength}"
    const match = concreteQuality.match(/C(\d+)\/(\d+)/);
    
    if (!match) {
      return { 
        cylindricalStrength: 0, 
        cubicStrength: 0,
        tensileStrength: 0
      };
    }
    
    const cylindricalStrength = parseInt(match[1], 10);
    const cubicStrength = parseInt(match[2], 10);
    
    // Calculate approximate tensile strength (simplified formula)
    // This is a simplified approximation, real calculations would be more complex
    const tensileStrength = 0.3 * Math.pow(cylindricalStrength, 2/3);
    
    return {
      cylindricalStrength, // MPa
      cubicStrength, // MPa
      tensileStrength // MPa
    };
  };
  
  /**
   * Calculate edge distances for anchor placement
   * @param {Object} concreteDimensions - The concrete dimensions
   * @param {Object} anchorDimensions - The anchor dimensions
   * @returns {Object} - Edge distances
   */
  export const calculateEdgeDistances = (concreteDimensions, anchorDimensions) => {
    // Calculate distances from anchor to each edge
    const halfConcreteWidth = concreteDimensions.width / 2;
    const halfConcreteDepth = concreteDimensions.depth / 2;
    const halfAnchorWidth = anchorDimensions.width / 2;
    const halfAnchorDepth = anchorDimensions.depth / 2;
    
    return {
      c1_1: halfConcreteWidth - halfAnchorWidth, // Distance to left edge
      c1_2: halfConcreteWidth + halfAnchorWidth, // Distance to right edge
      c2_1: halfConcreteDepth - halfAnchorDepth, // Distance to front edge
      c2_2: halfConcreteDepth + halfAnchorDepth  // Distance to back edge
    };
  };
  
  /**
   * Calculate anchor capacity based on concrete properties and dimensions
   * @param {Object} concreteProperties - Concrete properties
   * @param {Object} concreteDimensions - Concrete dimensions
   * @param {Object} anchorDimensions - Anchor dimensions
   * @returns {Object} - Anchor capacity values
   */
  export const calculateAnchorCapacity = (concreteProperties, concreteDimensions, anchorDimensions) => {
    // Get concrete strength properties
    const strength = calculateConcreteStrength(concreteProperties.quality);
    
    // Calculate edge distances
    const edgeDistances = calculateEdgeDistances(concreteDimensions, anchorDimensions);
    
    // Determine if this is an edge anchor or not
    const minEdgeDistance = Math.min(
      edgeDistances.c1_1,
      edgeDistances.c1_2,
      edgeDistances.c2_1,
      edgeDistances.c2_2
    );
    
    // Critical edge distance threshold (simplified)
    const criticalEdgeDistance = 1.5 * anchorDimensions.embedDepth;
    const isEdgeAnchor = minEdgeDistance < criticalEdgeDistance;
    
    // Base capacity calculation (simplified)
    // This is a highly simplified model and would need to be replaced
    // with proper engineering calculations for a real application
    const baseCapacity = Math.sqrt(strength.cylindricalStrength) * 
                        Math.pow(anchorDimensions.embedDepth, 1.5) * 
                        (anchorDimensions.width / 50);
    
    // Reduction factor for edge anchors
    const edgeReductionFactor = isEdgeAnchor ? 
      Math.min(1.0, minEdgeDistance / criticalEdgeDistance) : 1.0;
    
    // Reduction factor for cracked concrete
    const crackedReductionFactor = 
      concreteProperties.baseMaterial === 'Cracked' ? 0.7 : 1.0;
    
    // Final calculated capacity
    const tensionCapacity = baseCapacity * edgeReductionFactor * crackedReductionFactor;
    
    // Simplified shear capacity (typically lower than tension capacity)
    const shearCapacity = 0.8 * tensionCapacity;
    
    return {
      tensionCapacity: Math.round(tensionCapacity), // kN
      shearCapacity: Math.round(shearCapacity), // kN
      isEdgeAnchor,
      edgeDistances,
      strengthValues: strength
    };
  };
  
  export default {
    calculateMaxEmbedmentDepth,
    validateAnchorFit,
    calculateConcreteStrength,
    calculateEdgeDistances,
    calculateAnchorCapacity
  };