import { ScanResult } from 'src/domain/entities';

export type PaginatedScans = {
  docs: ScanResult[];
  totalDocs: number;
};

export abstract class ScansRepository {
  abstract create(scan: Omit<ScanResult, 'scanId' | 'createdAt'>): Promise<ScanResult>;
  // Most recent first — a scan history reads naturally newest-to-oldest
  abstract findByMacAddress(macAddress: string, page: number, limit: number): Promise<PaginatedScans>;
  // Account recovery: re-points every scan owned by the old device's macAddress to the new one
  abstract migrateMacAddress(fromMacAddress: string, toMacAddress: string): Promise<void>;
  abstract deleteByMacAddress(macAddress: string): Promise<void>;
}
