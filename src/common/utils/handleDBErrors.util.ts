import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export interface DatabaseError {
  code?: string;
  detail?: string;
}

export const handleDBErrors = (error: unknown, context?: string): never => {
  const logger = new Logger(context || 'DatabaseError');

  if (error && typeof error === 'object') {
    const { code, detail } = error as DatabaseError;

    if (code === '23505') {
      throw new BadRequestException(detail);
    }
  }

  logger.error(error);
  throw new InternalServerErrorException('Please check server logs');
};
