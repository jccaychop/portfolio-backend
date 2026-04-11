import { IsNotEmpty, IsString } from 'class-validator';

export class TranslatedFieldDto {
  @IsString()
  @IsNotEmpty({ message: 'Spanish translation is required' })
  es: string;

  @IsString()
  @IsNotEmpty({ message: 'English translation is required' })
  en: string;
}
