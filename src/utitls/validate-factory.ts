import { ZodIssue, ZodType, z } from "zod";

export type FieldValidation<T> = {
    field: keyof T,
    message: string
}

export const createSchema = <T>(fieldValidation: FieldValidation<T>[]) => {
    const schemaObject: Record<keyof T, ZodType<any, any, any>> = {} as Record<keyof T, ZodType<any, any, any>>;
    fieldValidation.forEach(({ field, message }) => {
        schemaObject[field] = z.string().refine((value) => value.trim() !== "", { message })
    });
    return z.object(schemaObject);
};

export const convertorErrors = (errors: ZodIssue[]) => {
    const convertedErrors = errors.reduce((acc, error) => {
        const key = error.path.join(".");
        const value = {
            type: error.code,
            message: error.message,
        };
        return { ...acc, [key]: value };
    }, {})
    return convertedErrors;
}

export const resolver = <T extends z.Schema>(schema: T, values: Record<string, any>) => {
    const validationResult = schema.safeParse(values);

    if (validationResult.success) {
        return {
            values: validationResult.data,
            errors: {},
        };
    } else {
        const error = validationResult.error.issues;
        return {
            values,
            errors: convertorErrors(error)
        };
    }
};

