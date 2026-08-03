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
        const rawRecords = result.images || [];
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
            imageUrl: objectUrl || item.imageUrl || ''
          };
        });

        setGalleryItems(processedItems);
      } else {
        // Vercel Blob items already have permanent public URLs
        const items = (result.images || []).map((item, index) => ({
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
      setGalleryItems([]);
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
    reorderImages
  };

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
};
