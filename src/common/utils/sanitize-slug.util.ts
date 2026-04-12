import slugify from 'slugify';
import { TranslatedField } from '../interfaces';

export const sanitizeSlug = (slug: TranslatedField): TranslatedField => {
  return {
    es: slugify(slug.es, { lower: true, strict: true }),
    en: slugify(slug.en, { lower: true, strict: true }),
  };
};
