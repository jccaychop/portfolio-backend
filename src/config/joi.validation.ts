import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod', 'test').required(),
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  DB_HOST: Joi.string().default('hostname'),
  BD_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
