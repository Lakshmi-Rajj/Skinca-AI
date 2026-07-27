import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface StandardApiResponse<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, StandardApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<StandardApiResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'items' in data && 'total' in data) {
          const { items, ...meta } = data;
          return {
            success: true,
            data: items,
            meta,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
