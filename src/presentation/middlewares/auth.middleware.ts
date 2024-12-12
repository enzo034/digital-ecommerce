import { NextFunction, Request, Response } from "express";
import { UserEntity } from "../../domain/entities/user.entity";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data/mongo/models/user.model";




export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {

        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' });

        const token = authorization.split(' ').at(1) || '';


        try {

            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' })

            const user = await UserModel.findById(payload.id);
            if (!user) return res.status(401).json({ error: 'Invalid token - user' });

            req.body.user = UserEntity.fromObject(user);

            next();

        } catch (error) {

            console.log(error);
            res.status(500).json({ error: 'Internal server error' });

        }

    }

    static async isAdmin(req: Request, res: Response, next: NextFunction) {
        const user = req.body.user;
        
        if (user.role !== 'ADMIN_ROLE') {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    }

}