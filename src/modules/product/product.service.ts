import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateProductWithFilesDto } from './interfaces/create-product-with-files.interface';
import { Product } from './schemas/product.schema';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(data: CreateProductWithFilesDto) {
    const existingSlug = await this.productModel.findOne({ slug: data.slug });
    if (existingSlug) {
      throw new BadRequestException('A product with this slug already exists.');
    }

    if (!data.thumbnail)
      throw new BadRequestException('Thumbnail is required.');

    if (!data?.images?.length) {
      throw new BadRequestException('At least one product image is required.');
    }

    let thumbnailUpload: UploadApiResponse | null = null;
    try {
      thumbnailUpload = await this.cloudinaryService.uploadFile(
        data.thumbnail,
        'trove/products',
      );
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
      throw new BadRequestException('Failed to upload thumbnail.');
    }

    if (!thumbnailUpload.secure_url) {
      throw new BadRequestException('Failed to upload thumbnail.');
    }

    let imagesUpload: UploadApiResponse[] = [];
    try {
      imagesUpload = await this.cloudinaryService.uploadMultipleFiles(
        data.images,
        'trove/products',
      );
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new BadRequestException('Failed to upload product images.');
    }

    if (!imagesUpload.length) {
      throw new BadRequestException('Failed to upload product images.');
    }

    const product = await this.productModel.create({
      ...data,
      thumbnail: thumbnailUpload.secure_url,
      images: imagesUpload.map((image: UploadApiResponse) => image.secure_url),
    });

    return product;
  }
}
