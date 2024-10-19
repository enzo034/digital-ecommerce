import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
//import { prisma } from "../../data/postgres";
import { UserEntity } from "../../domain/entities/user.entity";
import { EmailService } from "./email.service";




export class AuthService {

    //DI
    constructor(
        private readonly emailService: EmailService
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        //todo: Verificar si el usuario existe en la base de datos

        // Hashear la contraseña
        const hashedPassword = await bcryptAdapter.hash(registerUserDto.password);

        console.log(registerUserDto);

        //todo: Crear el usuario en la base de datos
        let newUser: any = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: registerUserDto.email,
            emailValidated: false,
            username: registerUserDto.username,
            password: hashedPassword
        };

        //Enviar mail de confirmación
        this.sendEmailValidationLink(newUser.email);

        // Generar token JWT
        const token = await JwtAdapter.generateToken({ id: newUser.id });
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        // Eliminar la contraseña del objeto de respuesta
        const { password, ...userEntity } = UserEntity.fromObject(newUser);

        return {
            user: { userEntity },
            token: token,
        };

    };

    public async loginUser(loginUserDto: LoginUserDto) {

        //todo: Verificar existencia del usuario/email en la base de datos
        let user: any = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: loginUserDto.email,
            password: "12345"
        };

        const hasMatched = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!hasMatched) throw CustomError.badRequest('Invalid email or password');

        const { password, ...userEntity } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id });
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: { ...userEntity },
            token: token,
        }

    }

    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEB_URL}validate-email/${token}`;
        const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #333;">Validate your email</h1>
                <p>Hello,</p>
                <p>Click on the following link to validate your email and complete the registration process:</p>
                <a href="${link}"  style="color: #0066cc;">Click here to validate your email</a>
                <br><br>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p>Thank you,</p>
                <p><strong>TEST</strong></p>
            </div>
            `;


        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('Error sending email');

        return true;

    }

    public validateEmail = async (token: string) => {

        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer('Email not in token');

        //todo: Check if email exists
        let user: any;

        if (user.emailValidated === true) throw CustomError.badRequest('The email was already validated');

        // todo: Actualizar el campo emailValidated a true


        // Si la actualización se realiza con éxito, se devuelve true
        return true;
    }

}