
import { isMongoId } from "../../config";
import { CustomError } from "../errors/custom-error";




export class SourceFileEntity {

    constructor(
        public id: string,
        public name: string,
        public link: string
    ) { }

    static fromObject(object: { [key: string]: any }): SourceFileEntity {

        const { id, name, link } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Source File Id is not a valid Id');
        
        if (!name) throw CustomError.badRequest('Missing name');

        if (!link) throw CustomError.badRequest('Missing link');

        return new SourceFileEntity(id, name, link);
    }
}
