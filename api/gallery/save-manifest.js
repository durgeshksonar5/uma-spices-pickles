import { put } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
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

    const { images } = request.body || {};
    if (!Array.isArray(images)) {
      return response.status(400).json({
        success: false,
        message: 'Invalid payload: images must be an array.'
      });
    }

    const manifestData = {
      version: 1,
      updatedAt: new Date().toISOString(),
      images
    };

    const blob = await put('gallery/gallery-manifest.json', JSON.stringify(manifestData, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      token
    });

    return response.status(200).json({
      success: true,
      message: 'Gallery manifest saved successfully to Vercel Blob.',
      url: blob.url,
      imagesCount: images.length
    });
  } catch (error) {
    console.error('Save manifest error:', error);
    return response.status(500).json({
      success: false,
      message: error.message || 'Failed to save gallery manifest to Vercel Blob.'
    });
  }
}
