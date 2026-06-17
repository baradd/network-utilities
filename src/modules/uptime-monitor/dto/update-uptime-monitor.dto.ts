// modules/uptime/dtos/update-monitor.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUptimeMonitorDto } from './create-uptime-monitor.dto';

export class UpdateUptimeMonitorDto extends PartialType(
  CreateUptimeMonitorDto,
) {}
