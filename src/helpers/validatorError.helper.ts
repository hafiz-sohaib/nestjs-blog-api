export function handleValidationError(error: any, model: any) {
    let errors = "";

    if (error.message.includes(`${model} validation failed`)) {
        Object.values(error.errors).map(({properties}) => {
            errors += `${properties.message}, `;
        })
        return errors;
    }
}