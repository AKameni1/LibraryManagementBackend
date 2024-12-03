import multer from 'multer'
import path from 'path'
import sharp from 'sharp'

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

export const compressImage = async (buffer) => {
    try {
        return await sharp(buffer)
            .resize(500, 500, { fit: sharp.fit.cover })
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
    } catch (error) {
        throw new Error("Erreur lors de la compression de l'image.")
    }
}

export default upload
