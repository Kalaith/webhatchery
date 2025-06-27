// Utility functions for color manipulation

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Handle undefined, null, or invalid hex values
  if (!hex || typeof hex !== 'string') {
    console.warn('Invalid hex color provided to hexToRgb:', hex);
    return { r: 128, g: 128, b: 128 }; // Default to gray
  }
  
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  
  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn('Invalid hex format provided to hexToRgb:', hex);
    return { r: 128, g: 128, b: 128 }; // Default to gray
  }
  
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  // Clamp values to valid range and handle NaN
  r = Math.max(0, Math.min(255, Math.round(r) || 0));
  g = Math.max(0, Math.min(255, Math.round(g) || 0));
  b = Math.max(0, Math.min(255, Math.round(b) || 0));
  
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Ensure h is always defined in rgbToHsl
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  // Handle invalid inputs
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    console.warn('Invalid RGB values provided to rgbToHsl:', { r, g, b });
    return { h: 0, s: 0, l: 0.5 };
  }
  
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;
  if (max === min) {
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  // Handle invalid inputs
  if (typeof h !== 'number' || typeof s !== 'number' || typeof l !== 'number') {
    console.warn('Invalid HSL values provided to hslToRgb:', { h, s, l });
    return { r: 128, g: 128, b: 128 };
  }
  
  // Ensure values are in valid ranges
  h = ((h % 360) + 360) % 360; // Normalize h to 0-360
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  
  let r, g, b;
  h /= 360;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
