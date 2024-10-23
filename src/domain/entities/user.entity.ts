import { isMongoId } from "../../config";
import { CustomError } from "../errors/custom-error";

export enum UserRole {
    USER = 'USER_ROLE',
    ADMIN = 'ADMIN_ROLE',
}

export class UserEntity {

    constructor(
        public id: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public username: string,
        public role: UserRole = UserRole.USER

    ) { }

    static fromObject(object: { [key: string]: any }): UserEntity {
        const { id, email, emailValidated, password, username, role = UserRole.USER } = object;
        console.log(object);


        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Client Id is not a valid Id');

        if (!email) throw CustomError.badRequest('Missing email');
        if (emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
        
        if (!password) throw CustomError.badRequest('Missing password');

        if (!username) throw CustomError.badRequest('Missing username');

        if (!Object.values(UserRole).includes(role)) throw CustomError.badRequest('Invalid role');
        

        return new UserEntity(id, email, emailValidated, password, username, role);

    }; 

};