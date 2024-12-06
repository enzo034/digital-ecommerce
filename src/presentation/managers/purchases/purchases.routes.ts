import { Router } from "express";
import { PurchasesService } from "../../services/purchases.service";
import { EcommerceQueryService } from "../../services/ecommerce-query.service";
import { PurchasesController } from "./purchases.controller";
import { AuthMiddleware } from "../../middlewares/auth.middleware";




export class PurchasesRoutes {

    static get routes(): Router {

        const router = Router();

        const ecommerceQueryService = new EcommerceQueryService();
        const purchasesService = new PurchasesService(ecommerceQueryService);

        const controller = new PurchasesController(purchasesService, ecommerceQueryService);

        //Definir las rutas

        /**
         * @swagger
         * /purchases:
         *   get:
         *     summary: Retrieve purchases for the authenticated user.
         *     description: >
         *       Returns a list of packages purchased by the authenticated user.
         *     tags:
         *       - Purchases
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 1
         *         description: Page number for pagination.
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           example: 10
         *         description: Number of items per page.
         *       - in: query
         *         name: orderBy
         *         schema:
         *           type: string
         *           example: "price,asc"
         *         description: >
         *           Sort order for the results. Format: "field,order".
         *     responses:
         *       200:
         *         description: A list of purchased packages.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 packages:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/PackagePartial'
         *       400:
         *         description: Invalid input or query parameters.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
         *       404:
         *         description: The user has no purchases.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.get('/', [AuthMiddleware.validateJWT], controller.getPurchasesByUser);

        /**
         * @swagger
         * /purchases/admin:
         *   get:
         *     summary: Retrieve all purchases (admin only).
         *     description: >
         *       Returns a list of all purchases made by users. Requires admin privileges.
         *     tags:
         *       - Purchases
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *           example: 1
         *         description: Page number for pagination.
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           example: 10
         *         description: Number of items per page.
         *       - in: query
         *         name: orderBy
         *         schema:
         *           type: string
         *           example: "price,asc"
         *         description: >
         *           Sort order for the results. Format: "field,order".
         *     responses:
         *       200:
         *         description: A list of all purchases.
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 packages:
         *                   type: array
         *                   items:
         *                     $ref: '#/components/schemas/PackageFull'
         *       400:
         *         description: Invalid input or query parameters.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
         *       403:
         *         description: Access forbidden for non-admin users.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.get('/admin', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getPurchasesByAdmin);

        return router;

    }

}