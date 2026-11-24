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
    { id: 'flash-sale', mainCategory: 'VEYN-SELECTS', label: 'FLASH SALE', href: '#flash-sale', isGlow: true, sortOrder: 1, active: true },
    { id: 'new-drops', mainCategory: 'VEYN-SELECTS', label: 'NEW DROPS', href: '/collections/all-drops', isGlow: true, sortOrder: 2, active: true },
    { id: 'all-drops', mainCategory: 'VEYN-SELECTS', label: 'ALL DROPS', href: '/collections/all-drops', isGlow: false, sortOrder: 3, active: true },

    // VEYN-OBJECTS
    { id: 'obj-drops', mainCategory: 'VEYN-OBJECTS', label: 'OBJECT DROPS', href: '#object-drops', isGlow: true, sortOrder: 0, active: true },
    { id: 'all-drops-obj', mainCategory: 'VEYN-OBJECTS', label: 'ALL DROPS', href: '/collections/objects-drops', isGlow: false, sortOrder: 1, active: true },
  ],
  heroSlides: [],
  swipeCategories: [],
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

    const contentObj = content.toObject ? content.toObject() : { ...content };
    const legacyStaticIds = new Set([
      'denims', 'cargo', 'baggy', 'bootcut', 'wide', 'straight', 'tops', 'accessories',
      'bags', 'chains', 'headwear', 'hardware', 'obj-all'
    ]);
    if (Array.isArray(contentObj.subcategories)) {
      contentObj.subcategories = contentObj.subcategories.filter(item => {
        if (item.id === 'obj-all' || item.label?.toUpperCase() === 'ALL OBJECTS') return false;
        if (legacyStaticIds.has(item.id) && (item.href === `#${item.id}` || !item.href)) return false;
        return true;
      });
    }

    if (content && Array.isArray(content.subcategories)) {
      const hadObjAll = content.subcategories.some(
        s => s.id === 'obj-all' || s.label?.toUpperCase() === 'ALL OBJECTS'
      );
      if (hadObjAll) {
        content.subcategories = content.subcategories.filter(
          s => s.id !== 'obj-all' && s.label?.toUpperCase() !== 'ALL OBJECTS'
        );
        await content.save();
      }
    }
    const legacySwipeKeys = new Set(['baggy', 'bootcut', 'wide', 'straight', 'bags', 'chains', 'caps']);
    if (Array.isArray(contentObj.swipeCategories)) {
      contentObj.swipeCategories = contentObj.swipeCategories.filter(item => {
        const key = (item.key || item.id || '').replace(/^swp-/, '').toLowerCase();
        return !legacySwipeKeys.has(key);
      });
    }

    const legacyHeroSlideIds = new Set([
      'slide-1', 'slide-2', 'slide-3',
      'obj-slide-1', 'obj-slide-2', 'obj-slide-3'
    ]);
    if (Array.isArray(contentObj.heroSlides)) {
      contentObj.heroSlides = contentObj.heroSlides.filter(
        item => !legacyHeroSlideIds.has(item.id)
      );
    }

    return res.status(200).json({
      success: true,
      data: contentObj,
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

    if (section === 'subcategories' && Array.isArray(sectionData)) {
      const legacyStaticIds = new Set([
        'denims', 'cargo', 'baggy', 'bootcut', 'wide', 'straight', 'tops', 'accessories',
        'bags', 'chains', 'headwear', 'hardware', 'obj-all'
      ]);
      sectionData = sectionData.filter(item => {
        if (item.id === 'obj-all' || item.label?.toUpperCase() === 'ALL OBJECTS') return false;
        if (legacyStaticIds.has(item.id) && (item.href === `#${item.id}` || !item.href)) {
          return false;
        }
        return true;
      });
    }

    if (section === 'swipeCategories' && Array.isArray(sectionData)) {
      const legacySwipeKeys = new Set(['baggy', 'bootcut', 'wide', 'straight', 'bags', 'chains', 'caps']);
      sectionData = sectionData.filter(item => {
        const key = (item.key || item.id || '').replace(/^swp-/, '').toLowerCase();
        return !legacySwipeKeys.has(key);
      });
    }

    if (section === 'heroSlides' && Array.isArray(sectionData)) {
      const legacyHeroSlideIds = new Set([
        'slide-1', 'slide-2', 'slide-3',
        'obj-slide-1', 'obj-slide-2', 'obj-slide-3'
      ]);
      sectionData = sectionData.filter(
        item => !legacyHeroSlideIds.has(item.id)
      );
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

    // Determine payload format: array items can arrive as { items: [...] }, [ ... ], or { [section]: [...] }
    let sectionData = bodyData;
    if (bodyData && typeof bodyData === 'object') {
      if (Array.isArray(bodyData.items)) {
        sectionData = bodyData.items;
      } else if (Array.isArray(bodyData[section])) {
        sectionData = bodyData[section];
      }
    }

    // Validate and sanitize if array section
    if (section === 'announcements') {
      const list = Array.isArray(sectionData) ? sectionData : [];
      sectionData = list
        .filter((item) => item && (item.text || item.id))
        .map((item, idx) => ({
          id: String(item.id || item._id || `ann-${Date.now()}-${idx}`),
          text: String(item.text || '').trim(),
          active: item.active !== false,
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : idx,
        }));
    } else if (section === 'subcategories') {
      const list = Array.isArray(sectionData) ? sectionData : [];
      sectionData = list
        .filter((item) => item && (item.label || item.id))
        .map((item, idx) => ({
          id: String(item.id || item._id || `sub-${Date.now()}-${idx}`),
          mainCategory: item.mainCategory === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS',
          label: String(item.label || '').trim().toUpperCase(),
          href: String(item.href || '#').trim(),
          image: String(item.image || '').trim(),
          isGlow: Boolean(item.isGlow),
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : idx,
          active: item.active !== false,
        }));
    } else if (section === 'heroSlides') {
      const list = Array.isArray(sectionData) ? sectionData : [];
      sectionData = list
        .filter((item) => item && (item.image || item.id))
        .map((item, idx) => ({
          id: String(item.id || item._id || `slide-${Date.now()}-${idx}`),
          targetSection: item.targetSection === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS',
          title: String(item.title || '').trim(),
          subtitle: String(item.subtitle || '').trim(),
          tag: String(item.tag || '').trim(),
          image: String(item.image || '').trim(),
          href: String(item.href || '/collections/all-drops').trim(),
          description: String(item.description || '').trim(),
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : idx,
          active: item.active !== false,
        }));
    } else if (section === 'swipeCategories') {
      const list = Array.isArray(sectionData) ? sectionData : [];
      sectionData = list
        .filter((item) => item && (item.key || item.label || item.id))
        .map((item, idx) => ({
          id: String(item.id || item._id || `swp-${Date.now()}-${idx}`),
          targetSection: item.targetSection === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS',
          key: String(item.key || '').trim().toLowerCase(),
          label: String(item.label || '').trim(),
          image: String(item.image || '').trim(),
          collectionPath: String(item.collectionPath || '/collections/all-drops').trim(),
          sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : idx,
          active: item.active !== false,
        }));
    }

    content[section] = sectionData;
    content.markModified(section);
    await content.save();

    return res.status(200).json({
      success: true,
      message: `Section "${section}" updated successfully.`,
      data: content[section],
    });
  } catch (error) {
    console.error(`[Content Controller] Error updating section "${req.params?.section}":`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to update section "${req.params?.section}".`,
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
