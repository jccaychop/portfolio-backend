import { IsArray, IsNotEmpty } from 'class-validator';

export class TranslatedContentDto {
  @IsArray()
  @IsNotEmpty({ message: 'Spanish translation is required' })
  es: object[];

  @IsArray()
  @IsNotEmpty({ message: 'English translation is required' })
  en: object[];
}
