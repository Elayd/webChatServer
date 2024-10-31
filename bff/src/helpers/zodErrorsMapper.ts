interface FormErrors {
    [key: string]: string[] | undefined
}

interface MappedErrors {
    [key: string]: string
}
export const zodErrorsMapper = <T extends string>(formErrors: FormErrors): Record<T, string> => {
    const errorsObject: MappedErrors = {}

    for (const [key, value] of Object.entries(formErrors)) {
        if (Array.isArray(value) && value.length > 0) {
            errorsObject[key as T] = value[0]
        }
    }
    return errorsObject as Record<T, string>
}
