import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, '../data/db.json');

const srcAssetsGalleryDir = path.resolve(__dirname, '../../src/assets/gallery');
const publicAssetsGalleryDir = path.resolve(__dirname, '../../public/assets/gallery');

// Ensure gallery dirs exist
if (!fs.existsSync(srcAssetsGalleryDir)) {
  fs.mkdirSync(srcAssetsGalleryDir, { recursive: true });
}
if (!fs.existsSync(publicAssetsGalleryDir)) {
  fs.mkdirSync(publicAssetsGalleryDir, { recursive: true });
}

const getJsonDB = () => {
  if (fs.existsSync(dbJsonPath)) {
    try {
      const data = fs.readFileSync(dbJsonPath, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.galleryItems || !Array.isArray(parsed.galleryItems)) {
        parsed.galleryItems = [];
      }
      return parsed;
    } catch (e) {}
  }
  return { galleryItems: [] };
};

const saveJsonDB = (data) => {
  try {
    fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
};

// GET /api/gallery
export const getGalleryItems = async (req, res, next) => {
  try {
    const db = getJsonDB();
    return res.status(200).json({
      success: true,
      data: db.galleryItems || []
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/gallery
export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, description, imageUrl, imageBase64, imageType } = req.body;

    let finalImageUrl = imageUrl;

    if (req.file) {
      const filename = req.file.filename;
      const fileBuffer = fs.readFileSync(req.file.path);

      fs.writeFileSync(path.join(srcAssetsGalleryDir, filename), fileBuffer);
      fs.writeFileSync(path.join(publicAssetsGalleryDir, filename), fileBuffer);

      finalImageUrl = `/assets/gallery/${filename}`;
    } else if (imageBase64) {
      const ext = imageType ? (imageType.split('/')[1] || 'jpg') : 'jpg';
      const filename = `gallery-${Date.now()}.${ext}`;
      const buffer = Buffer.from(imageBase64, 'base64');

      fs.writeFileSync(path.join(srcAssetsGalleryDir, filename), buffer);
      fs.writeFileSync(path.join(publicAssetsGalleryDir, filename), buffer);

      finalImageUrl = `/assets/gallery/${filename}`;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ success: false, message: 'Image file or URL is required' });
    }

    const db = getJsonDB();
    if (!db.galleryItems) db.galleryItems = [];

    const newItem = {
      _id: `gal-${Date.now()}`,
      title: title ? title.trim() : '',
      category: category || '',
      description: description ? description.trim() : '',
      imageUrl: finalImageUrl,
      createdAt: new Date().toISOString()
    };

    db.galleryItems.unshift(newItem);
    saveJsonDB(db);

    return res.status(201).json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/gallery/:id
export const updateGalleryItem = async (req, res, next) => {
  try {
    const { title, category, description, imageUrl, imageBase64, imageType } = req.body;
    const db = getJsonDB();

    const index = db.galleryItems.findIndex((item) => (item._id || item.id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    const current = db.galleryItems[index];

    let finalImageUrl = current.imageUrl;
    if (req.file) {
      const filename = req.file.filename;
      const fileBuffer = fs.readFileSync(req.file.path);

      fs.writeFileSync(path.join(srcAssetsGalleryDir, filename), fileBuffer);
      fs.writeFileSync(path.join(publicAssetsGalleryDir, filename), fileBuffer);

      finalImageUrl = `/assets/gallery/${filename}`;
    } else if (imageBase64) {
      const ext = imageType ? (imageType.split('/')[1] || 'jpg') : 'jpg';
      const filename = `gallery-${Date.now()}.${ext}`;
      const buffer = Buffer.from(imageBase64, 'base64');

      fs.writeFileSync(path.join(srcAssetsGalleryDir, filename), buffer);
      fs.writeFileSync(path.join(publicAssetsGalleryDir, filename), buffer);

      finalImageUrl = `/assets/gallery/${filename}`;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    const updated = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      category: category !== undefined ? category : current.category,
      description: description !== undefined ? description.trim() : current.description,
      imageUrl: finalImageUrl,
      updatedAt: new Date().toISOString()
    };

    db.galleryItems[index] = updated;
    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/gallery/:id
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const db = getJsonDB();
    const initialLen = db.galleryItems.length;
    db.galleryItems = db.galleryItems.filter((item) => (item._id || item.id) !== req.params.id);

    if (db.galleryItems.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    saveJsonDB(db);

    return res.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};
