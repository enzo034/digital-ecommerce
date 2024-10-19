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

        // Definir las rutas
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.use('/validate-email/:token', controller.validateEmail);

        return router;
    }


}

