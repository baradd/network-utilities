// modules/uptime/dtos/create-monitor.dto.ts
import { IsString, IsInt, IsOptional, IsUrl, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUptimeMonitorDto {
  @IsString()
  name!: string;

  @IsUrl()
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  @Type(() => Number)
  intervalMinutes?: number;
}
