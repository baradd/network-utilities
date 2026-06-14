import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IpMonitorService } from './ip-monitor.service';
import { CheckAliveDto } from './dtos/check-alive.dto';
import { CheckTcpDto } from './dtos/check-tcp.dto';
import { CheckUdpDto } from './dtos/check-udp.dto';
import { CheckDnsDto } from './dtos/check-dns.dto';
import { ScanPortRangeDto } from './dtos/scan-port-range.dto';
import { TracerouteDto } from './dtos/traceroute.dto';

@ApiTags('IP Monitor')
@Controller('ip-monitor')
export class IpMonitorController {
  constructor(private readonly ipMonitorService: IpMonitorService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Check if a host is alive via ICMP' })
  checkAlive(@Query('host') host: string) {
    return this.ipMonitorService.checkAlive(host);
  }

  @Post('ping/bulk')
  @ApiOperation({ summary: 'Check multiple hosts via ICMP' })
  checkAliveBulk(@Body() dto: CheckAliveDto) {
    return this.ipMonitorService.checkAliveBulk(dto.hosts);
  }

  @Get('tcp')
  @ApiOperation({ summary: 'Check if a TCP port is open' })
  checkTCP(@Query() dto: CheckTcpDto) {
    return this.ipMonitorService.checkTCP(dto.host, dto.port, dto.timeout);
  }

  @Get('udp')
  @ApiOperation({ summary: 'Check if a UDP port is reachable' })
  checkUDP(@Query() dto: CheckUdpDto) {
    return this.ipMonitorService.checkUDP(dto.host, dto.port, dto.timeout);
  }

  @Get('dns')
  @ApiOperation({ summary: 'Resolve a hostname via DNS' })
  checkDNS(@Query() dto: CheckDnsDto) {
    return this.ipMonitorService.checkDNS(dto.host, dto.dnsServer);
  }

  @Post('port-scan')
  @ApiOperation({ summary: 'Scan a range of TCP ports on a host' })
  scanPortRange(@Body() dto: ScanPortRangeDto) {
    return this.ipMonitorService.scanPortRange(
      dto.host,
      dto.startPort,
      dto.endPort,
      {
        timeout: dto.timeout,
        concurrency: dto.concurrency,
      },
    );
  }

  @Get('traceroute')
  @ApiOperation({ summary: 'Traceroute to a host' })
  traceroute(@Query() dto: TracerouteDto) {
    return this.ipMonitorService.tranceroute(dto.host, dto.timeout);
  }
}
