import { body } from 'express-validator'


export const validateCreateUser = [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').isEmail().withMessage('L\'email est invalide,'),
    body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères.')
]

export const validateAuth = [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').optional().isEmail().withMessage('L\'email est invalide,'),
    // body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères')
]

export const validateUpdateUser = [
    body('username').optional().notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').optional().isEmail().withMessage('L\'email est invalide,'),
    body('password').optional().isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères.'),
]

export const validateActivationUser = [
    body('isActive').isBoolean().withMessage('Le champ \'isActive\' doit être un booléen (true ou false).')
]

export const validateUserRole = [
    body('roleId').notEmpty().withMessage('roleId est requis.')
]

export const validatePermission = [
    body('permissionId').notEmpty().withMessage('permissionId est requis')
]

export const validateCreatePermission = [
    body('name').notEmpty().withMessage('Le nom de la permission est requis.'),
    body('description').notEmpty().withMessage('La description de la permission est requis.')
]

export const validateUpdatePermission = [
    body('name').optional().notEmpty().withMessage('Le nom de la permission est requis.'),
    body('description').optional().notEmpty().withMessage('La description de la permission est requis.')
]
export const validateCreateReport = [
    body('title')
        .notEmpty()
        .withMessage('Report title is required'),
    body('reportType')
        .isIn(['User Activity', 'Usage Stats', 'Error Log', 'Custom'])
        .withMessage('Invalid report type'),
    body('parameters')
        .optional()
        .isArray()
        .withMessage('Parameters must be an array')
]
// FAQ Validations
export const validateCreateFAQ = [
    body('question')
        .notEmpty().withMessage('La question est requise.')
        .isLength({ min: 10 }).withMessage('La question doit contenir au moins 10 caractères.'),
    body('answer')
        .notEmpty().withMessage('La réponse est requise.')
        .isLength({ min: 10 }).withMessage('La réponse doit contenir au moins 10 caractères.')
]

export const validateUpdateFAQ = [
    body('question')
        .optional()
        .notEmpty().withMessage('La question est requise.')
        .isLength({ min: 10 }).withMessage('La question doit contenir au moins 10 caractères.'),
    body('answer')
        .optional()
        .notEmpty().withMessage('La réponse est requise.')
        .isLength({ min: 10 }).withMessage('La réponse doit contenir au moins 10 caractères.')
]

// Support Ticket Validations
export const validateCreateTicket = [
    body('subject')
        .notEmpty().withMessage('Le sujet est requis.')
        .isLength({ min: 5, max: 255 }).withMessage('Le sujet doit contenir entre 5 et 255 caractères.'),
    body('description')
        .notEmpty().withMessage('La description est requise.')
        .isLength({ min: 20 }).withMessage('La description doit contenir au moins 20 caractères.')
]

export const validateUpdateTicketStatus = [
    body('status')
        .notEmpty().withMessage('Le statut est requis.')
        .isIn(['Open', 'In Progress', 'Closed']).withMessage('Statut invalide.')
]

// Ticket Response Validations
export const validateCreateResponse = [
    body('responseText')
        .notEmpty().withMessage('La réponse est requise.')
        .isLength({ min: 10 }).withMessage('La réponse doit contenir au moins 10 caractères.')
]

export const validateUpdateResponse = [
    body('responseText')
        .notEmpty().withMessage('La réponse est requise.')
        .isLength({ min: 10 }).withMessage('La réponse doit contenir au moins 10 caractères.')
]
export const validateUpdateReport = [
    body('title')
        .optional()
        .notEmpty()
        .withMessage('Report title cannot be empty'),
    body('reportType')
        .optional()
        .isIn(['User Activity', 'Usage Stats', 'Error Log', 'Custom'])
        .withMessage('Invalid report type'),
    body('parameters')
        .optional()
        .isArray()
        .withMessage('Parameters must be an array'),
    body('parameters.*.name')
        .optional()
        .notEmpty()
        .withMessage('Parameter name is required'),
    body('parameters.*.value')
        .optional()
        .notEmpty()
        .withMessage('Parameter value is required')
]