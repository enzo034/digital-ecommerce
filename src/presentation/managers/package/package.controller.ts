import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { PackageService } from "../../services/package.service";
import { CreatePackageDto } from "../../../domain/dtos/package/create-package.dto";



export class PackageController {

    //DI
    constructor(
        private readonly packageService: PackageService
    ) { }

    createPackage = (req: Request, res: Response) => {
        const [error, createPackageDto] = CreatePackageDto.create(req.body);
        if (error) return res.status(400).json({ error });
    
        this.packageService.createPackage(createPackageDto!)
            .then(packageRes => res.status(201).json(packageRes))
            .catch(error => handleError(res, error));
    };

}