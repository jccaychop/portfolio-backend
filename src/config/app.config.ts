export const EnvConfiguration = () => ({
  stage: process.env.STAGE,
  environment: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  storageProvider: process.env.STORAGE_PROVIDER,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  seed: {
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  jwtSecret: process.env.JWT_SECRET,
});
