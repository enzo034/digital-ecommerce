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
        router.get('/', [AuthMiddleware.validateJWT], controller.getPackages);
        router.get('/category/:categoryId', controller.getPackagesByCategory);
        router.get('/word/:word', controller.getPackagesByWord);

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.createPackage);

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.modifyPackage);

        return router;
    }


}

