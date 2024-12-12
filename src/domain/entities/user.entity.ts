import { isMongoId } from "../../config/regular-exp";
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
        public role: UserRole = UserRole.USER,
        public packages?: String

    ) { }

    static fromObject(object: { [key: string]: any }): UserEntity {
        
        const { id, email, emailValidated, password, username, role = UserRole.USER, packages } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!isMongoId(id)) throw CustomError.badRequest('Client Id is not a valid Id');

        if (!email) throw CustomError.badRequest('Missing email');
        if (emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
        
        if (!password) throw CustomError.badRequest('Missing password');

        if (!username) throw CustomError.badRequest('Missing username');

        if (!Object.values(UserRole).includes(role)) throw CustomError.badRequest('Invalid role');
        
        if(packages) {
            if (!Array.isArray(packages)) throw CustomError.badRequest('packages should be an array');
        }

        return new UserEntity(id, email, emailValidated, password, username, role, packages);

    }; 

};