import { isMongoId } from "../../../config";




export class ModifySourceFileDto {

    private constructor(
        public readonly sourceFileId: string,
        public readonly name?: string,
        public readonly link?: string,

    ) { }

    static create(object: { [key: string]: any }): [string?, ModifySourceFileDto?] {

        const { sourceFileId, name, link } = object;

        if (!sourceFileId) return ['Missing sourceFileId'];
        if (!isMongoId(sourceFileId)) return ['SourceFile id is not a valid id'];

        return [undefined, new ModifySourceFileDto(sourceFileId, name, link)];

    }


}