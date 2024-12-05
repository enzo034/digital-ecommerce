import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { CategoryService } from '../../services/category.service';
import { CategoryController } from './category.controller';




export class CategoryRoutes {


    static get routes(): Router {

        const router = Router();


        const categoryService = new CategoryService();

        const controller = new CategoryController(categoryService);

        /**
         * @swagger
         * tags:
         *   name: Categories
         *   description: Category management routes
        */

        // Definir las rutas

        /**
         * @swagger
         * /api/categories:
         *   post:
         *     tags:
         *       - Categories
         *     summary: Create a new category
         *     requestBody:
         *       description: Data for creating a new category
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               name:
         *                 type: string
         *                 description: Name of the category
         *                 example: "Electronics"
         *     responses:
         *       201:
         *         description: Category created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                   description: Unique identifier of the category
         *                   example: "64f1e2dcb7a6c9c73f9e1234"
         *                 name:
         *                   type: string
         *                   description: Name of the category
         *                   example: "Electronics"
         *       400:
         *         description: Invalid input
         *       500:
         *         description: Internal server error
        */

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.createCategory);

        /**
         * @swagger
         * /api/categories:
         *   get:
         *     tags:
         *       - Categories
         *     summary: Get all categories
         *     responses:
         *       200:
         *         description: List of categories
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 categories:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: string
         *                         description: Unique identifier of the category
         *                         example: "64f1e2dcb7a6c9c73f9e1234"
         *                       name:
         *                         type: string
         *                         description: Name of the category
         *                         example: "Electronics"
         *       500:
         *         description: Internal server error
        */

        router.get('/', controller.getCategories);

        /**
         * @swagger
         * /api/categories/popular-categories:
         *   get:
         *     tags:
         *       - Categories
         *     summary: Get popular categories
         *     responses:
         *       200:
         *         description: List of popular categories
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 categories:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: string
         *                         description: Unique identifier of the category
         *                         example: "64f1e2dcb7a6c9c73f9e1234"
         *                       name:
         *                         type: string
         *                         description: Name of the category
         *                         example: "Electronics"
         *       500:
         *         description: Internal server error
        */

        router.get('/popular-categories', controller.getPopularCategories);

        /**
         * @swagger
         * /api/categories:
         *   put:
         *     tags:
         *       - Categories
         *     summary: Modify a category
         *     requestBody:
         *       description: Data for modifying a category
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *                 description: ID of the category to modify
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *               name:
         *                 type: string
         *                 description: Updated name of the category
         *                 example: "Home Appliances"
         *     responses:
         *       200:
         *         description: Category modified successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 id:
         *                   type: string
         *                   description: Unique identifier of the category
         *                   example: "64f1e2dcb7a6c9c73f9e1234"
         *                 name:
         *                   type: string
         *                   description: Name of the category
         *                   example: "Home Appliances"
         *       400:
         *         description: Invalid input
         *       500:
         *         description: Internal server error
        */

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.modifyCategory);

        /**
         * @swagger
         * /api/categories:
         *   delete:
         *     tags:
         *       - Categories
         *     summary: Delete a category
         *     requestBody:
         *       description: Data for deleting a category
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               id:
         *                 type: string
         *                 description: ID of the category to delete
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *     responses:
         *       204:
         *         description: Category deleted successfully
         *       400:
         *         description: Invalid input
         *       500:
         *         description: Internal server error
        */

        router.delete('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.deleteCategory);


        return router;
    }


}

