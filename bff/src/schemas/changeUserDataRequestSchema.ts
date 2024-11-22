import mongoose from 'mongoose';
import { z } from 'zod';

const invalid_type_error = 'Check your provided data';
const required_error = 'Field is required';

export const ChangeUserDataRequestSchema = z.object({
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format'
  }),
  firstName: z.string({ invalid_type_error, required_error }).min(1, { message: required_error }),
  secondName: z.string({ invalid_type_error, required_error }).min(1, { message: required_error })
});
