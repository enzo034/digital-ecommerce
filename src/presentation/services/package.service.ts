import { UploadedFile } from "express-fileupload";
import { PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CreatePackageDto } from "../../domain/dtos/package/create-package.dto";
import { ModifyPackageDto } from "../../domain/dtos/package/modify-package.dto";
import { PaginationDto } from "../../domain/dtos/package/pagination.dto";
import { PackageEntity } from "../../domain/entities/package.entity";
import { ImageService } from "./image.service";

type SortOrder = 1 | -1;

export interface PackageOptions {
    paginationDto: PaginationDto;
    urlParameter?: string;
    where?: Record<string, any>; // Definición de where mongoose
    orderBy?: { [key: string]: SortOrder } | [string, SortOrder][]; // Definición de order by mongoose
}


export class PackageService {


    constructor(
        private readonly imageService: ImageService,
    ) { }

    async getPackagesCommon(packageOptions: PackageOptions) {
        const { paginationDto, orderBy, urlParameter = '/', where } = packageOptions;
        const { page, limit } = paginationDto;

        try {
            const total = await PackageModel.countDocuments(where);

            const packageModel = await PackageModel.find(where || {})
                .select('-sourceFiles')
                .skip((page - 1) * limit)
                .limit(limit)
                .sort(orderBy);

            const packageEntities = packageModel.map(product => PackageEntity.fromObject(product));

            return {
                page,
                limit,
                total,
                next: (page * limit < total) ? `/api/package${urlParameter}?page=${page + 1}&limit=${limit}` : null,
                prev: (page - 1 > 0) ? `/api/package${urlParameter}?page=${page - 1}&limit=${limit}` : null,
                packages: packageEntities,
            };

        } catch (error) {
            throw new Error("Internal server error");
        }
    }

    async createPackage(createPackageDto: CreatePackageDto, imageFile: UploadedFile[]) {

        if (!imageFile || imageFile.length === 0) throw CustomError.badRequest('An image file is required');

        if (imageFile.length > 1) throw CustomError.badRequest('A single image should be uploaded');

        const existingPackage = await PackageModel.findOne({ name: createPackageDto.name });
        if (existingPackage) throw CustomError.badRequest('Package already exists.');

        let primaryImage: string | undefined;
        try {
            const uploadImagesResult = await this.imageService.uploadImages(imageFile);
            primaryImage = uploadImagesResult[0]
                ? this.imageService.transformSingleImage(uploadImagesResult[0].public_id)
                : undefined;
        } catch (error) {
            throw CustomError.internalServer('Failed to upload package image');
        }

        const { name, description, price, sourceFiles, categories } = createPackageDto;

        const newPackage = await PackageModel.create({
            name,
            description,
            price,
            sourceFiles,
            categories,
            previewImage: primaryImage,
        });

        return PackageEntity.fromObject(newPackage);

    }

    async modifyPackage(modifyPackageDto: ModifyPackageDto) {

        const packageModel = await PackageModel.findById(modifyPackageDto.id);
        if (!packageModel) throw CustomError.badRequest('Package does not exists')

        try {

            const updatedPackage = await PackageModel.findByIdAndUpdate(
                modifyPackageDto.id,
                modifyPackageDto,
                { new: true }
            );

            return PackageEntity.fromObject(updatedPackage!);

        } catch (error) {
            throw new Error("Internal server error" + error);
        }

    }

}