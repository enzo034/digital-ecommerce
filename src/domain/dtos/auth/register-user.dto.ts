import { regularExps } from "../../../config/regular-exp";




export class RegisterUserDto {

    private constructor(
        public email: string,
        public password: string,
        public confirmPassword: string,
        public username: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {

        const { email, password, confirmPassword, username } = object;

        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];
        if (!confirmPassword) return ['Missing confirm password'];

        if (password.length < 8 || password.length > 20) return ['The password must have at least 8 minimum caracters and 20 maximum caracters'];
        
        if(password !== confirmPassword) return ['The password must be equal to the confirm password']

        if (!username) return ['Missing username'];
        if (username.length < 3 || username.length > 20) return ['The username must have at least 3 minimum caracters and 20 maximum caracters'];

        return [undefined, new RegisterUserDto(email, password, confirmPassword, username)];

    };

}