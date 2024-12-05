import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { PackageController } from './package.controller';
import { PackageService } from '../../services/package.service';
import { ImageService } from '../../services/image.service';
import { FileTypeMiddleware } from '../../middlewares/file-upload.middleware';
import { EcommerceQueryService } from '../../services/ecommerce-query.service';



export class PackageRoutes {


    static get routes(): Router {

        const router = Router();

        const imageService = new ImageService();
        const ecommerceQueryService = new EcommerceQueryService();

        const packageService = new PackageService(imageService, ecommerceQueryService);

        const controller = new PackageController(packageService, ecommerceQueryService);

        /**
         * @swagger
         * tags:
         *   name: Packages
         *   description: Packages management routes
        */

        // Definir las rutas

        /**
         * @swagger
         * /:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get all packages (partial)
         *     description: Retrieve a list of packages with limited information.
         *     responses:
         *       200:
         *         description: A list of packages.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackagePartial'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             timesSold: 100
         *             categories: ["Category ID"]
        */

        router.get('/', [AuthMiddleware.validateJWT], controller.getPackages);

        /**
         * @swagger
         * /category/{categoryId}:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get packages by category (partial)
         *     description: Retrieve a list of packages filtered by category, with limited information.
         *     parameters:
         *       - name: categoryId
         *         in: path
         *         required: true
         *         description: The ID of the category to filter packages by.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A list of packages filtered by category.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackagePartial'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             timesSold: 100
         *             categories: ["Category ID"]
        */

        router.get('/category/:categoryId', controller.getPackagesByCategory);

        /**
         * @swagger
         * /word/{word}:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get packages by search word (partial)
         *     description: Retrieve a list of packages filtered by a search word, with limited information.
         *     parameters:
         *       - name: word
         *         in: path
         *         required: true
         *         description: The word to search for in package names and descriptions.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A list of packages filtered by search word.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackagePartial'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             timesSold: 100
         *             categories: ["Category ID"]
        */

        router.get('/word/:word', controller.getPackagesByWord);

        /**
         * @swagger
         * /admin:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get all admin packages (full)
         *     description: Retrieve a complete list of packages for admins.
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: A list of all packages for admin users.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackageFull'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             sourceFiles: ["SourceFile ID"]
         *             categories: ["Category ID"]
         *             timesSold: 100
        */

        router.get('/admin/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackages);

        /**
         * @swagger
         * /admin/category/{categoryId}:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get admin packages by category (full)
         *     description: Retrieve a complete list of packages for admins, filtered by category.
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - name: categoryId
         *         in: path
         *         required: true
         *         description: The ID of the category to filter packages by.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A list of packages filtered by category for admin users.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackageFull'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             sourceFiles: ["SourceFile ID"]
         *             categories: ["Category ID"]
         *             timesSold: 100
        */

        router.get('/admin/category/:categoryId', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackagesByCategory);

        /**
         * @swagger
         * /admin/word/{word}:
         *   get:
         *     tags: 
         *       - Packages     
         *     summary: Get admin packages by search word (full)
         *     description: Retrieve a complete list of packages for admins, filtered by a search word.
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - name: word
         *         in: path
         *         required: true
         *         description: The word to search for in package names and descriptions.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A list of packages filtered by search word for admin users.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackageFull'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             sourceFiles: ["SourceFile ID"]
         *             categories: ["Category ID"]
         *             timesSold: 100
        */

        router.get('/admin/word/:word', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackagesByWord);

        /**
         * @swagger
         * /purchased-packages:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get purchased packages (full)
         *     description: Retrieve a complete list of purchased packages.
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: A list of purchased packages.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/PackageFull'
         *         example:
         *           - id: "64f1e2dcb7a6c9c73f9e1234"
         *             name: "Premium Package"
         *             previewImage: "https://example.com/preview.jpg"
         *             description: "This package includes exclusive features."
         *             price: 29.99
         *             sourceFiles: ["SourceFile ID"]
         *             categories: ["Category ID"]
         *             timesSold: 100
         *       400:
         *         description: No packages purchased.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.get('/purchased-packages', [AuthMiddleware.validateJWT], controller.getPurchasedPackages);

        /**
         * @swagger
         * /{package_id}:
         *   get:
         *     tags: 
         *       - Packages
         *     summary: Get a specific package by ID (partial)
         *     description: Retrieve a specific package by its ID with limited information.
         *     security:
         *       - BearerAuth: []
         *     parameters:
         *       - name: package_id
         *         in: path
         *         required: true
         *         description: The ID of the package to retrieve.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: A specific package with limited information.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/PackagePartial'
         *         example:
         *           id: "64f1e2dcb7a6c9c73f9e1234"
         *           name: "Premium Package"
         *           previewImage: "https://example.com/preview.jpg"
         *           description: "This package includes exclusive features."
         *           price: 29.99
         *           timesSold: 100
         *           categories: ["Category ID"]
         *       400:
         *         description: Invalid package Id.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
         *       404:
         *         description: Package does not exist or invalid input.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.get('/:package_id', [AuthMiddleware.validateJWT], controller.getPackageById);

        /**
         * @swagger
         * /package:
         *   post:
         *     tags: 
         *       - Packages
         *     summary: Create a new package
         *     description: Create a new package by providing package details and an image.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *               - description
         *               - price
         *               - sourceFiles
         *               - categories
         *             properties:
         *               name:
         *                 type: string
         *                 example: "Premium Package"
         *               description:
         *                 type: string
         *                 example: "This package includes exclusive features."
         *               price:
         *                 type: number
         *                 example: 29.99
         *               sourceFiles:
         *                 type: array
         *                 items:
         *                   type: string
         *                   example: "SourceFile ID"
         *               categories:
         *                 type: array
         *                 items:
         *                   type: string
         *                   example: "Category ID"
         *     responses:
         *       201:
         *         description: The package has been successfully created.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/PackageFull'
         *       400:
         *         description: Package already exists or invalid input.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin, FileTypeMiddleware.validateExtension], controller.createPackage);

        /**
         * @swagger
         * /package:
         *   put:
         *     tags: 
         *       - Packages
         *     summary: Modify an existing package
         *     description: Modify the details of an existing package by providing updated information. This includes updating basic information or replacing the preview image. Requires admin privileges.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - id
         *             properties:
         *               id:
         *                 type: string
         *                 description: The unique identifier of the package to modify.
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *               name:
         *                 type: string
         *                 description: The updated name of the package.
         *                 example: "Premium Package"
         *               description:
         *                 type: string
         *                 description: A brief description of the package.
         *                 example: "This package includes exclusive features."
         *               price:
         *                 type: number
         *                 description: The updated price of the package.
         *                 example: 29.99
         *               sourceFiles:
         *                 type: array
         *                 description: Array of updated source file IDs associated with the package.
         *                 items:
         *                   type: string
         *                   example: "SourceFile ID"
         *               categories:
         *                 type: array
         *                 description: Array of updated category IDs associated with the package.
         *                 items:
         *                   type: string
         *                   example: "Category ID"
         *               previewImage:
         *                 type: string
         *                 format: binary
         *                 description: The updated preview image file for the package.
         *     responses:
         *       200:
         *         description: The package has been successfully updated.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/PackageFull'
         *       400:
         *         description: Package does not exist, invalid input, or unauthorized request.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
         *       500:
         *         description: Internal server error.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin, FileTypeMiddleware.validateExtension], controller.modifyPackage);

        return router;
    }


}

