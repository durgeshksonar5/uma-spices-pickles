import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  uploadProductImage
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected admin routes
router.post('/', protect, upload.array('imageFiles', 5), createProduct);
router.put('/:id', protect, upload.array('imageFiles', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/status', protect, updateProductStatus);
router.post('/upload', protect, upload.array('imageFiles', 5), uploadProductImage);

export default router;
