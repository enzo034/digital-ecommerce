import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { SourceFileService } from "../../services/source-file.service";
import { CreateSourceFileDto } from "../../../domain/dtos/sourceFile/create-source-file.dto";
import { DeleteSourceFileDto } from "../../../domain/dtos/sourceFile/delete-source-file.dto";
import { ModifySourceFileDto } from "../../../domain/dtos/sourceFile/modify-source-file.dto";



export class SourceFileController {

    //DI
    constructor(
        private readonly sourceFileService: SourceFileService
    ) { }

    createSourceFile = (req: Request, res: Response) => {
        const [error, createSourceFileDto] = CreateSourceFileDto.create(req.body);
        if (error) return res.status(400).json({ error });
    
        this.sourceFileService.createSourceFile(createSourceFileDto!)
            .then(sourceFile => res.status(201).json(sourceFile))
            .catch(error => handleError(res, error));
    };

    getSourceFiles = (req: Request, res: Response) => {

        this.sourceFileService.getSourceFiles()
            .then(sourceFiles => res.json({ sourceFiles }))
            .catch(error => handleError(res, error));

    };
    
    modifySourceFile = (req: Request, res: Response) => {

        const [error, modifySourceFileDto] = ModifySourceFileDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.sourceFileService.modifySourceFile(modifySourceFileDto!)
            .then(sourceFile => res.json({ sourceFile }))
            .catch(error => handleError(res, error));

    };

    deleteSourceFile = (req: Request, res: Response) => {

        const [error, deleteSourceFileDto] = DeleteSourceFileDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.sourceFileService.deleteSourceFile(deleteSourceFileDto!)
            .then(() => res.sendStatus(204))
            .catch(error => handleError(res, error));

    };
}