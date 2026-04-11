import { Column, Entity } from 'typeorm';
import { SeoEntity } from '@/common/entities';
import type { TranslatedField } from '@/common/interfaces';

@Entity('projects')
export class Project extends SeoEntity {
  @Column('jsonb')
  title: TranslatedField;

  @Column('jsonb')
  slug: TranslatedField;

  @Column('jsonb')
  description: TranslatedField;

  @Column('jsonb')
  content: TranslatedField;

  @Column('text', { name: 'github_url', nullable: true })
  githubUrl: string;

  @Column('text', { name: 'live_url', nullable: true })
  liveUrl: string;

  @Column('text', { name: 'image_url', nullable: true })
  imageUrl: string;

  @Column('text', { name: 'model_3d_url', nullable: true })
  model3dUrl: string;

  @Column('boolean', { name: 'is_published', default: false })
  isPublished: boolean;
}
