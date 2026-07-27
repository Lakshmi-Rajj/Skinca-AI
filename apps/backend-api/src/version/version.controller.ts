import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

export interface VersionResponse {
  applicationVersion: string;
  buildVersion: string;
  commitHash: string;
}

@ApiTags('Platform')
@Controller('version')
export class VersionController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Retrieve application version and build metadata' })
  @ApiResponse({
    status: 200,
    description: 'Application version details',
  })
  getVersion(): VersionResponse {
    return {
      applicationVersion: '1.0.0',
      buildVersion: process.env.BUILD_VERSION || '1.0.0-dev',
      commitHash: process.env.GIT_COMMIT_HASH || 'local-dev-commit',
    };
  }
}
