import { checkIfExistsById, isReferencedInModel } from "../../config/document-helper";
import { PackageModel } from "../../data/mongo/models/package.model";
import { SourceFileDocument, SourceFileModel } from "../../data/mongo/models/source-file.model";
import { CreateSourceFileDto } from "../../domain/dtos/sourceFile/create-source-file.dto";
import { DeleteSourceFileDto } from "../../domain/dtos/sourceFile/delete-source-file.dto";
import { ModifySourceFileDto } from "../../domain/dtos/sourceFile/modify-source-file.dto";
import { SourceFileEntity } from "../../domain/entities/source-file.entity";
import { CustomError } from "../../domain/errors/custom-error";





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