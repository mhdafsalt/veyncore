'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/constants';

import AdminTopBar from '../AdminTopBar/AdminTopBar';
import AdminOverview from '../AdminOverview/AdminOverview';
import AdminProducts from '../AdminProducts/AdminProducts';
import ProductModal from '../AdminProducts/ProductModal';
import AdminOrders from '../AdminOrders/AdminOrders';
import OrderModal from '../AdminOrders/OrderModal';
import AdminUsers from '../AdminUsers/AdminUsers';
import AdminSettings from '../AdminSettings/AdminSettings';
import AdminToast from '../AdminToast/AdminToast';

import './AdminDashboard.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'users' | 'settings'

  // Loading & Feedback
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState(null);

  // 1. Overview metrics
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    vipUsers: 0,
    adminCount: 0,
    totalProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    recentUsers: [],
    recentOrders: [],
  });

  // 2. Products state
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState('all');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    comparePrice: '',
    category: 'VEYN-SELECTS',
    subCategory: 'BAGGY',
    badge: 'NEW',
    availableSizes: '28, 30, 32, 34, 36',
    images: '/images/products/artic-blue-wide.jpg',
    description: '',
    inStock: true,
  });

  // 3. Orders state
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    totalAmount: '',
    itemTitle: '',
    itemSize: '32',
    notes: '',
  });

  // 4. Users state
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userVipFilter, setUserVipFilter] = useState('all');

  // 5. Store Settings state
  const [settings, setSettings] = useState({
    whatsappNumber: '919876543210',
    announcementText: 'FREE SHIPPING ON ALL ORDERS ACROSS INDIA • DIRECT WHATSAPP CONCIERGE',
    supportEmail: 'concierge@veyncore.com',
    vipDiscountPercent: 10,
    isStoreOpen: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Toast trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Authenticated fetch wrapper
  const authFetch = useCallback(
    async (endpoint, options = {}) => {
      const storedToken =
        token || (typeof window !== 'undefined' ? localStorage.getItem('veyncore_token') : null);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedToken}`,
        ...options.headers,
      };
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    },
    [token]
  );

  // Fetch API handlers
  const fetchOverview = useCallback(async () => {
    const res = await authFetch('/api/admin/overview');
    if (res.ok && res.data.success) {
      setMetrics(res.data.data);
    }
  }, [authFetch]);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (productSearch) params.append('q', productSearch);
    if (productCategoryFilter !== 'ALL') params.append('category', productCategoryFilter);
    if (productStockFilter !== 'all') params.append('inStock', productStockFilter);

    const res = await authFetch(`/api/admin/products?${params.toString()}`);
    if (res.ok && res.data.success) {
      setProducts(res.data.data);
    }
  }, [authFetch, productSearch, productCategoryFilter, productStockFilter]);

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (orderSearch) params.append('q', orderSearch);
    if (orderStatusFilter !== 'all') params.append('status', orderStatusFilter);

    const res = await authFetch(`/api/admin/orders?${params.toString()}`);
    if (res.ok && res.data.success) {
      setOrders(res.data.data);
    }
  }, [authFetch, orderSearch, orderStatusFilter]);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams();
    if (userSearch) params.append('q', userSearch);
    if (userRoleFilter !== 'all') params.append('role', userRoleFilter);
    if (userVipFilter !== 'all')
      params.append('vip', userVipFilter === 'vip' ? 'true' : 'false');

    const res = await authFetch(`/api/admin/users?${params.toString()}`);
    if (res.ok && res.data.success) {
      setUsersList(res.data.data);
    }
  }, [authFetch, userSearch, userRoleFilter, userVipFilter]);

  const fetchSettings = useCallback(async () => {
    const res = await authFetch('/api/admin/settings');
    if (res.ok && res.data.success && res.data.data) {
      setSettings(res.data.data);
    }
  }, [authFetch]);

  // Initial Load
  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      setLoadingData(false);
      return;
    }

    const loadAll = async () => {
      setLoadingData(true);
      try {
        await Promise.all([
          fetchOverview(),
          fetchProducts(),
          fetchOrders(),
          fetchUsers(),
          fetchSettings(),
        ]);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadAll();
  }, [user, isLoading, fetchOverview, fetchProducts, fetchOrders, fetchUsers, fetchSettings]);

  // Tab switch effect
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'overview') fetchOverview();
  }, [activeTab, fetchProducts, fetchOrders, fetchUsers, fetchOverview, user]);

  /* ==========================================================================
     PRODUCT HANDLERS
     ========================================================================== */
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        title: prod.title || '',
        price: prod.price || '',
        comparePrice: prod.comparePrice || '',
        category: prod.category || 'VEYN-SELECTS',
        subCategory: prod.subCategory || 'BAGGY',
        badge: prod.badge || '',
        availableSizes: (prod.availableSizes || []).join(', '),
        images: (prod.images || []).join(', '),
        description: prod.description || '',
        inStock: prod.inStock !== false,
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        title: '',
        price: '',
        comparePrice: '',
        category: 'VEYN-SELECTS',
        subCategory: 'BAGGY',
        badge: 'NEW',
        availableSizes: '28, 30, 32, 34, 36',
        images: '/images/products/artic-blue-wide.jpg',
        description: '',
        inStock: true,
      });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price) {
      showToast('Title and Price are required.', 'error');
      return;
    }

    const payload = {
      title: productForm.title,
      price: Number(productForm.price),
      comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : null,
      category: productForm.category,
      subCategory: productForm.subCategory,
      badge: productForm.badge,
      availableSizes: productForm.availableSizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      images: productForm.images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: productForm.description,
      inStock: Boolean(productForm.inStock),
      isObject: productForm.category === 'VEYN-OBJECTS',
    };

    let res;
    if (editingProduct) {
      res = await authFetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    } else {
      res = await authFetch('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    if (res.ok && res.data.success) {
      showToast(
        editingProduct ? 'Product updated successfully.' : 'Product created successfully.'
      );
      setProductModalOpen(false);
      fetchProducts();
      fetchOverview();
    } else {
      showToast(res.data.message || 'Operation failed.', 'error');
    }
  };

  const handleToggleProductStock = async (prod) => {
    const res = await authFetch(`/api/admin/products/${prod._id}`, {
      method: 'PUT',
      body: JSON.stringify({ inStock: !prod.inStock }),
    });
    if (res.ok) {
      showToast(
        `Stock status updated to ${!prod.inStock ? 'IN STOCK' : 'OUT OF STOCK'}`
      );
      fetchProducts();
      fetchOverview();
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}' from the store?`))
      return;
    const res = await authFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Product removed.');
      fetchProducts();
      fetchOverview();
    }
  };

  const handleSeedCatalog = async () => {
    if (!window.confirm('Populate database with default catalog products?')) return;
    const res = await authFetch('/api/admin/products/seed', { method: 'POST' });
    if (res.ok) {
      showToast('Catalog initialized with demo data.');
      fetchProducts();
      fetchOverview();
    }
  };

  /* ==========================================================================
     ORDER HANDLERS
     ========================================================================== */
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await authFetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showToast(`Order status updated to '${newStatus}'`);
      fetchOrders();
      fetchOverview();
    }
  };

  const handleDeleteOrder = async (orderId, orderNum) => {
    if (!window.confirm(`Delete order ${orderNum}?`)) return;
    const res = await authFetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Order record deleted.');
      fetchOrders();
      fetchOverview();
    }
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (
      !orderForm.customerName ||
      !orderForm.customerPhone ||
      !orderForm.totalAmount
    ) {
      showToast('Name, phone, and total amount are required.', 'error');
      return;
    }

    const payload = {
      customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone,
      customerEmail: orderForm.customerEmail,
      totalAmount: Number(orderForm.totalAmount),
      notes: orderForm.notes,
      items: orderForm.itemTitle
        ? [
            {
              productId: 'custom-item',
              title: orderForm.itemTitle,
              size: orderForm.itemSize,
              quantity: 1,
              price: Number(orderForm.totalAmount),
              image: '/images/products/artic-blue-wide.jpg',
            },
          ]
        : [],
    };

    const res = await authFetch('/api/admin/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok && res.data.success) {
      showToast('Order logged successfully.');
      setOrderModalOpen(false);
      setOrderForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        totalAmount: '',
        itemTitle: '',
        itemSize: '32',
        notes: '',
      });
      fetchOrders();
      fetchOverview();
    } else {
      showToast(res.data.message || 'Failed to create order.', 'error');
    }
  };

  /* ==========================================================================
     USER HANDLERS
     ========================================================================== */
  const handleToggleUserRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const confirmMsg =
      newRole === 'admin'
        ? `Grant full administrator privileges to ${targetUser.email}?`
        : `Demote ${targetUser.email} to standard user role?`;

    if (!window.confirm(confirmMsg)) return;

    const res = await authFetch(`/api/admin/users/${targetUser._id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok && res.data.success) {
      showToast(`User role changed to '${newRole}'`);
      fetchUsers();
      fetchOverview();
    } else {
      showToast(res.data.message || 'Failed to update role.', 'error');
    }
  };

  const handleToggleUserVip = async (targetUser) => {
    const res = await authFetch(`/api/admin/users/${targetUser._id}/vip`, {
      method: 'PATCH',
      body: JSON.stringify({ vipNotifications: !targetUser.vipNotifications }),
    });
    if (res.ok) {
      showToast('VIP status updated.');
      fetchUsers();
      fetchOverview();
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Permanently delete user ${targetUser.email}?`)) return;
    const res = await authFetch(`/api/admin/users/${targetUser._id}`, {
      method: 'DELETE',
    });
    if (res.ok && res.data.success) {
      showToast('User deleted from database.');
      fetchUsers();
      fetchOverview();
    } else {
      showToast(res.data.message || 'Cannot delete user.', 'error');
    }
  };

  /* ==========================================================================
     SETTINGS HANDLERS
     ========================================================================== */
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    const res = await authFetch('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    setSavingSettings(false);
    if (res.ok && res.data.success) {
      showToast('Store settings saved successfully.');
    } else {
      showToast(res.data.message || 'Failed to save settings.', 'error');
    }
  };

  // Loading state
  if (isLoading || loadingData) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__spinner" />
        <p className="admin-dashboard__loading-text">
          LOADING VEYNCORE CONTROL PANEL...
        </p>
      </div>
    );
  }

  // Strict 403 Forbidden Access Guard
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="admin-dashboard admin-dashboard--denied">
        <div className="admin-dashboard__denied-box">
          <span className="admin-dashboard__denied-badge">403 FORBIDDEN</span>
          <h1 className="admin-dashboard__denied-title">ACCESS RESTRICTED</h1>
          <p className="admin-dashboard__denied-desc">
            The Veyncore Administrator Control Panel requires verified administrator
            privileges. Normal customer accounts are not permitted to access this sector.
          </p>
          <div className="admin-dashboard__denied-actions">
            <Link href="/" className="admin-dashboard__btn admin-dashboard__btn--primary">
              RETURN TO STORE
            </Link>
            <button
              type="button"
              className="admin-dashboard__btn admin-dashboard__btn--outline"
              onClick={() => openAuthModal('login')}
            >
              SIGN IN AS ADMIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminToast toast={toast} />

      <div className="admin-dashboard__container">
        {/* Top Header Bar */}
        <AdminTopBar
          user={user}
          onLogout={() => {
            logout();
            router.push('/');
          }}
        />

        {/* Tab Switcher Navigation */}
        <nav className="admin-dashboard__tabs" role="tablist">
          <button
            type="button"
            className={`admin-dashboard__tab ${
              activeTab === 'overview' ? 'admin-dashboard__tab--active' : ''
            }`}
            onClick={() => setActiveTab('overview')}
          >
            📊 OVERVIEW
          </button>
          <button
            type="button"
            className={`admin-dashboard__tab ${
              activeTab === 'products' ? 'admin-dashboard__tab--active' : ''
            }`}
            onClick={() => setActiveTab('products')}
          >
            📦 PRODUCTS ({metrics.totalProducts})
          </button>
          <button
            type="button"
            className={`admin-dashboard__tab ${
              activeTab === 'orders' ? 'admin-dashboard__tab--active' : ''
            }`}
            onClick={() => setActiveTab('orders')}
          >
            🛍️ ORDERS ({metrics.totalOrders})
          </button>
          <button
            type="button"
            className={`admin-dashboard__tab ${
              activeTab === 'users' ? 'admin-dashboard__tab--active' : ''
            }`}
            onClick={() => setActiveTab('users')}
          >
            👥 USERS ({metrics.totalUsers})
          </button>
          <button
            type="button"
            className={`admin-dashboard__tab ${
              activeTab === 'settings' ? 'admin-dashboard__tab--active' : ''
            }`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ STORE SETTINGS
          </button>
        </nav>

        {/* Dynamic Tab Panes */}
        {activeTab === 'overview' && (
          <AdminOverview
            metrics={metrics}
            onNavigateTab={setActiveTab}
            onOpenProductModal={() => handleOpenProductModal()}
            onOpenOrderModal={() => setOrderModalOpen(true)}
            onSeedCatalog={handleSeedCatalog}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {activeTab === 'products' && (
          <AdminProducts
            products={products}
            search={productSearch}
            onSearchChange={setProductSearch}
            categoryFilter={productCategoryFilter}
            onCategoryFilterChange={setProductCategoryFilter}
            stockFilter={productStockFilter}
            onStockFilterChange={setProductStockFilter}
            onOpenModal={handleOpenProductModal}
            onToggleStock={handleToggleProductStock}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'orders' && (
          <AdminOrders
            orders={orders}
            search={orderSearch}
            onSearchChange={setOrderSearch}
            statusFilter={orderStatusFilter}
            onStatusFilterChange={setOrderStatusFilter}
            onOpenModal={() => setOrderModalOpen(true)}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsers
            users={usersList}
            currentUser={user}
            search={userSearch}
            onSearchChange={setUserSearch}
            roleFilter={userRoleFilter}
            onRoleFilterChange={setUserRoleFilter}
            vipFilter={userVipFilter}
            onVipFilterChange={setUserVipFilter}
            onToggleRole={handleToggleUserRole}
            onToggleVip={handleToggleUserVip}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSettingsChange={setSettings}
            onSave={handleSaveSettings}
            saving={savingSettings}
          />
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={productModalOpen}
        editingProduct={editingProduct}
        form={productForm}
        onFormChange={setProductForm}
        onSave={handleSaveProduct}
        onClose={() => setProductModalOpen(false)}
      />

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        form={orderForm}
        onFormChange={setOrderForm}
        onSave={handleSaveOrder}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
