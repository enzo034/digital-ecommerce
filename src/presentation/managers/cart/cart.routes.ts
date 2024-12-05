import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { CategoryService } from '../../services/category.service';
import { CartController } from './cart.controller';
import { CartService } from '../../services/cart.service';




export class CartRoutes {


    static get routes(): Router {

        const router = Router();


        const cartService = new CartService();

        const controller = new CartController(cartService);

        /**
         * @swagger
         * tags:
         *   name: Cart
         *   description: Cart-related routes
        */

        // Definir las rutas

        /**
         * @swagger
         * /api/cart/{userId}:
         *   get:
         *     tags:
         *       - Cart
         *     summary: Retrieve user's cart
         *     parameters:
         *       - in: path
         *         name: userId
         *         required: true
         *         description: ID of the user whose cart is being retrieved
         *         schema:
         *           type: string
         *           example: 64f1e2dcb7a6c9c73f9e1234
         *     responses:
         *       200:
         *         description: User's cart retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: string
         *                   description: ID of the user
         *                   example: 64f1e2dcb7a6c9c73f9e1234
         *                 packages:
         *                   type: array
         *                   description: List of packages in the cart
         *                   items:
         *                     type: object
         *                     properties:
         *                       name:
         *                         type: string
         *                         description: Name of the package
         *                         example: "Premium Photography Package"
         *                       price:
         *                         type: number
         *                         description: Price of the package
         *                         example: 299.99
         *                       description:
         *                         type: string
         *                         description: Details about the package
         *                         example: "Includes 10 edited photos and a 2-hour session"
         *       404:
         *         description: Cart not found
         *       500:
         *         description: Internal server error
        */

        router.get('/', [AuthMiddleware.validateJWT], controller.getCart);

        /**
         * @swagger
         * /api/cart:
         *   post:
         *     tags:
         *       - Cart
         *     summary: Add a package to the user's cart
         *     requestBody:
         *       description: Data required to add a package to the cart
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               userId:
         *                 type: string
         *                 description: ID of the user adding the package
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *               packageId:
         *                 type: string
         *                 description: ID of the package to add
         *                 example: "650d3c7bcf8c5a4d3b0e5678"
         *     responses:
         *       200:
         *         description: Package successfully added to the cart
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 isNew:
         *                   type: boolean
         *                   description: Indicates whether the package was newly added
         *                   example: true
         *                 packageId:
         *                   type: string
         *                   description: ID of the package added to the cart
         *                   example: "650d3c7bcf8c5a4d3b0e5678"
         *       404:
         *         description: Package not found
         *       500:
         *         description: Internal server error
        */

        router.post('/', [AuthMiddleware.validateJWT], controller.addItemToCart);

        /**
         * @swagger
         * /api/cart:
         *   delete:
         *     tags:
         *       - Cart
         *     summary: Remove a package from the user's cart
         *     requestBody:
         *       description: Data required to remove a package from the cart
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               userId:
         *                 type: string
         *                 description: ID of the user whose cart will be updated
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *               packageId:
         *                 type: string
         *                 description: ID of the package to remove from the cart
         *                 example: "650d3c7bcf8c5a4d3b0e5678"
         *     responses:
         *       200:
         *         description: Package successfully removed from the cart
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: string
         *                   description: ID of the user
         *                   example: "64f1e2dcb7a6c9c73f9e1234"
         *                 packages:
         *                   type: array
         *                   description: List of remaining package IDs in the cart
         *                   items:
         *                     type: string
         *                   example: ["650d3c7bcf8c5a4d3b0e5678", "650d3c7bcf8c5a4d3b0e9876"]
         *                 totalPrice:
         *                   type: number
         *                   description: Updated total price of the cart
         *                   example: 50.00
         *       404:
         *         description: Cart or package not found
         *       500:
         *         description: Internal server error
        */

        router.delete('/', [AuthMiddleware.validateJWT], controller.deleteItemFromCart);


        return router;
    }


}

