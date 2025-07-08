import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException ? exception.getResponse() : null;

    if (res && typeof res === 'object' && 'success' in res) {
      return response.status(status).json(res);
    }

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error.';

    const errorMessage =
      typeof message === 'string'
        ? message
        : (message as any)?.message || 'Unknown error.';

    response.status(status).json({
      success: false,
      message: errorMessage,
      statusCode: status,
    });
  }
}
