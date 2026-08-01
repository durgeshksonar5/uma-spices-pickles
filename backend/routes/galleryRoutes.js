import express from 'express';
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public route
router.get('/', getGalleryItems);

// Protected admin routes
router.post('/', protect, upload.single('imageFile'), createGalleryItem);
router.put('/:id', protect, upload.single('imageFile'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;
