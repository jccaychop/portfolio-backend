import { Repository, ObjectLiteral } from 'typeorm';
import type { TranslatedField } from '../interfaces';

/**
 * Checks if a bilingual slug is already in use in the database.
 * Ideal for collision validations in both CREATE (POST) and UPDATE (PATCH) operations.
 * @param repository The repository of the entity (Projects, Articles, etc.)
 * @param slug The TranslatedField object with the slugs to check
 * @param currentId (Optional) The ID of the current entity. If provided, excludes it from the search (used for Updates).
 * @returns boolean True if there is a collision, False if the slug is free
 */
export async function hasSlugCollision<T extends ObjectLiteral>(
  repository: Repository<T>,
  slug: TranslatedField,
  currentId?: string,
): Promise<boolean> {
  const query = repository
    .createQueryBuilder('entity')
    .where("(entity.slug->>'es' = :slugEs OR entity.slug->>'en' = :slugEn)", {
      slugEs: slug.es,
      slugEn: slug.en,
    });

  if (currentId) {
    query.andWhere('entity.id != :id', { id: currentId });
  }

  const existingEntity = await query.withDeleted().getOne();

  return !!existingEntity;
}
