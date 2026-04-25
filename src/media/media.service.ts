import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '@/articles/entities/article.entity';
import { Project } from '@/projects/entities/project.entity';
import type { IStorageProvider } from '@/storage/interfaces';
import { Media } from './entities/media.entity';
import { MediaType } from './enums';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,

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

    await this.checkMediaUsage(mediaEntity.url);

    return await this.mediaRepository.softRemove(mediaEntity);
  }

  private async checkMediaUsage(url: string) {
    const projectExists = await this.projectRepository.exists({
      where: [{ imageUrl: url }, { model3dUrl: url }],
      withDeleted: true,
    });

    if (projectExists)
      throw new BadRequestException(
        'Cannot delete file: It is currently in use by a Project',
      );

    const articleExists = await this.articleRepository.exists({
      where: { coverImageUrl: url },
      withDeleted: true,
    });

    if (articleExists)
      throw new BadRequestException(
        'Cannot delete file: It is currently used as an Article cover',
      );

    const articleContentExists = await this.articleRepository
      .createQueryBuilder('article')
      .where('CAST(article.content AS TEXT) LIKE :url', { url: `%${url}%` })
      .withDeleted()
      .getExists();

    if (articleContentExists)
      throw new BadRequestException(
        'Cannot delete file: It is embedded inside an Article content',
      );
  }
}
