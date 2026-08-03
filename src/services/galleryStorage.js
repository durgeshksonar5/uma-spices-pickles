/**
 * IndexedDB storage service for Gajanan Foods Gallery.
 * Database: gajananGalleryDB
 * Store: galleryImages
 */

const DB_NAME = 'gajananGalleryDB';
const DB_VERSION = 1;
const STORE_NAME = 'galleryImages';

let dbInstance = null;

/**
 * Initialize and return IndexedDB connection
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('isActive', 'isActive', { unique: false });
        store.createIndex('displayOrder', 'displayOrder', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      dbInstance.onversionchange = () => {
        dbInstance.close();
        dbInstance = null;
      };
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Get all gallery records
 */
export const getAllGalleryImages = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const items = request.result || [];
      // Sort by displayOrder ascending, then createdAt descending
      items.sort((a, b) => {
        const orderA = Number(a.displayOrder ?? 0);
        const orderB = Number(b.displayOrder ?? 0);
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      resolve(items);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Get a single gallery record by ID
 */
export const getGalleryImage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Add a new gallery record
 */
export const addGalleryImage = async (itemData) => {
  const db = await initDB();
  const now = new Date().toISOString();
  const id = itemData.id || `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const record = {
    id,
    imageBlob: itemData.imageBlob,
    originalFileName: itemData.originalFileName || 'image.jpg',
    mimeType: itemData.mimeType || 'image/jpeg',
    fileSize: itemData.fileSize || itemData.imageBlob?.size || 0,
    title: itemData.title || '',
    altText: itemData.altText || itemData.title || 'Gallery image',
    caption: itemData.caption || '',
    category: itemData.category || 'General',
    displayOrder: typeof itemData.displayOrder === 'number' ? itemData.displayOrder : 0,
    isActive: typeof itemData.isActive === 'boolean' ? itemData.isActive : true,
    createdAt: itemData.createdAt || now,
    updatedAt: now
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(record);

    request.onsuccess = () => {
      resolve(record);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Add multiple gallery records in a single transaction
 */
export const addMultipleGalleryImages = async (imagesArray) => {
  const db = await initDB();
  const now = new Date().toISOString();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const addedRecords = [];

    tx.oncomplete = () => {
      resolve(addedRecords);
    };

    tx.onerror = (event) => {
      reject(event.target.error);
    };

    imagesArray.forEach((item, index) => {
      const id = item.id || `img_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 6)}`;
      const record = {
        id,
        imageBlob: item.imageBlob,
        originalFileName: item.originalFileName || 'image.jpg',
        mimeType: item.mimeType || 'image/jpeg',
        fileSize: item.fileSize || item.imageBlob?.size || 0,
        title: item.title || '',
        altText: item.altText || item.title || 'Gallery image',
        caption: item.caption || '',
        category: item.category || 'General',
        displayOrder: typeof item.displayOrder === 'number' ? item.displayOrder : index,
        isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
        createdAt: item.createdAt || now,
        updatedAt: now
      };
      store.add(record);
      addedRecords.push(record);
    });
  });
};

/**
 * Update an existing gallery record
 */
export const updateGalleryImage = async (id, updates) => {
  const existing = await getGalleryImage(id);
  if (!existing) {
    throw new Error(`Gallery item with ID "${id}" not found.`);
  }

  const db = await initDB();
  const updatedRecord = {
    ...existing,
    ...updates,
    id, // ensure ID is unchanged
    updatedAt: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(updatedRecord);

    request.onsuccess = () => {
      resolve(updatedRecord);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Delete a gallery record by ID
 */
export const deleteGalleryImage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Clear all gallery records
 */
export const clearGalleryImages = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

/**
 * Reorder gallery images by updating displayOrder according to the array of IDs
 */
export const reorderGalleryImages = async (orderedIds) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    tx.oncomplete = () => {
      resolve(true);
    };

    tx.onerror = (event) => {
      reject(event.target.error);
    };

    orderedIds.forEach((id, index) => {
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const record = getReq.result;
        if (record) {
          record.displayOrder = index;
          record.updatedAt = new Date().toISOString();
          store.put(record);
        }
      };
    });
  });
};
