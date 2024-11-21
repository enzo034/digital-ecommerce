import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";




export class FileTypeMiddleware {

    static validateExtension(req: Request, res: Response, next: NextFunction) {

        const validExtensions: string[] = ['png', 'jpg', 'jpeg'];

        let files: UploadedFile[] = [];

        if (req.files) {

            const fileField = req.files.file;
            if (Array.isArray(fileField)) {
                files = fileField as UploadedFile[];
            } else {
                files = [fileField] as UploadedFile[];
            }

            const fileExtensions = files.map(file => file.mimetype.split('/').at(1)?.toLowerCase() ?? '');

            for (let i = 0; i < fileExtensions.length; i++) {
                if (!validExtensions.includes(fileExtensions[i])) {
                    return res.status(400).json({ error: `File extension ${fileExtensions[i]} is invalid, accepted extensions : ${validExtensions}` });
                }
            }

            req.body.files = files;
        }

        next();

    }

}