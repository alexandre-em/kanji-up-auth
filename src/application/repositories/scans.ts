import { ScanResult } from 'src/domain/entities';

export abstract class ScansRepository {
  abstract create(scan: Omit<ScanResult, 'scanId' | 'createdAt'>): Promise<ScanResult>;
}
