// dtos/check-dns.dto.ts
import { IsString, IsOptional, IsIP } from 'class-validator';

export class CheckDnsDto {
  /** Hostname to resolve */
  @IsString()
  host: string;

  /** Custom DNS server IP (e.g. 8.8.8.8) */
  @IsOptional()
  @IsIP()
  dnsServer?: string;
}
