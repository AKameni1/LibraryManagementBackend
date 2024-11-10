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