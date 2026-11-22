'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/constants';
import AdminImageUploader from './AdminImageUploader/AdminImageUploader';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();

  // Active Tab: 'overview' | 'products' | 'media' | 'subcategories' | 'hero' | 'announcements' | 'swipeCategories' | 'bottomBanner' | 'users'
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
    recentUsers: [],
  });

  // Dynamic Data Lists
  const [products, setProducts] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Loading & Feedback
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [copiedMediaUrl, setCopiedMediaUrl] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters for Products
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL'); // 'ALL' | 'VEYN-SELECTS' | 'VEYN-OBJECTS'
  const [productSearch, setProductSearch] = useState('');

  // Modals state
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
  });

  // Generic Item Modal (for Subcategories, Hero Slides, Announcements, Swipe Categories)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalConfig, setItemModalConfig] = useState({
    type: '', // 'subcategories' | 'heroSlides' | 'announcements' | 'swipeCategories'
    isEdit: false,
    index: -1,
    title: '',
  });
  const [itemFormData, setItemFormData] = useState({});

  // Delete Confirmation Modal
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    type: '', // 'product' | 'contentItem'
    id: null,
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
    const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('veyncore_token') : '');
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

  // Delete Media File
  const handleDeleteMedia = async (filename) => {
    if (!window.confirm(`Delete image "${filename}" permanently?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Image deleted from media storage.', 'success');
        fetchMediaFiles();
      } else {
        showToast(data.message || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting image', 'error');
    }
  };

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

  // =========================================================================
  // SEED CATALOG & CONTENT
  // =========================================================================
  const handleSeedCatalog = async () => {
    if (!window.confirm('Seed default catalog products into MongoDB? Existing database products will be preserved unless forced.')) return;
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

  const handleSeedContent = async () => {
    if (!window.confirm('Reset all site content (Hero, Announcements, Subcategories, Bottom Banner) to factory defaults?')) return;
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
  // PRODUCT CRUD
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
      availableSizes: (product.availableSizes || ['28', '30', '32', '34']).join(', '),
      description: product.description || '',
      swipeCategory: product.swipeCategory || '',
      featured: Boolean(product.featured),
      newArrival: Boolean(product.newArrival),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.title || !productFormData.price) {
      showToast('Title and Price are required.', 'error');
      return;
    }

    const payload = {
      ...productFormData,
      price: Number(productFormData.price),
      comparePrice: productFormData.comparePrice ? Number(productFormData.comparePrice) : null,
      images: productFormData.images.filter((img) => img.trim().length > 0),
      availableSizes: productFormData.availableSizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const isEdit = Boolean(editingProduct);
      const url = isEdit
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? 'Product updated successfully.' : 'Product created successfully.', 'success');
        setIsProductModalOpen(false);
        fetchProducts();
        fetchOverview();
      } else {
        showToast(data.message || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (product) => {
    setDeleteModalConfig({
      isOpen: true,
      type: 'product',
      id: product._id,
      title: product.title,
    });
  };

  const confirmDeleteProduct = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${deleteModalConfig.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || 'Product deleted.', 'success');
        setDeleteModalConfig({ isOpen: false, type: '', id: null, title: '' });
        fetchProducts();
        fetchOverview();
      } else {
        showToast(data.message || 'Deletion failed', 'error');
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
      const searchLower = productSearch.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        p.title.toLowerCase().includes(searchLower) ||
        p.handle.toLowerCase().includes(searchLower) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(searchLower));
      return matchesCat && matchesSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  // =========================================================================
  // CONTENT MANAGEMENT (Hero, Subcategories, Announcements, Swipe, Banner)
  // =========================================================================
  const updateSectionApi = async (sectionKey, newSectionData, successMsg) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/content/${sectionKey}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSectionData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(successMsg || 'Content updated successfully.', 'success');
        setSiteContent((prev) => ({
          ...prev,
          [sectionKey]: newSectionData,
        }));
      } else {
        showToast(data.message || 'Update failed', 'error');
      }
    } catch (err) {
      showToast('Network error updating content', 'error');
    }
  };

  // Open Modal for Generic Items
  const handleOpenAddItem = (type) => {
    setItemModalConfig({
      type,
      isEdit: false,
      index: -1,
      title: `Add New ${type.slice(0, -1)}`,
    });

    if (type === 'announcements') {
      setItemFormData({ id: `ann-${Date.now()}`, text: '', active: true, sortOrder: 0 });
    } else if (type === 'subcategories') {
      setItemFormData({
        id: `sub-${Date.now()}`,
        mainCategory: 'VEYN-SELECTS',
        label: '',
        href: '#',
        isGlow: false,
        active: true,
      });
    } else if (type === 'heroSlides') {
      setItemFormData({
        id: `hero-${Date.now()}`,
        targetSection: 'VEYN-SELECTS',
        title: '',
        subtitle: '',
        tag: '',
        image: '',
        href: '/collections/all-drops',
        active: true,
      });
    } else if (type === 'swipeCategories') {
      setItemFormData({
        id: `swp-${Date.now()}`,
        targetSection: 'VEYN-SELECTS',
        key: '',
        label: '',
        collectionPath: '/collections/all-drops',
        active: true,
      });
    }
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (type, item, index) => {
    setItemModalConfig({
      type,
      isEdit: true,
      index,
      title: `Edit ${type.slice(0, -1)}`,
    });
    setItemFormData({ ...item });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const { type, isEdit, index } = itemModalConfig;
    const currentList = siteContent?.[type] || [];
    let updatedList = [];

    if (isEdit) {
      updatedList = currentList.map((item, idx) => (idx === index ? itemFormData : item));
    } else {
      updatedList = [...currentList, itemFormData];
    }

    await updateSectionApi(type, updatedList, `${type} updated successfully.`);
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (type, index, itemTitle) => {
    setDeleteModalConfig({
      isOpen: true,
      type: 'contentItem',
      id: index,
      title: itemTitle || `Item #${index + 1}`,
      sectionKey: type,
    });
  };

  const confirmDeleteItem = async () => {
    const { sectionKey, id: index } = deleteModalConfig;
    const currentList = siteContent?.[sectionKey] || [];
    const updatedList = currentList.filter((_, idx) => idx !== index);
    await updateSectionApi(sectionKey, updatedList, 'Item removed.');
    setDeleteModalConfig({ isOpen: false, type: '', id: null, title: '', sectionKey: '' });
  };

  // Toggle item active status instantly
  const handleToggleActive = async (type, index) => {
    const currentList = siteContent?.[type] || [];
    const updatedList = currentList.map((item, idx) => {
      if (idx === index) {
        return { ...item, active: !item.active };
      }
      return item;
    });
    await updateSectionApi(type, updatedList, 'Status updated.');
  };

  // Update Bottom Banner
  const handleSaveBottomBanner = async (e) => {
    e.preventDefault();
    await updateSectionApi('bottomBanner', siteContent.bottomBanner, 'Bottom banner updated.');
  };

  // =========================================================================
  // ACCESS RESTRICTION & LOADING CHECK
  // =========================================================================
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
              onClick={() => openAuthModal('login')}
            >
              AUTHENTICATE AS ADMIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-app">
      {/* Toast Notification */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`} role="status">
          <span className="admin-toast__icon">
            {toast.type === 'success' ? '✓' : '⚠'}
          </span>
          <span className="admin-toast__message">{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            <span className={`admin-mobile-burger ${mobileMenuOpen ? 'admin-mobile-burger--open' : ''}`}>
              <span />
              <span />
              <span />
            </span>
          </button>
          <img
            src="/images/veyncoreLogo_black.svg"
            alt="VEYNCORE"
            className="admin-topbar__logo"
          />
          <div className="admin-topbar__badge">
            <span className="admin-topbar__dot" />
            <span className="admin-topbar__badge-text">LIVE ADMIN CONSOLE</span>
          </div>
        </div>

        <div className="admin-topbar__right">
          <div className="admin-topbar__user">
            <span className="admin-topbar__user-email">{user?.email || 'admin@veyncore.in'}</span>
            <span className="admin-topbar__user-role">ADMINISTRATOR</span>
          </div>
          <Link href="/" className="admin-btn admin-btn--sm admin-btn--outline admin-hide-mobile" target="_blank">
            VIEW STORE ↗
          </Link>
          <button
            type="button"
            className="admin-btn admin-btn--sm admin-btn--black"
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            SIGN OUT
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Quick Tabs Strip (Immediately below topbar with 0 gap) */}
      <div className="admin-mobile-quicktabs">
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'overview' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'products' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Catalog</span>
          <span className="admin-mobile-quicktab__badge">{products.length}</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'subcategories' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('subcategories')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>Subcategories</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'hero' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('hero')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span>Hero Slides</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'announcements' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <span>Announcements</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'swipeCategories' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('swipeCategories')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
          <span>Swipe Categories</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'bottomBanner' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('bottomBanner')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span>Bottom Banner</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'media' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => {
            setActiveTab('media');
            fetchMediaFiles();
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Media Vault</span>
          <span className="admin-mobile-quicktab__badge">{mediaFiles.length}</span>
        </button>
        <button
          type="button"
          className={`admin-mobile-quicktab ${activeTab === 'users' ? 'admin-mobile-quicktab--active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span>Users</span>
          <span className="admin-mobile-quicktab__badge">{metrics.totalUsers}</span>
        </button>
      </div>

      {/* Main Layout (Sidebar + Content Body) */}
      <div className="admin-layout">
        {/* Mobile Drawer Backdrop */}
        {mobileMenuOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Modern Sidebar (Desktop sticky + Mobile slide-over drawer) */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? 'admin-sidebar--mobile-open' : ''}`}>
          <div className="admin-sidebar__mobile-header">
            <span className="admin-sidebar__mobile-title">ADMIN NAVIGATION</span>
            <button
              type="button"
              className="admin-sidebar__mobile-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <div className="admin-sidebar__menu">
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'overview' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              <span>Dashboard Overview</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'products' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('products');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Products Catalog</span>
              <span className="admin-nav-item__count">{products.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'media' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('media');
                setMobileMenuOpen(false);
                fetchMediaFiles();
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Media Library</span>
              <span className="admin-nav-item__count">{mediaFiles.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'subcategories' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('subcategories');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>Subcategories</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'hero' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('hero');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span>Hero Section</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'announcements' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('announcements');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span>Announcement Bar</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'swipeCategories' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('swipeCategories');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
              <span>Swipe Categories</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'bottomBanner' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('bottomBanner');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Bottom Banner</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'users' ? 'admin-nav-item--active' : ''}`}
              onClick={() => {
                setActiveTab('users');
                setMobileMenuOpen(false);
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users Syndicate</span>
              <span className="admin-nav-item__count">{metrics.totalUsers}</span>
            </button>
          </div>

          {/* Quick Setup Actions */}
          <div className="admin-sidebar__footer">
            <span className="admin-sidebar__footer-label">FACTORY DATA SEEDING</span>
            <button
              type="button"
              className="admin-btn admin-btn--xs admin-btn--outline admin-btn--full"
              onClick={handleSeedCatalog}
            >
              SEED PRODUCTS CATALOG
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--xs admin-btn--outline admin-btn--full"
              style={{ marginTop: '6px' }}
              onClick={handleSeedContent}
            >
              RESET CONTENT DEFAULTS
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="admin-main">
          {/* ===============================================================
              TAB 1: OVERVIEW DASHBOARD
              =============================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">COMMAND CENTER OVERVIEW</h1>
                  <p className="admin-view__subtitle">
                    Real-time database analytics and store configuration summary.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={handleOpenAddProduct}
                  >
                    + ADD NEW PRODUCT
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="admin-kpi-grid">
                <div className="admin-kpi-card">
                  <span className="admin-kpi-card__label">TOTAL PRODUCTS</span>
                  <div className="admin-kpi-card__val">{products.length}</div>
                  <span className="admin-kpi-card__sub">
                    {products.filter((p) => p.category === 'VEYN-SELECTS').length} Selects &bull;{' '}
                    {products.filter((p) => p.category === 'VEYN-OBJECTS').length} Objects
                  </span>
                </div>

                <div className="admin-kpi-card">
                  <span className="admin-kpi-card__label">REGISTERED USERS</span>
                  <div className="admin-kpi-card__val">{metrics.totalUsers}</div>
                  <span className="admin-kpi-card__sub">Authenticated via MongoDB</span>
                </div>

                <div className="admin-kpi-card">
                  <span className="admin-kpi-card__label">VIP NOTIFICATIONS</span>
                  <div className="admin-kpi-card__val">{metrics.vipUsers}</div>
                  <span className="admin-kpi-card__sub">Opted-in for secret drop alerts</span>
                </div>

                <div className="admin-kpi-card">
                  <span className="admin-kpi-card__label">ACTIVE ANNOUNCEMENTS</span>
                  <div className="admin-kpi-card__val">
                    {siteContent?.announcements?.filter((a) => a.active)?.length || 0}
                  </div>
                  <span className="admin-kpi-card__sub">Streaming on top ticker</span>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div className="admin-shortcuts">
                <h3 className="admin-section-heading">QUICK MANAGEMENT SHORTCUTS</h3>
                <div className="admin-shortcuts__grid">
                  <button
                    type="button"
                    className="admin-shortcut-card"
                    onClick={() => setActiveTab('products')}
                  >
                    <span className="admin-shortcut-card__icon">🛍️</span>
                    <div>
                      <h4>Manage Products</h4>
                      <p>Add, edit price, images, sizes, and stock status.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="admin-shortcut-card"
                    onClick={() => setActiveTab('hero')}
                  >
                    <span className="admin-shortcut-card__icon">🖼️</span>
                    <div>
                      <h4>Hero Carousel</h4>
                      <p>Update homepage slides, hero text, and call-to-actions.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="admin-shortcut-card"
                    onClick={() => setActiveTab('subcategories')}
                  >
                    <span className="admin-shortcut-card__icon">⚡️</span>
                    <div>
                      <h4>Subcategories Bar</h4>
                      <p>Manage sticky navigation items and glowing tags.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="admin-shortcut-card"
                    onClick={() => setActiveTab('bottomBanner')}
                  >
                    <span className="admin-shortcut-card__icon">📢</span>
                    <div>
                      <h4>Bottom Banner</h4>
                      <p>Customize the editorial denim campaign banner.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Users preview */}
              <div className="admin-card" style={{ marginTop: '32px' }}>
                <div className="admin-card__header">
                  <h3 className="admin-card__title">RECENT USER REGISTRATIONS</h3>
                  <button
                    type="button"
                    className="admin-btn admin-btn--xs admin-btn--outline"
                    onClick={() => setActiveTab('users')}
                  >
                    VIEW ALL USERS
                  </button>
                </div>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>MOBILE</th>
                        <th>ROLE</th>
                        <th>VIP</th>
                        <th>JOINED</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.recentUsers && metrics.recentUsers.length > 0 ? (
                        metrics.recentUsers.slice(0, 5).map((u) => (
                          <tr key={u._id || u.id}>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.mobileNumber || '—'}</td>
                            <td>
                              <span className={`admin-badge admin-badge--${u.role}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  u.vipNotifications ? 'vip' : 'standard'
                                }`}
                              >
                                {u.vipNotifications ? 'YES' : 'NO'}
                              </span>
                            </td>
                            <td style={{ color: '#71717a' }}>
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#71717a' }}>
                            No users registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 2: PRODUCTS MANAGER (DYNAMIC CRUD)
              =============================================================== */}
          {activeTab === 'products' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">PRODUCTS INVENTORY</h1>
                  <p className="admin-view__subtitle">
                    Dynamic management for VEYN-SELECTS denims &amp; VEYN-OBJECTS utilitarian hardware.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={handleOpenAddProduct}
                  >
                    + ADD PRODUCT
                  </button>
                </div>
              </div>

              {/* Filters Strip */}
              <div className="admin-filters-bar">
                <div className="admin-filter-pills">
                  <button
                    type="button"
                    className={`admin-filter-pill ${
                      productCategoryFilter === 'ALL' ? 'admin-filter-pill--active' : ''
                    }`}
                    onClick={() => setProductCategoryFilter('ALL')}
                  >
                    ALL PRODUCTS ({products.length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${
                      productCategoryFilter === 'VEYN-SELECTS' ? 'admin-filter-pill--active' : ''
                    }`}
                    onClick={() => setProductCategoryFilter('VEYN-SELECTS')}
                  >
                    VEYN-SELECTS (
                    {products.filter((p) => p.category === 'VEYN-SELECTS').length})
                  </button>
                  <button
                    type="button"
                    className={`admin-filter-pill ${
                      productCategoryFilter === 'VEYN-OBJECTS' ? 'admin-filter-pill--active' : ''
                    }`}
                    onClick={() => setProductCategoryFilter('VEYN-OBJECTS')}
                  >
                    VEYN-OBJECTS (
                    {products.filter((p) => p.category === 'VEYN-OBJECTS').length})
                  </button>
                </div>

                <div className="admin-search-wrap">
                  <input
                    type="text"
                    placeholder="Search by title, handle, fit..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="admin-search-input"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      className="admin-search-clear"
                      onClick={() => setProductSearch('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Products Table */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>IMAGE</th>
                        <th>TITLE &amp; HANDLE</th>
                        <th>CATEGORY</th>
                        <th>SUBCATEGORY</th>
                        <th>PRICE</th>
                        <th>BADGE</th>
                        <th>STOCK</th>
                        <th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                          <tr key={p._id || p.handle}>
                            <td style={{ width: '64px' }}>
                              <img
                                src={p.thumbnail || p.images?.[0] || '/images/products/artic-blue-wide.jpg'}
                                alt={p.title}
                                className="admin-product-thumb"
                              />
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, fontSize: '13px' }}>{p.title}</div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>
                                /products/{p.handle}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  p.category === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                                }`}
                              >
                                {p.category}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', fontWeight: 600 }}>
                                {p.subCategory || p.fit || '—'}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700 }}>
                                Rs. {Number(p.price).toLocaleString('en-IN')}.00
                              </div>
                              {p.comparePrice && (
                                <div style={{ fontSize: '11px', color: '#71717a', textDecoration: 'line-through' }}>
                                  Rs. {Number(p.comparePrice).toLocaleString('en-IN')}.00
                                </div>
                              )}
                            </td>
                            <td>
                              {p.badge ? (
                                <span className="admin-badge admin-badge--badge">
                                  {p.badge}
                                </span>
                              ) : (
                                <span style={{ color: '#a1a1aa' }}>—</span>
                              )}
                            </td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  p.inStock !== false ? 'in-stock' : 'out-stock'
                                }`}
                              >
                                {p.inStock !== false ? 'IN STOCK' : 'SOLD OUT'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="admin-row-actions">
                                <Link
                                  href={`/products/${p.handle}`}
                                  target="_blank"
                                  className="admin-icon-btn"
                                  title="View Live Product"
                                >
                                  ↗
                                </Link>
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  title="Edit Product"
                                  onClick={() => handleOpenEditProduct(p)}
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn admin-icon-btn--danger"
                                  title="Delete Product"
                                  onClick={() => handleDeleteProduct(p)}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ color: '#71717a', marginBottom: '12px' }}>
                              No products found matching your filter criteria.
                            </p>
                            <button
                              type="button"
                              className="admin-btn admin-btn--sm admin-btn--black"
                              onClick={handleOpenAddProduct}
                            >
                              + Create First Product
                            </button>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB: MEDIA ASSET VAULT
              =============================================================== */}
          {activeTab === 'media' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">MEDIA ASSET VAULT</h1>
                  <p className="admin-view__subtitle">
                    Centralized image storage for product shoots, campaign hero banners, and brand graphics.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--outline"
                    onClick={fetchMediaFiles}
                    disabled={loadingMedia}
                  >
                    {loadingMedia ? 'SYNCING...' : 'REFRESH VAULT'}
                  </button>
                </div>
              </div>

              {/* Upload Dropzone Card */}
              <div className="admin-card" style={{ marginBottom: '24px' }}>
                <h3 className="admin-card__title" style={{ marginBottom: '16px' }}>
                  UPLOAD NEW IMAGE TO STORAGE
                </h3>
                <AdminImageUploader
                  label="DROP OR SELECT IMAGE"
                  value=""
                  onChange={(newUrl) => {
                    showToast('Media file uploaded successfully!', 'success');
                    fetchMediaFiles();
                  }}
                  aspectRatio="16/9"
                  placeholder="https://... or upload local file"
                  helpText="Files are permanently stored on the server and can be linked in any product or banner."
                />
              </div>

              {/* Media Filter & Stats Bar */}
              <div className="admin-card">
                <div className="admin-card__header">
                  <div className="admin-search-box" style={{ maxWidth: '340px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Search uploaded filename..."
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>
                    {mediaFiles.length} Total Uploaded Files
                  </span>
                </div>

                {/* Media Cards Grid */}
                {mediaFiles.filter((f) => f.filename.toLowerCase().includes(mediaSearch.toLowerCase())).length > 0 ? (
                  <div className="admin-media-grid">
                    {mediaFiles
                      .filter((f) => f.filename.toLowerCase().includes(mediaSearch.toLowerCase()))
                      .map((file) => (
                        <div key={file.filename} className="admin-media-card">
                          <div className="admin-media-card__thumb-wrap">
                            <img
                              src={file.url}
                              alt={file.filename}
                              className="admin-media-card__thumb"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/products/artic-blue-wide.jpg';
                              }}
                            />
                          </div>
                          <div className="admin-media-card__body">
                            <div className="admin-media-card__name" title={file.filename}>
                              {file.filename}
                            </div>
                            <div className="admin-media-card__meta">
                              <span>{(file.size / 1024).toFixed(1)} KB</span>
                              <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                            </div>
                            <input
                              type="text"
                              readOnly
                              value={file.url}
                              className="admin-media-card__url-input"
                              onClick={(e) => e.target.select()}
                            />
                            <div className="admin-media-card__actions">
                              <button
                                type="button"
                                className="admin-btn admin-btn--xs admin-btn--outline"
                                style={{ flex: 1 }}
                                onClick={() => {
                                  navigator.clipboard.writeText(file.url);
                                  setCopiedMediaUrl(file.filename);
                                  setTimeout(() => setCopiedMediaUrl(null), 2000);
                                }}
                              >
                                {copiedMediaUrl === file.filename ? '✓ Copied' : 'Copy URL'}
                              </button>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="admin-btn admin-btn--xs admin-btn--outline"
                                title="Open full image"
                              >
                                ↗
                              </a>
                              <button
                                type="button"
                                className="admin-btn admin-btn--xs admin-btn--outline"
                                style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                title="Delete file"
                                onClick={() => handleDeleteMedia(file.filename)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#71717a' }}>
                    <p style={{ marginBottom: '8px', fontSize: '13px' }}>
                      No media files found matching your search.
                    </p>
                    <p style={{ fontSize: '12px', color: '#a1a1aa' }}>
                      Drag and drop an image file in the upload zone above to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 3: SUBCATEGORIES MANAGER
              =============================================================== */}
          {activeTab === 'subcategories' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">SUBCATEGORIES NAVIGATION</h1>
                  <p className="admin-view__subtitle">
                    Configure the sticky secondary menu items below the navbar for both Selects and Objects.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={() => handleOpenAddItem('subcategories')}
                  >
                    + ADD SUBCATEGORY
                  </button>
                </div>
              </div>

              {/* Subcategories Table */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>LABEL</th>
                        <th>MAIN CATEGORY</th>
                        <th>LINK / ROUTE</th>
                        <th>GLOW ACCENT</th>
                        <th>ACTIVE</th>
                        <th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent?.subcategories && siteContent.subcategories.length > 0 ? (
                        siteContent.subcategories.map((sub, idx) => (
                          <tr key={sub.id || idx}>
                            <td style={{ fontWeight: 700 }}>{sub.label}</td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  sub.mainCategory === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                                }`}
                              >
                                {sub.mainCategory || 'VEYN-SELECTS'}
                              </span>
                            </td>
                            <td>
                              <code>{sub.href}</code>
                            </td>
                            <td>
                              {sub.isGlow ? (
                                <span className="admin-badge admin-badge--vip">⚡️ GLOW</span>
                              ) : (
                                <span style={{ color: '#a1a1aa' }}>Standard</span>
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-toggle-switch ${
                                  sub.active !== false ? 'admin-toggle-switch--on' : ''
                                }`}
                                onClick={() => handleToggleActive('subcategories', idx)}
                              >
                                <span className="admin-toggle-switch__thumb" />
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="admin-row-actions">
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  onClick={() => handleOpenEditItem('subcategories', sub, idx)}
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn admin-icon-btn--danger"
                                  onClick={() => handleDeleteItem('subcategories', idx, sub.label)}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#71717a' }}>
                            No subcategories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 4: HERO SECTION MANAGER
              =============================================================== */}
          {activeTab === 'hero' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">HERO SECTION SLIDES</h1>
                  <p className="admin-view__subtitle">
                    Control the continuous hero carousel slides for VEYN-SELECTS and VEYN-OBJECTS.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={() => handleOpenAddItem('heroSlides')}
                  >
                    + ADD HERO SLIDE
                  </button>
                </div>
              </div>

              {/* Hero Cards Grid */}
              <div className="admin-hero-cards-grid">
                {siteContent?.heroSlides && siteContent.heroSlides.length > 0 ? (
                  siteContent.heroSlides.map((slide, idx) => (
                    <div key={slide.id || idx} className="admin-hero-card">
                      <div className="admin-hero-card__media">
                        <img
                          src={slide.image || '/images/hero/heroimg01.jpg'}
                          alt={slide.title}
                          className="admin-hero-card__img"
                        />
                        <span className="admin-hero-card__section-badge">
                          {slide.targetSection || 'VEYN-SELECTS'}
                        </span>
                        {slide.tag && (
                          <span className="admin-hero-card__tag-badge">{slide.tag}</span>
                        )}
                      </div>

                      <div className="admin-hero-card__body">
                        <h4 className="admin-hero-card__title">{slide.title || 'Untitled Slide'}</h4>
                        <p className="admin-hero-card__sub">{slide.subtitle || 'No subtitle'}</p>
                        <div className="admin-hero-card__href">
                          <code>{slide.href || '/'}</code>
                        </div>

                        <div className="admin-hero-card__footer">
                          <label className="admin-toggle-label">
                            <button
                              type="button"
                              className={`admin-toggle-switch ${
                                slide.active !== false ? 'admin-toggle-switch--on' : ''
                              }`}
                              onClick={() => handleToggleActive('heroSlides', idx)}
                            >
                              <span className="admin-toggle-switch__thumb" />
                            </button>
                            <span>{slide.active !== false ? 'Active' : 'Disabled'}</span>
                          </label>

                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="admin-icon-btn"
                              onClick={() => handleOpenEditItem('heroSlides', slide, idx)}
                            >
                              ✎
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn admin-icon-btn--danger"
                              onClick={() => handleDeleteItem('heroSlides', idx, slide.title)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#71717a' }}>No hero slides configured.</p>
                )}
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 5: ANNOUNCEMENT BAR MANAGER
              =============================================================== */}
          {activeTab === 'announcements' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">ANNOUNCEMENT TICKER</h1>
                  <p className="admin-view__subtitle">
                    Manage the top scrolling ticker announcements across the store.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={() => handleOpenAddItem('announcements')}
                  >
                    + ADD ANNOUNCEMENT
                  </button>
                </div>
              </div>

              {/* Announcements List */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ANNOUNCEMENT TEXT</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent?.announcements && siteContent.announcements.length > 0 ? (
                        siteContent.announcements.map((ann, idx) => (
                          <tr key={ann.id || idx}>
                            <td style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                              &bull; {ann.text}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-toggle-switch ${
                                  ann.active !== false ? 'admin-toggle-switch--on' : ''
                                }`}
                                onClick={() => handleToggleActive('announcements', idx)}
                              >
                                <span className="admin-toggle-switch__thumb" />
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="admin-row-actions">
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  onClick={() => handleOpenEditItem('announcements', ann, idx)}
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn admin-icon-btn--danger"
                                  onClick={() => handleDeleteItem('announcements', idx, ann.text)}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} style={{ textAlign: 'center', color: '#71717a' }}>
                            No announcements found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 6: SWIPE CATEGORIES MANAGER
              =============================================================== */}
          {activeTab === 'swipeCategories' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">HOMEPAGE SWIPE CATEGORIES</h1>
                  <p className="admin-view__subtitle">
                    Configure the horizontal denim fits (Baggy, Bootcut, Wide, Straight) and object drops rows.
                  </p>
                </div>
                <div className="admin-view__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--black"
                    onClick={() => handleOpenAddItem('swipeCategories')}
                  >
                    + ADD SWIPE CATEGORY
                  </button>
                </div>
              </div>

              {/* Swipe Categories Table */}
              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>LABEL</th>
                        <th>KEY IDENTIFIER</th>
                        <th>TARGET SECTION</th>
                        <th>COLLECTION ROUTE</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'right' }}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siteContent?.swipeCategories && siteContent.swipeCategories.length > 0 ? (
                        siteContent.swipeCategories.map((swp, idx) => (
                          <tr key={swp.id || idx}>
                            <td style={{ fontWeight: 800 }}>{swp.label}</td>
                            <td>
                              <code>{swp.key}</code>
                            </td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  swp.targetSection === 'VEYN-OBJECTS' ? 'objects' : 'selects'
                                }`}
                              >
                                {swp.targetSection || 'VEYN-SELECTS'}
                              </span>
                            </td>
                            <td>
                              <code>{swp.collectionPath}</code>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`admin-toggle-switch ${
                                  swp.active !== false ? 'admin-toggle-switch--on' : ''
                                }`}
                                onClick={() => handleToggleActive('swipeCategories', idx)}
                              >
                                <span className="admin-toggle-switch__thumb" />
                              </button>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="admin-row-actions">
                                <button
                                  type="button"
                                  className="admin-icon-btn"
                                  onClick={() => handleOpenEditItem('swipeCategories', swp, idx)}
                                >
                                  ✎
                                </button>
                                <button
                                  type="button"
                                  className="admin-icon-btn admin-icon-btn--danger"
                                  onClick={() => handleDeleteItem('swipeCategories', idx, swp.label)}
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#71717a' }}>
                            No swipe categories found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 7: BOTTOM BANNER MANAGER
              =============================================================== */}
          {activeTab === 'bottomBanner' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">EDITORIAL BOTTOM BANNER</h1>
                  <p className="admin-view__subtitle">
                    Configure the full-width campaign banner situated directly above the footer.
                  </p>
                </div>
              </div>

              <div className="admin-banner-editor">
                {/* Visual Live Preview */}
                <div className="admin-card">
                  <h3 className="admin-card__title" style={{ marginBottom: '16px' }}>
                    LIVE PREVIEW
                  </h3>
                  <div className="admin-banner-preview">
                    <img
                      src={siteContent?.bottomBanner?.imageDesktop || '/images/ImageBanner.png'}
                      alt="Banner Preview"
                      className="admin-banner-preview__img"
                    />
                  </div>
                </div>

                {/* Edit Form */}
                <form className="admin-card" onSubmit={handleSaveBottomBanner}>
                  <h3 className="admin-card__title" style={{ marginBottom: '20px' }}>
                    BANNER CONFIGURATION
                  </h3>

                  <AdminImageUploader
                    label="DESKTOP BANNER IMAGE"
                    value={siteContent?.bottomBanner?.imageDesktop || ''}
                    onChange={(newUrl) =>
                      setSiteContent((prev) => ({
                        ...prev,
                        bottomBanner: {
                          ...prev.bottomBanner,
                          imageDesktop: newUrl,
                        },
                      }))
                    }
                    aspectRatio="21/9"
                    placeholder="/images/ImageBanner.png"
                    required
                    helpText="Desktop banner landscape image (recommended 1920x800px)."
                  />

                  <AdminImageUploader
                    label="MOBILE BANNER IMAGE"
                    value={siteContent?.bottomBanner?.imageMobile || ''}
                    onChange={(newUrl) =>
                      setSiteContent((prev) => ({
                        ...prev,
                        bottomBanner: {
                          ...prev.bottomBanner,
                          imageMobile: newUrl,
                        },
                      }))
                    }
                    aspectRatio="16/9"
                    placeholder="/images/ImageBanner-Mob.png"
                    required
                    helpText="Mobile banner image optimized for vertical viewports."
                  />

                  <div className="admin-form-group">
                    <label className="admin-form-label">ALT TEXT</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={siteContent?.bottomBanner?.altText || ''}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          bottomBanner: {
                            ...prev.bottomBanner,
                            altText: e.target.value,
                          },
                        }))
                      }
                      placeholder="VEYNCORE Denim Campaign"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">TARGET COLLECTION LINK</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={siteContent?.bottomBanner?.buttonLink || ''}
                      onChange={(e) =>
                        setSiteContent((prev) => ({
                          ...prev,
                          bottomBanner: {
                            ...prev.bottomBanner,
                            buttonLink: e.target.value,
                          },
                        }))
                      }
                      placeholder="/collections/all-drops"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={siteContent?.bottomBanner?.active !== false}
                        onChange={(e) =>
                          setSiteContent((prev) => ({
                            ...prev,
                            bottomBanner: {
                              ...prev.bottomBanner,
                              active: e.target.checked,
                            },
                          }))
                        }
                      />
                      <span>Banner Visible on Storefront</span>
                    </label>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <button type="submit" className="admin-btn admin-btn--black">
                      SAVE BOTTOM BANNER CHANGES
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===============================================================
              TAB 8: USERS SYNDICATE
              =============================================================== */}
          {activeTab === 'users' && (
            <div className="admin-view">
              <div className="admin-view__header">
                <div>
                  <h1 className="admin-view__title">USERS SYNDICATE</h1>
                  <p className="admin-view__subtitle">
                    Registered customer and administrator accounts in MongoDB.
                  </p>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>EMAIL ADDRESS</th>
                        <th>MOBILE NUMBER</th>
                        <th>ROLE</th>
                        <th>VIP NOTIFICATIONS</th>
                        <th>JOINED DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length > 0 ? (
                        usersList.map((u) => (
                          <tr key={u._id || u.id}>
                            <td style={{ fontWeight: 600 }}>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.mobileNumber || '—'}</td>
                            <td>
                              <span className={`admin-badge admin-badge--${u.role}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`admin-badge admin-badge--${
                                  u.vipNotifications ? 'vip' : 'standard'
                                }`}
                              >
                                {u.vipNotifications ? 'VIP ENABLED' : 'STANDARD'}
                              </span>
                            </td>
                            <td style={{ color: '#71717a' }}>
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', color: '#71717a' }}>
                            No users registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===================================================================
          MODAL: PRODUCT ADD / EDIT
          =================================================================== */}
      {isProductModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsProductModalOpen(false)}>
          <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">
                {editingProduct ? `EDIT PRODUCT: ${editingProduct.title}` : 'ADD NEW PRODUCT'}
              </h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setIsProductModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="admin-modal__form">
              <div className="admin-form-grid">
                {/* Title */}
                <div className="admin-form-group">
                  <label className="admin-form-label">PRODUCT TITLE *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productFormData.title}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. VEXO BLUE BAGGY"
                    required
                  />
                </div>

                {/* Handle / Slug */}
                <div className="admin-form-group">
                  <label className="admin-form-label">HANDLE / URL SLUG</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productFormData.handle}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, handle: e.target.value }))
                    }
                    placeholder="auto-generated if empty (e.g. vexo-blue-baggy)"
                  />
                </div>

                {/* Main Category */}
                <div className="admin-form-group">
                  <label className="admin-form-label">MAIN CATEGORY *</label>
                  <select
                    className="admin-form-select"
                    value={productFormData.category}
                    onChange={(e) =>
                      setProductFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                        subCategory: e.target.value === 'VEYN-OBJECTS' ? 'BAGS' : 'BAGGY',
                      }))
                    }
                  >
                    <option value="VEYN-SELECTS">VEYN-SELECTS (Denims &amp; Apparel)</option>
                    <option value="VEYN-OBJECTS">VEYN-OBJECTS (Hardware &amp; Utility)</option>
                  </select>
                </div>

                {/* Subcategory */}
                <div className="admin-form-group">
                  <label className="admin-form-label">SUBCATEGORY</label>
                  {productFormData.category === 'VEYN-OBJECTS' ? (
                    <select
                      className="admin-form-select"
                      value={productFormData.subCategory}
                      onChange={(e) =>
                        setProductFormData((prev) => ({ ...prev, subCategory: e.target.value }))
                      }
                    >
                      <option value="BAGS">BAGS &amp; UTILITY</option>
                      <option value="CHAINS">CHAINS &amp; HARDWARE</option>
                      <option value="CAPS">CAPS &amp; HEADWEAR</option>
                      <option value="HARDWARE">TACTICAL HARDWARE</option>
                    </select>
                  ) : (
                    <select
                      className="admin-form-select"
                      value={productFormData.subCategory}
                      onChange={(e) =>
                        setProductFormData((prev) => ({
                          ...prev,
                          subCategory: e.target.value,
                          fit: e.target.value.toLowerCase(),
                          swipeCategory: e.target.value.toLowerCase(),
                        }))
                      }
                    >
                      <option value="BAGGY">BAGGY FIT</option>
                      <option value="BOOTCUT">BOOTCUT FIT</option>
                      <option value="WIDE">WIDE LEG FIT</option>
                      <option value="STRAIGHT">STRAIGHT FIT</option>
                      <option value="CARGO">CARGO</option>
                      <option value="TOPS">TOPS &amp; HOODIES</option>
                      <option value="ACCESSORIES">ACCESSORIES</option>
                    </select>
                  )}
                </div>

                {/* Price */}
                <div className="admin-form-group">
                  <label className="admin-form-label">SALE PRICE (₹ INR) *</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="1499"
                    required
                  />
                </div>

                {/* Compare Price */}
                <div className="admin-form-group">
                  <label className="admin-form-label">REGULAR / COMPARE PRICE (₹ INR)</label>
                  <input
                    type="number"
                    className="admin-form-input"
                    value={productFormData.comparePrice}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, comparePrice: e.target.value }))
                    }
                    placeholder="1700"
                  />
                </div>

                {/* Badge */}
                <div className="admin-form-group">
                  <label className="admin-form-label">PRODUCT BADGE</label>
                  <select
                    className="admin-form-select"
                    value={productFormData.badge}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, badge: e.target.value }))
                    }
                  >
                    <option value="">(No Badge)</option>
                    <option value="NEW">NEW</option>
                    <option value="SALE">SALE</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="MUST HAVE">MUST HAVE</option>
                    <option value="EXCLUSIVE">EXCLUSIVE</option>
                    <option value="HOT">HOT</option>
                  </select>
                </div>

                {/* Available Sizes */}
                <div className="admin-form-group">
                  <label className="admin-form-label">SIZES (Comma-separated)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={productFormData.availableSizes}
                    onChange={(e) =>
                      setProductFormData((prev) => ({ ...prev, availableSizes: e.target.value }))
                    }
                    placeholder="28, 30, 32, 34, 36"
                  />
                </div>
              </div>

              {/* Images URL list */}
              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="admin-form-label" style={{ margin: 0 }}>
                    PRODUCT IMAGES (GALLERY & THUMBNAIL) *
                  </label>
                  <button
                    type="button"
                    className="admin-btn admin-btn--xs admin-btn--outline"
                    onClick={() =>
                      setProductFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, ''],
                      }))
                    }
                  >
                    + Add Another Image Slot
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {productFormData.images.map((imgUrl, i) => (
                    <AdminImageUploader
                      key={i}
                      label={i === 0 ? 'PRIMARY IMAGE (THUMBNAIL) *' : `GALLERY IMAGE #${i + 1}`}
                      value={imgUrl}
                      onChange={(newUrl) => {
                        const newImages = [...productFormData.images];
                        newImages[i] = newUrl;
                        setProductFormData((prev) => ({ ...prev, images: newImages }));
                      }}
                      aspectRatio="1/1"
                      placeholder="https://... or /images/products/..."
                      required={i === 0}
                      onRemove={
                        productFormData.images.length > 1
                          ? () => {
                              const newImages = productFormData.images.filter((_, idx) => idx !== i);
                              setProductFormData((prev) => ({ ...prev, images: newImages }));
                            }
                          : null
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="admin-form-group" style={{ marginTop: '16px' }}>
                <label className="admin-form-label">DESCRIPTION</label>
                <textarea
                  className="admin-form-textarea"
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) =>
                    setProductFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Material specs, denim weight, detailing, fit description..."
                />
              </div>

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="admin-btn admin-btn--black">
                  {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: GENERIC CONTENT ITEM (Hero / Subcategory / Announcement / Swipe)
          =================================================================== */}
      {isItemModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsItemModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{itemModalConfig.title}</h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setIsItemModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="admin-modal__form">
              {/* Announcements Form */}
              {itemModalConfig.type === 'announcements' && (
                <div className="admin-form-group">
                  <label className="admin-form-label">ANNOUNCEMENT TEXT *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={itemFormData.text || ''}
                    onChange={(e) =>
                      setItemFormData((prev) => ({ ...prev, text: e.target.value }))
                    }
                    placeholder="e.g. FREE SHIPPING ON ALL ORDERS"
                    required
                  />
                </div>
              )}

              {/* Subcategories Form */}
              {itemModalConfig.type === 'subcategories' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">SUBCATEGORY LABEL *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.label || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, label: e.target.value }))
                      }
                      placeholder="e.g. FLASH SALE⚡️"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">MAIN CATEGORY *</label>
                    <select
                      className="admin-form-select"
                      value={itemFormData.mainCategory || 'VEYN-SELECTS'}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, mainCategory: e.target.value }))
                      }
                    >
                      <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                      <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">TARGET LINK / ROUTE *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.href || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, href: e.target.value }))
                      }
                      placeholder="e.g. #baggy or /collections/all-drops"
                      required
                    />
                  </div>

                  <AdminImageUploader
                    label="SUBCATEGORY ICON / IMAGE (OPTIONAL)"
                    value={itemFormData.image || ''}
                    onChange={(newUrl) =>
                      setItemFormData((prev) => ({ ...prev, image: newUrl }))
                    }
                    aspectRatio="1/1"
                    placeholder="/images/icons/..."
                    helpText="Optional icon or thumbnail preview for this subcategory item."
                  />

                  <div className="admin-form-group">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={Boolean(itemFormData.isGlow)}
                        onChange={(e) =>
                          setItemFormData((prev) => ({ ...prev, isGlow: e.target.checked }))
                        }
                      />
                      <span>Enable Glow Animation Accent (⚡️)</span>
                    </label>
                  </div>
                </>
              )}

              {/* Hero Slide Form */}
              {itemModalConfig.type === 'heroSlides' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">TARGET SECTION *</label>
                    <select
                      className="admin-form-select"
                      value={itemFormData.targetSection || 'VEYN-SELECTS'}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, targetSection: e.target.value }))
                      }
                    >
                      <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                      <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                    </select>
                  </div>

                  <AdminImageUploader
                    label="HERO SLIDE IMAGE *"
                    value={itemFormData.image || ''}
                    onChange={(newUrl) =>
                      setItemFormData((prev) => ({ ...prev, image: newUrl }))
                    }
                    aspectRatio="16/9"
                    placeholder="/images/hero/heroimg01.jpg"
                    required
                    helpText="Choose an image file from your device or paste a web/local image URL."
                  />

                  <div className="admin-form-group">
                    <label className="admin-form-label">SLIDE TITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.title || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="e.g. Wide Leg Fit"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">SUBTITLE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.subtitle || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                      }
                      placeholder="e.g. Best Choice"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">CORNER TAG BADGE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.tag || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, tag: e.target.value }))
                      }
                      placeholder="e.g. DROP 01"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">TARGET LINK</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.href || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, href: e.target.value }))
                      }
                      placeholder="/collections/all-drops"
                    />
                  </div>
                </>
              )}

              {/* Swipe Categories Form */}
              {itemModalConfig.type === 'swipeCategories' && (
                <>
                  <div className="admin-form-group">
                    <label className="admin-form-label">TARGET SECTION *</label>
                    <select
                      className="admin-form-select"
                      value={itemFormData.targetSection || 'VEYN-SELECTS'}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, targetSection: e.target.value }))
                      }
                    >
                      <option value="VEYN-SELECTS">VEYN-SELECTS</option>
                      <option value="VEYN-OBJECTS">VEYN-OBJECTS</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">CATEGORY LABEL *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.label || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, label: e.target.value }))
                      }
                      placeholder="e.g. BAGGY"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">KEY IDENTIFIER *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.key || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({
                          ...prev,
                          key: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''),
                        }))
                      }
                      placeholder="e.g. baggy (matches product fit/swipeCategory)"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">COLLECTION LINK ROUTE</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={itemFormData.collectionPath || ''}
                      onChange={(e) =>
                        setItemFormData((prev) => ({ ...prev, collectionPath: e.target.value }))
                      }
                      placeholder="/collections/baggy"
                    />
                  </div>

                  <AdminImageUploader
                    label="CATEGORY BANNER / COVER IMAGE (OPTIONAL)"
                    value={itemFormData.image || ''}
                    onChange={(newUrl) =>
                      setItemFormData((prev) => ({ ...prev, image: newUrl }))
                    }
                    aspectRatio="16/9"
                    placeholder="/images/hero/heroimg01.jpg"
                    helpText="Optional category card or banner cover image."
                  />
                </>
              )}

              <div className="admin-modal__footer">
                <button
                  type="button"
                  className="admin-btn admin-btn--outline"
                  onClick={() => setIsItemModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="admin-btn admin-btn--black">
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL: DELETE CONFIRMATION
          =================================================================== */}
      {deleteModalConfig.isOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() =>
            setDeleteModalConfig({ isOpen: false, type: '', id: null, title: '', sectionKey: '' })
          }
        >
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title" style={{ color: '#dc2626' }}>
                CONFIRM DELETION
              </h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() =>
                  setDeleteModalConfig({ isOpen: false, type: '', id: null, title: '', sectionKey: '' })
                }
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#3f3f46', lineHeight: 1.6 }}>
                Are you sure you want to permanently delete{' '}
                <strong>"{deleteModalConfig.title}"</strong>? This action cannot be reversed.
              </p>
            </div>

            <div className="admin-modal__footer">
              <button
                type="button"
                className="admin-btn admin-btn--outline"
                onClick={() =>
                  setDeleteModalConfig({ isOpen: false, type: '', id: null, title: '', sectionKey: '' })
                }
              >
                CANCEL
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--danger"
                onClick={
                  deleteModalConfig.type === 'product'
                    ? confirmDeleteProduct
                    : confirmDeleteItem
                }
              >
                CONFIRM DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
