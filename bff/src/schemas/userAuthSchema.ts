import { z, ZodType } from 'zod'

interface AuthUserProps {
    email: string
    password: string
}

const invalid_type_error = 'Check your provided data'
const required_error = 'Field is required'
export const UserAuthSchema: ZodType<AuthUserProps> = z.object({
    email: z
        .string({ invalid_type_error, required_error })
        .min(1, { message: required_error })
        .email('Email is not valid'),
    password: z.string({ invalid_type_error }).min(8, { message: 'Password too short. Minimum length is 8 characters' })
})
