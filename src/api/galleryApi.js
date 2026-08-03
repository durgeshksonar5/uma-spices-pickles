import { upload } from '@vercel/blob/client';
import {
  getAllGalleryImages,
  addMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage as deleteIndexedDBImage,
  clearGalleryImages,
  reorderGalleryImages
} from '../services/galleryStorage';

/**
 * Upload an image file directly to Vercel Blob using client upload flow
 */
export const uploadToVercelBlob = async (file, options = {}) => {
  const sanitizeName = (name) => name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const cleanName = sanitizeName(file.name || 'image.jpg');
  const pathname = `gallery/gallery-${Date.now()}-${cleanName}`;

  try {
    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/gallery/upload'
    });
    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type || 'image/jpeg',
      size: file.size
    };
  } catch (err) {
    console.warn('[galleryApi] Vercel Blob upload endpoint unavailable or failing:', err.message);
    throw err;
  }
};

/**
 * Fetch gallery images from Vercel Blob API (/api/gallery) with IndexedDB fallback for local development
 */
export const fetchGalleryFromApi = async () => {
  try {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.images) && data.source !== 'unconfigured') {
        return {
          success: true,
          source: 'vercel_blob',
          images: data.images
        };
      }
    }
  } catch (err) {
    console.warn('[galleryApi] Vercel Blob API endpoint unavailable, utilizing IndexedDB:', err.message);
  }

  // Fallback to IndexedDB
  const localItems = await getAllGalleryImages();
  return {
    success: true,
    source: 'indexeddb',
    images: localItems
  };
};

/**
 * Persist gallery manifest metadata to Vercel Blob store
 */
export const saveGalleryManifestToApi = async (imagesArray) => {
  try {
    const res = await fetch('/api/gallery/save-manifest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: imagesArray })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[galleryApi] Failed to save manifest to Vercel Blob API:', err.message);
  }
  return { success: false, message: 'Vercel Blob API unavailable' };
};

/**
 * Delete image from Vercel Blob store
 */
export const deleteGalleryImageFromApi = async (imageRecord) => {
  try {
    const res = await fetch('/api/gallery/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: imageRecord.id,
        url: imageRecord.url,
        pathname: imageRecord.pathname
      })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[galleryApi] Failed to delete from Vercel Blob API:', err.message);
  }
  return { success: false, message: 'Vercel Blob API unavailable' };
};
