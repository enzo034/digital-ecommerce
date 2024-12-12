import { UploadedFile } from "express-fileupload";
import { CreatePackageDto } from "../../domain/dtos/package/create-package.dto";
import { ModifyPackageDto } from "../../domain/dtos/package/modify-package.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { PackageEntity } from "../../domain/entities/package.entity";
import { ImageService } from "./image.service";
import { EcommerceQueryService } from "./ecommerce-query.service";
import { PackageDocument, PackageModel } from "../../data/mongo/models/package.model";
import { CustomError } from "../../domain/errors/custom-error";



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
        private readonly ecommerceQueryService: EcommerceQueryService
    ) { }

    //#region Get packages

    async getPackagesCommon(packageOptions: PackageOptions) {
        // Aquí pasamos `fetchPackages` con el contexto correcto
        return await this.ecommerceQueryService.getResourcesCommon<PackageDocument>(PackageModel, PackageEntity, this.fetchPackages.bind(this), packageOptions);
    }


    async fetchPackages(where: any, page: number, limit: number, orderBy: any, isAdmin: boolean = false): Promise<PackageDocument[]> { // * No se devuelve una entidad ya que dentro de getPackagesCommon se parsean antes de ser devueltas desde fetch

        const sendSourceFiles = this.shouldSendSourceFiles(isAdmin);
        const populate = this.howShouldPopulate(isAdmin);
        const modifiedWhere = this.addNonAdminFilters(where, isAdmin);

        const packages = await PackageModel.find(modifiedWhere || {}) //todo: si el rendimiento baja, hacer la páginación con cursores en lugar de usar .skip
            .select(sendSourceFiles)
            .populate(populate)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(orderBy)

        return packages;
    }

    private shouldSendSourceFiles(isAdmin: boolean): string {
        return isAdmin ? '+sourceFiles' : '-sourceFiles';
    }

    private addNonAdminFilters(where: any, isAdmin: boolean): any { //Para llevar solo los package disponibles a los que no son admin
        if (isAdmin) {
            return where || {};
        }

        return {
            ...where,
            isActive: true
        };
    }

    //#endregion

    //#region Get package by id

    async getPackageById(id: string, isAdmin: boolean = false): Promise<PackageEntity> {

        const populate = this.howShouldPopulate(isAdmin);

        const pkg = await PackageModel.findById(id)
            .populate(populate)

        if (!pkg) throw CustomError.notFound(`The package with id ${id} was not found.`)

        return PackageEntity.fromObject(pkg);

    }

    private howShouldPopulate(isAdmin: boolean): Array<{ path: string; select: string }> {
        const categoriesPath = { path: 'categories', select: 'name timesSold' };
        const sourceFilesPath = { path: 'sourceFiles', select: isAdmin ? 'name link' : 'name' };

        return [categoriesPath, sourceFilesPath];
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
    async modifyPackage(modifyPackageDto: ModifyPackageDto, imageFile: UploadedFile[]) {

        const packageModel = await PackageModel.findById(modifyPackageDto.id);
        if (!packageModel) throw CustomError.badRequest('Package does not exists')

        let modifyPackage = modifyPackageDto;

        if (imageFile) {

            const newPrimaryImage = await this.imageService.processSingleImage(imageFile);

            modifyPackage = { ...modifyPackageDto, previewImage: newPrimaryImage! }

            const previousPublicId = this.extractPublicId(packageModel.previewImage);

            if (previousPublicId) {
                this.imageService.deleteImages(previousPublicId);
            }
        }

        try {

            const updatedPackage = await PackageModel.findByIdAndUpdate(
                modifyPackageDto.id,
                { $set: modifyPackage },
                { new: true }
            );

            return PackageEntity.fromObject(updatedPackage!);

        } catch (error) {
            throw CustomError.internalServer("Internal server error")
        }

    }

    extractPublicId(url: string): string | null {
        if (!url) return null;
        const regex = /\/packages\/([^/?]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    //#endregion

}

