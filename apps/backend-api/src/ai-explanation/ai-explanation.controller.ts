import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AIExplanationService } from './ai-explanation.service';
import { ExplanationRequestDto } from './dto/explanation-request.dto';
import { RecommendationExplanationResponse } from './dto/explanation-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@ApiTags('AI Explanation Worker')
@ApiBearerAuth('bearer-auth')
@Controller('explanations')
export class AIExplanationController {
  constructor(private explanationService: AIExplanationService) {}

  @Post()
  @Roles('OWNER', 'ADMIN', 'MANAGER', 'STAFF', 'VIEWER')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate natural language explanations for deterministic recommendation results' })
  @ApiResponse({ status: 200, description: 'Natural language explanation returned' })
  async generateExplanation(
    @CurrentTenant() tenantId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Body() dto: ExplanationRequestDto,
  ): Promise<RecommendationExplanationResponse> {
    return this.explanationService.generateExplanation(
      tenantId || currentUser.tenantId,
      dto,
    );
  }
}
