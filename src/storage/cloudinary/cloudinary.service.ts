import { Inject, Injectable } from '@nestjs/common';
import 'multer';
import { Readable } from 'stream';
import {
  v2 as CloudinaryLib,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { IStorageProvider } from '../interfaces';

@Injectable()
export class CloudinaryService implements IStorageProvider {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof CloudinaryLib,
  ) {}

  async upload(
    file: Express.Multer.File,
    path?: string,
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: path || 'portfolio',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(new Error(error.message));
          }
          if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
