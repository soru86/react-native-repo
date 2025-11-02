import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useResponsive = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const isTablet = dimensions.width >= 768;
  const isSmallScreen = dimensions.width < 375;
  const isLargeScreen = dimensions.width >= 1024;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isTablet,
    isSmallScreen,
    isLargeScreen,
  };
};



