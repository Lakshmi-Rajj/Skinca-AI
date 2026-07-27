import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty()
  data: T;

  @ApiProperty({ example: '2026-07-27T18:58:54.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'req_123456789', required: false })
  requestId?: string;

  constructor(data: T, requestId?: string) {
    this.success = true;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }
}

export class ValidationErrorItem {
  @ApiProperty({ example: 'skinType' })
  field!: string;

  @ApiProperty({ example: 'skinType must be a valid enum value' })
  reason!: string;
}

export class ErrorResponseBody {
  @ApiProperty({ example: 'https://api.skincareplatform.com/errors/validation-failed' })
  type!: string;

  @ApiProperty({ example: 'Unprocessable Entity' })
  title!: string;

  @ApiProperty({ example: 422 })
  status!: number;

  @ApiProperty({ example: 'One or more validation constraints failed.' })
  detail!: string;

  @ApiProperty({ example: 'ERR_VALIDATION_FAILED' })
  code!: string;

  @ApiProperty({ type: [ValidationErrorItem], required: false })
  invalidParams?: ValidationErrorItem[];
}

export class ErrorResponse {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ type: ErrorResponseBody })
  error: ErrorResponseBody;

  @ApiProperty({ example: '2026-07-27T18:58:54.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'req_123456789', required: false })
  requestId?: string;

  constructor(error: ErrorResponseBody, requestId?: string) {
    this.success = false;
    this.error = error;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }
}

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  totalItems!: number;

  @ApiProperty({ example: 10 })
  itemCount!: number;

  @ApiProperty({ example: 10 })
  itemsPerPage!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;

  @ApiProperty({ example: 1 })
  currentPage!: number;
}

export class PaginatedResponse<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;

  @ApiProperty({ example: '2026-07-27T18:58:54.000Z' })
  timestamp: string;

  @ApiProperty({ example: 'req_123456789', required: false })
  requestId?: string;

  constructor(data: T[], meta: PaginationMeta, requestId?: string) {
    this.success = true;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }
}
