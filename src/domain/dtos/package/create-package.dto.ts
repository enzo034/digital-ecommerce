import { isMongoId } from "../../../config/regular-exp";


export class CreatePackageDto {
    private constructor(
        public readonly name: string,
        public readonly previewImage: string,
        public readonly description: string,
        public readonly price: number,
        public readonly sourceFiles: string[],
        public readonly categories: string[]
    ) { }

    static create(object: { [key: string]: any }): [string?, CreatePackageDto?] {
        const { name, previewImage, description, price, sourceFiles, categories } = object;

        if (!name) return ['Missing name'];

        if (!description) return ['Missing description'];

        if (!price) return ['Missing price'];

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice < 0) return ['Price must be a valid number'];

        if (!Array.isArray(sourceFiles)) return ['SourceFiles should be an array'];
        for (const sourceFile of sourceFiles) {
            if (!isMongoId(sourceFile)) return ['All sourceFiles should be valid IDs'];
        }

        if (!Array.isArray(categories)) return ['Categories should be an array'];
        for (const category of categories) {
            if (!isMongoId(category)) return ['All categories should be valid IDs'];
        }
        
        return [undefined, new CreatePackageDto(name, previewImage, description, parsedPrice, sourceFiles, categories)];
    }
}