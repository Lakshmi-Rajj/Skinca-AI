import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigurationService } from '../config/configuration.service';
import { Public } from '../auth/decorators/public.decorator';

export interface HealthStatusResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
}

@ApiTags('Platform')
@Controller('health')
export class HealthController {
  constructor(private configService: ConfigurationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Retrieve application health status' })
  @ApiResponse({
    status: 200,
    description: 'Service is operational and healthy',
  })
  getHealth(): HealthStatusResponse {
    return {
      status: 'ok',
      service: 'backend-api',
      version: '1.0.0',
      environment: this.configService.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
