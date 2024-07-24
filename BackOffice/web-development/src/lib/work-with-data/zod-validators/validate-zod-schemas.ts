
type ValidationResult= { validatedSchema: any; errors: any };
export function validateSchema(data: FormData, schema: any): ValidationResult {

    const validatedSchema = schema.safeParse(data)

    if (!validatedSchema.success) {
        const {errors} = validatedSchema.error;
        return {
            validatedSchema,
            errors,
        };
    }

    return {
        validatedSchema,
        errors: null,
    };
}