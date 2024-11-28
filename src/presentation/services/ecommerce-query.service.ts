import { Request, Response } from "express";
import { PaginationDto } from "../../domain/dtos/package/pagination.dto";
import { handleError } from "../../config/handle-error";


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

    

}