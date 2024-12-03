import express from 'express'
import multerS3 from '../config/multerS3.js'
import { DefaultImages } from '../config/defaultImages.js'
import {
    deleteImage,
    getSignedImageUrl,
    getSignedUrlsForDefaults,
} from '../services/s3Service.js'

const router = express.Router()

// Upload une image
router.post('/upload', multerS3.single('image'), async (req, res) => {
    try {
        // Vérifier si un fichier a été téléchargé
        if (!req.file) {
            return res.status(400).json({
                message:
                    "Aucun fichier n'a été téléchargé. Veuillez fournir une image valide.",
            })
        }
        const key = req.file.key
        const signedUrl = await getSignedImageUrl(key)
        res.status(200).json({
            message: 'Image uploadée avec succès.',
            url: signedUrl,
        })
    } catch (error) {
        res.status(500).json({
            message: "Échec de l'upload.",
            error: error.message,
        })
    }
})

// Supprimer une image
router.delete('/delete/:key', async (req, res) => {
    try {
        const { key } = req.params
        await deleteImage(key)
        res.status(200).json({ message: 'Image supprimée avec succès.' })
    } catch (error) {
        res.status(500).json({
            message: 'Échec de la suppression.',
            error: error.message,
        })
    }
})

router.get('/default-images', async (req, res) => {
    try {
        const keys = Object.values(DefaultImages)
        const signedUrls = await getSignedUrlsForDefaults(keys)
        res.json({ defaultImages: signedUrls })
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des images.',
        })
    }
})

export default router
