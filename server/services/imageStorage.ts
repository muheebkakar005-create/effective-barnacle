import fs from 'fs';
import path from 'path';

// Image storage abstraction service
// Easily extensible to AWS S3, Cloudinary, or Cloudflare R2 via IMAGE_STORAGE_PROVIDER env var

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

export interface ImageStorageProvider {
  uploadImage(data: string, fileName?: string): Promise<string>;
  deleteImage(imageUrl: string): Promise<boolean>;
  getImageUrl(imageIdentifier: string): string;
}

export class LocalImageStorage implements ImageStorageProvider {
  constructor() {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  async uploadImage(data: string, fileName?: string): Promise<string> {
    // If it's already a hosted URL (e.g. Unsplash or external CDN), return as-is
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return data;
    }

    // If it's base64 data URI
    const match = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (match) {
      const ext = match[1].split('/')[1] || 'jpg';
      const cleanName = fileName ? `${Date.now()}-${fileName.replace(/[^\w\.-]/g, '')}` : `img-${Date.now()}.${ext}`;
      const buffer = Buffer.from(match[2], 'base64');
      const targetPath = path.resolve(UPLOADS_DIR, cleanName);
      fs.writeFileSync(targetPath, buffer);
      return `/uploads/${cleanName}`;
    }

    return data;
  }

  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      if (imageUrl.startsWith('/uploads/')) {
        const filePath = path.resolve(process.cwd(), 'public', imageUrl.replace(/^\//, ''));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return true;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  getImageUrl(imageIdentifier: string): string {
    return imageIdentifier;
  }
}

export const imageStorage = new LocalImageStorage();
