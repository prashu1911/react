import { useCallback } from "react";

/**
 * Helper function to convert RGB object to hex string
 * @param {Object|string} rgb - RGB object with r, g, b properties or string
 * @returns {string} Hex color string
 */
function rgbToHex(rgb) {
  // If rgb is already a hex string, return it
  if (typeof rgb === "string") {
    if (rgb.startsWith("#")) {
      return rgb;
    }

    // Handle rgb() string format
    const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    return "#000000"; // Fallback for unknown string formats
  }

  // Handle RGB object format
  if (!rgb || typeof rgb !== "object") {
    return "#000000";
  }

  // The color-blind package uses lowercase r,g,b properties
  const r = Math.round('r' in rgb ? rgb.r : (rgb.R || 0));
  const g = Math.round('g' in rgb ? rgb.g : (rgb.G || 0));
  const b = Math.round('b' in rgb ? rgb.b : (rgb.B || 0));

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function useColorBlindSimulation() {
  /**
   * Transforms colors based on color blindness type
   *
   * @param {string[]} colors - Array of hex color codes to transform
   * @param {string} blindnessType - Type of color blindness to simulate:
   *   - 'protanopia': Red-blind
   *   - 'deuteranopia': Green-blind
   *   - 'tritanopia': Blue-blind
   *   - 'achromatopsia': Full color blindness (monochrome)
   *   - '': Normal vision (returns original colors)
   * @returns {string[]} Transformed color array
   */
  const transformColors = useCallback((colors, blindnessType) => {
    if (!blindnessType || !colors || !colors.length) {
      return colors || [];
    }

    // Dynamic import of color-blind package
    try {
      // We need to ensure the color-blind package is available
      // eslint-disable-next-line global-require
      const colorBlind = require("color-blind");

      const blindnessTransformations = {
        protanopia: colorBlind.protanopia,
        deuteranopia: colorBlind.deuteranopia,
        tritanopia: colorBlind.tritanopia,
        achromatopsia: colorBlind.achromatopsia
      };

      const transformFunction = blindnessTransformations[blindnessType];

      if (transformFunction) {
        return colors.map((color) => {
          try {
            const transformed = transformFunction(color);
            return rgbToHex(transformed);
          } catch (error) {
            console.error(`Error transforming color ${color}:`, error);
            return color; // Return original color if transformation fails
          }
        });
      }
    } catch (error) {
      console.error("Error loading color-blind package:", error);
    }

    // Return original colors if transformation wasn't possible
    return colors;
  }, []);

  return { transformColors };
}