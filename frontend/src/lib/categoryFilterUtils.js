/**
 * Category Filtration Utilities for VEYNCORE
 * Provides unified, robust, slug-aware category matching and defaults
 * across All Drops, Objects Drops, SubCategories, and Storefront carousels.
 */

export const DEFAULT_SELECTS_CATEGORIES = [
  { id: 'all', label: 'ALL DROPS' },
  { id: 'baggy', label: 'BAGGY' },
  { id: 'bootcut', label: 'BOOTCUT' },
  { id: 'wide', label: 'WIDE LEG' },
  { id: 'straight', label: 'STRAIGHT' },
  { id: 'cargo', label: 'CARGO' },
  { id: 'denims', label: 'DENIMS' },
  { id: 'tops', label: 'TOPS' },
];

export const DEFAULT_OBJECTS_CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'bags', label: 'BAGS & UTILITY' },
  { id: 'chains', label: 'CHAINS & HARDWARE' },
  { id: 'caps', label: 'CAPS & HEADWEAR' },
  { id: 'shades', label: 'SHADES & EYEWEAR' },
  { id: 'bracelets', label: 'BRACELETS' },
];

/**
 * Normalizes any category string into an alphanumeric slug for safe comparisons
 */
export const toCategorySlug = (str = '') =>
  String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Robust category matching function.
 * Matches a product against a target category key or slug with:
 * - Exact and slug-normalized matching
 * - Singular/plural tolerance ('top'/'tops', 'baggy'/'baggies', 'denim'/'denims', 'cap'/'caps')
 * - Streetwear alias matching ('wide' <-> 'wide leg', 'straight' <-> 'stright', 'caps' <-> 'headwear')
 * - Denims vs Tops exclusivity (denims includes all pants fits, excludes tops/tees)
 * - Word-boundary title search
 */
