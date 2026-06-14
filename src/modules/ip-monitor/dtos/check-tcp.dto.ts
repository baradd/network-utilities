// dtos/check-tcp.dto.ts
import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckTcpDto {
  /** Target host IP or domain */
  @IsString()
  host: string;

  /** TCP port to check */
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
