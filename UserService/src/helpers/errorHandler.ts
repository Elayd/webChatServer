import { CustomErrorCodes } from '../enums/customErrorCodes';
import { Response } from 'express';
import * as Sentry from '@sentry/node';
import HttpStatusCode from '../enums/httpStatusCodes';

process.on('uncaughtException', (error: Error) => {
  handler.handleError(error);
  if (!handler.isTrustedError(error)) process.exit(1);
});

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;

  public readonly errorData?: Record<string, unknown>;

  public readonly messageCode: HttpStatusCode | CustomErrorCodes;

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    description: string,
    messageCode: HttpStatusCode | CustomErrorCodes,
    isOperational: boolean,
    errorData?: Record<string, unknown>
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.errorData = errorData;
    this.messageCode = messageCode;

    Error.captureStackTrace(this);
  }
}
class ErrorHandler {
  private isCustomErrorCode(messageCode: HttpStatusCode | CustomErrorCodes): boolean {
    return Object.values(CustomErrorCodes).includes(messageCode as CustomErrorCodes);
  }

  public async handleError(err: unknown, res?: Response): Promise<void> {
    if (err instanceof AppError) {
      if (res) {
        const responseBody = {
          message: err.message,
          code: err.messageCode,
          ...(err.errorData && { data: err.errorData })
        };

        res.status(err.httpCode).json(responseBody);
      }

      if (
        !this.isCustomErrorCode(err.messageCode) &&
        process.env.NODE_ENV !== 'test_unit' &&
        process.env.NODE_ENV !== 'test_integration'
      ) {
        Sentry.captureException(err);
      }
      return;
    }
  }

  public isTrustedError(error: Error) {
    return error instanceof AppError && error.isOperational;
  }
}

export const handler = new ErrorHandler();
