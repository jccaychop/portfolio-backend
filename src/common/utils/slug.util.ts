import { BadRequestException } from '@nestjs/common';
import { Repository, ObjectLiteral } from 'typeorm';
import { TranslatedField } from '../interfaces';
import { generateUniqueSlug, hasSlugCollision, sanitizeSlug } from './';

interface ProcessSlugOptions<T extends ObjectLiteral> {
  repository: Repository<T>;
  providedSlug?: TranslatedField;
  fallbackText?: TranslatedField;
  entityId?: string;
}

/**
 * Processes the slug generation or validation for bilingual entities during creation or update operations.
 * Handles auto-generation from fallback text, sanitization of manual inputs, and collision checking.
 *
 * @param options - The configuration object for processing the slug.
 * @param options.repository - The TypeORM repository of the entity (e.g., Articles, Projects, Tags).
 * @param options.providedSlug - (Optional) The manually provided bilingual slug object from the DTO.
 * @param options.fallbackText - (Optional) The bilingual source text (e.g., title or name) used to generate the slug if none is provided.
 * @param options.entityId - (Optional) The UUID of the entity, used to bypass collision checks against itself during updates.
 * @returns A Promise resolving to a sanitized/unique bilingual slug object, or undefined if no update is required.
 * @throws {BadRequestException} If fallback text is missing during creation, or if a manual slug collision is detected.
 */
export async function processEntitySlug<T extends ObjectLiteral>(
  options: ProcessSlugOptions<T>,
): Promise<TranslatedField | undefined> {
  const { repository, providedSlug, fallbackText, entityId } = options;

  // SCENARIO 1: Creation without a provided slug -> Generate one based on title/name
  if (!providedSlug && !entityId) {
    if (!fallbackText) {
      throw new BadRequestException(
        'A base text (title or name) is required to automatically generate the slug',
      );
    }
    return await generateUniqueSlug(repository, fallbackText);
  }

  // SCENARIO 2: Update without a provided slug -> Do nothing, keep the existing slug
  if (!providedSlug && entityId) {
    return undefined;
  }

  // SCENARIO 3: Creation or Update WITH a manual slug -> Sanitize and check for collisions
  const cleanSlug = sanitizeSlug(providedSlug!); // Non-null assertion since we know it exists here
  const isCollision = await hasSlugCollision(repository, cleanSlug, entityId);

  if (isCollision) {
    const entityName = repository.metadata.targetName.toLowerCase() || 'record';

    throw new BadRequestException(
      `One of the provided slugs is already in use by another ${entityName}`,
    );
  }

  return cleanSlug;
}
