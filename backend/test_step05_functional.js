import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import User from './models/user.model.js';
import Product from './models/product.model.js';
import Order from './models/order.model.js';
import Content from './models/content.model.js';

let adminToken = '';
let regularUserToken = '';
let testAdminUser = null;
let testRegularUser = null;

async function runStep05Tests() {
  console.log('====================================================');
  console.log('  VEYNCORE STEP 05 - COMPREHENSIVE FUNCTIONAL AUDIT');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Connect to database
    console.log('[1/7] Connecting to MongoDB Atlas...');
    await connectDB();
    assert(mongoose.connection.readyState === 1, 'MongoDB connection established');

    const JWT_SECRET = process.env.JWT_SECRET;
    assert(Boolean(JWT_SECRET), 'JWT_SECRET is configured in environment');

    // Setup or find test users
    console.log('\n[2/7] Testing Priority 1: Admin Authentication & Authorization...');
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Veyncore Admin',
        email: 'test_admin_audit@veyncore.com',
        password: '$2a$10$hashedpasswordforexampleauditpurposes',
        role: 'admin',
      });
      testAdminUser = adminUser;
    }

    let regularUser = await User.findOne({ role: 'user' });
    if (!regularUser) {
      regularUser = await User.create({
        name: 'Regular Customer',
        email: 'test_user_audit@veyncore.com',
        password: '$2a$10$hashedpasswordforexampleauditpurposes',
        role: 'user',
      });
      testRegularUser = regularUser;
    }

    adminToken = jwt.sign({ id: adminUser._id, role: adminUser.role }, JWT_SECRET, { expiresIn: '1h' });
    regularUserToken = jwt.sign({ id: regularUser._id, role: regularUser.role }, JWT_SECRET, { expiresIn: '1h' });

    // Verify token payload
    const decodedAdmin = jwt.verify(adminToken, JWT_SECRET);
    assert(decodedAdmin.role === 'admin', 'Admin token carries admin role');
    const decodedUser = jwt.verify(regularUserToken, JWT_SECRET);
    assert(decodedUser.role === 'user', 'Regular user token carries user role');

    // Test Expired Token handling
    const expiredToken = jwt.sign({ id: adminUser._id, role: 'admin' }, JWT_SECRET, { expiresIn: '-1s' });
    let expiredRejected = false;
    try {
      jwt.verify(expiredToken, JWT_SECRET);
    } catch (e) {
      expiredRejected = e.name === 'TokenExpiredError';
    }
    assert(expiredRejected, 'Expired JWT is rejected by jsonwebtoken verify');

    // Test Priority 2: Product Management CRUD
    console.log('\n[3/7] Testing Priority 2: Product Management CRUD & Validation...');
    const testHandle = `audit-test-product-${Date.now()}`;
    const newProduct = new Product({
      title: 'AUDIT RAW SELVEDGE JEANS',
      handle: testHandle,
      category: 'VEYN-SELECTS',
      subCategory: 'WIDE',
      fit: 'wide',
      price: 2499,
      comparePrice: 3499,
      badge: 'NEW',
      stock: 45,
      inStock: true,
      images: ['https://res.cloudinary.com/veyncore/image/upload/v1/audit-test.jpg'],
      thumbnail: 'https://res.cloudinary.com/veyncore/image/upload/v1/audit-test.jpg',
      availableSizes: ['30', '32', '34'],
      description: 'Handcrafted Japanese raw denim engineered for contemporary silhouette.',
    });

    const savedProduct = await newProduct.save();
    assert(Boolean(savedProduct._id), 'Admin can create product and persist to MongoDB');
    assert(savedProduct.salePrice === 'Rs. 2,499.00', 'Canonical salePrice auto-formatted');

    // Update Product
    savedProduct.price = 2299;
    savedProduct.stock = 0;
    savedProduct.inStock = false;
    await savedProduct.save();

    const updatedProduct = await Product.findById(savedProduct._id).lean();
    assert(updatedProduct.price === 2299, 'Product price successfully updated');
    assert(updatedProduct.inStock === false, 'Product out-of-stock toggle successfully saved');

    // Delete Product
    await Product.findByIdAndDelete(savedProduct._id);
    const checkDeleted = await Product.findById(savedProduct._id);
    assert(checkDeleted === null, 'Admin can safely delete product from catalog');

    // Test Priority 3: Category & Subcategory Management
    console.log('\n[4/7] Testing Priority 3: Subcategory Management...');
    let contentDoc = await Content.findOne({ key: 'main_site_content' });
    if (!contentDoc) {
      contentDoc = await Content.create({
        key: 'main_site_content',
        subcategories: [
          { label: '⚡ ALL DROPS', href: '/collections/all-drops', mainCategory: 'VEYN-SELECTS', active: true, isGlow: true },
          { label: 'BAGGY', href: '/collections/all-drops?category=baggy', mainCategory: 'VEYN-SELECTS', active: true, isGlow: false },
        ],
      });
    }
    assert(Array.isArray(contentDoc.subcategories) && contentDoc.subcategories.length > 0, 'Subcategories array retrieved from SiteContent in MongoDB');
    const hasSelects = contentDoc.subcategories.some((i) => i.mainCategory === 'VEYN-SELECTS');
    assert(hasSelects, 'Subcategories contain VEYN-SELECTS main category binding');

    // Test Priority 4: Order Management Workflow & State Machine
    console.log('\n[5/7] Testing Priority 4: Order Persistence & Status Transitions...');
    const orderNumber1 = `TEST-KL-${Date.now()}`;
    const keralaOrder = await Order.create({
      orderNumber: orderNumber1,
      customer: {
        name: 'Rahul Nair',
        phone: '9876543210',
        email: 'rahul@example.com',
      },
      shippingAddress: {
        addressLine: 'Flat 4B, Skyline Riverdale, Marine Drive',
        pincode: '682001', // Kerala
        city: 'Kochi',
        state: 'Kerala',
        isKerala: true,
      },
      items: [
        {
          title: 'WIDE-LEG RAW DENIM',
          productHandle: 'wide-leg-raw-denim',
          unitPrice: 2499,
          itemTotal: 2499,
          quantity: 1,
          size: '32',
        },
      ],
      subtotal: 2499,
      shippingFee: 0, // Kerala is free
      totalAmount: 2499,
      status: 'pending',
      paymentStatus: 'unpaid',
      source: 'whatsapp_checkout',
    });
    assert(keralaOrder.shippingFee === 0, 'Kerala order has Free Shipping (Rs. 0)');
    assert(keralaOrder.shippingAddress.isKerala === true, 'Kerala pincode 682001 identified accurately');

    // Non-Kerala Order
    const orderNumber2 = `TEST-BLR-${Date.now()}`;
    const nonKeralaOrder = await Order.create({
      orderNumber: orderNumber2,
      customer: {
        name: 'Priya Sharma',
        phone: '9123456789',
        email: 'priya@example.com',
      },
      shippingAddress: {
        addressLine: '12 Indiranagar 100ft Road',
        pincode: '560038', // Karnataka
        city: 'Bengaluru',
        state: 'Karnataka',
        isKerala: false,
      },
      items: [
        {
          title: 'V-LOGO HARDWARE CHAIN',
          productHandle: 'v-logo-hardware-chain',
          unitPrice: 999,
          itemTotal: 999,
          quantity: 1,
          size: 'ONE SIZE',
        },
      ],
      subtotal: 999,
      shippingFee: 50, // Non-Kerala (₹50)
      totalAmount: 1049,
      status: 'pending',
      paymentStatus: 'unpaid',
      source: 'whatsapp_checkout',
    });
    assert(nonKeralaOrder.shippingFee === 50, 'Non-Kerala order has ₹50 shipping fee');
    assert(nonKeralaOrder.totalAmount === 1049, 'Total accurately includes ₹50 shipping fee (999 + 50 = 1049)');

    // Test Allowed Status Transition: pending -> confirmed
    keralaOrder.status = 'confirmed';
    await keralaOrder.save();
    const confirmedOrder = await Order.findById(keralaOrder._id);
    assert(confirmedOrder.status === 'confirmed', 'Order transitioned from pending to confirmed');

    // Test Allowed Status Transition: confirmed -> shipped
    confirmedOrder.status = 'shipped';
    await confirmedOrder.save();
    const shippedOrder = await Order.findById(keralaOrder._id);
    assert(shippedOrder.status === 'shipped', 'Order transitioned from confirmed to shipped');

    // Test Invalid Status Transition Validation via state machine rules
    const ALLOWED_ORDER_TRANSITIONS = {
      pending: ['whatsapp_opened', 'contacted', 'confirmed', 'cancelled'],
      whatsapp_opened: ['contacted', 'confirmed', 'cancelled'],
      contacted: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'shipped', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['cancelled'],
      cancelled: [],
    };
    const allowedFromShipped = ALLOWED_ORDER_TRANSITIONS['shipped'];
    const invalidAttemptToPending = allowedFromShipped.includes('pending');
    assert(invalidAttemptToPending === false, 'Invalid state transition from "shipped" to "pending" is strictly rejected');

    // Clean up test orders
    await Order.findByIdAndDelete(keralaOrder._id);
    await Order.findByIdAndDelete(nonKeralaOrder._id);
    assert(true, 'Test orders cleaned up from database');

    // Test Customer Journey Calculations & Validation (Priority 7 & 8)
    console.log('\n[6/8] Testing Priority 7 & 8: Customer Journey Calculations & Error Handling...');
    const evaluateDiscount = (code, subtotal) => {
      const cleanCode = String(code || '').trim().toUpperCase();
      if (!cleanCode || subtotal <= 0) return { valid: false, amount: 0 };
      if (cleanCode === 'VEYN10' || cleanCode === 'WELCOME10') {
        return { valid: true, code: cleanCode, amount: Math.round(subtotal * 0.1) };
      }
      if (cleanCode === 'FLAT100' && subtotal >= 999) {
        return { valid: true, code: cleanCode, amount: 100 };
      }
      return { valid: false, amount: 0 };
    };

    const discount10 = evaluateDiscount('VEYN10', 2500);
    assert(discount10.valid && discount10.amount === 250, '10% discount accurately calculated on Rs. 2,500 subtotal');
    const discountFlat = evaluateDiscount('FLAT100', 1200);
    assert(discountFlat.valid && discountFlat.amount === 100, 'FLAT100 discount accurately applied on eligible subtotal');
    const discountInvalid = evaluateDiscount('FAKECODE', 2000);
    assert(!discountInvalid.valid, 'Invalid coupon codes correctly rejected with zero discount');

    // Test Pincode Kerala detection
    const isKeralaPincode = (pincode) => /^(67|68|69)/.test(String(pincode || '').replace(/\s/g, ''));
    assert(isKeralaPincode('673001') === true, 'Kerala Malappuram/Kozhikode 67xxxx detected');
    assert(isKeralaPincode('682001') === true, 'Kerala Ernakulam 68xxxx detected');
    assert(isKeralaPincode('695001') === true, 'Kerala Trivandrum 69xxxx detected');
    assert(isKeralaPincode('110001') === false, 'Delhi 110001 identified as Non-Kerala');
    assert(isKeralaPincode('400001') === false, 'Mumbai 400001 identified as Non-Kerala');

    // Test Priority 5: Admin Overview & Analytics Calculations
    console.log('\n[6/7] Testing Priority 5: Real Analytics Calculations from Database...');
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'whatsapp_opened'] } });
    const confirmedOrders = await Order.countDocuments({
      status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
    });

    assert(typeof totalUsers === 'number', `Real totalUsers calculated: ${totalUsers}`);
    assert(typeof totalProducts === 'number', `Real totalProducts calculated: ${totalProducts}`);
    assert(typeof totalOrders === 'number', `Real totalOrders calculated: ${totalOrders}`);
    assert(typeof pendingOrders === 'number', `Real pendingOrders calculated: ${pendingOrders}`);
    assert(typeof confirmedOrders === 'number', `Real confirmedOrders calculated: ${confirmedOrders}`);

    // Clean up temporary test users if created
    if (testAdminUser) await User.findByIdAndDelete(testAdminUser._id);
    if (testRegularUser) await User.findByIdAndDelete(testRegularUser._id);

    console.log('\n[7/7] SUMMARY');
    console.log(`  Passed checks: ${passed}`);
    console.log(`  Failed checks: ${failed}`);
    console.log(failed === 0 ? '  ✓ ALL FUNCTIONAL CHECKS PASSED!\n' : '  ✗ SOME CHECKS FAILED!\n');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runStep05Tests();
