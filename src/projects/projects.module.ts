import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from '@/tags/tags.module';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), TagsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule],
})
export class ProjectsModule {}
