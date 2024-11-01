import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { CategoryService } from '../../services/category.service';
import { CartController } from './cart.controller';
import { CartService } from '../../services/cart.service';




export class CartRoutes {


    static get routes(): Router {

        const router = Router();


        const cartService = new CartService();

        const controller = new CartController(cartService);

        // Definir las rutas
        router.get('/', [AuthMiddleware.validateJWT], controller.getCart);
        router.post('/', [AuthMiddleware.validateJWT], controller.addItemToCart);
        router.delete('/', [AuthMiddleware.validateJWT], controller.deleteItemFromCart);


        return router;
    }


}

