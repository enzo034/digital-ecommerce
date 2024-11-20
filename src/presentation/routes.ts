import { Router } from 'express';
import { AuthRoutes } from './managers/auth/auth.routes';
import { CategoryRoutes } from './managers/category/category.routes';
import { SourceFileRoutes } from './managers/sourceFile/source-file.routes';
import { PackageRoutes } from './managers/package/package.routes';
import { CartRoutes } from './managers/cart/cart.routes';
import { PaymentRoutes } from './managers/payment/payment.routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Rutas principales
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/category', CategoryRoutes.routes );
    router.use('/api/source-file', SourceFileRoutes.routes );
    router.use('/api/package', PackageRoutes.routes );
    router.use('/api/cart', CartRoutes.routes );
    router.use('/api/payment', PaymentRoutes.routes );

    return router;
  }


}

