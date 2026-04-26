import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
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

  @IsOptional()
  @Matches(/^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/, {
    message:
      'githubUrl must be a valid GitHub repository URL (e.g., https://github.com/user/repo)',
  })
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

  @IsString({ each: true })
  tags: string[];
}
