import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod', 'test').required(),
  NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
  PORT: Joi.number().default(3000),

  // DATABASE
  DB_HOST: Joi.string().default('hostname'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // STORAGE
  STORAGE_PROVIDER: Joi.string()
    .valid('cloudinary', 'aws')
    .default('cloudinary'),

  CLOUDINARY_CLOUD_NAME: Joi.string().when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  CLOUDINARY_API_KEY: Joi.string().when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  CLOUDINARY_API_SECRET: Joi.string().when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // SEED
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
});
