import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data/mongo";
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

        //Check if user exists
        const user = await UserModel.findOne({ email: registerUserDto.email });
        if (user) throw CustomError.badRequest('User already exists');

        // Encrypt the password
        const hashedPassword = bcryptAdapter.hash(registerUserDto.password);

        const { confirmPassword, ...userData } = registerUserDto;

        userData.password = hashedPassword;

        // Create the new user
        const newUser = await UserModel.create(userData);

        // Send confirmation email
        //todo: this.sendEmailValidationLink(newUser.email);

        // Generate token
        const token = await JwtAdapter.generateToken({ id: newUser.id });
        if (!token) throw CustomError.internalServer('Error while creating JWT');

        // Send the data without the password
        const { password, emailValidated , ...userEntity } = UserEntity.fromObject(newUser);

        return {
            user: { userEntity },
            token: token,
        };

    };

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({email: loginUserDto.email});
        if(!user) throw CustomError.badRequest('Invalid email or password');

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

    public validateEmail = async (token: string) => { //todo: ver si es reentable la verificación por mail

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