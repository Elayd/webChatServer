import { NextFunction, Request, Response } from 'express'
import { PutObjectCommand, S3 } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import HttpStatusCode from '../enums/httpStatusCodes'
import { AppError } from '../helpers/errorHandler'

interface UploadImageRequest extends Request {
    query: {
        userId: string
        fileType: string
    }
}

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    },
    endpoint: process.env.AWS_BUCKET_URL!,
    forcePathStyle: true,
    region: process.env.AWS_REGION!,
    apiVersion: 'latest'
})

export const uploadImageUrlController = async (req: UploadImageRequest, res: Response, next: NextFunction) => {
    const { userId, fileType } = req.query
    const type = fileType.split('/')[1]
    const key = `${userId}/${uuidv4()}.${type}`

    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ContentType: fileType
    }

    const command = new PutObjectCommand(s3Params)

    await getSignedUrl(s3, command)
        .then((signature) => {
            res.status(HttpStatusCode.CREATED).json({ url: signature, key })
        })
        .catch(() => {
            return next(
                new AppError(
                    'INTERNAL_SERVER_ERROR',
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    'FAILED TO UPLOAD IMAGE',
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    true
                )
            )
        })
}
