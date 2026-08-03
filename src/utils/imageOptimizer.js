/**
 * Client-side Image Optimizer & Validator using Canvas API
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_DIMENSION = 1800; // max width or height in px

/**
 * Validate an image file before processing
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check MIME type or file extension
  const fileName = file.name || '';
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.type);
  const isExtValid = validExtensions.includes(fileExt);

  if (!isMimeValid && !isExtValid) {
    return {
      valid: false,
      error: `Unsupported file format (${file.type || fileExt}). Only JPG, JPEG, PNG, and WebP images are allowed.`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File "${file.name}" is too large (${sizeMB} MB). Maximum allowed size is 5 MB.`
    };
  }

  return { valid: true };
};

/**
 * Optimize an image File or Blob using HTML Canvas:
 * Resizes down to MAX_DIMENSION while keeping aspect ratio, and compresses to WebP or JPEG.
 */
export const optimizeImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const maxDim = options.maxDimension || MAX_DIMENSION;
    const quality = options.quality || 0.85;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width <= 0 || height <= 0) {
        reject(new Error('Damaged or unreadable image file.'));
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context for image optimization.'));
        return;
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Attempt to export as webp, fallback to jpeg
      const mimeType = 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // Fallback to jpeg if webp export failed
            canvas.toBlob(
              (jpegBlob) => {
                if (!jpegBlob) {
                  reject(new Error('Canvas image compression failed.'));
                  return;
                }
                resolve({
                  blob: jpegBlob,
                  originalFileName: file.name,
                  mimeType: 'image/jpeg',
                  width,
                  height,
                  size: jpegBlob.size
                });
              },
              'image/jpeg',
              quality
            );
            return;
          }

          resolve({
            blob,
            originalFileName: file.name,
            mimeType: 'image/webp',
            width,
            height,
            size: blob.size
          });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load or parse image file. It may be corrupt or damaged.'));
    };

    img.src = objectUrl;
  });
};

/**
 * Convert a Blob to Base64 string for JSON export
 */
export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
};

/**
 * Convert a Data URL / Base64 string back to Blob for JSON import
 */
export const dataURLToBlob = (dataURL) => {
  const arr = dataURL.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};
