import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateProductWithFilesDto } from './interfaces/create-product-with-files.interface';
import { Product } from './schemas/product.schema';
import { UploadApiResponse } from 'cloudinary';
import { GetProductsQuery } from './interfaces/get-products-query.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getProducts({
    limit = 10,
    page = 1,
    isPublished = true,
    search = '',
    categories = [],
  }: GetProductsQuery) {
    const filters: any = {};

    if (typeof isPublished === 'boolean') {
      filters.isPublished = isPublished;
    }

    if (search) {
      filters.$or = [
        {
          name: { $regex: search, $options: 'i' },
        },
        {
          title: { $regex: search, $options: 'i' },
        },
        {
          brand: { $regex: search, $options: 'i' },
        },
        {
          description: { $regex: search, $options: 'i' },
        },
      ];
    }

    if (categories.length > 0) {
      filters.categories = { $in: categories };
    }

    const totalProducts = await this.productModel
      .countDocuments(filters)
      .exec();

    const products = await this.productModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      statusCode: 200,
      message: 'Products fetched successfully.',
      data: { products, totalProducts },
    };
  }

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

    return {
      message: 'Product created successfully.',
      statusCode: 201,
      data: product,
    };
  }
}
