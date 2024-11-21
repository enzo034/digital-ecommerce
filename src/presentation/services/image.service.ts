import { UploadedFile } from "express-fileupload";
import { ImageUploader, CloudinaryUploadResult } from "../../config/image-uploader.adapter";






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

}