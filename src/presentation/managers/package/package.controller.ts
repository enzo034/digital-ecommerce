import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { PackageService } from "../../services/package.service";
import { CreatePackageDto } from "../../../domain/dtos/package/create-package.dto";
import { PaginationDto } from "../../../domain/dtos/package/pagination.dto";
import { ModifyPackageDto } from "../../../domain/dtos/package/modify-package.dto";
import { isMongoId } from "../../../config";
import { EcommerceQueryService, HandleGetEntities } from "../../services/ecommerce-query.service";

type SortOrder = 1 | -1;

type QueryParams = {
    page: string;
    limit: string;
    orderBy?: string;
    minPrice?: string;
    maxPrice?: string;
};

export class PackageController {

    //DI
    constructor(
        private readonly packageService: PackageService,
        private readonly ecommerceQueryService: EcommerceQueryService
    ) { }

    //#region Methods to help get controllers

    private handleGetPackages(handleGetPackages: HandleGetEntities) {

        const {req, res, additionalWhere, urlParameter, isAdmin} = handleGetPackages;

        const [error, paginationDto, orderByParams, priceWhere] = this.ecommerceQueryService.getQueryParams(req);
        if (error) return res.status(400).json({ error });

        const where = {
            ...priceWhere,
            ...additionalWhere
        };

        // Asegurándote de que orderByParams es en el formato correcto [campo, orden]
        this.packageService.getPackagesCommon({
            paginationDto: paginationDto!,
            urlParameter: urlParameter,
            where: where,
            orderBy: orderByParams, // Mongoose lo acepta como [string, number][]
            isAdmin
        })
            .then(packages => res.status(200).json({ packages }))
            .catch(error => handleError(res, error));
    }
    //#endregion 

    //#region Get Controllers
    getPackages = (req: Request, res: Response) => {
        this.handleGetPackages({req, res, additionalWhere: {}, urlParameter: ''});
    }

    getPackagesByCategory = (req: Request, res: Response) => {
        const { categoryId } = req.params;
        this.handleGetPackages({req, res, additionalWhere: { categories: { $in: [categoryId] } }, urlParameter: `/category/${categoryId}`});
    }

    getPackagesByWord = (req: Request, res: Response) => {
        const { word } = req.params;
        this.handleGetPackages({req, res, additionalWhere: { name: { $regex: word, $options: 'i' } }, urlParameter: `/word/${word}`});
    }

    getAdminPackages = (req: Request, res: Response) => {
        this.handleGetPackages({req, res, additionalWhere: {}, urlParameter: '/', isAdmin: true});
    };

    getAdminPackagesByCategory = (req: Request, res: Response) => {
        const { categoryId } = req.params;
        this.handleGetPackages({req, res, additionalWhere: { categories: { $in: [categoryId] } }, urlParameter: `/category/${categoryId}`, isAdmin: true});
    };

    getAdminPackagesByWord = (req: Request, res: Response) => {
        const { word } = req.params;
        this.handleGetPackages({req, res, additionalWhere: { name: { $regex: word, $options: 'i' } }, urlParameter: `/word/${word}`, isAdmin: true});
    };

    getPurchasedPackages = (req: Request, res: Response) => {
        const { packages } = req.body.user;

        if (!packages || packages.length === 0) return res.status(400).json({ error: 'No packages purchased.' });

        this.handleGetPackages({req, res, additionalWhere: { _id: { $in: packages } }, urlParameter: `/purchased-packages`, isAdmin: true});
    }

    getPackageById = (req: Request, res: Response) => {
        const { package_id } = req.params;

        if (!isMongoId(package_id)) return res.status(400).json({ error: 'The package id is not a valid id.' });

        this.packageService.getPackageById(package_id)
            .then(pkg => res.status(201).json(pkg))
            .catch(error => handleError(res, error));

    }
    //#endregion

    //#region Create Package
    createPackage = (req: Request, res: Response) => {
        const [error, createPackageDto] = CreatePackageDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.packageService.createPackage(createPackageDto!, req.body.files)
            .then(packageRes => res.status(201).json(packageRes))
            .catch(error => handleError(res, error));
    };
    //#endregion
    
    //#region Modify Package
    modifyPackage = (req: Request, res: Response) => {
        const [error, modifyPackageDto] = ModifyPackageDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.packageService.modifyPackage(modifyPackageDto!)
            .then(resp => res.status(201).json(resp))
            .catch(error => handleError(res, error));
    }
    //#endregion

}