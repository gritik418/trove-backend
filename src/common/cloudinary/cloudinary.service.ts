import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ENV_KEYS } from '../constants/env.keys';

@Injectable()
export class CloudinaryService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get<string>(ENV_KEYS.CLOUDINARY_CLOUD_NAME),
      api_key: config.get<string>(ENV_KEYS.CLOUDINARY_API_KEY),
      api_secret: config.get<string>(ENV_KEYS.CLOUDINARY_API_SECRET),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    try {
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('No result from Cloudinary'));
            resolve(result as UploadApiResponse);
          },
        );
        stream.end(file.buffer);
      });
    } catch (error) {
      console.error('Cloudinary uploadFile error:', error);
      throw new InternalServerErrorException('Failed to upload image.');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<UploadApiResponse[]> {
    try {
      const uploads = await Promise.all(
        files.map((file) => this.uploadFile(file, folder)),
      );
      return uploads;
    } catch (error) {
      console.error('Cloudinary uploadMultipleFiles error:', error);
      throw new InternalServerErrorException('Failed to upload images.');
    }
  }
}
