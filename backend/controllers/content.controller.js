import SiteContent from '../models/content.model.js';
import Subcategory from '../models/subcategory.model.js';

// Initial empty content structure (no hardcoded static default content)
const DEFAULT_CONTENT = {
  key: 'main_site_content',
  announcements: [],
  subcategories: [],
  heroSlides: [],
  swipeCategories: [],
  bottomBanner: {
    imageDesktop: '',
    imageMobile: '',
    altText: '',
    buttonLink: '',
    active: false,
  },
  bottomBannerObjects: {
    imageDesktop: '',
    imageMobile: '',
    altText: '',
    buttonLink: '',
    active: false,
  },
};

/**
 * GET /api/content
 * Retrieve current dynamic site content (auto-creates empty structure if none exists)
 */
export const getContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'main_site_content' }).lean();

    if (!content) {
      const created = await SiteContent.create(DEFAULT_CONTENT);
      content = created.toObject ? created.toObject() : created;
    }

    const contentObj = { ...content };

    // Reflect active subcategories from MongoDB Atlas subcategories collection
    try {
      const atlasSubs = await Subcategory.find({ active: true }).sort({ sortOrder: 1 }).lean();
      if (atlasSubs && atlasSubs.length > 0) {
        contentObj.subcategories = atlasSubs;
      }
    } catch (e) {
      // Fallback to embedded array if query fails
    }

    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
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
    let content = await SiteContent.findOne({ key: 'main_site_content' }).lean();

    if (!content) {
      const created = await SiteContent.create(DEFAULT_CONTENT);
      content = created.toObject ? created.toObject() : created;
    }

    let sectionData = content[section] !== undefined ? content[section] : DEFAULT_CONTENT[section];
    if (sectionData === undefined) {
      return res.status(404).json({
        success: false,
        message: `Section "${section}" not found.`,
      });
    }

    if (section === 'subcategories') {
      try {
        const atlasSubcategories = await Subcategory.find({ active: true }).sort({ sortOrder: 1 }).lean();
        if (atlasSubcategories && atlasSubcategories.length > 0) {
          sectionData = atlasSubcategories;
        }
      } catch (e) {
        // Fallback to embedded array if query fails
      }
    }

    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
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

    // Keep dedicated subcategories collection in MongoDB Atlas in 100% sync
    if (section === 'subcategories' && Array.isArray(sectionData)) {
      try {
        await Subcategory.deleteMany({});
        await Subcategory.insertMany(
          sectionData.map((item, idx) => ({
            id: String(item.id || `sub-${Date.now()}-${idx}`),
            slug: String(item.id || `sub-${Date.now()}-${idx}`),
            parentCategory: item.mainCategory === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS',
            mainCategory: item.mainCategory === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS',
            label: String(item.label || '').trim().toUpperCase(),
            href: String(item.href || '#').trim(),
            image: String(item.image || '').trim(),
            isGlow: Boolean(item.isGlow),
            sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : idx,
            active: item.active !== false,
          }))
        );
      } catch (syncErr) {
        console.error('[Content Controller] Error syncing subcategories to MongoDB Atlas:', syncErr);
      }
    }

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
