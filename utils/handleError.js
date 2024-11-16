
// Fonction de gestion des erreurs
export const handleError = (res, message, error) => {
    console.error(error)
    return res.status(500).json({ message, error: error.message })
}