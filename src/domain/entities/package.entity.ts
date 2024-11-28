import { isMongoId } from "../../config";
import { CustomError } from "../errors/custom-error";

export enum UserRole {
    USER = 'USER_ROLE',
    ADMIN = 'ADMIN_ROLE',
}

export class PackageEntity {

    constructor(
        public id: string,
        public name: string,
        public previewImage: string,
        public description: string,
        public price: number,
        public categories: string[],
        public sourceFiles?: string[],

    ) { }


    static fromObject(object: { [key: string]: any; }): PackageEntity {

        const { id, name, previewImage, description, price, sourceFiles, categories } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Client Id is not a valid Id');

        if (!name) throw CustomError.badRequest('Missing name');

        if (!previewImage) throw CustomError.badRequest('Missing previewImage');

        if (!description) throw CustomError.badRequest('Missing description');

        if (!price) throw CustomError.badRequest('Missing price');

        if (sourceFiles) {
            if (!Array.isArray(sourceFiles)) throw CustomError.badRequest('SourceFiles should be an array');
        }

        if (!Array.isArray(categories)) throw CustomError.badRequest('Categories should be an array');

        return new PackageEntity(id, name, previewImage, description, price, categories, sourceFiles);

    };

};