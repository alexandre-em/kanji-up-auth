import { Injectable } from '@nestjs/common';
import { PaginatedScans, ScansRepository } from 'src/application/repositories/scans';

@Injectable()
export class ListScansUseCase {
  constructor(private scansRepository: ScansRepository) {}

  execute(userId: string, page: number, limit: number): Promise<PaginatedScans> {
    return this.scansRepository.findByUserId(userId, page, limit);
  }
}
