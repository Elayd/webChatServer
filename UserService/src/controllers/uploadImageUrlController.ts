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
        accessKeyId: 'edfaa1304e5b466aaaef3d635e0e757a',
        secretAccessKey: '62aef3840537421cae2658b03c9d78a5'
    },
    endpoint: 'https://webchatapp.s3.ru-1.storage.selcloud.ru',
    forcePathStyle: true,
    region: 'ru-1',
    apiVersion: 'latest'
})

export const uploadImageUrlController = async (req: UploadImageRequest, res: Response, next: NextFunction) => {
    const { userId, fileType } = req.query
    const type = fileType.split('/')[1]
    const key = `${userId}/${uuidv4()}.${type}`

    const s3Params = {
        Bucket: 'webchatapp',
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
