import crypto from 'crypto'
import { NextFunction, Response } from 'express';

export const verifySignature = (req: any, res: Response, next: NextFunction) => {
    const { sign } = req.body;

    if (!sign) {
        return res.status(400).json({ message: 'Missing signature' });
    }

    // Clona el cuerpo original sin la firma para calcular la firma correctamente.
    const data = JSON.parse(req.rawBody);
    delete data.sign;

    try {
        const calculatedSign = crypto.createHash('md5')
            .update(Buffer.from(JSON.stringify(data)).toString('base64') + process.env.API_KEY)
            .digest('hex');

        if (calculatedSign !== sign) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        // Si la firma del webhook es válida, seguir
        next();
    } catch (error) {
        console.error('Error verifying signature:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

