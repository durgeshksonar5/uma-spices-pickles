import { list } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      // Return clear status if token is missing (e.g. unconfigured local environment)
      return response.status(200).json({
        success: true,
        source: 'unconfigured',
        message: 'BLOB_READ_WRITE_TOKEN environment variable is not configured.',
        images: []
      });
    }

    // List Blobs with prefix 'gallery/'
    const { blobs } = await list({ prefix: 'gallery/', token });

    // Look for gallery-manifest.json
    const manifestBlob = blobs.find((b) => b.pathname === 'gallery/gallery-manifest.json');

    if (manifestBlob) {
      try {
        const manifestRes = await fetch(manifestBlob.url);
        if (manifestRes.ok) {
          const manifestData = await manifestRes.json();
          if (manifestData && Array.isArray(manifestData.images)) {
            return response.status(200).json({
              success: true,
              source: 'manifest',
              images: manifestData.images
            });
          }
        }
      } catch (e) {
        console.warn('Failed to parse gallery manifest JSON:', e.message);
      }
    }

    // If no manifest exists, build image array from listed blobs (excluding manifest file)
    const imageBlobs = blobs.filter((b) => b.pathname !== 'gallery/gallery-manifest.json');
    const images = imageBlobs.map((b, index) => {
      const fileName = b.pathname.replace(/^gallery\//, '');
      const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      const formattedTitle = nameWithoutExt.replace(/[-_]/g, ' ');

      return {
        id: `blob_${b.uploadedAt.getTime()}_${index}`,
        url: b.url,
        pathname: b.pathname,
        originalFileName: fileName,
        mimeType: b.contentType || 'image/jpeg',
        fileSize: b.size,
        title: formattedTitle,
        altText: formattedTitle,
        caption: '',
        category: 'General',
        displayOrder: index,
        isActive: true,
        createdAt: b.uploadedAt ? b.uploadedAt.toISOString() : new Date().toISOString(),
        updatedAt: b.uploadedAt ? b.uploadedAt.toISOString() : new Date().toISOString()
      };
    });

    return response.status(200).json({
      success: true,
      source: 'blobs',
      images
    });
  } catch (error) {
    console.error('Vercel Blob list error:', error);
    return response.status(500).json({
      success: false,
      message: error.message || 'Failed to list gallery images from Vercel Blob.',
      images: []
    });
  }
}
