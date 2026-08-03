import { handleUpload } from '@vercel/blob/client';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Enforce gallery/ prefix
        const cleanPathname = pathname.startsWith('gallery/')
          ? pathname
          : `gallery/${pathname.replace(/^\/+/, '')}`;

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB max
          tokenPayload: JSON.stringify({
            uploadTime: Date.now()
          })
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Blob upload completed callback on serverless function
        console.log('[Vercel Blob Upload Completed]', blob.url);
      }
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Vercel Blob Upload Error:', error);
    return response.status(400).json({
      success: false,
      message: error.message || 'Failed to process Blob upload'
    });
  }
}
