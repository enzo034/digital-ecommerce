import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { PackageController } from './package.controller';
import { PackageService } from '../../services/package.service';



export class PackageRoutes {


    static get routes(): Router {

        const router = Router();


        const packageService = new PackageService();

        const controller = new PackageController(packageService);

        // Definir las rutas
        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin] ,controller.createPackage);
        

        return router;
    }


}

