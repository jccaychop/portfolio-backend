import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import {
  SeoDto,
  TranslatedContentDto,
  TranslatedFieldDto,
} from '@/common/dtos';

export class CreateArticleDto extends SeoDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  title: TranslatedFieldDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  slug?: TranslatedFieldDto;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  excerpt: TranslatedFieldDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedContentDto)
  content: TranslatedContentDto;

  @IsString()
  @IsUrl({}, { message: 'Image URL must be a valid URL address' })
  @IsOptional()
  coverImageUrl?: string;

  @IsBoolean({ message: 'isPublished must be a boolean value' })
  @IsOptional()
  isPublished?: boolean;
}
