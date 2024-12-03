import multer from 'multer'
import multerS3 from 'multer-s3'
import path from 'path'
import s3 from './aws.js'

const allowedExtensions = ['.jpg', '.jpeg', '.png']

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            const extName = path.extname(file.originalname).toLowerCase()
            if (allowedExtensions.includes(extName)) {
                cb(null, `profile-images/${Date.now()}-${file.originalname}`)
            } else {
                cb(new Error('Extension de fichier non autorisée'), false)
            }
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})

export default upload
