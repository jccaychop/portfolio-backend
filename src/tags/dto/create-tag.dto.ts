import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TranslatedFieldDto } from '@/common/dtos';

export class CreateTagDto {
  @IsDefined({ message: 'The tag name is required' })
  @IsObject({ message: 'The name must be a valid bilingual object' })
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  name: TranslatedFieldDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  slug?: TranslatedFieldDto;
}
