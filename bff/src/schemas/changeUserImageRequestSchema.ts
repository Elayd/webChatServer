import mongoose from 'mongoose'
import { z } from 'zod'

export const ChangeUserImageRequestSchema = z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectId format'
    }),
    picture: z.string().url({
        message: 'Invalid URL format for picture'
    })
})
