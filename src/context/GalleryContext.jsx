import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  getAllGalleryImages,
  addGalleryImage,
  addMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  clearGalleryImages,
  reorderGalleryImages
} from '../services/galleryStorage';
import { optimizeImage, blobToBase64, dataURLToBlob } from '../utils/imageOptimizer';

export const GalleryContext = createContext(null);

const BROADCAST_CHANNEL_NAME = 'gajanan_gallery_channel';
const CUSTOM_EVENT_NAME = 'gajanan_gallery_updated';

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map of id -> objectUrl to manage memory cleanup
  const objectUrlsMapRef = useRef(new Map());
  const broadcastChannelRef = useRef(null);

  // Clean up all generated Object URLs
  const cleanupAllObjectUrls = useCallback(() => {
    objectUrlsMapRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Error revoking Object URL:', e);
      }
    });
    objectUrlsMapRef.current.clear();
  }, []);

  // Revoke a single Object URL by ID
  const revokeObjectUrlForId = useCallback((id) => {
    if (objectUrlsMapRef.current.has(id)) {
      const url = objectUrlsMapRef.current.get(id);
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn('Error revoking Object URL:', e);
      }
      objectUrlsMapRef.current.delete(id);
    }
  }, []);

  // Broadcast sync signal to other tabs/components
  const notifyGalleryChanged = useCallback(() => {
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'GALLERY_MUTATED', timestamp: Date.now() });
      } catch (e) {
        // ignore
      }
    }
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
  }, []);

  // Load gallery from IndexedDB and manage Object URLs
  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawRecords = await getAllGalleryImages();

      // Track active IDs to clean up removed item URLs
      const newIdsSet = new Set(rawRecords.map((r) => r.id));

      // Revoke URLs for items that no longer exist
      objectUrlsMapRef.current.forEach((url, id) => {
        if (!newIdsSet.has(id)) {
          revokeObjectUrlForId(id);
        }
      });

      // Attach or create object URLs
      const processedItems = rawRecords.map((item) => {
        let objectUrl = objectUrlsMapRef.current.get(item.id);

        if (!objectUrl && item.imageBlob) {
          try {
            objectUrl = URL.createObjectURL(item.imageBlob);
            objectUrlsMapRef.current.set(item.id, objectUrl);
          } catch (e) {
            console.error('Failed to create Object URL for item', item.id, e);
          }
        }

        return {
          ...item,
          imageUrl: objectUrl || ''
        };
      });

      setGalleryItems(processedItems);
    } catch (err) {
      console.error('Failed to load gallery from IndexedDB:', err);
      setError(err.message || 'Failed to load gallery images from browser storage.');
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  }, [revokeObjectUrlForId]);

  // Set up broadcast channel and window listener for cross-tab sync
  useEffect(() => {
    loadGallery();

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannelRef.current = channel;
      channel.onmessage = (event) => {
        if (event.data?.type === 'GALLERY_MUTATED') {
          loadGallery();
        }
      };
    }

    const handleCustomEvent = () => {
      loadGallery();
    };

    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
      cleanupAllObjectUrls();
    };
  }, [loadGallery, cleanupAllObjectUrls]);

  /**
   * Add multiple images from File object list with optional default metadata
   */
  const addImages = async (filesList, defaultMetadata = {}) => {
    if (!filesList || filesList.length === 0) return [];

    const files = Array.from(filesList);
    const optimizedItems = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const opt = await optimizeImage(file);

        // Derive title from filename without extension if not provided
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const formattedTitle = nameWithoutExt.replace(/[-_]/g, ' ');

        optimizedItems.push({
          imageBlob: opt.blob,
          originalFileName: opt.originalFileName,
          mimeType: opt.mimeType,
          fileSize: opt.size,
          title: defaultMetadata.title || formattedTitle,
          altText: defaultMetadata.altText || formattedTitle,
          caption: defaultMetadata.caption || '',
          category: defaultMetadata.category || 'General',
          displayOrder: defaultMetadata.displayOrder ?? galleryItems.length + i,
          isActive: typeof defaultMetadata.isActive === 'boolean' ? defaultMetadata.isActive : true
        });
      } catch (err) {
        errors.push(`"${file.name}": ${err.message}`);
      }
    }

    if (optimizedItems.length > 0) {
      await addMultipleGalleryImages(optimizedItems);
      notifyGalleryChanged();
      await loadGallery();
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return optimizedItems;
  };

  /**
   * Update existing image metadata
   */
  const updateImage = async (id, metadataUpdates) => {
    await updateGalleryImage(id, metadataUpdates);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Replace existing image file and metadata
   */
  const replaceImage = async (id, newFile, metadataUpdates = {}) => {
    const opt = await optimizeImage(newFile);
    revokeObjectUrlForId(id);

    const updates = {
      ...metadataUpdates,
      imageBlob: opt.blob,
      originalFileName: opt.originalFileName,
      mimeType: opt.mimeType,
      fileSize: opt.size
    };

    await updateGalleryImage(id, updates);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Delete an image
   */
  const deleteImage = async (id) => {
    revokeObjectUrlForId(id);
    await deleteGalleryImage(id);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Toggle active/inactive status
   */
  const toggleActiveStatus = async (id) => {
    const item = galleryItems.find((i) => i.id === id);
    if (!item) return;
    await updateGalleryImage(id, { isActive: !item.isActive });
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Reorder images
   */
  const reorderImages = async (orderedIds) => {
    await reorderGalleryImages(orderedIds);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Export all images and metadata as downloadable JSON backup file
   */
  const exportBackup = async () => {
    const rawItems = await getAllGalleryImages();
    const backupData = {
      app: 'GajananFoodsGalleryBackup',
      version: 1,
      exportedAt: new Date().toISOString(),
      count: rawItems.length,
      items: []
    };

    for (const item of rawItems) {
      let base64Data = '';
      if (item.imageBlob) {
        base64Data = await blobToBase64(item.imageBlob);
      }
      backupData.items.push({
        id: item.id,
        originalFileName: item.originalFileName,
        mimeType: item.mimeType,
        fileSize: item.fileSize,
        title: item.title,
        altText: item.altText,
        caption: item.caption,
        category: item.category,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        base64Data
      });
    }

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().slice(0, 10);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gajanan_gallery_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /**
   * Import JSON backup file
   */
  const importBackup = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          const parsed = JSON.parse(text);

          if (parsed.app !== 'GajananFoodsGalleryBackup' || !Array.isArray(parsed.items)) {
            throw new Error('Invalid backup file format.');
          }

          // Clear existing
          cleanupAllObjectUrls();
          await clearGalleryImages();

          const toAdd = [];
          for (const item of parsed.items) {
            if (!item.base64Data) continue;
            const blob = dataURLToBlob(item.base64Data);
            toAdd.push({
              id: item.id,
              imageBlob: blob,
              originalFileName: item.originalFileName,
              mimeType: item.mimeType,
              fileSize: item.fileSize || blob.size,
              title: item.title || '',
              altText: item.altText || item.title || 'Gallery image',
              caption: item.caption || '',
              category: item.category || 'General',
              displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : 0,
              isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString()
            });
          }

          await addMultipleGalleryImages(toAdd);
          notifyGalleryChanged();
          await loadGallery();

          resolve(toAdd.length);
        } catch (err) {
          reject(new Error('Failed to parse or restore backup: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading backup file.'));
      reader.readAsText(file);
    });
  };

  const value = {
    galleryItems,
    loading,
    error,
    refreshGallery: loadGallery,
    addImages,
    updateImage,
    replaceImage,
    deleteImage,
    toggleActiveStatus,
    reorderImages,
    exportBackup,
    importBackup
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};
