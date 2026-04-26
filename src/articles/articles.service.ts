import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/common/dtos';
import { handleDBErrors, processEntitySlug } from '@/common/utils';
import { TagsService } from '@/tags/tags.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    private readonly tagsService: TagsService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const { tags: tagNames = [], ...articleData } = createArticleDto;

    articleData.slug = await processEntitySlug({
      repository: this.articleRepository,
      providedSlug: articleData.slug,
      fallbackText: articleData.title,
    });

    const tags = await this.tagsService.findOrCreateTags(tagNames);

    const article = this.articleRepository.create({
      ...articleData,
      tags,
    });

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
      relations: ['tags'],
    });

    return articles;
  }

  async findOne(id: string) {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!article)
      throw new NotFoundException(`Article with id ${id}, not found`);
    return article;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { tags: tagNames, ...updateData } = updateArticleDto;

    updateData.slug = await processEntitySlug({
      repository: this.articleRepository,
      providedSlug: updateData.slug,
      entityId: id,
    });

    const article = await this.articleRepository.preload({
      id,
      ...updateData,
    });

    if (!article) {
      throw new NotFoundException(`Article with id ${id}, not found`);
    }

    if (tagNames) {
      article.tags = await this.tagsService.findOrCreateTags(tagNames);
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
