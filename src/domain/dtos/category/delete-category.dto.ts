import { isMongoId } from "../../../config";




export class DeleteCategoryDto {

    private constructor(
        public readonly id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, DeleteCategoryDto?] {

        const { id } = object;

        if (!id) return ['Missing categoryId'];
        if (!isMongoId(id)) return ['Category id is not a valid id'];

        return [undefined, new DeleteCategoryDto(id)];

    }


}