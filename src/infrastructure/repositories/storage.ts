import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { StorageRepository } from 'src/application/repositories/storage';

// Cloudflare R2, S3-compatible — same account/bucket kanjiup already uses for kanji/radical
// images (src/config/aws.ts there), just a different key prefix for this service's own content
@Injectable()
export class R2StorageRepository implements StorageRepository {
  private bucket = process.env.AWS_BUCKET_NAME ?? '';
  private storageUrl = process.env.STORAGE_BASE_URL ?? '';
  private client = new S3Client({
    endpoint: `https://${process.env.CF_ACC_ID}.r2.cloudflarestorage.com`,
    region: 'weur',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_ID ?? '',
      secretAccessKey: process.env.AWS_ACCESS_SECRET ?? '',
    },
  });

  async upload(key: string, content: Buffer, contentType?: string): Promise<string> {
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: content, ContentType: contentType }));

    return `${this.storageUrl}/${key}`;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }
}
