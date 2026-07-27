import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, '../data/db.json');

const DEFAULT_HERO_SETTINGS = {
  heroImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1920',
  heroTitle: 'Discover the Essence of Fresh Spices & Pickles',
  heroSubtitle: 'Handpicked ingredients, traditional recipes and authentic flavours crafted to make every meal memorable.',
  heroBadge: '100% Pure & Handcrafted',
  heroCtaText: 'Shop Spices & Pickles'
};

const DEFAULT_FESTIVE_DEAL = {
  badge: 'SPECIAL FESTIVE DEAL',
  tagline: 'Latest Offer • Best Value',
  title: 'Chef’s Signature Bundle',
  description: 'A curated combination of our bestselling spices and traditional handcrafted pickles. Delivered in a premium airtight gift box.',
  image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000',
  price: 2150,
  originalPrice: 2650,
  discount: '19% OFF',
  includedItems: ['Turmeric Powder', 'Red Chilli Powder', 'Garam Masala', 'Mango Pickle', 'Lemon Pickle']
};

const getJsonDB = () => {
  if (fs.existsSync(dbJsonPath)) {
    try {
      const data = fs.readFileSync(dbJsonPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.heroSettings) parsed.heroSettings = DEFAULT_HERO_SETTINGS;
      if (!parsed.festiveDeal) parsed.festiveDeal = DEFAULT_FESTIVE_DEAL;
      return parsed;
    } catch (e) {}
  }
  return { heroSettings: DEFAULT_HERO_SETTINGS, festiveDeal: DEFAULT_FESTIVE_DEAL };
};

const saveJsonDB = (data) => {
  try {
    fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
};

// GET /api/settings/hero
export const getHeroSettings = async (req, res, next) => {
  try {
    const db = getJsonDB();
    const hero = db.heroSettings || DEFAULT_HERO_SETTINGS;
    return res.status(200).json({ success: true, data: hero });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/hero
export const updateHeroSettings = async (req, res, next) => {
  try {
    const db = getJsonDB();
    const currentHero = db.heroSettings || { ...DEFAULT_HERO_SETTINGS };

    let uploadedImageUrl = req.body.heroImage;
    if (req.file) {
      uploadedImageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    }

    const updatedHero = {
      ...currentHero,
      heroImage: uploadedImageUrl || currentHero.heroImage,
      heroTitle: req.body.heroTitle || currentHero.heroTitle,
      heroSubtitle: req.body.heroSubtitle || currentHero.heroSubtitle,
      heroBadge: req.body.heroBadge || currentHero.heroBadge,
      heroCtaText: req.body.heroCtaText || currentHero.heroCtaText,
      updatedAt: new Date().toISOString()
    };

    db.heroSettings = updatedHero;
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Hero section settings updated successfully',
      data: updatedHero
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/settings/festive-deal
export const getFestiveDealSettings = async (req, res, next) => {
  try {
    const db = getJsonDB();
    const deal = db.festiveDeal || DEFAULT_FESTIVE_DEAL;
    return res.status(200).json({ success: true, data: deal });
  } catch (error) {
    next(error);
  }
};

// PUT /api/settings/festive-deal
export const updateFestiveDealSettings = async (req, res, next) => {
  try {
    const db = getJsonDB();
    const currentDeal = db.festiveDeal || { ...DEFAULT_FESTIVE_DEAL };

    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    }

    let items = currentDeal.includedItems;
    if (req.body.includedItems) {
      if (typeof req.body.includedItems === 'string') {
        items = req.body.includedItems.split(',').map((s) => s.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.includedItems)) {
        items = req.body.includedItems;
      }
    }

    const updatedDeal = {
      ...currentDeal,
      badge: req.body.badge || currentDeal.badge,
      tagline: req.body.tagline || currentDeal.tagline,
      title: req.body.title || currentDeal.title,
      description: req.body.description || currentDeal.description,
      image: imageUrl || currentDeal.image,
      price: req.body.price ? Number(req.body.price) : currentDeal.price,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : currentDeal.originalPrice,
      discount: req.body.discount || currentDeal.discount,
      includedItems: items,
      updatedAt: new Date().toISOString()
    };

    db.festiveDeal = updatedDeal;
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Special Festive Deal settings updated successfully',
      data: updatedDeal
    });
  } catch (error) {
    next(error);
  }
};
