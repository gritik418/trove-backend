import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto } from './schemas/zod/create-product.zod';
import { ParseCreateProductPipe } from 'src/modules/product/pipes/parse-create-product/parse-create-product.pipe';
import { CreateProductFilesDto } from './interfaces/create-product-files.interface';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { GetProductsQuery } from './interfaces/get-products-query.interface';
import { ParseProductQueryParamsPipe } from './pipes/parse-product-query-params/parse-product-query-params.pipe';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/')
  getAllProducts(
    @Query(new ParseProductQueryParamsPipe()) queryParams: GetProductsQuery,
  ) {
    return this.productService.getProducts(queryParams);
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:value')
  getProduct(@Param('value') value: string) {
    return this.productService.getProductByIdOrSlug(value);
  }

  @Roles(Role.ADMIN, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'thumbnail',
        maxCount: 1,
      },
      { name: 'images' },
    ]),
  )
  createProduct(
    @Body(new ParseCreateProductPipe()) data: CreateProductDto,
    @UploadedFiles() files: CreateProductFilesDto,
  ) {
    return this.productService.createProduct({
      ...data,
      thumbnail: files.thumbnail ? files.thumbnail[0] : null,
      images: files.images,
    });
  }
}
