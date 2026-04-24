import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { PaginationDto } from '@/common/dtos';
import {
  generateUniqueSlug,
  handleDBErrors,
  hasSlugCollision,
  sanitizeSlug,
} from '@/common/utils';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    if (!createArticleDto.slug) {
      createArticleDto.slug = await generateUniqueSlug(
        this.articleRepository,
        createArticleDto.title,
      );
    } else {
      createArticleDto.slug = sanitizeSlug(createArticleDto.slug);
      const isCollision = await hasSlugCollision(
        this.articleRepository,
        createArticleDto.slug,
      );

      if (isCollision) {
        throw new BadRequestException(
          'One of the provided slugs is already in use by another article',
        );
      }
    }

    const article = this.articleRepository.create(createArticleDto);

    try {
      await this.articleRepository.save(article);
      return article;
    } catch (error) {
      throw handleDBErrors(error, 'ArticlesService');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const articles = await this.articleRepository.find({
      take: limit,
      skip: offset,
    });

    return articles;
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({ where: { id } });

    if (!article)
      throw new NotFoundException(`Article with id ${id}, not found`);
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    if (updateArticleDto.slug) {
      updateArticleDto.slug = sanitizeSlug(updateArticleDto.slug);

      const isCollision = await hasSlugCollision(
        this.articleRepository,
        updateArticleDto.slug,
        id,
      );

      if (isCollision) {
        throw new BadRequestException(
          'One of the provided slugs is already in use by another article',
        );
      }
    }

    const article = await this.articleRepository.preload({
      id,
      ...updateArticleDto,
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id}, not found`);
    }

    try {
      return await this.articleRepository.save(article);
    } catch (error) {
      throw handleDBErrors(error, 'ArticlesService');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const result = await this.articleRepository.softDelete(id);
      if (result.affected === 1)
        return {
          message: `Article with id ${id} has been successfully removed`,
        };
    } catch (error) {
      throw handleDBErrors(error, 'ArticlesService');
    }
  }
}
