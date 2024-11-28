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
        
        const packageService = new PackageService(imageService);
        const ecommerceQueryService = new EcommerceQueryService();
        
        const controller = new PackageController(packageService, ecommerceQueryService);

        // Definir las rutas
        router.get('/', [AuthMiddleware.validateJWT], controller.getPackages);
        router.get('/category/:categoryId', controller.getPackagesByCategory);
        router.get('/word/:word', controller.getPackagesByWord);

        router.get('/admin/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackages);
        router.get('/admin/category/:categoryId', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackagesByCategory);
        router.get('/admin/word/:word', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.getAdminPackagesByWord);

        router.get('/purchased-packages', [AuthMiddleware.validateJWT], controller.getPurchasedPackages);

        router.get('/:package_id', [AuthMiddleware.validateJWT], controller.getPackageById);

        router.post('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin, FileTypeMiddleware.validateExtension], controller.createPackage);

        router.put('/', [AuthMiddleware.validateJWT, AuthMiddleware.isAdmin], controller.modifyPackage);

        return router;
    }


}

