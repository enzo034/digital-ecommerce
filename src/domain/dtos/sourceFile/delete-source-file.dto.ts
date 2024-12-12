import { isMongoId } from "../../../config/regular-exp";


export class DeleteSourceFileDto {

    private constructor(
        public readonly sourceFileId: string
    ) { }

    static create(object: { [key: string]: any }): [string?, DeleteSourceFileDto?] {

        const { sourceFileId } = object;

        if (!sourceFileId) return ['Missing sourceFileId'];
        if (!isMongoId(sourceFileId)) return ['SourceFile id is not a valid id'];

        return [undefined, new DeleteSourceFileDto(sourceFileId)];

    }


}