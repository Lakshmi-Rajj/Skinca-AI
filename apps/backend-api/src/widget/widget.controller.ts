import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WidgetService, WidgetSessionResponse, WidgetPublicConfig } from './widget.service';
import { CreateWidgetSessionDto } from './dto/create-widget-session.dto';
import { WidgetRecommendationDto } from './dto/widget-recommendation.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Storefront Widget')
@Public()
@Controller('widget')
export class WidgetController {
  constructor(private widgetService: WidgetService) {}

  @Post('session')
  @ApiOperation({ summary: 'Initialize anonymous guest storefront widget session' })
  @ApiResponse({ status: 201, description: 'Widget session initialized successfully' })
  async createSession(@Body() dto: CreateWidgetSessionDto): Promise<WidgetSessionResponse> {
    return this.widgetService.createSession(dto);
  }

  @Get('config')
  @ApiOperation({ summary: 'Get sanitized public tenant configuration and branding' })
  @ApiResponse({ status: 200, description: 'Public tenant configuration returned' })
  async getConfig(@Query('tenantId', ParseUUIDPipe) tenantId: string): Promise<WidgetPublicConfig> {
    return this.widgetService.getPublicConfig(tenantId);
  }

  @Get('theme')
  @ApiOperation({ summary: 'Get runtime CSS theme variables for tenant' })
  @ApiResponse({ status: 200, description: 'Runtime CSS theme variables string returned' })
  async getTheme(@Query('tenantId', ParseUUIDPipe) tenantId: string): Promise<string> {
    return this.widgetService.getThemeCss(tenantId);
  }

  @Get('localization')
  @ApiOperation({ summary: 'Get widget UI localization translation dictionary' })
  @ApiResponse({ status: 200, description: 'Localization dictionary returned' })
  async getLocalization(@Query('lang') lang?: string): Promise<Record<string, string>> {
    return this.widgetService.getLocalization(lang || 'en');
  }

  @Post('recommend')
  @ApiOperation({ summary: 'Submit storefront widget questionnaire & generate routine recommendation' })
  @ApiResponse({ status: 200, description: 'Routine recommendation & explanation returned' })
  async generateRecommendation(@Body() dto: WidgetRecommendationDto): Promise<any> {
    return this.widgetService.generateRecommendation(dto);
  }
}
