import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { logger } from '@platform/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const requestId = req.headers['x-request-id'] as string;
    const method = req.method;
    const url = req.originalUrl || req.url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res.statusCode;
          logger.info({
            requestId,
            method,
            url,
            statusCode,
            durationMs: duration,
          }, `HTTP ${method} ${url} ${statusCode} - ${duration}ms`);
        },
        error: (error: any) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || res.statusCode || 500;
          logger.error({
            requestId,
            method,
            url,
            statusCode,
            durationMs: duration,
            errorName: error?.name,
            errorMessage: error?.message,
          }, `HTTP ${method} ${url} ${statusCode} - ${duration}ms [FAILED]`);
        },
      }),
    );
  }
}
