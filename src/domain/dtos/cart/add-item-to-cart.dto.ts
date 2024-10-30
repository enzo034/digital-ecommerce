import { isMongoId } from "../../../config";

export class AddToCartDto {
    private constructor(
        public readonly userId: string,
        public readonly packageId: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, AddToCartDto?] {
        const { userId, packageId } = object;

        if (!userId || !isMongoId(userId)) return ['Invalid or missing userId'];
        if (!packageId || !isMongoId(packageId)) return ['Invalid or missing packageId'];


        return [undefined, new AddToCartDto(userId, packageId)];
    }
}