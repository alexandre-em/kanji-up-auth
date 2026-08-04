export abstract class StorageRepository {
  abstract upload(key: string, content: Buffer, contentType?: string): Promise<string>;
  abstract delete(key: string): Promise<void>;
}
