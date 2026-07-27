import express from 'express';
import {
  getHeroSettings,
  updateHeroSettings,
  getFestiveDealSettings,
  updateFestiveDealSettings
} from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/hero', getHeroSettings);
router.put('/hero', protect, upload.single('heroImageFile'), updateHeroSettings);

router.get('/festive-deal', getFestiveDealSettings);
router.put('/festive-deal', protect, upload.single('dealImageFile'), updateFestiveDealSettings);

export default router;
