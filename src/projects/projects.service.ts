import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { PaginationDto } from '@/common/dtos';
import { generateUniqueSlug, handleDBErrors } from '@/common/utils';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    try {
      if (!createProjectDto.slug) {
        createProjectDto.slug = await generateUniqueSlug(
          this.projectRepository,
          createProjectDto.title,
        );
      }

      const project = this.projectRepository.create(createProjectDto);
      await this.projectRepository.save(project);

      return project;
    } catch (error) {
      handleDBErrors(error, 'ProjectsService');
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

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
