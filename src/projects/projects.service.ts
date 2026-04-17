import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { PaginationDto } from '@/common/dtos';
import {
  generateUniqueSlug,
  handleDBErrors,
  hasSlugCollision,
  sanitizeSlug,
} from '@/common/utils';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    if (!createProjectDto.slug) {
      createProjectDto.slug = await generateUniqueSlug(
        this.projectRepository,
        createProjectDto.title,
      );
    } else {
      createProjectDto.slug = sanitizeSlug(createProjectDto.slug);
      const isCollision = await hasSlugCollision(
        this.projectRepository,
        createProjectDto.slug,
      );

      if (isCollision) {
        throw new BadRequestException(
          'One of the provided slugs is already in use by another project',
        );
      }
    }

    const project = this.projectRepository.create(createProjectDto);

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
    });

    return projects;
  }

  async findOne(id: string) {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project)
      throw new NotFoundException(`Project with id ${id}, not found`);
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    if (updateProjectDto.slug) {
      updateProjectDto.slug = sanitizeSlug(updateProjectDto.slug);

      const isCollision = await hasSlugCollision(
        this.projectRepository,
        updateProjectDto.slug,
        id,
      );

      if (isCollision) {
        throw new BadRequestException(
          'One of the provided slugs is already in use by another project',
        );
      }
    }

    const project = await this.projectRepository.preload({
      id,
      ...updateProjectDto,
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id}, not found`);
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
