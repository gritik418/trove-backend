import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};

        err.errors.forEach((e) => {
          const field = e.path[0]?.toString() || 'unknown';
          fieldErrors[field] = e.message;
        });

        throw new BadRequestException({
          message: fieldErrors,
          statusCode: 400,
        });
      }

      throw err;
    }
  }
}
