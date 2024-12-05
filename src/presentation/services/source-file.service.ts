import { checkIfExistsById, isReferencedInModel } from "../../config/document-helper";
import { PackageModel, SourceFileDocument, SourceFileModel } from "../../data/mongo";
import { CreateSourceFileDto, CustomError, DeleteSourceFileDto, ModifySourceFileDto } from "../../domain";
import { SourceFileEntity } from "../../domain/entities/source-file.entity";





export class SourceFileService {

    // DI
    constructor() { }


    async createSourceFile(createSourceFileDto: CreateSourceFileDto) {

        const { name, link } = createSourceFileDto;

        const existingSourceFile = await SourceFileModel.findOne({
            $or: [{ name }, { link }]
        });

        if (existingSourceFile) {
            const conflictField = existingSourceFile.name === name ? 'name' : 'link';
            throw CustomError.badRequest(`SourceFile ${conflictField} already exists`);
        }

        const sourceFile = await SourceFileModel.create(createSourceFileDto);

        return SourceFileEntity.fromObject(sourceFile);

    }

    async getSourceFiles() {

        const sourceFiles = await SourceFileModel.find();
        if (!sourceFiles.length) throw CustomError.notFound('No source files found.');

        return sourceFiles.map(sourceFile => SourceFileEntity.fromObject(sourceFile));

    }

    async modifySourceFile(modifySourcefileDto: ModifySourceFileDto) {

        const { id } = modifySourcefileDto;

        await checkIfExistsById<SourceFileDocument>(SourceFileModel, id);

        const modifiedSourceFile = await SourceFileModel.findByIdAndUpdate(
            id,
            modifySourcefileDto,
            { new: true }
        );

        if (!modifiedSourceFile) throw CustomError.notFound(`Unable to update sourceFile with id: ${id}`);

        return SourceFileEntity.fromObject(modifiedSourceFile);

    }

    async deleteSourceFile(deleteSourceFileDto: DeleteSourceFileDto) {

        const { sourceFileId } = deleteSourceFileDto;

        const sourceFile = await checkIfExistsById<SourceFileDocument>(SourceFileModel, sourceFileId);

        const isSourceFileReferenced = await isReferencedInModel(PackageModel, 'sourceFiles', sourceFileId);

        if (isSourceFileReferenced) throw CustomError.badRequest(`Can't delete sourceFile with id : ${sourceFileId}. The document exists on a package.`)


        await sourceFile.deleteOne();

    }

}