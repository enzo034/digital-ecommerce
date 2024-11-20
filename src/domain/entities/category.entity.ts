
import { isMongoId } from "../../config";
import { CustomError } from "../errors/custom-error";




export class CategoryEntity {

    constructor(
        public categoryId: string,
        public name: string
    ) { }

    static fromObject(object: { [key: string]: any }): CategoryEntity {
        
        const { categoryId, name } = object;
        
        if (!categoryId) throw CustomError.badRequest('Missing id');
        if (!isMongoId(categoryId)) throw CustomError.badRequest('categoryId is not a valid Id');

        if (!name) throw CustomError.badRequest('Missing name');
    
        return new CategoryEntity(categoryId, name);
    }
}
