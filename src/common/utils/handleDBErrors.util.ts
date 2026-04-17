import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export interface DatabaseError {
  code?: string;
  detail?: string;
}

export const handleDBErrors = (error: unknown, context?: string) => {
  const logger = new Logger(context || 'DatabaseError');

  if (error && typeof error === 'object') {
    const { code, detail } = error as DatabaseError;

    if (code === '23505') {
      return new BadRequestException(detail);
    }
  }

  logger.error(error);
  return new InternalServerErrorException('Please check server logs');
};
