import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: NextRequest) {
  try {
    const { key, contentType } = await request.json();

    if (!key) {
      return NextResponse.json({ error: 'Missing object key' }, { status: 400 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || 'wocha-assets';
    const cdnDomain = process.env.NEXT_PUBLIC_R2_DOMAIN || 'https://cdn.wocha.com';

    // If live R2 credentials are valid
    if (accountId && accessKeyId && secretAccessKey && !accountId.includes('mock-')) {
      const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType || 'application/octet-stream',
      });

      // Expires in 15 minutes
      const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

      return NextResponse.json({
        uploadUrl,
        key,
        publicUrl: `${cdnDomain}/${key}`,
      });
    }

    // Dev/Staging mock simulation
    return NextResponse.json({
      uploadUrl: `/api/storage/mock-upload?key=${encodeURIComponent(key)}`,
      key,
      publicUrl: `https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80`,
      mock: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
