import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

// Configure AWS SDK on server-side
const s3Client = new AWS.S3({
  region: process.env.AWS_REGION || 'ap-south-1',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'your-bucket-name';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Extract key from URL
    const url = new URL(imageUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    // Delete from S3
    await s3Client.deleteObject({
      Bucket: BUCKET_NAME,
      Key: key,
    }).promise();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('S3 Delete Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
