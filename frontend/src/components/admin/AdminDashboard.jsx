'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/constants';

// Modular Subcomponents
import AdminTopBar from './AdminTopBar/AdminTopBar';
import AdminSidebar from './AdminSidebar/AdminSidebar';
import AdminOverview from './AdminOverview/AdminOverview';
import AdminProducts from './AdminProducts/AdminProducts';
import ProductModal from './AdminProducts/ProductModal';
import AdminSubcategories from './AdminSubcategories/AdminSubcategories';
import AdminHeroSlides from './AdminHeroSlides/AdminHeroSlides';
import AdminAnnouncements from './AdminAnnouncements/AdminAnnouncements';
import AdminSwipeCategories from './AdminSwipeCategories/AdminSwipeCategories';
import AdminBottomBanner from './AdminBottomBanner/AdminBottomBanner';
import AdminUsers from './AdminUsers/AdminUsers';
import AdminWhatsAppOrders from './AdminWhatsAppOrders/AdminWhatsAppOrders';
import ItemModal from './AdminCommon/ItemModal';
import DeleteConfirmModal from './AdminCommon/DeleteConfirmModal';
import AdminToast from './AdminCommon/AdminToast';

import './AdminDashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();

  // Active Tab: 'overview' | 'products' | 'media' | 'subcategories' | 'hero' | 'announcements' | 'swipeCategories' | 'bottomBanner' | 'objectsBanner' | 'users'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Overview metrics
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    vipUsers: 0,
    adminCount: 0,
    totalProducts: 0,
    selectsCount: 0,
    objectsCount: 0,
    whatsappClicks: 0,
    recentWhatsAppClicks: [],
    recentUsers: [],
  });

  // Dynamic Data Lists
  const [products, setProducts] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Loading States
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    title: '',
    handle: '',
    category: 'VEYN-SELECTS',
    subCategory: 'BAGGY',
    fit: 'baggy',
    price: '',
    comparePrice: '',
    badge: 'NEW',
    images: [''],
    availableSizes: '28, 30, 32, 34, 36',
    description: '',
    swipeCategory: 'baggy',
    featured: false,
    newArrival: false,
    inStock: true,
  });

  // Item Modal State (for Subcategories, Hero Slides, Announcements, Swipe Categories)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalConfig, setItemModalConfig] = useState({
    type: '',
    isEdit: false,
    index: -1,
    title: '',
  });
  const [itemFormData, setItemFormData] = useState({});

  // Delete Confirmation Modal State
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    type: '', // 'product' | 'contentItem' | 'media'
    id: null,
    index: -1,
    title: '',
    sectionKey: '',
  });

  // Trigger Toast Notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  }, []);

  // Auth Header Helper
  const getAuthHeaders = useCallback(() => {
    const storedToken =
      token || (typeof window !== 'undefined' ? localStorage.getItem('veyncore_token') : '');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${storedToken}`,
    };
  }, [token]);

  // Fetch Overview Metrics
  const fetchOverview = useCallback(async () => {
    try {
      setLoadingOverview(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/overview`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin overview:', err);
    } finally {
      setLoadingOverview(false);
    }
  }, [getAuthHeaders]);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(`${API_BASE_URL}/api/products?limit=250`);
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch Site Content
  const fetchContent = useCallback(async () => {
    try {
      setLoadingContent(true);
      const res = await fetch(`${API_BASE_URL}/api/content`);
      const data = await res.json();
      if (res.ok && data.success) {
        setSiteContent(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch site content:', err);
    } finally {
      setLoadingContent(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  }, [getAuthHeaders]);

  // Fetch Media Files
  const fetchMediaFiles = useCallback(async () => {
    try {
      setLoadingMedia(true);
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setMediaFiles(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch media files:', err);
    } finally {
      setLoadingMedia(false);
    }
  }, [getAuthHeaders]);

  // Initial Load
  useEffect(() => {
    if (!isLoading && user && user.role === 'admin') {
      fetchOverview();
      fetchProducts();
      fetchContent();
      fetchUsers();
      fetchMediaFiles();
    }
  }, [isLoading, user, fetchOverview, fetchProducts, fetchContent, fetchUsers, fetchMediaFiles]);

  // Seed Catalog Action
  const handleSeedCatalog = async () => {
    if (
      !window.confirm(
        'Seed default catalog products into MongoDB? Existing database products will be preserved unless forced.'
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/admin/seed?force=true`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        fetchProducts();
        fetchOverview();
      } else {
        showToast(data.message || 'Seeding failed', 'error');
      }
    } catch (err) {
      showToast('Error seeding catalog', 'error');
    }
  };

  // Seed Content Action
  const handleSeedContent = async () => {
    if (
      !window.confirm(
        'Reset all site content (Hero, Announcements, Subcategories, Bottom Banner) to factory defaults?'
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/content/admin/seed`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Site content reset to factory defaults.', 'success');
        fetchContent();
      } else {
        showToast(data.message || 'Reset failed', 'error');
      }
    } catch (err) {
      showToast('Error resetting content', 'error');
    }
  };

  // =========================================================================
  // PRODUCT HANDLERS
  // =========================================================================
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      title: '',
      handle: '',
      category: 'VEYN-SELECTS',
      subCategory: 'BAGGY',
      fit: 'baggy',
      price: '',
      comparePrice: '',
      badge: 'NEW',
      images: [''],
      availableSizes: '28, 30, 32, 34, 36',
      description: '',
      swipeCategory: 'baggy',
      featured: false,
      newArrival: false,
      inStock: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      title: product.title || '',
      handle: product.handle || '',
      category: product.category || 'VEYN-SELECTS',
      subCategory: product.subCategory || 'BAGGY',
      fit: product.fit || '',
      price: product.price ?? '',
      comparePrice: product.comparePrice ?? '',
      badge: product.badge || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      availableSizes: Array.isArray(product.availableSizes)
        ? product.availableSizes.join(', ')
        : product.availableSizes || '28, 30, 32, 34, 36',
      description: product.description || '',
      swipeCategory: product.swipeCategory || '',
      featured: Boolean(product.featured),
      newArrival: Boolean(product.newArrival),
      inStock: product.inStock !== false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const parsedSizes = productFormData.availableSizes
        ? productFormData.availableSizes.split(',').map((s) => s.trim()).filter(Boolean)
        : ['28', '30', '32', '34', '36'];

      const cleanedImages = (productFormData.images || [])
        .map((img) => img.trim())
        .filter(Boolean);

      const payload = {
        title: productFormData.title,
        handle:
          productFormData.handle ||
          productFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: productFormData.category,
        subCategory: productFormData.subCategory,
        fit: productFormData.fit || productFormData.subCategory.toLowerCase(),
        price: Number(productFormData.price) || 0,
        comparePrice: productFormData.comparePrice ? Number(productFormData.comparePrice) : null,
        badge: productFormData.badge,
        images:
          cleanedImages.length > 0 ? cleanedImages : ['/images/products/artic-blue-wide.jpg'],
        thumbnail: cleanedImages[0] || '/images/products/artic-blue-wide.jpg',
        availableSizes: parsedSizes,
        description: productFormData.description,
        swipeCategory:
          productFormData.swipeCategory || productFormData.subCategory.toLowerCase(),
        featured: productFormData.featured,
        newArrival: productFormData.newArrival,
        inStock: productFormData.inStock,
      };

      const isEdit = Boolean(editingProduct && (editingProduct._id || editingProduct.handle));
      const url = isEdit
        ? `${API_BASE_URL}/api/products/${editingProduct.handle || editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          isEdit ? 'Product updated successfully.' : 'Product created and listed live!',
          'success'
        );
        setIsProductModalOpen(false);
        fetchProducts();
        fetchOverview();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Error saving product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const updatedStock = product.inStock === false;
      const res = await fetch(`${API_BASE_URL}/api/products/${product.handle || product._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inStock: updatedStock }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          `Product marked as ${updatedStock ? 'IN STOCK' : 'SOLD OUT'}.`,
          'success'
        );
        fetchProducts();
      }
    } catch (err) {
      showToast('Error toggling stock status', 'error');
    }
  };

  const handleDeleteProduct = (product) => {
    setDeleteModalConfig({
      isOpen: true,
      type: 'product',
      id: product.handle || product._id,
      title: product.title,
    });
  };

  // =========================================================================
  // CONTENT SECTION HANDLERS (SUBCATEGORIES, HERO, ANNOUNCEMENTS, SWIPE)
  // =========================================================================
  const handleOpenItemModal = (type, isEdit = false, index = -1) => {
    const sectionList = siteContent?.[type] || [];
    const item = isEdit && index >= 0 ? sectionList[index] : {};

    setItemModalConfig({
      type,
      isEdit,
      index,
      title: isEdit ? `EDIT ${type.toUpperCase()}` : `ADD TO ${type.toUpperCase()}`,
    });

    setItemFormData(isEdit ? { ...item } : { active: true });
    setIsItemModalOpen(true);
  };

  const handleSaveContentItem = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { type, isEdit, index } = itemModalConfig;
      const currentList = [...(siteContent?.[type] || [])];

      if (isEdit && index >= 0) {
        const existing = currentList[index] || {};
        currentList[index] = {
          ...existing,
          ...itemFormData,
          id: itemFormData.id || existing.id || existing._id || `item-${Date.now()}-${index}`,
        };
      } else {
        const newItem = {
          ...itemFormData,
          id:
            itemFormData.id ||
            itemFormData.key ||
            `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          active: itemFormData.active !== false,
        };
        currentList.push(newItem);
      }

      const res = await fetch(`${API_BASE_URL}/api/content/${type}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: currentList }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Site content updated and published live.', 'success');
        setIsItemModalOpen(false);
        fetchContent();
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch (err) {
      showToast('Error saving content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleContentItem = async (type, index, field = 'active') => {
    try {
      const currentList = [...(siteContent?.[type] || [])];
      if (!currentList[index]) return;

      currentList[index] = {
        ...currentList[index],
        [field]: !currentList[index][field],
        id: currentList[index].id || currentList[index]._id || `item-${Date.now()}-${index}`,
      };

      const res = await fetch(`${API_BASE_URL}/api/content/${type}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items: currentList }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Status toggled.', 'success');
        fetchContent();
      } else {
        showToast(data.message || 'Toggle failed', 'error');
      }
    } catch (err) {
      showToast('Error updating status', 'error');
    }
  };

  const handleDeleteContentItem = (type, index) => {
    const item = siteContent?.[type]?.[index];
    setDeleteModalConfig({
      isOpen: true,
      type: 'contentItem',
      sectionKey: type,
      index,
      title: item?.title || item?.label || item?.text || 'Item',
    });
  };

  // =========================================================================
  // BOTTOM BANNER HANDLER
  // =========================================================================
  const handleSaveBottomBanner = async (bannerPayload, targetSection = 'VEYN-SELECTS') => {
    try {
      setIsSaving(true);
      const sectionKey = targetSection === 'VEYN-OBJECTS' ? 'bottomBannerObjects' : 'bottomBanner';
      const res = await fetch(`${API_BASE_URL}/api/content/${sectionKey}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          `${targetSection === 'VEYN-OBJECTS' ? 'VEYN-OBJECTS' : 'VEYN-SELECTS'} campaign banner saved live.`,
          'success'
        );
        fetchContent();
      } else {
        showToast(data.message || 'Save failed', 'error');
      }
    } catch (err) {
      showToast('Error saving banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================================
  // MEDIA FILE HANDLERS
  // =========================================================================
  const handleDeleteMedia = (filename) => {
    setDeleteModalConfig({
      isOpen: true,
      type: 'media',
      id: filename,
      title: filename,
    });
  };

  // Confirm Delete Handler (Routes to Product, ContentItem, or Media)
  const handleConfirmDelete = async () => {
    const { type, id, sectionKey, index } = deleteModalConfig;
    try {
      setIsSaving(true);

      if (type === 'product') {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Product deleted from inventory.', 'success');
          fetchProducts();
          fetchOverview();
        } else {
          showToast(data.message || 'Delete failed', 'error');
        }
      } else if (type === 'contentItem') {
        const currentList = [...(siteContent?.[sectionKey] || [])];
        currentList.splice(index, 1);

        const res = await fetch(`${API_BASE_URL}/api/content/${sectionKey}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ items: currentList }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Item deleted from section.', 'success');
          fetchContent();
        } else {
          showToast(data.message || 'Delete failed', 'error');
        }
      } else if (type === 'media') {
        const res = await fetch(`${API_BASE_URL}/api/upload/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast('Media file deleted.', 'success');
          fetchMediaFiles();
        } else {
          showToast(data.message || 'Delete failed', 'error');
        }
      }
    } catch (err) {
      showToast('Error deleting item', 'error');
    } finally {
      setIsSaving(false);
      setDeleteModalConfig({ isOpen: false, type: '', id: null, index: -1, title: '', sectionKey: '' });
    }
  };

  // Authentication Guards
  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p className="admin-loading-text">AUTHENTICATING ADMINISTRATOR ACCESS...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="admin-access-denied">
        <div className="admin-denied-card">
          <span className="admin-denied-badge">403 FORBIDDEN</span>
          <h1 className="admin-denied-heading">RESTRICTED SECTOR</h1>
          <p className="admin-denied-sub">
            The VEYNCORE Administration Command Center is reserved strictly for authorized syndicate personnel.
          </p>
          <div className="admin-denied-buttons">
            <Link href="/" className="admin-btn admin-btn--outline">
              BACK TO STOREFRONT
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--black"
              onClick={() => openAuthModal && openAuthModal('login')}
            >
              ADMINISTRATOR SIGN IN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">
      {/* Toast Notification */}
      <AdminToast toast={toast} />

      {/* Top Navbar */}
      <AdminTopBar
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onSignOut={() => {
          logout();
          router.push('/');
        }}
      />

      {/* Mobile Horizontal Quick Tabs Strip */}
      <div className="admin-mobile-quicktabs">
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'overview' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'products' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <span>Catalog</span>
          <span className="admin-mobile-quicktab__badge">{products.length}</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'whatsappOrders' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('whatsappOrders')}
        >
          <span>WhatsApp</span>
          <span className="admin-mobile-quicktab__badge">{metrics.whatsappClicks || 0}</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'subcategories' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('subcategories')}
        >
          <span>Subcategories</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'hero' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          <span>Hero Slides</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'announcements' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <span>Announcements</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'swipeCategories' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('swipeCategories')}
        >
          <span>Swipe Categories</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'bottomBanner' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('bottomBanner')}
        >
          <span>Selects Banner</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'objectsBanner' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('objectsBanner')}
        >
          <span>Objects Banner</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'users' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span>Users</span>
          <span className="admin-mobile-quicktab__badge">{metrics.totalUsers}</span>
        </button>
      </div>

      {/* Main Layout (Sidebar + Modular Content Views) */}
      <div className="admin-layout">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          metrics={metrics}
          mediaCount={mediaFiles.length}
          onSeedCatalog={handleSeedCatalog}
          onSeedContent={handleSeedContent}
        />

        <main className="admin-main">
          {activeTab === 'overview' && (
            <AdminOverview
              metrics={metrics}
              products={products}
              siteContent={siteContent}
              onAddProduct={handleOpenAddProduct}
              onNavigateTab={(tab) => {
                setActiveTab(tab);
                if (tab === 'media') fetchMediaFiles();
              }}
            />
          )}

          {activeTab === 'whatsappOrders' && (
            <AdminWhatsAppOrders
              metrics={metrics}
              getAuthHeaders={getAuthHeaders}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              loading={loadingProducts}
              onAddProduct={handleOpenAddProduct}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onToggleStock={handleToggleStock}
            />
          )}

          {activeTab === 'subcategories' && (
            <AdminSubcategories
              subcategories={siteContent?.subcategories || []}
              onAddItem={() => handleOpenItemModal('subcategories', false)}
              onEditItem={(idx) => handleOpenItemModal('subcategories', true, idx)}
              onDeleteItem={(idx) => handleDeleteContentItem('subcategories', idx)}
              onToggleItem={(idx, field) => handleToggleContentItem('subcategories', idx, field)}
            />
          )}

          {activeTab === 'hero' && (
            <AdminHeroSlides
              heroSlides={siteContent?.heroSlides || []}
              onAddSlide={() => handleOpenItemModal('heroSlides', false)}
              onEditSlide={(idx) => handleOpenItemModal('heroSlides', true, idx)}
              onDeleteSlide={(idx) => handleDeleteContentItem('heroSlides', idx)}
              onToggleSlide={(idx, field) => handleToggleContentItem('heroSlides', idx, field)}
            />
          )}

          {activeTab === 'announcements' && (
            <AdminAnnouncements
              announcements={siteContent?.announcements || []}
              onAddAnnouncement={() => handleOpenItemModal('announcements', false)}
              onEditAnnouncement={(idx) => handleOpenItemModal('announcements', true, idx)}
              onDeleteAnnouncement={(idx) => handleDeleteContentItem('announcements', idx)}
              onToggleAnnouncement={(idx, field) => handleToggleContentItem('announcements', idx, field)}
            />
          )}

          {activeTab === 'swipeCategories' && (
            <AdminSwipeCategories
              swipeCategories={siteContent?.swipeCategories || []}
              onAddItem={() => handleOpenItemModal('swipeCategories', false)}
              onEditItem={(idx) => handleOpenItemModal('swipeCategories', true, idx)}
              onDeleteItem={(idx) => handleDeleteContentItem('swipeCategories', idx)}
              onToggleItem={(idx, field) => handleToggleContentItem('swipeCategories', idx, field)}
            />
          )}

          {activeTab === 'bottomBanner' && (
            <AdminBottomBanner
              initialSection="VEYN-SELECTS"
              bannerData={siteContent?.bottomBanner}
              bannerDataObjects={siteContent?.bottomBannerObjects}
              onSaveBanner={handleSaveBottomBanner}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'objectsBanner' && (
            <AdminBottomBanner
              initialSection="VEYN-OBJECTS"
              bannerData={siteContent?.bottomBanner}
              bannerDataObjects={siteContent?.bottomBannerObjects}
              onSaveBanner={handleSaveBottomBanner}
              isSaving={isSaving}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsers
              users={usersList}
              loading={loadingUsers}
              onRefresh={fetchUsers}
            />
          )}
        </main>
      </div>

      {/* Modular Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        formData={productFormData}
        setFormData={setProductFormData}
        onSubmit={handleSaveProduct}
        isSaving={isSaving}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        config={itemModalConfig}
        formData={itemFormData}
        setFormData={setItemFormData}
        onSubmit={handleSaveContentItem}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        isOpen={deleteModalConfig.isOpen}
        onClose={() =>
          setDeleteModalConfig({ isOpen: false, type: '', id: null, index: -1, title: '', sectionKey: '' })
        }
        onConfirm={handleConfirmDelete}
        title={deleteModalConfig.title}
        message={`Are you sure you want to permanently delete "${deleteModalConfig.title}"?`}
        isDeleting={isSaving}
      />
    </div>
  );
}
