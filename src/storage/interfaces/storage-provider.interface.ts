export interface IStorageProvider {
  upload(
    file: Express.Multer.File,
    path?: string,
  ): Promise<{ url: string; publicId: string }>;

  delete(publicId: string): Promise<boolean>;
}
