import { Test, TestingModule } from '@nestjs/testing';
import { UptimeMonitorController } from './uptime-monitor.controller';
import { UptimeMonitorService } from './uptime-monitor.service';

describe('UptimeMonitorController', () => {
  let controller: UptimeMonitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UptimeMonitorController],
      providers: [UptimeMonitorService],
    }).compile();

    controller = module.get<UptimeMonitorController>(UptimeMonitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
