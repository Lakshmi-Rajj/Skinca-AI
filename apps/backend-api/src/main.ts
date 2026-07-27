import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { ConfigurationService } from './config/configuration.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { logger } from '@platform/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigurationService);

  // Trust Proxy Setup (Behind AWS API Gateway / ALB / Cloudflare)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Security Middleware
  app.use(helmet());

  // Compression
  app.use(compression());

  // CORS Configuration
  app.enableCors({
    origin: true, // Configured dynamically via guards/gateway in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Prefix & URI Versioning (/api/v1/*)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger / OpenAPI Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('B2B SaaS Skincare Recommendation Platform API')
    .setDescription(
      'Enterprise API specification for embedded storefront widgets, B2B admin portal, recommendation engine, and analytics.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter B2B Admin JWT or Widget Session Token',
        in: 'header',
      },
      'bearer-auth',
    )
    .addTag('Platform', 'System health, versioning, and platform operations')
    .addTag('Tenant', 'Tenant management and configuration APIs')
    .addTag('Auth', 'B2B Admin & Storefront Widget Session Authentication')
    .addTag('Catalog', 'B2B Product Catalog & INCI Formulation Mapping')
    .addTag('Recommendation', 'Deterministic Recommendation Engine Execution')
    .addTag('AI Explanation', 'Natural Language Routine Narrative Generation')
    .addTag('Analytics', 'Storefront Interaction Telemetry & B2B Dashboard Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Skincare Platform API Documentation',
  });

  const port = configService.port;
  await app.listen(port, '0.0.0.0');

  logger.info(`🚀 NestJS Backend API running on port ${port}`);
  logger.info(`📚 Swagger OpenAPI documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
