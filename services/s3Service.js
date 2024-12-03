import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3 from '../config/aws.js'

export const uploadImage = async (key, buffer, contentType) => {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    })
    await s3.send(command)
}

export const getSignedImageUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    })
    return await getSignedUrl(s3, command, { expiresIn: 3600 })
}

export const deleteImage = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    })
    await s3.send(command)
}

// Générer des URLs signées pour plusieurs images
export const getSignedUrlsForDefaults = async (keys) => {
    const signedUrls = await Promise.all(
        keys.map(async (key) => {
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
            })
            return await getSignedUrl(s3, command, { expiresIn: 3600 })
        })
    )
    return signedUrls
}
