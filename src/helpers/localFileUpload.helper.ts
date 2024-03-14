import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


export function fileUpload(field_name: string) {
    return FilesInterceptor(field_name, 1, {
        storage: diskStorage({
            destination: './uploads/blogpost',
            filename: (request, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        })
    });
};