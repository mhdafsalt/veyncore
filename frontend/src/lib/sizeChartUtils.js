/**
 * sizeChartUtils.js
 * Dynamic size chart calculation and measurement presets for VEYNCORE
 */

export function parseSizes(input) {
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function isTopCategory(subCategory = '') {
  const norm = String(subCategory || '').toUpperCase();
  return ['TOP', 'TOPS', 'TEE', 'TEES', 'T-SHIRT', 'SHIRT', 'HOODIE', 'SWEAT', 'JACKET'].some((k) =>
    norm.includes(k)
  );
}

export function isObjectCategory(subCategory = '', category = '') {
  if (String(category || '').toUpperCase() === 'VEYN-OBJECTS') return true;
  const norm = String(subCategory || '').toUpperCase();
  return ['CHAIN', 'CHAINS', 'BAG', 'BAGS', 'CAP', 'CAPS', 'SHADE', 'SHADES', 'BRACELET', 'WATCH', 'BELT'].some(
    (k) => norm.includes(k)
  );
}

/**
 * Generate dynamic measurement rows for a list of sizes in a given unit ('inches' | 'cm')
 */
export function generateDynamicMeasurements(sizes = [], unit = 'inches', subCategory = '', category = '') {
  const parsed = parseSizes(sizes);
  const targetSizes = parsed.length > 0 ? parsed : ['28', '30', '32', '34', '36'];
  const isCm = unit === 'cm';
  const isTop = isTopCategory(subCategory);

  if (isTop) {
    const topPresets = {
      XS: { chest: 36, length: 26, shoulder: 17, sleeve: 8 },
      S: { chest: 38, length: 27, shoulder: 18, sleeve: 8.5 },
      M: { chest: 40, length: 28, shoulder: 19, sleeve: 9 },
      L: { chest: 42, length: 29, shoulder: 20, sleeve: 9.5 },
      XL: { chest: 44, length: 30, shoulder: 21, sleeve: 10 },
      XXL: { chest: 46, length: 31, shoulder: 22, sleeve: 10.5 },
      '2XL': { chest: 46, length: 31, shoulder: 22, sleeve: 10.5 },
      '3XL': { chest: 48, length: 32, shoulder: 23, sleeve: 11 },
    };

    return targetSizes.map((s) => {
      const upper = String(s).trim().toUpperCase();
      const p = topPresets[upper] || { chest: 40, length: 28, shoulder: 19, sleeve: 9 };
      if (isCm) {
        return {
          size: s,
          chest: (p.chest * 2.54).toFixed(1),
          length: (p.length * 2.54).toFixed(1),
          shoulder: (p.shoulder * 2.54).toFixed(1),
          sleeve: (p.sleeve * 2.54).toFixed(1),
        };
      }
      return {
        size: s,
        chest: String(p.chest),
        length: String(p.length),
        shoulder: String(p.shoulder),
        sleeve: String(p.sleeve),
      };
    });
  }

  // Denim & Pants generator
  return targetSizes.map((s) => {
    const num = parseInt(String(s).replace(/\D/g, ''), 10);
    const validNum = !isNaN(num) && num > 0 ? num : 30;

    const waistIn = validNum;
    const riseIn = (12 + Math.max(0, (validNum - 28) * 0.25)).toFixed(1);
    const thighsIn = (24 + Math.max(0, (validNum - 28) * 0.5)).toFixed(1);
    const lengthIn = validNum <= 28 ? 41 : validNum <= 32 ? 42 : validNum <= 36 ? 43 : 44;
    const legOpeningIn = (21 + Math.max(0, (validNum - 28) * 0.35)).toFixed(1);

    if (isCm) {
      return {
        size: s,
        waist: (waistIn * 2.54).toFixed(1),
        rise: (parseFloat(riseIn) * 2.54).toFixed(1),
        thighs: (parseFloat(thighsIn) * 2.54).toFixed(1),
        length: (lengthIn * 2.54).toFixed(1),
        legOpening: (parseFloat(legOpeningIn) * 2.54).toFixed(1),
      };
    }

    return {
      size: s,
      waist: String(waistIn),
      rise: String(parseFloat(riseIn)),
      thighs: String(parseFloat(thighsIn)),
      length: String(lengthIn),
      legOpening: String(parseFloat(legOpeningIn)),
    };
  });
}

/**
 * Generate full measurement object containing both inches and cm
 */
export function buildCompleteMeasurements(sizes = [], subCategory = '', category = '') {
  return {
    inches: generateDynamicMeasurements(sizes, 'inches', subCategory, category),
    cm: generateDynamicMeasurements(sizes, 'cm', subCategory, category),
  };
}