export function matchProductCategory(product, targetCategory) {
  if (!product || !targetCategory) return false;
  const targetRaw = String(targetCategory).toLowerCase().trim();
  if (!targetRaw || targetRaw === 'all' || targetRaw === 'all-drops') return true;

  const targetSlug = toCategorySlug(targetRaw);
  if (!targetSlug) return true;

  const pSub = String(product.subCategory || '').toLowerCase().trim();
  const pFit = String(product.fit || '').toLowerCase().trim();
  const pSwipe = String(product.swipeCategory || '').toLowerCase().trim();
  const pTitle = String(product.title || '').toLowerCase().trim();
  const pCat = String(product.category || '').toUpperCase().trim();

  const subSlug = toCategorySlug(pSub);
  const fitSlug = toCategorySlug(pFit);
  const swipeSlug = toCategorySlug(pSwipe);

  // 1. Direct or slug equality on any category field
  if (
    pSub === targetRaw ||
    pFit === targetRaw ||
    pSwipe === targetRaw ||
    (subSlug && subSlug === targetSlug) ||
    (fitSlug && fitSlug === targetSlug) ||
    (swipeSlug && swipeSlug === targetSlug)
  ) {
    return true;
  }

  // 2. Singular/Plural tolerance
  const targetSingular = targetSlug.endsWith('s') ? targetSlug.slice(0, -1) : targetSlug;
  const subSingular = subSlug.endsWith('s') ? subSlug.slice(0, -1) : subSlug;
  const fitSingular = fitSlug.endsWith('s') ? fitSlug.slice(0, -1) : fitSlug;
  if (
    (targetSingular && subSingular && targetSingular === subSingular) ||
    (targetSingular && fitSingular && targetSingular === fitSingular)
  ) {
    return true;
  }

  // 3. Domain-Specific Streetwear Category Mappings

  // --- TOPS (Tees, T-shirts, Hoodies, Shirts, Jackets) ---
  if (targetSlug === 'top' || targetSlug === 'tops' || targetSlug === 'tees' || targetSlug === 'tee') {
    return (
      subSlug.includes('top') ||
      fitSlug.includes('top') ||
      subSlug.includes('tee') ||
      subSlug.includes('shirt') ||
      subSlug.includes('hoodie') ||
      subSlug.includes('jacket') ||
      /\b(top|tops|tee|tees|t-shirt|shirt|hoodie|jacket|sweater)\b/i.test(pTitle)
    );
  }

  // --- DENIMS (All denim fits & pants; strictly excludes tops) ---
  if (targetSlug === 'denim' || targetSlug === 'denims') {
    const isTopItem =
      subSlug.includes('top') ||
      fitSlug.includes('top') ||
      subSlug.includes('tee') ||
      subSlug.includes('shirt') ||
      subSlug.includes('hoodie') ||
      /\b(top|tops|tee|tees|t-shirt|shirt|hoodie|jacket)\b/i.test(pTitle);
    if (isTopItem) return false;

    return (
      pCat === 'VEYN-SELECTS' ||
      subSlug.includes('denim') ||
      subSlug.includes('baggy') ||
      subSlug.includes('bootcut') ||
      subSlug.includes('wide') ||
      subSlug.includes('straight') ||
      subSlug.includes('stright') ||
      subSlug.includes('cargo')
    );
  }

  // --- WIDE / WIDE LEG ---
  if (targetSlug === 'wide' || targetSlug === 'wideleg') {
    return (
      subSlug.includes('wide') ||
      fitSlug.includes('wide') ||
      swipeSlug.includes('wide') ||
      /\bwide\b/i.test(pTitle)
    );
  }

  // --- BAGGY ---
  if (targetSlug === 'baggy' || targetSlug === 'baggies') {
    return (
      subSlug.includes('baggy') ||
      fitSlug.includes('baggy') ||
      swipeSlug.includes('baggy') ||
      /\bbaggy\b/i.test(pTitle)
    );
  }

  // --- BOOTCUT ---
  if (targetSlug === 'bootcut' || targetSlug === 'boot') {
    return (
      subSlug.includes('boot') ||
      fitSlug.includes('boot') ||
      swipeSlug.includes('boot') ||
      /\bbootcut\b/i.test(pTitle)
    );
  }

  // --- STRAIGHT / STRIGHT ---
  if (targetSlug === 'straight' || targetSlug === 'stright') {
    return (
      subSlug.includes('straight') ||
      subSlug.includes('stright') ||
      fitSlug.includes('straight') ||
      fitSlug.includes('stright') ||
      swipeSlug.includes('straight') ||
      swipeSlug.includes('stright') ||
      /\b(straight|stright)\b/i.test(pTitle)
    );
  }

  // --- CARGO ---
  if (targetSlug === 'cargo' || targetSlug === 'cargos') {
    return (
      subSlug.includes('cargo') ||
      fitSlug.includes('cargo') ||
      swipeSlug.includes('cargo') ||
      /\bcargo\b/i.test(pTitle)
    );
  }

  // --- VEYN-OBJECTS: BAGS ---
  if (targetSlug === 'bag' || targetSlug === 'bags' || targetSlug === 'bagsutility') {
    return (
      subSlug.includes('bag') ||
      swipeSlug.includes('bag') ||
      /\b(bag|bags|tote|backpack|crossbody|duffle|utility)\b/i.test(pTitle)
    );
  }

  // --- VEYN-OBJECTS: CHAINS & HARDWARE ---
  if (targetSlug === 'chain' || targetSlug === 'chains' || targetSlug === 'hardware' || targetSlug === 'chainshardware') {
    return (
      subSlug.includes('chain') ||
      subSlug.includes('hardware') ||
      swipeSlug.includes('chain') ||
      swipeSlug.includes('hardware') ||
      /\b(chain|chains|necklace|pendant|hardware|cuban|link)\b/i.test(pTitle)
    );
  }

  // --- VEYN-OBJECTS: CAPS & HEADWEAR ---
  if (targetSlug === 'cap' || targetSlug === 'caps' || targetSlug === 'headwear' || targetSlug === 'capsheadwear') {
    return (
      subSlug.includes('cap') ||
      subSlug.includes('headwear') ||
      subSlug.includes('hat') ||
      swipeSlug.includes('cap') ||
      swipeSlug.includes('headwear') ||
      /\b(cap|caps|hat|headwear|beanie|bucket)\b/i.test(pTitle)
    );
  }

  // --- VEYN-OBJECTS: SHADES & EYEWEAR ---
  if (targetSlug === 'shade' || targetSlug === 'shades' || targetSlug === 'eyewear' || targetSlug === 'shadeseyewear') {
    return (
      subSlug.includes('shade') ||
      subSlug.includes('eyewear') ||
      swipeSlug.includes('shade') ||
      swipeSlug.includes('eyewear') ||
      /\b(shade|shades|sunglass|sunglasses|eyewear|glasses)\b/i.test(pTitle)
    );
  }

  // --- VEYN-OBJECTS: BRACELETS ---
  if (targetSlug === 'bracelet' || targetSlug === 'bracelets') {
    return (
      subSlug.includes('bracelet') ||
      swipeSlug.includes('bracelet') ||
      /\b(bracelet|bracelets|wristband|cuff)\b/i.test(pTitle)
    );
  }

  // 4. Substring contains on slug (e.g. 'accessories', custom categories)
  if (subSlug && (subSlug.includes(targetSlug) || targetSlug.includes(subSlug))) {
    return true;
  }
  if (fitSlug && (fitSlug.includes(targetSlug) || targetSlug.includes(fitSlug))) {
    return true;
  }

  // 5. Word boundary title match
  try {
    const wordRegex = new RegExp(`\\b${targetRaw}\\b`, 'i');
    if (wordRegex.test(pTitle)) return true;
  } catch (e) {
    // ignore invalid regex characters
  }

  return false;
}
