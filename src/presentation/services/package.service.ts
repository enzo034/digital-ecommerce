import { PackageModel } from "../../data/mongo";
import { CustomError } from "../../domain";
import { CreatePackageDto } from "../../domain/dtos/package/create-package.dto";
import { PackageEntity } from "../../domain/entities/package.entity";




export class PackageService {

    constructor() {}


    async createPackage(createPackageDto: CreatePackageDto) {

        const packageModel = await PackageModel.findOne({name: createPackageDto.name});
        if(packageModel) throw CustomError.badRequest('Package already exists.');

        const newPackage = await PackageModel.create(createPackageDto);

        return PackageEntity.fromObject(newPackage);

    }


}