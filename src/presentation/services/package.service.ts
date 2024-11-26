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
    isAdmin?: boolean;
}


export class PackageService {


    constructor(
        private readonly imageService: ImageService,
    ) { }

    async getPackagesCommon(packageOptions: PackageOptions) {
        const { paginationDto, orderBy, urlParameter = '/', where, isAdmin = false } = packageOptions;
        const { page, limit } = paginationDto;
    
        try {
            const total = await this.countPackages(where);
            const packageModel = await this.fetchPackages(where, page, limit, orderBy, isAdmin);
            const packageEntities = this.parsePackageEntities(packageModel);
    
            return {
                page,
                limit,
                total,
                next: this.getNextPageUrl(page, limit, total, urlParameter),
                prev: this.getPreviousPageUrl(page, limit, urlParameter),
                packages: packageEntities,
            };
        } catch (error) {
            throw new Error("Internal server error: " + error);
        }
    }


    async countPackages(where: any): Promise<number> {
        return await PackageModel.countDocuments(where);
    }

    async fetchPackages(where: any, page: number, limit: number, orderBy: any, isAdmin: boolean = false) { //todo: hacer el endpoint para el admin, y hacer que los que hayan comprado el package, tambien puedan ver el contenido

        const sendSourceFiles = isAdmin ? '' : '-sourceFiles';

        return await PackageModel.find(where || {}) //todo: si el rendimiento baja, hacer la páginación con cursores en lugar de usar .skip
            .select(sendSourceFiles)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(orderBy);
    }

    parsePackageEntities(packageModel: any[]): PackageEntity[] {
        return packageModel.reduce((acc: PackageEntity[], product) => {
            try {
                const entity = PackageEntity.fromObject(product);
                acc.push(entity); // Agrega solo los válidos
            } catch (error) {
                console.warn(`Error parsing product with ID ${product.id}:`);
            }
            return acc;
        }, []);
    }

    getNextPageUrl(page: number, limit: number, total: number, urlParameter: string): string | null {
        return page * limit < total ? `/api/package${urlParameter}?page=${page + 1}&limit=${limit}` : null;
    }

    getPreviousPageUrl(page: number, limit: number, urlParameter: string): string | null {
        return page - 1 > 0 ? `/api/package${urlParameter}?page=${page - 1}&limit=${limit}` : null;
    }

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