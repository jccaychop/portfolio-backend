import { Repository, ObjectLiteral } from 'typeorm';
import slugify from 'slugify';
import type { TranslatedField } from '../interfaces';

/**
 * Generates a unique bilingual slug for any TypeORM entity.
 * @param repository The entity's repository (Projects, Articles, Tags, etc.)
 * @param sourceField The TranslatedField object with the source field in Spanish/English
 * @returns A TranslatedField object with the unique slugs
 */
export async function generateUniqueSlug<T extends ObjectLiteral>(
  repository: Repository<T>,
  sourceField: TranslatedField,
): Promise<TranslatedField> {
  let baseSlugEs = slugify(sourceField.es, { lower: true, strict: true });
  let baseSlugEn = slugify(sourceField.en, { lower: true, strict: true });

  const existingEntity = await repository
    .createQueryBuilder('entity')
    .where("entity.slug->>'es' = :slugEs", { slugEs: baseSlugEs })
    .orWhere("entity.slug->>'en' = :slugEn", { slugEn: baseSlugEn })
    .withDeleted() // Search with SoftDelete
    .getOne();

  if (existingEntity) {
    const suffix = Math.random().toString(36).substring(2, 7);
    baseSlugEs = `${baseSlugEs}-${suffix}`;
    baseSlugEn = `${baseSlugEn}-${suffix}`;
  }

  return { es: baseSlugEs, en: baseSlugEn };
}
