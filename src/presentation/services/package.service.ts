import { UploadedFile } from "express-fileupload";
import { PackageDocument, PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CreatePackageDto } from "../../domain/dtos/package/create-package.dto";
import { ModifyPackageDto } from "../../domain/dtos/package/modify-package.dto";
import { PaginationDto } from "../../domain/dtos/package/pagination.dto";
import { PackageEntity } from "../../domain/entities/package.entity";
import { ImageService } from "./image.service";
import { countDocuments, getNextPageUrl, getPreviousPageUrl } from "../../config/pagination-helper";
import { parseEntities } from "../../domain/entities/IEntity";

type SortOrder = 1 | -1;

export interface PackageOptions {
    paginationDto: PaginationDto;
    urlParameter?: string;
    where?: Record<string, any>; // Definición de where mongoose
    orderBy?: { [key: string]: SortOrder } | [string, SortOrder][]; // Definición de order by mongoose
    isAdmin?: boolean;
}


export class PackageService {


    constructor(
        private readonly imageService: ImageService,
    ) { }

    //#region Get packages
    async getPackagesCommon(packageOptions: PackageOptions) {
        const { paginationDto, orderBy, urlParameter = '/', where = {}, isAdmin = false } = packageOptions;
        const { page, limit } = paginationDto;

        try {
            const total = await countDocuments(PackageModel, where);
            const packageModel = await this.fetchPackages(where, page, limit, orderBy, isAdmin);
            const packageEntities = parseEntities(PackageEntity, packageModel);

            return {
                page,
                limit,
                total,
                next: getNextPageUrl(page, limit, total, urlParameter),
                prev: getPreviousPageUrl(page, limit, urlParameter),
                packages: packageEntities,
            };
        } catch (error) {
            throw CustomError.internalServer("Internal server error: " + error);
        }
    }

    async fetchPackages(where: any, page: number, limit: number, orderBy: any, isAdmin: boolean = false): Promise<PackageDocument[]> {

        const sendSourceFiles = this.shouldSendSourceFiles(isAdmin);

        const packages = await PackageModel.find(where || {}) //todo: si el rendimiento baja, hacer la páginación con cursores en lugar de usar .skip
            .select(sendSourceFiles)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(orderBy);

        return packages;
    }

    //#endregion

    //#region Get package by id

    async getPackageById(id: string, isAdmin: boolean = false): Promise<PackageEntity> {

        const sendSourceFiles = this.shouldSendSourceFiles(isAdmin);

        const pkg = await PackageModel.findById(id)
            .select(sendSourceFiles)

        if (!pkg) throw CustomError.notFound(`The package with id ${id} was not found.`)

        return PackageEntity.fromObject(pkg);

    }

    shouldSendSourceFiles(isAdmin: boolean): string {
        return isAdmin ? '' : '-sourceFiles';
    }

    //#endregion

    //#region Create Package
    async createPackage(createPackageDto: CreatePackageDto, imageFile: UploadedFile[]) {

        const existingPackage = await PackageModel.findOne({ name: createPackageDto.name });
        if (existingPackage) throw CustomError.badRequest('Package already exists.');

        const primaryImage = await this.imageService.processSingleImage(imageFile);

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
    //#endregion

    //#region ModifyPackage
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
    //#endregion

}

