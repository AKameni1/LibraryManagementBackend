// utils/handleError.js

// Fonction utilitaire pour gérer les erreurs de manière standardisée
export const handleError = (res, message, error) => {
    console.error(error);
    return res.status(500).json({
        message: message,
        error: error.message || 'Une erreur est survenue'
    });
};