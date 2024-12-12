import { Request, Response } from "express";
import { handleError } from "../../../config/handle-error";
import { AuthService } from "../../services/auth.service";
import { RegisterUserDto } from "../../../domain/dtos/auth/register-user.dto";
import { LoginUserDto } from "../../../domain/dtos/auth/login-user.dto";



export class AuthController {

    //DI
    constructor(
        public readonly authService: AuthService,
    ) { }

    registerUser = (req: Request, res: Response) => {

        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.registerUser(registerDto!)
            .then(user => res.json(user))
            .catch(error => handleError(res, error));

    };

    loginUser = (req: Request, res: Response) => {

        const [error, loginDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.loginUser(loginDto!)
            .then(user => res.json({ user }))
            .catch(error => handleError(res, error));

    };

    validateEmail = (req: Request, res: Response) => {

        const { token } = req.params;

        this.authService.validateEmail(token)
            .then(() => res.json('Email was validated properly'))
            .catch(error => handleError(res, error));

    };

}