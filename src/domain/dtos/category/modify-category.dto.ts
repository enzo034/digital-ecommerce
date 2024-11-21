import { isMongoId } from "../../../config";



export class ModifyCategoryDto {

    private constructor(
        public readonly id: string,
        public readonly name?: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, ModifyCategoryDto?] {

        const { id, name } = object;

        if (!id) return ['Missing categoryId'];
        if (!isMongoId(id)) return ['Category id is not a valid id'];

        return [undefined, new ModifyCategoryDto(id, name)];

    }


}