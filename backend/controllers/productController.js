import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, '../data/db.json');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const deleteUploadedFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../uploads/products', filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Error deleting file ${filename}:`, err.message);
    }
  }
};

// Helper to read JSON DB file
const getJsonDB = () => {
  if (fs.existsSync(dbJsonPath)) {
    try {
      const data = fs.readFileSync(dbJsonPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading db.json:', e);
    }
  }
  return { users: [], products: [] };
};

// Helper to save JSON DB file
const saveJsonDB = (data) => {
  try {
    fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving db.json:', e);
  }
};

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Engine 1: If MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (req.query.category && req.query.category !== 'all') {
        query.category = req.query.category.toLowerCase();
      }
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query.$or = [
          { name: searchRegex },
          { shortDescription: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { sku: searchRegex }
        ];
      }
      if (req.query.status) {
        query.status = req.query.status;
      } else if (req.query.admin !== 'true') {
        query.status = 'published';
        query.isActive = true;
      }
      if (req.query.featured === 'true') {
        query.isFeatured = true;
      }

      let sort = { createdAt: -1 };
      if (req.query.sort) {
        switch (req.query.sort) {
          case 'price-low':
            sort = { basePrice: 1 };
            break;
          case 'price-high':
            sort = { basePrice: -1 };
            break;
          case 'best-selling':
            sort = { bestSeller: -1, createdAt: -1 };
            break;
          case 'rating':
            sort = { rating: -1 };
            break;
          case 'oldest':
            sort = { createdAt: 1 };
            break;
          case 'newest':
          default:
            sort = { createdAt: -1 };
            break;
        }
      }

      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sort).skip(skip).limit(limit);

      return res.status(200).json({
        success: true,
        message: 'Products fetched successfully',
        data: products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
      });
    }

    // Engine 2: Instant JSON Database Fallback
    const db = getJsonDB();
    let filtered = [...db.products];

    if (req.query.category && req.query.category !== 'all') {
      filtered = filtered.filter((p) => p.category === req.query.category.toLowerCase());
    }

    if (req.query.search) {
      const s = req.query.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(s) ||
          p.shortDescription?.toLowerCase().includes(s) ||
          p.sku?.toLowerCase().includes(s)
      );
    }

    if (req.query.status) {
      filtered = filtered.filter((p) => p.status === req.query.status);
    } else if (req.query.admin !== 'true') {
      filtered = filtered.filter((p) => (p.status || 'published') === 'published');
    }

    if (req.query.featured === 'true') {
      filtered = filtered.filter((p) => p.isFeatured);
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.status(200).json({ success: true, data: product });
    }

    const db = getJsonDB();
    const product = db.products.find((p) => (p._id || p.id) === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${req.params.id}` });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug
// @route   GET /api/products/slug/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const targetSlug = req.params.slug.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findOne({ slug: targetSlug });
      if (product) return res.status(200).json({ success: true, data: product });
    }

    const db = getJsonDB();
    const product = db.products.find((p) => p.slug === targetSlug);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found with slug: ${targetSlug}` });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (typeof body.sizes === 'string') {
      try { body.sizes = JSON.parse(body.sizes); } catch (e) { body.sizes = []; }
    }
    if (typeof body.weights === 'string') {
      try { body.weights = JSON.parse(body.weights); } catch (e) { body.weights = []; }
    }
    if (typeof body.availableSizes === 'string') {
      try { body.availableSizes = JSON.parse(body.availableSizes); } catch (e) { body.availableSizes = []; }
    }
    if (typeof body.images === 'string') {
      try { body.images = JSON.parse(body.images); } catch (e) { body.images = []; }
    }

    if (!body.name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    body.slug = body.slug ? slugify(body.slug) : slugify(body.name);

    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
        uploadedImages.push({
          url: fileUrl,
          filename: file.filename,
          altText: body.name,
          isPrimary: index === 0
        });
      });
    }

    const finalImages = [...(Array.isArray(body.images) ? body.images : []), ...uploadedImages];
    if (finalImages.length === 0) {
      finalImages.push({
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
        filename: '',
        altText: body.name,
        isPrimary: true
      });
    }
    body.images = finalImages;

    if (!body.availableSizes || body.availableSizes.length === 0) {
      if (body.sizes && body.sizes.length > 0) {
        body.availableSizes = body.sizes.map((s) => ({ size: s.label, price: s.price }));
      } else {
        body.availableSizes = [{ size: 'Standard Pack', price: Number(body.basePrice) || 100 }];
      }
    }

    // Engine 1: MongoDB
    if (mongoose.connection.readyState === 1) {
      const product = await Product.create(body);
      return res.status(201).json({ success: true, message: 'Product created successfully', data: product });
    }

    // Engine 2: JSON DB
    const db = getJsonDB();
    const newProduct = {
      _id: `prod-${Date.now()}`,
      id: `prod-${Date.now()}`,
      ...body,
      basePrice: Number(body.basePrice) || 0,
      price: Number(body.basePrice) || 0,
      stock: Number(body.stock) || 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.products.unshift(newProduct);
    saveJsonDB(db);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (typeof body.sizes === 'string') {
      try { body.sizes = JSON.parse(body.sizes); } catch (e) {}
    }
    if (typeof body.weights === 'string') {
      try { body.weights = JSON.parse(body.weights); } catch (e) {}
    }
    if (typeof body.images === 'string') {
      try { body.images = JSON.parse(body.images); } catch (e) {}
    }

    if (body.slug) body.slug = slugify(body.slug);

    const newlyUploadedImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`;
        newlyUploadedImages.push({
          url: fileUrl,
          filename: file.filename,
          altText: body.name || 'Product Image',
          isPrimary: false
        });
      });
    }

    // Engine 1: MongoDB
    if (mongoose.connection.readyState === 1) {
      let product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

      let updatedImages = Array.isArray(body.images) ? body.images : product.images;
      updatedImages = [...updatedImages, ...newlyUploadedImages];
      body.images = updatedImages;

      product = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
      return res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    }

    // Engine 2: JSON DB
    const db = getJsonDB();
    const index = db.products.findIndex((p) => (p._id || p.id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let existingPro = db.products[index];
    let updatedImages = Array.isArray(body.images) ? body.images : existingPro.images || [];
    updatedImages = [...updatedImages, ...newlyUploadedImages];

    const updatedProduct = {
      ...existingPro,
      ...body,
      images: updatedImages,
      basePrice: body.basePrice ? Number(body.basePrice) : existingPro.basePrice,
      price: body.basePrice ? Number(body.basePrice) : existingPro.price,
      updatedAt: new Date().toISOString()
    };

    db.products[index] = updatedProduct;
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) {
        if (product.images) product.images.forEach((img) => img.filename && deleteUploadedFile(img.filename));
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: 'Product deleted', data: { id: req.params.id } });
      }
    }

    const db = getJsonDB();
    const target = db.products.find((p) => (p._id || p.id) === req.params.id);
    if (target && target.images) {
      target.images.forEach((img) => img.filename && deleteUploadedFile(img.filename));
    }

    db.products = db.products.filter((p) => (p._id || p.id) !== req.params.id);
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product status
// @route   PATCH /api/products/:id/status
export const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (product) return res.status(200).json({ success: true, message: `Status updated to ${status}`, data: product });
    }

    const db = getJsonDB();
    const index = db.products.findIndex((p) => (p._id || p.id) === req.params.id);
    if (index !== -1) {
      db.products[index].status = status;
      db.products[index].updatedAt = new Date().toISOString();
      saveJsonDB(db);
      return res.status(200).json({ success: true, message: `Status updated to ${status}`, data: db.products[index] });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Standalone image upload
// @route   POST /api/products/upload
export const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const uploadedFiles = req.files.map((file, index) => ({
      url: `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`,
      filename: file.filename,
      altText: file.originalname,
      isPrimary: index === 0
    }));

    res.status(200).json({ success: true, message: 'Images uploaded successfully', data: uploadedFiles });
  } catch (error) {
    next(error);
  }
};
