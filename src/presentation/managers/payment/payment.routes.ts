import { Router } from 'express';
import { AuthMiddleware } from '../../middlewares/auth.middleware'; 
import { PaymentController } from './payment.controller';
import { PaymentService } from '../../services/payment.service';




export class PaymentRoutes {


    static get routes(): Router {

        const router = Router();

        const paymentService = new PaymentService();

        const controller = new PaymentController(paymentService);

        /**
         * @swagger
         * tags:
         *   name: Payment
         *   description: Payment management routes
        */

        // Definir las rutas

        /**
         * @swagger
         * /payment:
         *   post:
         *     tags:
         *       - Payment
         *     summary: Create a new payment
         *     description: Creates a payment by first checking the cart status and then generating a payment link.
         *     security:
         *       - BearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - userId
         *             properties:
         *               userId:
         *                 type: string
         *                 example: "64f1e2dcb7a6c9c73f9e1234"
         *     responses:
         *       200:
         *         description: Payment link generated successfully.
         *         content:
         *           application/json:
         *             schema:
         *               type: string
         *               example: "https://paymentgateway.com/xyz123"
         *       400:
         *         description: Invalid cart status or cart is empty.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
         *       500:
         *         description: Internal server error during order creation or payment link generation.
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ErrorResponse'
        */

        router.post('/', [AuthMiddleware.validateJWT], controller.createPayment); 

        return router;
    }


}

