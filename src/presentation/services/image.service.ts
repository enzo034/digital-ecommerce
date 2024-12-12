import { UploadedFile } from "express-fileupload";
import { ImageUploader, CloudinaryUploadResult } from "../../config/image-uploader.adapter";
import { CustomError } from "../../domain/errors/custom-error";



export class ImageService {

    // DI
    constructor() { }


    async uploadImages(files: UploadedFile[]) {
        if (files && files.length > 0) {
            const uploadResults: CloudinaryUploadResult[] = await ImageUploader.uploadFromBuffer(files);
            return uploadResults;
        } else {
            return [];
        }
    }

    async deleteImages(public_id: string) {
        await ImageUploader.deleteImages(public_id);
    }

    transformImagesUrl(public_id: string): Record<string, string> {

        const transformedUrls = ImageUploader.transformImageUrls(public_id);

        return transformedUrls;

    }

    transformSingleImage(public_id: string): string {
        
        const url = ImageUploader.transformSingleImage(public_id);

        return url;
    }

    async processSingleImage(imageFile: UploadedFile[]): Promise<string | undefined> {
        if (!imageFile || imageFile.length === 0) {
            throw CustomError.badRequest('An image file is required');
        }
    
        if (imageFile.length > 1) {
            throw CustomError.badRequest('A single image should be uploaded');
        }
    
        try {
            const uploadImagesResult = await this.uploadImages(imageFile);
            return uploadImagesResult[0]
                ? this.transformSingleImage(uploadImagesResult[0].public_id)
                : undefined;
        } catch (error) {
            throw CustomError.internalServer('Failed to upload package image');
        }
    }
    

}