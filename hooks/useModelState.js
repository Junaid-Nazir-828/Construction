// hooks/useModelState.js
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the state of 3D models
 * @param {string} modelType - Type of model (e.g., 'concrete', 'anchor')
 * @param {Object} dimensions - Dimensions object
 * @param {Function} validateFn - Optional validation function
 * @returns {Object} Object containing model state
 */
export const useModelState = (modelType, dimensions, validateFn = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);
  
  // Validate dimensions when they change
  useEffect(() => {
    // Reset error state
    setError(null);
    
    // If a validation function is provided, use it
    if (validateFn) {
      try {
        const validationResult = validateFn(dimensions);
        
        setIsValid(validationResult.isValid);
        setValidationErrors(validationResult.errors || []);
        
        if (!validationResult.isValid && validationResult.errors?.length > 0) {
          setError(`Invalid ${modelType} dimensions: ${validationResult.errors[0]}`);
        }
      } catch (err) {
        console.error(`Error validating ${modelType} dimensions:`, err);
        setError(`Error validating ${modelType} dimensions`);
        setIsValid(false);
      }
    }
  }, [dimensions, validateFn, modelType]);
  
  // Function to set loading state
  const setLoading = (loading) => {
    setIsLoading(loading);
  };
  
  // Function to set error state
  const setModelError = (errorMessage) => {
    setError(errorMessage);
    setIsValid(false);
  };
  
  // Function to reset error state
  const resetError = () => {
    setError(null);
    setIsValid(true);
    setValidationErrors([]);
  };
  
  return {
    isLoading,
    error,
    isValid,
    validationErrors,
    setLoading,
    setModelError,
    resetError
  };
};

export default useModelState;