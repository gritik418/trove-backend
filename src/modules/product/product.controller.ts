import {
  Body,
  Controller,
  Post,
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

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(Role.ADMIN, Role.SELLER)
  @UseGuards(AuthGuard, RolesGuard)
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
