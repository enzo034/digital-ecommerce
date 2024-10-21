import { isMongoId } from "../../../config";

export class AddToCartDto {
    private constructor(
        public readonly userId: string,
        public readonly packageId: string,
        public readonly quantity: number
    ) { }

    static create(object: { [key: string]: any }): [string?, AddToCartDto?] {
        const { userId, packageId, quantity = 0 } = object;

        if (!userId || !isMongoId(userId)) return ['Invalid or missing userId'];
        if (!packageId || !isMongoId(packageId)) return ['Invalid or missing packageId'];

        const parsedQuantity = parseFloat(quantity);

        if (isNaN(parsedQuantity) || parsedQuantity < 0) return ['Quantity must be a valid number'];

        return [undefined, new AddToCartDto(userId, packageId, parsedQuantity)];
    }
}