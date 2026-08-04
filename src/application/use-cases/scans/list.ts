import { Injectable } from '@nestjs/common';
import { PaginatedScans, ScansRepository } from 'src/application/repositories/scans';

@Injectable()
export class ListScansUseCase {
  constructor(private scansRepository: ScansRepository) {}

  execute(macAddress: string, page: number, limit: number): Promise<PaginatedScans> {
    return this.scansRepository.findByMacAddress(macAddress, page, limit);
  }
}
