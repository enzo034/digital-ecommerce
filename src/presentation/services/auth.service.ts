import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
//import { prisma } from "../../data/postgres";
import { UserEntity } from "../../domain/entities/user.entity";
//import { EmailService } from "./email.service";




export class AuthService {

    //DI
    constructor(
        //private readonly emailService: EmailService
    ) { }

    public async registerUser(registerClientDto: RegisterUserDto) {

        //todo: Verificar si el usuario existe en la base de datos

        try {

            // Hashear la contraseña
            const hashedPassword = await bcryptAdapter.hash(registerClientDto.password);

            //todo: Crear el usuario en la base de datos
            let newUser: any;

            //Enviar mail de confirmación
            //this.sendEmailValidationLink(newUser.email);

            // Generar token JWT
            const token = await JwtAdapter.generateToken({ id: newUser.id });
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            // Eliminar la contraseña del objeto de respuesta
            const { password, ...userEntity } = UserEntity.fromObject(newUser);

            return {
                user: { userEntity },
                token: token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    };

    public async loginUser(loginClientDto: LoginUserDto) {

        try {

            //todo: Verificar existencia del usuario/email en la base de datos
            let user: any;

            const hasMatched = bcryptAdapter.compare(loginClientDto.password, user.password);

            if (!hasMatched) throw CustomError.badRequest('Invalid email or password');

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: { ...userEntity },
                token: token,
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }

    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEB_URL}validate-email/${token}`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        };

        /*const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('Error sending email'); */

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
        /* await prisma.client.update({
            where: { id: user.id },
            data: { emailValidated: true },
        }); */

        // Si la actualización se realiza con éxito, se devuelve true
        return true;
    }

}