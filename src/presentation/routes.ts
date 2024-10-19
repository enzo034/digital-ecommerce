import { Router } from 'express';
import { AuthRoutes } from './managers/auth/auth.routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas

    router.use('/api', AuthRoutes.routes );



    return router;
  }


}

