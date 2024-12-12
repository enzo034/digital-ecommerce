import { isMongoId } from "../../config/regular-exp";
import { CustomError } from "../errors/custom-error";


export class PurchaseEntity {

    constructor(
        public id: string,
        public packages: string[],
        public date: Date,
        public totalPrice: number,

    ) { }


    static fromObject(object: { [key: string]: any; }): PurchaseEntity {

        const { id, packages, date, totalPrice } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Client Id is not a valid Id');

        if (!totalPrice) throw CustomError.badRequest('Missing totalPrice');

        if (!date) throw CustomError.badRequest('Missing date');

        if (packages) {
            if (!Array.isArray(packages)) throw CustomError.badRequest('Packages should be an array');
        }

        return new PurchaseEntity(id, packages, date, totalPrice);

    };

};