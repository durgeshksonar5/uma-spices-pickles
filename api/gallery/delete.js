import { del, put, list } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return response.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return response.status(400).json({
        success: false,
        message: 'BLOB_READ_WRITE_TOKEN environment variable is missing.'
      });
    }

    const { url, pathname, id } = request.body || {};
    const targetUrl = url || pathname;

    if (!targetUrl) {
      return response.status(400).json({
        success: false,
        message: 'Target image url or pathname is required.'
      });
    }

    // Safety check: ensure deleting only files under gallery/ prefix
    if (pathname && !pathname.startsWith('gallery/')) {
      return response.status(403).json({
        success: false,
        message: 'Access Denied: Can only delete files under the gallery/ prefix.'
      });
    }

    // Delete actual image from Vercel Blob
    try {
      await del(targetUrl, { token });
    } catch (delError) {
      console.warn('Failed to delete Blob file directly:', delError.message);
    }

    // Update manifest if it exists
    const { blobs } = await list({ prefix: 'gallery/', token });
    const manifestBlob = blobs.find((b) => b.pathname === 'gallery/gallery-manifest.json');

    if (manifestBlob) {
      try {
        const manifestRes = await fetch(manifestBlob.url);
        if (manifestRes.ok) {
          const manifestData = await manifestRes.json();
          if (manifestData && Array.isArray(manifestData.images)) {
            const updatedImages = manifestData.images.filter(
              (img) => img.id !== id && img.url !== targetUrl && img.pathname !== pathname
            );
            manifestData.images = updatedImages;
            manifestData.updatedAt = new Date().toISOString();

            await put('gallery/gallery-manifest.json', JSON.stringify(manifestData, null, 2), {
              access: 'public',
              addRandomSuffix: false,
              allowOverwrite: true,
              contentType: 'application/json',
              token
            });
          }
        }
      } catch (e) {
        console.warn('Failed to update manifest on delete:', e.message);
      }
    }

    return response.status(200).json({
      success: true,
      message: 'Gallery image deleted successfully from Vercel Blob.'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    return response.status(500).json({
      success: false,
      message: error.message || 'Failed to delete gallery image.'
    });
  }
}
