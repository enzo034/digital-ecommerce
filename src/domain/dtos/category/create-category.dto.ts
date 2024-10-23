



export class CreateCategoryDto {

    private constructor(

        public readonly name: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, CreateCategoryDto?] {

        const { name } = object;

        if (!name) return ['Missing name'];

        return [undefined, new CreateCategoryDto(name)];

    }


}