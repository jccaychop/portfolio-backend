import { Column, Entity } from 'typeorm';
import { CoreEntity } from '@/common/entities';
import { MediaType } from '../enums';

@Entity('media')
export class Media extends CoreEntity {
  @Column('text')
  url: string;

  @Column('text', { name: 'public_id', unique: true })
  publicId: string;

  @Column('text', { name: 'original_name' })
  originalName: string;

  @Column('text', { name: 'mime_type' })
  mimeType: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @Column('int')
  size: number;
}
