import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { applyDecorators, UseInterceptors, BadRequestException } from '@nestjs/common';

export function UploadFileInterceptor(fieldName: string, folder: string) {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    destination: `./uploads/${folder}`,
                    filename: (req, file, callback) => {
                        const ext = path.extname(file.originalname);
                        const filename = `${Date.now()}-${file.originalname}`;
                        callback(null, filename);
                    },
                }),
                limits: {
                    fileSize: 2 * 1024 * 1024, // 2 MB
                },
                fileFilter: (req, file, callback) => {
                    const allowedTypes = ['image/jpeg', 'image/png'];
                    if (!allowedTypes.includes(file.mimetype)) {
                        return callback(new BadRequestException('Only .jpg and .png files are allowed!'), false);
                    }
                    callback(null, true);
                },
            })
        )
    );
}
