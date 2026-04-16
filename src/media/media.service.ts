import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './entities/media.entity';
import type { IStorageProvider } from '@/storage/interfaces';
import { MediaType } from './enums';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    @Inject('STORAGE_SERVICE')
    private readonly storageProvider: IStorageProvider,
  ) {}

  async upload(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadPromises = files.map(async (file) => {
      let type: MediaType;
      let folderPath = 'portfolio/misc';

      if (file.mimetype.startsWith('image/')) {
        type = MediaType.IMAGE;
        folderPath = 'portfolio/images';
      } else if (file.mimetype === 'application/pdf') {
        type = MediaType.DOCUMENT;
        folderPath = 'portfolio/documents';
      } else if (
        file.mimetype.includes('gltf') ||
        file.mimetype.includes('glb')
      ) {
        type = MediaType.MODEL_3D;
        folderPath = 'portfolio/models';
      } else {
        type = MediaType.DOCUMENT;
      }

      const { url, publicId } = await this.storageProvider.upload(
        file,
        folderPath,
      );

      const mediaEntity = this.mediaRepository.create({
        url,
        publicId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        type,
      });

      return await this.mediaRepository.save(mediaEntity);
    });

    return await Promise.all(uploadPromises);
  }

  async findOne(id: string) {
    const media = await this.mediaRepository.findOneBy({ id });

    if (!media) throw new NotFoundException(`Media with id ${id}, not found`);

    return media;
  }

  async findAll(type?: MediaType) {
    const media = await this.mediaRepository.find({
      where: type ? { type } : {},
      order: { createdAt: 'DESC' },
    });
    return media;
  }

  async remove(id: string) {
    const mediaEntity = await this.findOne(id);

    // TODO: Validate in the 'media_usage' table if this image is embedded
    // in any bilingual content before allowing deletion.

    return await this.mediaRepository.softRemove(mediaEntity);
  }
}
