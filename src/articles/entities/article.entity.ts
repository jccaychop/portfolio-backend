import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { SeoEntity } from '@/common/entities';
import type { TranslatedContent, TranslatedField } from '@/common/interfaces';
import { Tag } from '@/tags/entities/tag.entity';

@Entity('articles')
export class Article extends SeoEntity {
  @Column('jsonb')
  title: TranslatedField;

  @Column('jsonb')
  slug: TranslatedField;

  @Column('jsonb')
  excerpt: TranslatedField;

  @Column('jsonb')
  content: TranslatedContent;

  @Column('text', { name: 'cover_image_url', nullable: true })
  coverImageUrl: string;

  @Column('boolean', { name: 'is_published', default: false })
  isPublished: boolean;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];
}
