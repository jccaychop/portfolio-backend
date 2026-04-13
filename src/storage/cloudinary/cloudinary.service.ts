import { Inject, Injectable } from '@nestjs/common';
import { IStorageProvider } from '../interfaces';

@Injectable()
export class CloudinaryService implements IStorageProvider {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary,
  ) {}

  async upload(file: any): Promise<{ url: string; publicId: string }> {
    throw new Error('Method not implemented.');
  }

  async delete(publicId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
