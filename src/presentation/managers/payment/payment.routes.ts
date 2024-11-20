import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware'; 
import { PaymentController } from './payment.controller';
import { PaymentService } from '../../services/payment.service';




export class PaymentRoutes {


    static get routes(): Router {

        const router = Router();

        const paymentService = new PaymentService();

        const controller = new PaymentController(paymentService);

        // Definir las rutas
        router.post('/', [AuthMiddleware.validateJWT], controller.createPayment); 

        return router;
    }


}

