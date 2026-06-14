// dtos/check-udp.dto.ts
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckUdpDto {
  /** Target host IP or domain */
  @IsString()
  host: string;

  /** UDP port to check */
  @IsInt()
  @Min(1)
  @Max(65535)
  @Type(() => Number)
  port: number;

  /** Timeout in ms */
  @IsOptional()
  @IsInt()
  @Min(100)
  @Type(() => Number)
  timeout?: number;
}
