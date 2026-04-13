export interface IStorageProvider {
  upload(file: any): Promise<{ url: string; publicId: string }>;
  delete(publicId: string): Promise<boolean>;
}
