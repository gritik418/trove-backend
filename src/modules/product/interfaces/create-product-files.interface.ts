export interface CreateProductFilesDto {
  thumbnail: Express.Multer.File | null;
  images: Express.Multer.File[];
}
