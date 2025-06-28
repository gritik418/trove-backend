import { CreateProductDto } from '../schemas/zod/create-product.zod';

export interface CreateProductWithFilesDto extends CreateProductDto {
  thumbnail: Express.Multer.File | null;
  images: Express.Multer.File[];
}
