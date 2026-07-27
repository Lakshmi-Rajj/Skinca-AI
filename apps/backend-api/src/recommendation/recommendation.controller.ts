import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { RecommendationRequestDto } from './dto/recommendation-request.dto';
import { RecommendationResponseDto } from './dto/recommendation-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('Recommendation Engine')
@ApiBearerAuth('bearer-auth')
@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate deterministic skincare routine recommendations' })
  @ApiResponse({ status: 200, description: 'Deterministic recommendation result returned' })
  async generateRecommendation(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: RecommendationRequestDto,
  ): Promise<RecommendationResponseDto> {
    return this.recommendationService.generateRecommendation(
      tenantId || currentUser.tenantId,
      dto,
    );
  }
}
