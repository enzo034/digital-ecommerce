import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { PackageService } from "../../services/package.service";
import { CreatePackageDto } from "../../../domain/dtos/package/create-package.dto";
import { PaginationDto } from "../../../domain/dtos/package/pagination.dto";

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


    private handleGetProducts(req: Request, res: Response, additionalWhere: Record<string, any>, urlParameter: string) {
        const [error, paginationDto, orderByParams, priceWhere] = this.getQueryParams(req);
        if (error) return res.status(400).json({ error });

        const where = {
            ...priceWhere,
            ...additionalWhere
        };

        // Asegurándote de que orderByParams es en el formato correcto [campo, orden]
        this.packageService.getProductsCommon({
            paginationDto: paginationDto!,
            urlParameter: urlParameter,
            where: where,
            orderBy: orderByParams, // Mongoose lo acepta como [string, number][]
        })
            .then(products => res.status(200).json({ products }))
            .catch(error => handleError(res, error));
    }

    getProducts = (req: Request, res: Response) => {
        this.handleGetProducts(req, res, {}, '/');
    }

    createPackage = (req: Request, res: Response) => {
        const [error, createPackageDto] = CreatePackageDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.packageService.createPackage(createPackageDto!)
            .then(packageRes => res.status(201).json(packageRes))
            .catch(error => handleError(res, error));
    };

}