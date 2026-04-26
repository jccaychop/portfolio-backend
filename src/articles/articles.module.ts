import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from '@/tags/tags.module';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { Article } from './entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TagsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [TypeOrmModule],
})
export class ArticlesModule {}
