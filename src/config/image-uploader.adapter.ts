import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { envs } from './envs';
import { UploadedFile } from 'express-fileupload';
import { CustomError } from '../domain';

cloudinary.config({
  cloud_name: envs.CLOUDINARY_CLOUD_NAME,
  api_key: envs.CLOUDINARY_API_KEY,
  api_secret: envs.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult extends UploadApiResponse {
  asset_id: string;
  version_id: string;
  asset_folder: string;
  display_name: string;
  api_key: string;
}

export class ImageUploader {

  constructor() { }

  static async uploadFromBuffer(files: UploadedFile[]): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map(file => new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'products',
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result as CloudinaryUploadResult);
          }
        ).end(file.data);
      }));

      const uploadResults = await Promise.all(uploadPromises);

      return uploadResults;
    } catch (error) {
      throw CustomError.internalServer('Internal server error on iu');
    }
  }

  static async deleteImages(public_id: string) {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (error) {
      throw CustomError.internalServer('Failed to delete image');
    }
  }

  static transformImageUrls(public_id: string): Record<string, string> {
    const transformations = { // Definition of the image's sizes that we want
      cart: { width: 64, height: 64 },
      product_slider: { width: 200, height: 340 },
      product_detail_main: { width: 360, height: 400 },
      product_detail_sub: { width: 50, height: 50 },
      product_card: { width: 235, height: 340 },
    };

    const urls: Record<string, string> = {};
    for (const [key, { width, height }] of Object.entries(transformations)) { // Create every url with the given public_id
      urls[key] = cloudinary.url(public_id, {
        transformation: [
          { width, height, crop: 'scale' },
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
    }

    return urls;
  }

  static transformSingleImage(public_id: string): string {

    const url = cloudinary.url(public_id, {
      transformation: [
        { width: 235, height: 340, crop: 'scale' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return url;

  }

}