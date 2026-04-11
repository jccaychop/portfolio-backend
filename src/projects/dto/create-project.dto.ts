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
import { SeoDto, TranslatedFieldDto } from '@/common/dtos';

export class CreateProjectDto extends SeoDto {
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
  description: TranslatedFieldDto;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => TranslatedFieldDto)
  content: TranslatedFieldDto;

  @IsString()
  @IsUrl({}, { message: 'GitHub URL must be a valid URL address' })
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsUrl({}, { message: 'Live URL must be a valid URL address' })
  @IsOptional()
  liveUrl?: string;

  @IsString()
  @IsUrl({}, { message: 'Image URL must be a valid URL address' })
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsUrl({}, { message: 'Model 3D URL must be a valid URL address' })
  @IsOptional()
  model3dUrl?: string;

  @IsBoolean({ message: 'isPublished must be a boolean value' })
  @IsOptional()
  isPublished?: boolean;
}
