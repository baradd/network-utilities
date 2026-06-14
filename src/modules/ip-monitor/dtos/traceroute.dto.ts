// dtos/traceroute.dto.ts
import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TracerouteDto {
  /** Target host IP or domain */
  @IsString()
  host: string;

  /** Overall timeout in ms (default: 60000) */
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Type(() => Number)
  timeout?: number;
}
