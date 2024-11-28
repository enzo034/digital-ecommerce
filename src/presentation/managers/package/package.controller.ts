import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { PackageService } from "../../services/package.service";
import { CreatePackageDto } from "../../../domain/dtos/package/create-package.dto";
import { PaginationDto } from "../../../domain/dtos/package/pagination.dto";
import { ModifyPackageDto } from "../../../domain/dtos/package/modify-package.dto";
import { isMongoId } from "../../../config";

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
        private readonly packageService: PackageService
    ) { }

    //#region Methods to help get controllers
    // Función para parsear el parámetro orderBy en un solo objeto
    private parseOrderBy(orderByQuery: string): [string, SortOrder][] {
        return orderByQuery.split(',').reduce((acc, param) => {
            const [field, order] = param.split(':');
            acc.push([field, order === 'desc' ? -1 : 1]);
            return acc;
        }, [] as [string, SortOrder][]);
    }

    // Función para obtener los parámetros de consulta de la req
    private getQueryParams(req: Request): [null | string, PaginationDto | null, [string, SortOrder][], Record<string, any>] {
        const { page = 1, limit = 10, orderBy, minPrice, maxPrice } = req.query as QueryParams;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return [error, null, [], {}];

        let orderByParams: [string, SortOrder][] = [];
        if (orderBy) {
            orderByParams = this.parseOrderBy(orderBy); // Esto ahora devuelve un arreglo de tuplas
        }

        let where: Record<string, any> = {};
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.$gte = +minPrice;
            if (maxPrice) where.price.$lte = +maxPrice;
        }

        return [null, paginationDto!, orderByParams, where];
    }


    private handleGetPackages(req: Request, res: Response, additionalWhere: Record<string, any>, urlParameter: string, isAdmin: boolean = false) {
        const [error, paginationDto, orderByParams, priceWhere] = this.getQueryParams(req);
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
        this.handleGetPackages(req, res, {}, '/');
    }

    getPackagesByCategory = (req: Request, res: Response) => {
        const { categoryId } = req.params;
        this.handleGetPackages(req, res, { categories: { $in: [categoryId] } }, `/category/${categoryId}`);
    }

    getPackagesByWord = (req: Request, res: Response) => {
        const { word } = req.params;
        this.handleGetPackages(req, res, { name: { $regex: word, $options: 'i' } }, `/word/${word}`);
    }

    getAdminPackages = (req: Request, res: Response) => {
        this.handleGetPackages(req, res, {}, '/', true);
    };

    getAdminPackagesByCategory = (req: Request, res: Response) => {
        const { categoryId } = req.params;
        this.handleGetPackages(req, res, { categories: { $in: [categoryId] } }, `/category/${categoryId}`, true);
    };

    getAdminPackagesByWord = (req: Request, res: Response) => {
        const { word } = req.params;
        this.handleGetPackages(req, res, { name: { $regex: word, $options: 'i' } }, `/word/${word}`, true);
    };

    getPurchasedPackages = (req: Request, res: Response) => {
        const { packages } = req.body.user;

        if (!packages || packages.length === 0) return res.status(400).json({ error: 'No packages purchased.' });

        this.handleGetPackages(req, res, { _id: { $in: packages } }, `/purchased-packages`, true);
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