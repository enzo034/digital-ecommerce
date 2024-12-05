import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { SourceFileService } from '../../services/source-file.service';
import { SourceFileController } from './source-file.controller';




export class SourceFileRoutes {


    static get routes(): Router {

        const router = Router();


        const sourceFileService = new SourceFileService();

        const controller = new SourceFileController(sourceFileService);

        /**
         * @swagger
         * tags:
         *   name: SourceFiles
         *   description: SourceFiles-related routes
        */

        // Definir las rutas

        /**
         * @swagger
         * /sourcefile:
         *   post:
         *     tags: 
         *       - SourceFiles
         *     summary: Create a new source file
         *     description: Creates a new source file, checking for duplicates by name or link.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateSourceFileDto'
         *     responses:
         *       200:
         *         description: Source file created successfully.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SourceFile'
         *       400:
         *         description: Conflict - Source file name or link already exists.
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

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin] ,controller.createSourceFile);

        /**
         * @swagger
         * /sourcefile:
         *   get:
         *     tags: 
         *       - SourceFiles
         *     summary: Get all source files
         *     description: Retrieves a list of all source files.
         *     security:
         *       - BearerAuth: []
         *     responses:
         *       200:
         *         description: List of source files.
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/SourceFile'
         *       404:
         *         description: No source files found.
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

        router.get('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin],controller.getSourceFiles);

        /**
         * @swagger
         * /sourcefile:
         *   put:
         *     tags: 
         *       - SourceFiles
         *     summary: Modify an existing source file
         *     description: Modifies an existing source file based on its ID.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/ModifySourceFileDto'
         *     responses:
         *       200:
         *         description: Source file updated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/SourceFile'
         *       404:
         *         description: Source file not found.
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

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin] ,controller.modifySourceFile);

        /**
         * @swagger
         * /sourcefile:
         *   delete:
         *     tags: 
         *       - SourceFiles
         *     summary: Delete an existing source file
         *     description: Deletes a source file by its ID.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/DeleteSourceFileDto'
         *     responses:
         *       200:
         *         description: Source file deleted successfully.
         *       404:
         *         description: Source file not found.
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

        router.delete('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin] ,controller.deleteSourceFile);
        

        return router;
    }


}

