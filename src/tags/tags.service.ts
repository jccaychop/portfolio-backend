import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  handleDBErrors,
  processEntitySlug,
  sanitizeSlug,
} from '@/common/utils';
import { PaginationDto } from '@/common/dtos';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    createTagDto.slug = await processEntitySlug({
      repository: this.tagRepository,
      providedSlug: createTagDto.slug,
      fallbackText: createTagDto.name,
    });

    const tag = this.tagRepository.create(createTagDto);

    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw handleDBErrors(error, 'TagsService');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const tags = await this.tagRepository.find({
      take: limit,
      skip: offset,
    });

    return tags;
  }

  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) throw new NotFoundException(`Tag with id ${id}, not found`);
    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    updateTagDto.slug = await processEntitySlug({
      repository: this.tagRepository,
      providedSlug: updateTagDto.slug,
      entityId: id,
    });

    const tag = await this.tagRepository.preload({
      id,
      ...updateTagDto,
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id}, not found`);
    }

    try {
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw handleDBErrors(error, 'TagsService');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const result = await this.tagRepository.softDelete(id);

      if (result.affected === 1) {
        return {
          message: `Tag with id ${id} has been successfully removed`,
        };
      }
    } catch (error) {
      throw handleDBErrors(error, 'TagsService');
    }
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    if (!tagNames || tagNames.length === 0) {
      return [];
    }

    const cleanNames = tagNames.map((name) => name.trim());
    const lowerCaseNames = cleanNames.map((name) => name.toLowerCase());

    const existingTags = await this.tagRepository
      .createQueryBuilder('tag')
      .where("LOWER(tag.name->>'es') IN (:...names)", { names: lowerCaseNames })
      .orWhere("LOWER(tag.name->>'en') IN (:...names)", {
        names: lowerCaseNames,
      })
      .getMany();

    const existingTagNamesLower = new Set(
      existingTags.flatMap((tag) => [
        tag.name.es.toLowerCase(),
        tag.name.en.toLowerCase(),
      ]),
    );

    const newTagNames = cleanNames.filter(
      (name) => !existingTagNamesLower.has(name.toLowerCase()),
    );

    if (newTagNames.length === 0) {
      return existingTags;
    }

    const newTagsData = newTagNames.map((name) => {
      const bilingueName = {
        es: name,
        en: name,
      };

      const slugifiedObj = sanitizeSlug(bilingueName);

      return {
        name: bilingueName,
        slug: slugifiedObj,
      };
    });

    const tagsToCreate = this.tagRepository.create(
      newTagsData as DeepPartial<Tag>[],
    );
    const savedNewTags = await this.tagRepository.save(tagsToCreate);

    return [...existingTags, ...savedNewTags];
  }
}
