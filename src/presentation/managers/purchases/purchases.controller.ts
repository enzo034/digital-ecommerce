import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { EcommerceQueryService, HandleGetEntities } from "../../services/ecommerce-query.service";
import { PurchasesService } from "../../services/purchases.service";
import { CustomError } from "../../../domain";




export class PurchasesController {

    constructor(
        private readonly purchasesService: PurchasesService,
        private readonly ecommerceQueryService: EcommerceQueryService
    ) { }

    //#region Method to help controllers

    private handleGetPackages(handleGetPackages: HandleGetEntities) {

        const { req, res, additionalWhere, urlParameter, isAdmin } = handleGetPackages;

        const [error, paginationDto, orderByParams, priceWhere] = this.ecommerceQueryService.getQueryParams(req);
        if (error) return res.status(400).json({ error });

        const where = {
            ...priceWhere,
            ...additionalWhere
        };

        // Asegurándote de que orderByParams es en el formato correcto [campo, orden]
        this.purchasesService.getPurchasesCommon({
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

    getPurchasesByUser(req: Request, res: Response) {

        const userPackages = req.body.user.packages;

        if(userPackages.length < 1) throw CustomError.notFound('User does not have purchases');

        this.handleGetPackages({req, res, additionalWhere: {packages: {$in: [userPackages]}}, urlParameter: ''})
    }

    getPurchasesByAdmin(req: Request, res: Response) {
        this.handleGetPackages({req, res, additionalWhere: {}, urlParameter: '/admin', isAdmin: true});
    }

}