import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Module({
  providers: [
    CloudinaryProvider,
    CloudinaryService,
    {
      provide: 'STORAGE_SERVICE',
      inject: [ConfigService, CloudinaryService],
      useFactory: (
        configService: ConfigService,
        cloudinaryService: CloudinaryService,
      ) => {
        const provider = configService.get<string>('storageProvider');

        return provider === 'cloudinary'
          ? cloudinaryService
          : cloudinaryService; /* TODO: Switch to awsService when it exists */
      },
    },
  ],
  exports: ['STORAGE_SERVICE'],
})
export class StorageModule {}
