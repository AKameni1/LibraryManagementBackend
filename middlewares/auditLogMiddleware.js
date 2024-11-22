import { logAction } from '../controllers/auditLogController.js'

export const auditLogMiddleware = (action) => async (req, res, next) => {
    try {
        // Récupération de l'ID utilisateur, utilisation de 0 par défaut pour les actions système
        const userId =
            req.user && typeof req.user.userId === 'number'
                ? req.user.userId
                : null

        // Construction des détails à enregistrer
        const details = {
            body: req.body || null, // Enregistre le body uniquement s'il est présent
            params: req.params || null,
            query: req.query || null,
            method: req.method,
            ip: req.ip,
            headers: req.headers
                ? {
                      // On extrait uniquement les en-têtes pertinents pour éviter de surcharger les logs
                      'user-agent': req.headers['user-agent'],
                      host: req.headers['host'],
                  }
                : null,
        }

        // Enregistrement du log d'audit
        await logAction(userId, `${req.baseUrl}${req.path}`, action, details)

        // Passage au middleware suivant
        next()
    } catch (error) {
        console.error(
            `Erreur lors de l'enregistrement de l'audit log: ${error.message}`
        )
        // On passe l'erreur au middleware suivant pour une gestion appropriée
        next(error)
    }
}
