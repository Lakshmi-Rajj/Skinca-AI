import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from '@platform/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse?.message || (exception as Error)?.message || 'Internal server error';

    const errorDetails =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : {};

    const requestId = (request.headers['x-request-id'] as string) || undefined;

    const problemDetails = {
      type: `https://httpstatuses.com/${status}`,
      title: HttpStatus[status] || 'Error',
      status,
      detail: Array.isArray(message) ? message.join(', ') : message,
      instance: request.url,
      timestamp: new Date().toISOString(),
      requestId,
      ...errorDetails,
    };

    logger.error(
      {
        requestId,
        status,
        path: request.url,
        method: request.method,
        error: message,
      },
      `HTTP Exception [${status}] ${request.method} ${request.url}`,
    );

    response.status(status).json(problemDetails);
  }
}
