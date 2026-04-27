import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

// ============================================================================
// 1. CIRCULAR DEPENDENCY RESOLUTION
// We declare an empty array generically typed to avoid the TS error.
// ============================================================================
const contentSubTypes: { name: string; value: any }[] = [];

const NodeDiscriminator = {
  property: 'type',
  subTypes: contentSubTypes,
};

// ============================================================================
// 2. BASE DOT AND LEAF NODES (No children)
// ============================================================================
export abstract class ContentNodeDto {
  @IsString()
  type: string;
}

export class TextNodeDto extends ContentNodeDto {
  @IsString() text: string;

  @IsOptional() @IsBoolean() bold?: boolean;
  @IsOptional() @IsBoolean() italic?: boolean;
  @IsOptional() @IsBoolean() underline?: boolean;
  @IsOptional() @IsBoolean() strikethrough?: boolean;
  @IsOptional() @IsBoolean() code?: boolean;
}

export class ImageNodeDto extends ContentNodeDto {
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  url: string;

  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsString() caption?: string;
  @IsOptional() @IsIn(['left', 'center', 'right']) align?:
    | 'left'
    | 'center'
    | 'right';
}

// ============================================================================
// 3. BLOCK NODES (With children, they use the NodeDiscriminator)
// ============================================================================
export class ParagraphNodeDto extends ContentNodeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class HeadingNodeDto extends ContentNodeDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5, 6])
  level: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class LinkNodeDto extends ContentNodeDto {
  @IsString() href: string;
  @IsOptional() @IsBoolean() openInNewTab?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class CodeBlockNodeDto extends ContentNodeDto {
  @IsString() @IsOptional() language?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class QuoteNodeDto extends ContentNodeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class ListNodeDto extends ContentNodeDto {
  @IsString()
  @IsIn(['ordered', 'bullet'])
  format: 'ordered' | 'bullet';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

export class ListItemNodeDto extends ContentNodeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  children: ContentNodeDto[];
}

// ============================================================================
// 4. POPULATE THE DISCRIMINATOR
// By doing this below, TS and Node already know all the classes defined above.
// ============================================================================
contentSubTypes.push(
  { value: TextNodeDto, name: 'text' },
  { value: ImageNodeDto, name: 'image' },
  { value: ParagraphNodeDto, name: 'paragraph' },
  { value: HeadingNodeDto, name: 'heading' },
  { value: CodeBlockNodeDto, name: 'code-block' },
  { value: LinkNodeDto, name: 'link' },
  { value: QuoteNodeDto, name: 'quote' },
  { value: ListNodeDto, name: 'list' },
  { value: ListItemNodeDto, name: 'list-item' },
);

// ============================================================================
// 5. MAIN DTO
// ============================================================================
export class TranslatedContentDto {
  @IsArray()
  @IsNotEmpty({ message: 'Spanish translation is required' })
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  es: ContentNodeDto[];

  @IsArray()
  @IsNotEmpty({ message: 'English translation is required' })
  @ValidateNested({ each: true })
  @Type(() => ContentNodeDto, {
    keepDiscriminatorProperty: true,
    discriminator: NodeDiscriminator,
  })
  en: ContentNodeDto[];
}
