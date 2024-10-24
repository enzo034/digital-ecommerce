import { SourceFileModel } from "../../data/mongo";
import { CreateSourceFileDto, CustomError, DeleteSourceFileDto, ModifySourceFileDto } from "../../domain";
import { SourceFileEntity } from "../../domain/entities/source-file.entity";





export class SourceFileService {

    // DI
    constructor() { }


    async createSourceFile(createSourceFileDto: CreateSourceFileDto) {

        const sourceFileExists = await SourceFileModel.findOne({ name: createSourceFileDto.name })
        if (sourceFileExists) throw CustomError.badRequest('SourceFile already exists');

        const sourceFile = await SourceFileModel.create(createSourceFileDto);

        return SourceFileEntity.fromObject(sourceFile);


    }

    async getSourceFiles() {

        const sourceFiles = await SourceFileModel.find();
        if (!sourceFiles.length) throw CustomError.notFound('No source files found.');

        return sourceFiles.map(sourceFile => SourceFileEntity.fromObject(sourceFile));

    }

    async modifySourceFile(modifySourcefileDto: ModifySourceFileDto) {

        const sourceFile = await SourceFileModel.findById(modifySourcefileDto.sourceFileId);
        if (!sourceFile) throw CustomError.notFound(`SourceFiles with id : ${modifySourcefileDto.sourceFileId} not found.`);

        const modifiedSourceFile = await SourceFileModel.findByIdAndUpdate(
            modifySourcefileDto.sourceFileId,
            { name: modifySourcefileDto.name },
            { new: true }
        );

        if (!modifiedSourceFile) throw CustomError.notFound(`Unable to update sourceFile with id: ${modifySourcefileDto.sourceFileId}`);

        return SourceFileEntity.fromObject(modifiedSourceFile);

    }

    async deleteSourceFile(deleteSourceFileDto: DeleteSourceFileDto) {

        const sourceFile = await SourceFileModel.findById(deleteSourceFileDto.sourceFileId);
        if (!sourceFile) throw CustomError.notFound(`SourceFile with id: ${deleteSourceFileDto.sourceFileId} not found.`);

        await SourceFileModel.deleteOne({ _id: deleteSourceFileDto.sourceFileId });

    }

}