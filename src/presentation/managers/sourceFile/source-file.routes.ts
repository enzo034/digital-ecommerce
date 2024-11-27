import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { SourceFileService } from '../../services/source-file.service';
import { SourceFileController } from './source-file.controller';




export class SourceFileRoutes {


    static get routes(): Router {

        const router = Router();


        const sourceFileService = new SourceFileService();

        const controller = new SourceFileController(sourceFileService);

        // Definir las rutas
        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.createSourceFile);
        router.get('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getSourceFiles);
        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.modifySourceFile);
        router.delete('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.deleteSourceFile);


        return router;
    }


}

