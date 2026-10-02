export type StoredImage = {
  url: string;
  key: string;
};

export type UploadInput = {
  buffer: Buffer;
  filename: string;
  contentType: string;
};

export interface StorageProvider {
  upload(file: UploadInput, folder: string): Promise<StoredImage>;
  delete(key: string): Promise<void>;
}
