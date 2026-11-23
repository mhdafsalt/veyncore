import SiteContent from '../models/content.model.js';

// Default initial content structure
const DEFAULT_CONTENT = {
  key: 'main_site_content',
  announcements: [
    { id: 'ann-1', text: 'LEAD WITH CONFIDENCE', active: true, sortOrder: 0 },
    { id: 'ann-2', text: 'FREE SHIPPING ON ALL ORDERS', active: true, sortOrder: 1 },
    { id: 'ann-3', text: 'NEW DENIM DROPS LIVE NOW', active: true, sortOrder: 2 },
    { id: 'ann-4', text: 'CASH ON DELIVERY AVAILABLE', active: true, sortOrder: 3 },
    { id: 'ann-5', text: 'EASY 7-DAY EXCHANGES', active: true, sortOrder: 4 },
  ],
  subcategories: [
    // VEYN-SELECTS
    { id: 'home', mainCategory: 'VEYN-SELECTS', label: 'HOME', href: '#home', isGlow: false, sortOrder: 0, active: true },
    { id: 'flash-sale', mainCategory: 'VEYN-SELECTS', label: 'FLASH SALE⚡️', href: '#flash-sale', isGlow: true, sortOrder: 1, active: true },
    { id: 'new-drops', mainCategory: 'VEYN-SELECTS', label: 'NEW DROPS', href: '/collections/all-drops', isGlow: true, sortOrder: 2, active: true },
    { id: 'all-drops', mainCategory: 'VEYN-SELECTS', label: 'ALL DROPS', href: '/collections/all-drops', isGlow: false, sortOrder: 3, active: true },
    { id: 'denims', mainCategory: 'VEYN-SELECTS', label: 'DENIMS', href: '#denims', isGlow: false, sortOrder: 4, active: true },
    { id: 'cargo', mainCategory: 'VEYN-SELECTS', label: 'CARGO', href: '#cargo', isGlow: false, sortOrder: 5, active: true },
    { id: 'baggy', mainCategory: 'VEYN-SELECTS', label: 'BAGGY', href: '#baggy', isGlow: false, sortOrder: 6, active: true },
    { id: 'bootcut', mainCategory: 'VEYN-SELECTS', label: 'BOOTCUT', href: '#bootcut', isGlow: false, sortOrder: 7, active: true },
    { id: 'wide', mainCategory: 'VEYN-SELECTS', label: 'WIDE', href: '#wide', isGlow: false, sortOrder: 8, active: true },
    { id: 'straight', mainCategory: 'VEYN-SELECTS', label: 'STRAIGHT', href: '#straight', isGlow: false, sortOrder: 9, active: true },
    { id: 'tops', mainCategory: 'VEYN-SELECTS', label: 'TOPS', href: '#tops', isGlow: false, sortOrder: 10, active: true },
    { id: 'accessories', mainCategory: 'VEYN-SELECTS', label: 'ACCESSORIES', href: '#accessories', isGlow: false, sortOrder: 11, active: true },

    // VEYN-OBJECTS
    { id: 'obj-all', mainCategory: 'VEYN-OBJECTS', label: 'ALL OBJECTS', href: '/collections/objects-drops', isGlow: false, sortOrder: 0, active: true },
    { id: 'obj-drops', mainCategory: 'VEYN-OBJECTS', label: 'OBJECT DROPS ⚡️', href: '#object-drops', isGlow: true, sortOrder: 1, active: true },
    { id: 'bags', mainCategory: 'VEYN-OBJECTS', label: 'BAGS', href: '#bags', isGlow: false, sortOrder: 2, active: true },
    { id: 'chains', mainCategory: 'VEYN-OBJECTS', label: 'CHAINS', href: '#chains', isGlow: false, sortOrder: 3, active: true },
    { id: 'headwear', mainCategory: 'VEYN-OBJECTS', label: 'CAPS & HEADWEAR', href: '#headwear', isGlow: false, sortOrder: 4, active: true },
    { id: 'hardware', mainCategory: 'VEYN-OBJECTS', label: 'HARDWARE', href: '#hardware', isGlow: false, sortOrder: 5, active: true },
  ],
  heroSlides: [
    // VEYN-SELECTS
    {
      id: 'slide-1',
      targetSection: 'VEYN-SELECTS',
      title: 'Wide Leg Fit',
      subtitle: 'Best Choice',
      tag: 'DROP 01',
      image: '/images/hero/heroimg01.jpg',
      href: '/collections/wide-leg',
      sortOrder: 0,
      active: true,
    },
    {
      id: 'slide-2',
      targetSection: 'VEYN-SELECTS',
      title: 'Veyn Selects',
      subtitle: 'Curated Denims',
      tag: 'EXCLUSIVE',
      image: '/images/hero/heroimg02.jpg',
      href: '/collections/veyn-selects',
      sortOrder: 1,
      active: true,
    },
    {
      id: 'slide-3',
      targetSection: 'VEYN-SELECTS',
      title: 'Baggy Fit',
      subtitle: 'Most Selling',
      tag: 'BESTSELLER',
      image: '/images/hero/heroimg03.jpg',
      href: '/collections/baggy',
      sortOrder: 2,
      active: true,
    },

    // VEYN-OBJECTS
    {
      id: 'obj-slide-1',
      targetSection: 'VEYN-OBJECTS',
      title: 'Tactical Utility Bags',
      subtitle: 'FUNCTION OVER ADORNMENT',
      tag: 'NEW RELEASE',
      image: '/images/hero/ObjectHero01.png',
      href: '/collections/objects-drops?category=bags',
      sortOrder: 0,
      active: true,
    },
    {
      id: 'obj-slide-2',
      targetSection: 'VEYN-OBJECTS',
      title: 'Solid Hardware Archive',
      subtitle: 'ENGINEERED ARTIFACTS',
      tag: 'DROP 01 // OBJECTS',
      image: '/images/hero/ObjectHero02.png',
      href: '/collections/objects-drops',
      sortOrder: 1,
      active: true,
    },
  ],
  swipeCategories: [
    { id: 'swp-baggy', targetSection: 'VEYN-SELECTS', key: 'baggy', label: 'BAGGY', collectionPath: '/collections/baggy', sortOrder: 0, active: true },
    { id: 'swp-bootcut', targetSection: 'VEYN-SELECTS', key: 'bootcut', label: 'BOOTCUT', collectionPath: '/collections/bootcut', sortOrder: 1, active: true },
    { id: 'swp-wide', targetSection: 'VEYN-SELECTS', key: 'wide', label: 'WIDE', collectionPath: '/collections/wide', sortOrder: 2, active: true },
    { id: 'swp-straight', targetSection: 'VEYN-SELECTS', key: 'straight', label: 'STRAIGHT', collectionPath: '/collections/straight', sortOrder: 3, active: true },

    { id: 'swp-bags', targetSection: 'VEYN-OBJECTS', key: 'bags', label: 'BAGS', collectionPath: '/collections/objects-drops?category=bags', sortOrder: 0, active: true },
    { id: 'swp-chains', targetSection: 'VEYN-OBJECTS', key: 'chains', label: 'CHAINS', collectionPath: '/collections/objects-drops?category=chains', sortOrder: 1, active: true },
    { id: 'swp-caps', targetSection: 'VEYN-OBJECTS', key: 'caps', label: 'CAPS & HEADWEAR', collectionPath: '/collections/objects-drops?category=caps', sortOrder: 2, active: true },
  ],
  bottomBanner: {
    imageDesktop: '/images/ImageBanner.png',
    imageMobile: '/images/ImageBanner-Mob.png',
    altText: 'VEYNCORE Denim Campaign',
    buttonLink: '/collections/all-drops',
    active: true,
  },
  bottomBannerObjects: {
    imageDesktop: '/images/hero/ObjectHero03.jpg',
    imageMobile: '/images/hero/ObjectHero03.jpg',
    altText: 'VEYN-OBJECTS Artifacts Campaign',
    buttonLink: '/collections/objects-drops',
    active: true,
  },
};

