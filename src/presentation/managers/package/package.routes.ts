import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { PackageController } from './package.controller';
import { PackageService } from '../../services/package.service';
import { ImageService } from '../../services/image.service';
import { FileTypeMiddleware } from '../../middlewares/file-upload.middleware';



export class PackageRoutes {


    static get routes(): Router {

        const router = Router();

        const imageService = new ImageService();
        const packageService = new PackageService(imageService);

        const controller = new PackageController(packageService);

        // Definir las rutas
        router.get('/', [AuthMiddleware.validateJWT], controller.getPackages);
        router.get('/category/:categoryId', controller.getPackagesByCategory);
        router.get('/word/:word', controller.getPackagesByWord);

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin, FileTypeMiddleware.validateExtension], controller.createPackage);

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.modifyPackage);

        return router;
    }


}

