import { isMongoId } from "../../../config";

export class ModifyPackageDto {
    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly previewImage?: string,
        public readonly description?: string,
        public readonly price?: number,
        public readonly sourceFiles?: string[],
        public readonly categories?: string[]
    ) { }

    static create(object: { [key: string]: any }): [string?, ModifyPackageDto?] {
        const { id, name, previewImage, description, price, sourceFiles, categories } = object;

        if (!id) return ['Missing packageId'];
        if (!isMongoId(id)) return ['PackageId is not a valid id'];

        const parsedPrice = price !== undefined ? parseFloat(price) : undefined;
        if (parsedPrice !== undefined && (isNaN(parsedPrice) || parsedPrice < 0)) {
            return ['Price must be a valid non-negative number'];
        }

        if (sourceFiles) {
            if (!Array.isArray(sourceFiles)) return ['SourceFiles should be an array'];
            for (const sourceFile of sourceFiles) {
                if (!isMongoId(sourceFile)) return ['All sourceFiles should be valid IDs'];
            }
        }

        if (categories) {
            if (!Array.isArray(categories)) return ['Categories should be an array'];
            for (const category of categories) {
                if (!isMongoId(category)) return ['All categories should be valid IDs'];
            }
        }

        return [undefined, new ModifyPackageDto(id, name, previewImage, description, parsedPrice, sourceFiles, categories)];
    }
}