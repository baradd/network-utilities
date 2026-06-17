import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UptimeMonitorService } from './uptime-monitor.service';
import { CreateUptimeMonitorDto } from './dto/create-uptime-monitor.dto';
import { UpdateUptimeMonitorDto } from './dto/update-uptime-monitor.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Uptime-monitor')
@Controller('uptime-monitor')
export class UptimeMonitorController {
  constructor(private readonly uptimeService: UptimeMonitorService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new monitor' })
  create(@Body() dto: CreateUptimeMonitorDto) {
    return this.uptimeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all monitors' })
  findAll() {
    return this.uptimeService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get monitor by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.uptimeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a monitor' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUptimeMonitorDto,
  ) {
    return this.uptimeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a monitor' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.uptimeService.softDelete(id);
  }

  @Get(':id/check')
  @ApiOperation({ summary: 'Manually trigger a check now' })
  async check(@Param('id', ParseIntPipe) id: number) {
    const monitor = await this.uptimeService.findOne(id);
    return this.uptimeService.checkUrl(monitor.url);
  }
}
