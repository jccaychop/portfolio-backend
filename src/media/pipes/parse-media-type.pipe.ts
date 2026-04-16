import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { MediaType } from '../enums';

@Injectable()
export class ParseMediaTypePipe implements PipeTransform<
  string | undefined,
  MediaType | undefined
> {
  transform(value: string | undefined): MediaType | undefined {
    if (!value) {
      return undefined;
    }

    const normalizedValue = value.toUpperCase();

    const validTypes = Object.values(MediaType);
    const isValid = validTypes.includes(normalizedValue as MediaType);

    if (!isValid) {
      throw new BadRequestException(
        `Invalid type parameter. Accepted values are: ${validTypes.join(', ')}`,
      );
    }

    return normalizedValue as MediaType;
  }
}
