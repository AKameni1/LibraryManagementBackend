import multer from 'multer'
import path from 'path'

// const uploadDirectory = 'assets/images'
const allowedExtensions = ['.jpg', '.jpeg', '.png']

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5Mo
    fileFilter: (req, file, cb) => {
        const extName = path.extname(file.originalname).toLowerCase()
        if (allowedExtensions.includes(extName)) {
            return cb(null, true)
        }
        return cb(
            new Error('Le fichier doit être une image (jpg, jpeg, png)'),
            false
        )
    },
})

export default upload
