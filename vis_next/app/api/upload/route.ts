import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK on server-side
const s3Client = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  // Credentials will be picked up from environment or IAM roles
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'your-bucket-name';
const REGION = process.env.AWS_REGION || 'us-east-1';

export async function POST(request: NextRequest) {
  try {
    console.log('AWS Configuration:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_S3_BUCKET,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `images/chat/${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      // Removed ACL parameter - bucket should use bucket policy for public access
    };

    await s3Client.upload(uploadParams).promise();

    // Generate public URL
    const publicUrl = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });

  } catch (error) {
    console.error('S3 Upload Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
