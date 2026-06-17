import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/crud/base.repository';
import { UptimeMonitor } from '../entities/uptime-monitor.entity';

@Injectable()
export class UptimeMonitorRepository extends BaseRepository<UptimeMonitor> {
  constructor(
    @InjectRepository(UptimeMonitor)
    repo: Repository<UptimeMonitor>,
  ) {
    super(repo);
  }

  findAllActive(): Promise<UptimeMonitor[]> {
    return this.findBy({ isActive: true });
  }
}