/**
 * GET /api/content
 * Retrieve current dynamic site content (auto-creates defaults if none exists)
 */
export const getContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'main_site_content' });

    if (!content) {
      content = await SiteContent.create(DEFAULT_CONTENT);
    }

    return res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('[Content Controller] Error fetching content:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve site content.',
      error: error.message,
    });
  }
};

/**
 * GET /api/content/:section
 * Retrieve specific section (announcements, subcategories, heroSlides, swipeCategories, bottomBanner)
 */
export const getSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    let content = await SiteContent.findOne({ key: 'main_site_content' });

    if (!content) {
      content = await SiteContent.create(DEFAULT_CONTENT);
    }

    let sectionData = content[section] || DEFAULT_CONTENT[section];
    if (sectionData === undefined) {
      return res.status(404).json({
        success: false,
        message: `Section "${section}" not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      section,
      data: sectionData,
    });
  } catch (error) {
    console.error('[Content Controller] Error fetching section:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve section content.',
      error: error.message,
    });
  }
};

/**
 * PUT /api/content/:section
 * Admin only: Update specific section of site content
 */
export const updateSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    const bodyData = req.body;

    let content = await SiteContent.findOne({ key: 'main_site_content' });
    if (!content) {
      content = await SiteContent.create(DEFAULT_CONTENT);
    }

    content[section] = bodyData;
    await content.save();

    return res.status(200).json({
      success: true,
      message: `Section "${section}" updated successfully.`,
      data: content[section],
    });
  } catch (error) {
    console.error('[Content Controller] Error updating section:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to update section "${req.params.section}".`,
      error: error.message,
    });
  }
};

/**
 * POST /api/content/seed
 * Admin only: Reset / Seed content to factory defaults
 */
export const seedContent = async (req, res) => {
  try {
    await SiteContent.deleteMany({});
    const content = await SiteContent.create(DEFAULT_CONTENT);

    return res.status(200).json({
      success: true,
      message: 'Site content seeded successfully to defaults.',
      data: content,
    });
  } catch (error) {
    console.error('[Content Controller] Error seeding content:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed site content.',
      error: error.message,
    });
  }
};

export default {
  getContent,
  getSectionContent,
  updateSectionContent,
  seedContent,
};
