// dtos/scan-port-range.dto.ts
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ScanPortRangeDto {
  /** Target host IP or domain */
  @IsString()
  host: string;

  /** Start of port range (default: 1) */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Type(() => Number)
  startPort?: number;

  /** End of port range (default: 1024) */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  @Type(() => Number)
  endPort?: number;

  /** Timeout per port in ms (default: 3000) */
  @IsOptional()
  @IsInt()
  @Min(100)
  @Type(() => Number)
  timeout?: number;

  /** Number of ports to scan in parallel (default: 50) */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  @Type(() => Number)
  concurrency?: number;
}
