



export class CreateSourceFileDto {

    private constructor(

        public readonly name: string,
        public readonly link: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, CreateSourceFileDto?] {

        const { name, link } = object;

        if (!name) return ['Missing name'];
        if (!link) return ['Missing link'];

        return [undefined, new CreateSourceFileDto(name, link)];

    }


}