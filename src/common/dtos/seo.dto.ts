import { Type } from 'class-transformer';
import { IsDefined, IsObject, ValidateNested } from 'class-validator';
import { TranslatedFieldDto } from './translated-field.dto';

export abstract class SeoDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  metaTitle: TranslatedFieldDto;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  metaDescription: TranslatedFieldDto;
}
