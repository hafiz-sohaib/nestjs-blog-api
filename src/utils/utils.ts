import slugify from "slugify"
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


export function handleValidationError(error: any, model: any) {
    let errors = "";

    if (error.message.includes(`${model} validation failed`)) {
        Object.values(error.errors).map(({properties}) => {
            errors += `${properties.message}, `;
        })
        return errors;
    }
}


export function handleMongoServerError(error: any) {
    let errors = "";

    if (error.code === 11000) {
        Object.keys(error.keyValue).forEach(elem=> {
            errors += `${elem} already exists`
        })
        return errors;
    }
}


export async function slugGenerator(title: string, model: any) {
    const slug = slugify(title, { lower: true });
    const existingSlug = await model.findOne({ slug });
    let finalSlug = slug;

    if (existingSlug) {
        const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        finalSlug = `${slug}-${suffix}`;
    }

    return finalSlug;
}


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