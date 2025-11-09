// Client-side utility for uploading images via API route
// This avoids credential issues by using server-side S3 upload

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadImageToS3 = async (file: File): Promise<UploadResult> => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Upload via API route
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.error || 'Upload failed' };
    }

    return result;
  } catch (error) {
    console.error('Upload Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const deleteImageFromS3 = async (imageUrl: string): Promise<boolean> => {
  try {
    // You can implement this via another API route if needed
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    return response.ok;
  } catch (error) {
    console.error('Delete Error:', error);
    return false;
  }
};
