import { Router } from 'express';
import { AuthRoutes } from './managers/auth/auth.routes';
import { CategoryRoutes } from './managers/category/category.routes';
import { SourceFileRoutes } from './managers/sourceFile/source-file.routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas

    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/category', CategoryRoutes.routes );
    router.use('/api/source-file', SourceFileRoutes.routes );



    return router;
  }


}

