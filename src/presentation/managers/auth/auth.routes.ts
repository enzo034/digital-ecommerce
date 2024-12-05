import { Router } from 'express';
import { AuthService } from '../../services/auth.service';
import { AuthController } from './auth.controller';
import { envs } from '../../../config';
import { EmailService } from '../../services/email.service';




export class AuthRoutes {


    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SERCRET_KEY,
            envs.SEND_EMAIL,
        );

        const authService = new AuthService(emailService);

        const controller = new AuthController(authService);

        /**
         * @swagger
         * tags:
         *   name: Auth
         *   description: Authentication router for users
        */

        // Definir las rutas

        /**
         * @swagger
         * /api/auth/login:
         *   post:
         *     tags:
         *       - Auth
         *     summary: Login de usuario
         *     requestBody:
         *       description: Datos para login
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               email:
         *                 type: string
         *                 example: user@example.com
         *               password:
         *                 type: string
         *                 example: 123456
         *     responses:
         *       200:
         *         description: User logged in successfully
         *       400:
         *         description: Invalid email or password (user does not exists)
         *       500:
         *         description: Internal server error
        */

        router.post('/login', controller.loginUser);


        /**
         * @swagger
         * /api/auth/register:
         *   post:
         *     tags:
         *       - Auth
         *     summary: Register a new user
         *     description: Creates a new user account with an email, password, and username.
         *     requestBody:
         *       description: User registration details
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - email
         *               - password
         *               - confirmPassword
         *               - username
         *             properties:
         *               email:
         *                 type: string
         *                 format: email
         *                 example: newuser@example.com
         *                 description: The user's email address.
         *               password:
         *                 type: string
         *                 format: password
         *                 example: MyPassword123!
         *                 description: The user's password (must be 8-20 characters long).
         *               confirmPassword:
         *                 type: string
         *                 format: password
         *                 example: MyPassword123!
         *                 description: Must match the password.
         *               username:
         *                 type: string
         *                 example: NewUser
         *                 description: The username for the account (3-20 characters).
         *     responses:
         *       201:
         *         description: User registered successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: string
         *                       example: 6438bcf4d6a50e2d3c7f3b4a
         *                     username:
         *                       type: string
         *                       example: NewUser
         *                     email:
         *                       type: string
         *                       example: newuser@example.com
         *                 token:
         *                   type: string
         *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
         *       400:
         *         description: Validation error or user already exists
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: User already exists
         *       500:
         *         description: Internal server error
        */

        router.post('/register', controller.registerUser);

        router.use('/validate-email/:token', controller.validateEmail);

        return router;
    }


}

