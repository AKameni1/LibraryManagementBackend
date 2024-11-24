import multer from 'multer'
import path from 'path'

const uploadDirectory = 'assets/images'
const allowedExtensions = ['.jpg', '.jpeg', '.png']

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
        // Générer un nom unique basé sur le timestamp et l'extension du fichier
        const extName = path.extname(file.originalname).toLowerCase()
        if (allowedExtensions.includes(extName)) {
            cb(null, Date.now() + extName)
        } else {
            cb(new Error('Extension de fichier non autorisée'), false)
        }
    },
})

const upload = multer({
    storage: storage,
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