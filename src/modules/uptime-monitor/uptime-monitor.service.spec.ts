import { Test, TestingModule } from '@nestjs/testing';
import { UptimeMonitorService } from './uptime-monitor.service';

describe('UptimeMonitorService', () => {
  let service: UptimeMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UptimeMonitorService],
    }).compile();

    service = module.get<UptimeMonitorService>(UptimeMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
