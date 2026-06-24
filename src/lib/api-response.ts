import { NextResponse } from 'next/server';

export type ApiResponse<T> = {
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function success<T>(data: T, meta?: ApiResponse<T>['meta'], status = 200) {
  return NextResponse.json<ApiResponse<T>>({ data, meta }, { status });
}

export function created<T>(data: T, meta?: ApiResponse<T>['meta']) {
  return success(data, meta, 201);
}

export function error(code: string, message: string, details?: unknown, status = 400) {
  return NextResponse.json<ApiError>(
    { error: { code, message, details } },
    { status }
  );
}

export function unauthorized(message = 'Unauthorized') {
  return error('UNAUTHORIZED', message, undefined, 401);
}

export function forbidden(message = 'Forbidden') {
  return error('FORBIDDEN', message, undefined, 403);
}

export function notFound(message = 'Resource not found') {
  return error('NOT_FOUND', message, undefined, 404);
}

export function conflict(message = 'Resource already exists') {
  return error('CONFLICT', message, undefined, 409);
}

export function validationError(details: unknown) {
  return error('VALIDATION_ERROR', 'Invalid request data', details, 422);
}

export function internalError(message = 'Internal server error') {
  return error('INTERNAL_ERROR', message, undefined, 500);
}
