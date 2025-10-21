import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { Express } from 'express';
import { env } from '../config/env.js';

const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');

export const ensureUploadsDir = async () => {
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create uploads directory', error);
  }
};

const isS3Configured = () => Boolean(env.aws.bucket && env.aws.accessKeyId && env.aws.secretAccessKey);

const s3Client = isS3Configured()
  ? new S3Client({
      region: env.aws.region,
      credentials: {
        accessKeyId: env.aws.accessKeyId!,
        secretAccessKey: env.aws.secretAccessKey!,
      },
    })
  : undefined;

export const uploadMedia = async (file: Express.Multer.File | undefined) => {
  if (!file) return { url: null as string | null, type: null as string | null };

  const id = randomUUID();
  const extension = path.extname(file.originalname);
  const key = `uploads/${id}${extension}`;

  if (env.uploadDriver === 's3' && isS3Configured() && s3Client) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.aws.bucket!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const url = `https://${env.aws.bucket}.s3.${env.aws.region}.amazonaws.com/${key}`;
    return { url, type: file.mimetype.startsWith('video') ? 'video' : 'image' } as const;
  }

  await ensureUploadsDir();
  const filePath = path.join(uploadsDir, `${id}${extension}`);
  await fs.writeFile(filePath, file.buffer);
  const url = `/uploads/${id}${extension}`;
  return { url, type: file.mimetype.startsWith('video') ? 'video' : 'image' } as const;
};
