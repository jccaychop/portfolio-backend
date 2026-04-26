import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '@/common/dtos';
import { handleDBErrors, processEntitySlug } from '@/common/utils';
import { TagsService } from '@/tags/tags.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly tagsService: TagsService,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const { tags: tagNames = [], ...projectData } = createProjectDto;

    projectData.slug = await processEntitySlug({
      repository: this.projectRepository,
      providedSlug: projectData.slug,
      fallbackText: projectData.title,
    });

    const tags = await this.tagsService.findOrCreateTags(tagNames);

    const project = this.projectRepository.create({
      ...projectData,
      tags,
    });

    try {
      await this.projectRepository.save(project);
      return project;
    } catch (error) {
      throw handleDBErrors(error, 'ProjectsService');
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const projects = await this.projectRepository.find({
      take: limit,
      skip: offset,
      relations: ['tags'],
    });

    return projects;
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!project)
      throw new NotFoundException(`Project with id ${id}, not found`);
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { tags: tagNames, ...updateData } = updateProjectDto;

    updateData.slug = await processEntitySlug({
      repository: this.projectRepository,
      providedSlug: updateData.slug,
      entityId: id,
    });

    const project = await this.projectRepository.preload({
      id,
      ...updateData,
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id}, not found`);
    }

    if (tagNames) {
      project.tags = await this.tagsService.findOrCreateTags(tagNames);
    }

    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      throw handleDBErrors(error, 'ProjectsService');
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    try {
      const result = await this.projectRepository.softDelete(id);
      if (result.affected === 1)
        return {
          message: `Project with id ${id} has been successfully removed`,
        };
    } catch (error) {
      throw handleDBErrors(error, 'ProjectsService');
    }
  }
}
