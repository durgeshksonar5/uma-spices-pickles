import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  fetchGalleryFromApi,
  uploadToVercelBlob,
  saveGalleryManifestToApi,
  deleteGalleryImageFromApi
} from '../api/galleryApi';
import {
  getAllGalleryImages,
  addMultipleGalleryImages,
  updateGalleryImage,
  deleteGalleryImage as deleteIndexedDBImage,
  clearGalleryImages,
  reorderGalleryImages as reorderIndexedDBImages
} from '../services/galleryStorage';
import { optimizeImage, blobToBase64, dataURLToBlob } from '../utils/imageOptimizer';
import { defaultGalleryItems } from '../data/defaultGallery';

export const GalleryContext = createContext(null);

const BROADCAST_CHANNEL_NAME = 'gajanan_gallery_channel';
const CUSTOM_EVENT_NAME = 'gajanan_gallery_updated';

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageSource, setStorageSource] = useState('vercel_blob'); // 'vercel_blob' or 'indexeddb'

  // Map of id -> objectUrl (for local IndexedDB fallback blobs)
  const objectUrlsMapRef = useRef(new Map());
  const broadcastChannelRef = useRef(null);

  const cleanupAllObjectUrls = useCallback(() => {
    objectUrlsMapRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
    });
    objectUrlsMapRef.current.clear();
  }, []);

  const revokeObjectUrlForId = useCallback((id) => {
    if (objectUrlsMapRef.current.has(id)) {
      const url = objectUrlsMapRef.current.get(id);
      try {
        URL.revokeObjectURL(url);
      } catch (e) {}
      objectUrlsMapRef.current.delete(id);
    }
  }, []);

  const notifyGalleryChanged = useCallback(() => {
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'GALLERY_MUTATED', timestamp: Date.now() });
      } catch (e) {}
    }
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME));
  }, []);

  // Load gallery items from Vercel Blob or local IndexedDB
  const loadGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchGalleryFromApi();
      setStorageSource(result.source || 'vercel_blob');

      if (result.source === 'indexeddb') {
        let rawRecords = result.images || [];

        // If local storage is empty, seed with initial default gallery items
        if (rawRecords.length === 0) {
          try {
            await addMultipleGalleryImages(defaultGalleryItems);
            rawRecords = await getAllGalleryImages();
          } catch (seedErr) {
            console.warn('Failed to seed default gallery items to IndexedDB:', seedErr);
            rawRecords = defaultGalleryItems;
          }
        }

        const newIdsSet = new Set(rawRecords.map((r) => r.id));

        objectUrlsMapRef.current.forEach((url, id) => {
          if (!newIdsSet.has(id)) {
            revokeObjectUrlForId(id);
          }
        });

        const processedItems = rawRecords.map((item) => {
          let objectUrl = objectUrlsMapRef.current.get(item.id);
          if (!objectUrl && item.imageBlob) {
            try {
              objectUrl = URL.createObjectURL(item.imageBlob);
              objectUrlsMapRef.current.set(item.id, objectUrl);
            } catch (e) {}
          }
          return {
            ...item,
            imageUrl: objectUrl || item.imageUrl || item.url || ''
          };
        });

        setGalleryItems(processedItems);
      } else {
        // Vercel Blob items
        let rawBlobs = result.images || [];
        if (rawBlobs.length === 0) {
          // Fallback to default items if Vercel Blob has no items yet
          rawBlobs = defaultGalleryItems;
        }

        const items = rawBlobs.map((item, index) => ({
          ...item,
          id: item.id || `img_blob_${index}`,
          imageUrl: item.url || item.imageUrl || '',
          displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index,
          isActive: typeof item.isActive === 'boolean' ? item.isActive : true
        }));

        // Sort by displayOrder ascending, then createdAt descending
        items.sort((a, b) => {
          const orderA = Number(a.displayOrder ?? 0);
          const orderB = Number(b.displayOrder ?? 0);
          if (orderA !== orderB) return orderA - orderB;
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        setGalleryItems(items);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
      setError(err.message || 'Failed to load gallery photos.');
      setGalleryItems(defaultGalleryItems);
    } finally {
      setLoading(false);
    }
  }, [revokeObjectUrlForId]);

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
   * Add multiple images (Vercel Blob upload with fallback to IndexedDB)
   */
  const addImages = async (filesList, defaultMetadata = {}) => {
    if (!filesList || filesList.length === 0) return [];
    const files = Array.from(filesList);
    const addedRecords = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const opt = await optimizeImage(file);

        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const formattedTitle = nameWithoutExt.replace(/[-_]/g, ' ');

        let blobUrl = '';
        let pathname = '';

        // Try Vercel Blob Upload
        try {
          const blobRes = await uploadToVercelBlob(opt.blob);
          blobUrl = blobRes.url;
          pathname = blobRes.pathname;
        } catch (blobErr) {
          console.warn('Vercel Blob upload unavailable, storing locally:', blobErr.message);
        }

        const now = new Date().toISOString();
        const id = `img_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 6)}`;

        const record = {
          id,
          url: blobUrl,
          imageUrl: blobUrl,
          pathname: pathname || `gallery/gallery-${Date.now()}-${file.name}`,
          imageBlob: !blobUrl ? opt.blob : null,
          originalFileName: opt.originalFileName,
          mimeType: opt.mimeType,
          fileSize: opt.size,
          title: defaultMetadata.title || formattedTitle,
          altText: defaultMetadata.altText || formattedTitle,
          caption: defaultMetadata.caption || '',
          category: defaultMetadata.category || 'General',
          displayOrder: (defaultMetadata.displayOrder ?? galleryItems.length) + i,
          isActive: typeof defaultMetadata.isActive === 'boolean' ? defaultMetadata.isActive : true,
          createdAt: now,
          updatedAt: now
        };

        addedRecords.push(record);
      } catch (err) {
        errors.push(`"${file.name}": ${err.message}`);
      }
    }

    if (addedRecords.length > 0) {
      if (storageSource === 'indexeddb' || addedRecords.some((r) => r.imageBlob)) {
        await addMultipleGalleryImages(addedRecords);
      }

      // Update Vercel Blob Manifest
      const newItemsList = [...galleryItems, ...addedRecords];
      await saveGalleryManifestToApi(newItemsList);

      notifyGalleryChanged();
      await loadGallery();
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }

    return addedRecords;
  };

  /**
   * Update existing image metadata
   */
  const updateImage = async (id, metadataUpdates) => {
    const updatedList = galleryItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...metadataUpdates,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    setGalleryItems(updatedList);

    if (storageSource === 'indexeddb') {
      await updateGalleryImage(id, metadataUpdates);
    }

    await saveGalleryManifestToApi(updatedList);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Replace existing image
   */
  const replaceImage = async (id, newFile, metadataUpdates = {}) => {
    const existing = galleryItems.find((i) => i.id === id);
    const opt = await optimizeImage(newFile);

    let blobUrl = '';
    let pathname = '';

    try {
      const blobRes = await uploadToVercelBlob(opt.blob);
      blobUrl = blobRes.url;
      pathname = blobRes.pathname;
    } catch (e) {
      console.warn('Vercel Blob upload failed on replace, updating locally:', e.message);
    }

    // Delete old Vercel Blob file if present
    if (existing && existing.url && blobUrl) {
      deleteGalleryImageFromApi(existing).catch(() => {});
    }

    const now = new Date().toISOString();
    const updatedRecord = {
      ...existing,
      ...metadataUpdates,
      id,
      url: blobUrl || existing?.url || '',
      imageUrl: blobUrl || existing?.imageUrl || '',
      pathname: pathname || existing?.pathname || '',
      imageBlob: !blobUrl ? opt.blob : null,
      originalFileName: opt.originalFileName,
      mimeType: opt.mimeType,
      fileSize: opt.size,
      updatedAt: now
    };

    const updatedList = galleryItems.map((item) => (item.id === id ? updatedRecord : item));

    if (storageSource === 'indexeddb') {
      revokeObjectUrlForId(id);
      await updateGalleryImage(id, updatedRecord);
    }

    await saveGalleryManifestToApi(updatedList);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Delete image
   */
  const deleteImage = async (id) => {
    const existing = galleryItems.find((i) => i.id === id);

    if (existing) {
      if (existing.url || existing.pathname) {
        deleteGalleryImageFromApi(existing).catch(() => {});
      }
      if (storageSource === 'indexeddb') {
        revokeObjectUrlForId(id);
        await deleteIndexedDBImage(id);
      }
    }

    const updatedList = galleryItems.filter((item) => item.id !== id);
    setGalleryItems(updatedList);
    await saveGalleryManifestToApi(updatedList);

    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Toggle active/inactive status
   */
  const toggleActiveStatus = async (id) => {
    const item = galleryItems.find((i) => i.id === id);
    if (!item) return;
    await updateImage(id, { isActive: !item.isActive });
  };

  /**
   * Reorder images
   */
  const reorderImages = async (orderedIds) => {
    const updatedList = orderedIds
      .map((id, index) => {
        const item = galleryItems.find((i) => i.id === id);
        if (item) {
          return { ...item, displayOrder: index, updatedAt: new Date().toISOString() };
        }
        return null;
      })
      .filter(Boolean);

    setGalleryItems(updatedList);

    if (storageSource === 'indexeddb') {
      await reorderIndexedDBImages(orderedIds);
    }

    await saveGalleryManifestToApi(updatedList);
    notifyGalleryChanged();
    await loadGallery();
  };

  /**
   * Export gallery JSON backup including image Blobs as Base64 Data URLs
   */
  const exportBackup = async () => {
    const exportItems = await Promise.all(
      galleryItems.map(async (item) => {
        let base64Data = null;
        if (item.imageBlob) {
          try {
            base64Data = await blobToBase64(item.imageBlob);
          } catch (e) {}
        }
        return {
          id: item.id,
          title: item.title || '',
          altText: item.altText || '',
          caption: item.caption || '',
          category: item.category || 'General',
          displayOrder: item.displayOrder ?? 0,
          isActive: item.isActive ?? true,
          imageUrl: item.imageUrl || item.url || '',
          url: item.url || '',
          pathname: item.pathname || '',
          originalFileName: item.originalFileName || 'image.jpg',
          mimeType: item.mimeType || 'image/jpeg',
          fileSize: item.fileSize || 0,
          base64Data,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        };
      })
    );

    const backupObj = {
      version: 1,
      exportedAt: new Date().toISOString(),
      totalImages: exportItems.length,
      images: exportItems
    };

    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gajanan_gallery_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Import gallery JSON backup
   */
  const importBackup = async (jsonFile) => {
    const text = await jsonFile.text();
    const backupObj = JSON.parse(text);
    if (!backupObj || !Array.isArray(backupObj.images)) {
      throw new Error('Invalid backup file format: missing "images" array.');
    }

    const importedRecords = backupObj.images.map((item, idx) => {
      let imageBlob = null;
      if (item.base64Data) {
        try {
          imageBlob = dataURLToBlob(item.base64Data);
        } catch (e) {}
      }

      return {
        id: item.id || `img_imp_${Date.now()}_${idx}`,
        imageUrl: item.imageUrl || item.url || '',
        url: item.url || '',
        pathname: item.pathname || '',
        imageBlob,
        originalFileName: item.originalFileName || 'image.jpg',
        mimeType: item.mimeType || 'image/jpeg',
        fileSize: item.fileSize || (imageBlob ? imageBlob.size : 0),
        title: item.title || '',
        altText: item.altText || item.title || 'Gallery image',
        caption: item.caption || '',
        category: item.category || 'General',
        displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : idx,
        isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    await clearGalleryImages();
    await addMultipleGalleryImages(importedRecords);
    notifyGalleryChanged();
    await loadGallery();
    return importedRecords.length;
  };

  const value = {
    galleryItems,
    loading,
    error,
    storageSource,
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

export default GalleryProvider;
