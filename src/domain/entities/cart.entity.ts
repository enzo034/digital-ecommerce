
import { isMongoId } from "../../config";
import { CustomError } from "../errors/custom-error";




export class CartEntity {

    constructor(
        public id: string,
        public userId: string,
        public packages: string[],
        public totalPrice: number,
        public status: number,
    ) { }

    static fromObject(object: { [key: string]: any }): CartEntity {

        const { id, userId, packages, totalPrice, status } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Category Id is not a valid Id');

        if (!userId) throw CustomError.badRequest('Missing userId');
        if (!packages) throw CustomError.badRequest('Missing packages');
        if (!totalPrice) throw CustomError.badRequest('Missing totalPrice');
        
        return new CartEntity(id, userId, packages, totalPrice, status);
    }
}