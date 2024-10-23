import { isMongoId } from "../../../config";



export class ModifyCategoryDto {

    private constructor(
        public readonly categoryId: string,
        public readonly name?: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, ModifyCategoryDto?] {

        const { categoryId, name } = object;

        if (!categoryId) return ['Missing categoryId'];
        if (!isMongoId(categoryId)) return ['Category id is not a valid id'];

        return [undefined, new ModifyCategoryDto(categoryId, name)];

    }


}