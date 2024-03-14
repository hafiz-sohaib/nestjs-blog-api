export function handleMongoServerError(error: any) {
    let errors = "";

    if (error.code === 11000) {
        Object.keys(error.keyValue).forEach(elem=> {
            errors += `${elem} already exists`
        })
        return errors;
    }
}