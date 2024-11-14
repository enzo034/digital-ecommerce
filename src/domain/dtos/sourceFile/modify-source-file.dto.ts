import { isMongoId } from "../../../config";




export class ModifySourceFileDto {

    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly link?: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, ModifySourceFileDto?] {

        const { id, name, link } = object;

        if (!id) return ['Missing sourceFileId'];
        if (!isMongoId(id)) return ['SourceFile id is not a valid id'];

        return [undefined, new ModifySourceFileDto(id, name, link)];

    }


}