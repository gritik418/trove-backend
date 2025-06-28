import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseProductQueryParamsPipe implements PipeTransform {
  transform(value: any) {
    const transformed: any = {};

    if (value.limit !== undefined) {
      const limit = Number(value.limit);
      if (isNaN(limit) || limit < 0)
        throw new BadRequestException('Invalid limit');

      transformed.limit = limit;
    }

    if (value.page !== undefined) {
      const page = Number(value.page);
      if (isNaN(page) || page < 1)
        throw new BadRequestException('Invalid page');

      transformed.page = page;
    }

    if (value.isPublished !== undefined) {
      if (value.isPublished === 'true') transformed.isPublished = true;
      else if (value.isPublished === 'false') transformed.isPublished = false;
      else throw new BadRequestException('Invalid isPublished value');
    }

    if (value.search !== undefined) {
      transformed.search = value.search;
    }

    if (value.categories !== undefined) {
      transformed.categories = Array.isArray(value.categories)
        ? value.categories
        : value.categories.split(',');
    }

    return transformed;
  }
}
