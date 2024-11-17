import { body } from 'express-validator'

// Validations pour la création d'un nouvel utilisateur
export const validateCreateUser = [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').isEmail().withMessage('L\'email est invalide,'),
    body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères.')
]

// Validations pour l'authentification
export const validateAuth = [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').optional().isEmail().withMessage('L\'email est invalide,'),
    // body('password').isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères')
]

// Validations pour la mise à jour d'un utilisateur
export const validateUpdateUser = [
    body('username').optional().notEmpty().withMessage('Le nom d\'utilisateur est requis.'),
    body('email').optional().isEmail().withMessage('L\'email est invalide,'),
    body('password').optional().isLength({ min: 12 }).withMessage('Le mot de passe doit contenir au 12 caractères.'),
]

// Validation du statut d'activation d'un utilisateur
export const validateActivationUser = [
    body('isActive').isBoolean().withMessage('Le champ \'isActive\' doit être un booléen (true ou false).')
]

// Validation du rôle utilisateur
export const validateUserRole = [
    body('roleId').notEmpty().withMessage('roleId est requis.')
]

// Validation d'une permission existante
export const validatePermission = [
    body('permissionId').notEmpty().withMessage('permissionId est requis')
]

// Validations pour la création d'une nouvelle permission
export const validateCreatePermission = [
    body('name').notEmpty().withMessage('Le nom de la permission est requis.'),
    body('description').notEmpty().withMessage('La description de la permission est requis.')
]

// Validations pour la mise à jour d'une permission
export const validateUpdatePermission = [
    body('name').optional().notEmpty().withMessage('Le nom de la permission est requis.'),
    body('description').optional().notEmpty().withMessage('La description de la permission est requis.')
]

// Validations pour la création d'un rapport
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

// Validations pour la mise à jour d'un rapport
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