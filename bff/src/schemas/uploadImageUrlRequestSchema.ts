import mongoose from 'mongoose'
import { z } from 'zod'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const UploadImageUrlRequestSchema = z.object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid MongoDB ObjectId format'
    }),
    fileType: z
        .string()
        .refine(
            (type) => ACCEPTED_IMAGE_TYPES.includes(type),
            'Only .jpg, .jpeg, .png and .webp formats are supported.'
        )
})
