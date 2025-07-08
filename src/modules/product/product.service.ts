import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UploadApiResponse } from 'cloudinary';
import { isValidObjectId, Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateProductWithFilesDto } from './interfaces/create-product-with-files.interface';
import { GetProductsQuery } from './interfaces/get-products-query.interface';
import {
  VariantColor,
  VariantColorSize,
  Variants,
  VariantSize,
  VariantType,
} from './interfaces/variant.interface';
import { Product } from './schemas/product.schema';

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
      .lean()
      .exec();

    return {
      statusCode: 200,
      message: 'Products fetched successfully.',
      data: {
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        limit,
      },
    };
  }

  async getProductByIdOrSlug(value: string) {
    const query = isValidObjectId(value) ? { _id: value } : { slug: value };

    const product = await this.productModel.findOne(query).exec();

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const { variants, variantType } = await this.getVariants(product.name);

    return {
      statusCode: 200,
      message: 'Product fetched successfully.',
      data: { product, variants, variantType },
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
      thumbnail: {
        publicId: thumbnailUpload.public_id,
        url: thumbnailUpload.secure_url,
      },
      images: imagesUpload.map((image) => ({
        publicId: image.public_id,
        url: image.secure_url,
      })),
    });

    return {
      message: 'Product created successfully.',
      statusCode: 201,
      data: product,
    };
  }

  private async getVariants(
    name: string,
  ): Promise<{ variants: Variants; variantType: VariantType }> {
    const products = await this.productModel.find({ name });
    const variantType = this.inferVariantType(products);

    switch (variantType) {
      case 'color-size':
        const variantsColorSize = new Map<string, VariantColorSize>();

        for (const product of products) {
          if (!product.color || !product.size) continue;

          if (!variantsColorSize.has(product?.color)) {
            variantsColorSize.set(product.color, {
              color: product.color,
              thumbnail: product.thumbnail?.url,
              sizes: [],
            });
          }

          const variant = variantsColorSize.get(product.color);
          variant?.sizes.push({
            size: product.size,
            slug: product.slug,
            isPublished: product.isPublished,
            stock: product.stock,
          });
        }

        return {
          variants: Array.from(variantsColorSize.values()),
          variantType,
        };

      case 'color':
        const variantsColor = new Map<string, VariantColor>();

        for (const product of products) {
          if (!product.color) continue;
          if (!variantsColor.has(product?.color)) {
            variantsColor.set(product.color, {
              color: product.color,
              isPublished: product.isPublished,
              stock: product.stock,
              slug: product.slug,
              thumbnail: product.thumbnail?.url,
            });
          }
        }

        return { variants: Array.from(variantsColor.values()), variantType };

      case 'size':
        const variantsSize = new Map<string, VariantSize>();

        for (const product of products) {
          if (!product.size) continue;
          if (!variantsSize.has(product.size)) {
            variantsSize.set(product.size, {
              size: product.size,
              isPublished: product.isPublished,
              slug: product.slug,
              stock: product.stock,
              thumbnail: product.thumbnail?.url,
            });
          }
        }

        return { variants: Array.from(variantsSize.values()), variantType };

      default:
        return { variants: [], variantType };
    }
  }

  private inferVariantType(products: Product[]): VariantType {
    const allHaveColor = products.every((product) => !!product.color);
    const allHaveSize = products.every((products) => !!products.size);
    const noneHaveColor = products.every((products) => !products.color);
    const noneHaveSize = products.every((products) => !products.size);

    if (allHaveColor && allHaveSize) return 'color-size';

    if (allHaveColor && noneHaveSize) return 'color';

    if (allHaveSize && noneHaveColor) return 'size';
    return 'none';
  }
}
