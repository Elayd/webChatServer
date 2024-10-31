import { z, ZodType } from 'zod'

interface RegistrationUserProps {
    email: string
    password: string
}

const invalid_type_error = 'Check your provided data'
const required_error = 'Field is required'
export const UserRegistrationSchema: ZodType<RegistrationUserProps> = z.object({
    email: z
        .string({ invalid_type_error, required_error })
        .min(1, { message: required_error })
        .email('Email is not valid'),
    password: z.string({ invalid_type_error, required_error }).min(8, 'Password too short')
})
