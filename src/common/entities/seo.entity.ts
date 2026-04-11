import { Column } from 'typeorm';
import { CoreEntity } from './core.entity';
import type { TranslatedField } from '../interfaces';

export abstract class SeoEntity extends CoreEntity {
  @Column('jsonb')
  metaTitle: TranslatedField;

  @Column('jsonb')
  metaDescription: TranslatedField;
}
