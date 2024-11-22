import mongoose from 'mongoose';
import { z } from 'zod';

export const GetUserInfoRequestSchema = z.object({
  userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid MongoDB ObjectId format'
  })
});
