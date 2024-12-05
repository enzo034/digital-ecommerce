import { Request, Response } from "express";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { PackageOptions } from "./package.service";
import { getNextPageUrl, getPreviousPageUrl } from "../../config/pagination-helper";
import { Model } from "mongoose";
import { parseEntities } from "../../domain/entities/Ientity";
import { countDocuments } from "../../config/document-helper";


type SortOrder = 1 | -1;

type QueryParams = {
    page: string;
    limit: string;
    orderBy?: string;
    minPrice?: string;
    maxPrice?: string;
};

export interface HandleGetEntities { // Interfaz que se debe aplicar al handler de cada controlador con paginación
    req: Request; // Request de express
    res: Response; // Response de express
    additionalWhere: Record<string, any>; // Filtros adicionales para la consulta
    urlParameter: string; // Parámetro de URL ej: '', '/category' , `/word/${word}`
    isAdmin?: boolean; // Indica si es una solicitud de un administrador, deberia tener valor por defecto : False
}


export class EcommerceQueryService {

    // Función para parsear el parámetro orderBy en un solo objeto
    private parseOrderBy(orderByQuery: string): [string, SortOrder][] {
        return orderByQuery.split(',').reduce((acc, param) => {
            const [field, order] = param.split(':');
            acc.push([field, order === 'desc' ? -1 : 1]);
            return acc;
        }, [] as [string, SortOrder][]);
    }

    // Función para obtener los parámetros de consulta de la req
    getQueryParams(req: Request): [null | string, PaginationDto | null, [string, SortOrder][], Record<string, any>] {
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

    async getResourcesCommon<T>(
        model: Model<T>,
        entity: any,
        fetchFunction: (...args: any[]) => Promise<any[]>,// Tipo de fetchFunctions para que reciba cualquier parametro
        options: PackageOptions
    ) {
        // Extraemos los valores necesarios de `options`
        const { paginationDto, orderBy, urlParameter = '/', where = {}, isAdmin = false } = options;
        const { page, limit } = paginationDto;
    
        const total = await countDocuments(model, where);

        // Llamamos a `fetchFunction` pasando los argumentos correctos
        const results = await fetchFunction(where, page, limit, orderBy, isAdmin);

        const parsedResults = parseEntities(entity, results);

        return {
            page,
            limit,
            total,
            next: getNextPageUrl(page, limit, total, urlParameter),
            prev: getPreviousPageUrl(page, limit, urlParameter),
            results: parsedResults,
        };
    }
    

}