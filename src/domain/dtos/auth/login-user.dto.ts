import { regularExps } from "../../../config";



export class LoginUserDto {

    private constructor(
        public email: string,
        public password: string,
        
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginUserDto?] {

        const { email, password } = object;

        if (!email) return ['Missing email'];
        if (!regularExps.email.test(email)) return ['Email is not valid'];
        if (!password) return ['Missing password'];

        if (password.length < 8 && password.length > 20) return ['The password must have at least 8 minimum caracters and 20 maximum caracters'];

        return [undefined, new LoginUserDto(email, password)];

    };

}