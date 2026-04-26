import { Column, Entity, ManyToMany } from 'typeorm';
import { CoreEntity } from '@/common/entities';
import { Article } from '@/articles/entities/article.entity';
import type { TranslatedField } from '@/common/interfaces';
import { Project } from '@/projects/entities/project.entity';

@Entity('tags')
export class Tag extends CoreEntity {
  @Column('jsonb')
  name: TranslatedField;

  @Column('jsonb')
  slug: TranslatedField;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

  @ManyToMany(() => Project, (project) => project.tags)
  projects: Project[];
}
