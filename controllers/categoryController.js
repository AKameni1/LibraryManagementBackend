import { Category, Book } from '../models/index.js'
import { handleError } from '../utils/handleError.js'

// Obtenir la liste de toutes les catégories
export const getAllCategories = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: categories, count: total } =
            await Category.findAndCountAll({
                limit: limit,
                offset: offset,
            })

        res.status(200).json({
            total: total, // Nombre total de catégories
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            categories: categories, // Liste des catégories pour cette page
        })
    } catch (error) {
        handleError(
            res,
            'Erreur lors de la récupération des catégories.',
            error
        )
    }
}

// Obtenir une catégorie par son ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.categoryId)
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' })
        }
        res.status(200).json(category)
    } catch (error) {
        handleError(
            res,
            'Erreur lors de la récupération de la catégorie.',
            error
        )
    }
}

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
    const { categoryName } = req.body

    if (!categoryName) {
        return res
            .status(400)
            .json({ message: 'Le nom de la catégorie est requis.' })
    }

    try {
        const newCategory = await Category.create({
            CategoryName: categoryName,
        })
        res.status(201).json(newCategory)
    } catch (error) {
        handleError(res, 'Erreur lors de la création de la catégorie.', error)
    }
}

// Mettre à jour une catégorie par son ID
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.categoryId)
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' })
        }
        await category.update(req.body)
        res.status(200).json(category)
    } catch (error) {
        handleError(
            res,
            'Erreur lors de la mise à jour de la catégorie.',
            error
        )
    }
}

// Supprimer une catégorie par son ID (avec suppression des livres associés)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.categoryId)

        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' })
        }

        // Supprimer tous les livres associés à cette catégorie
        await Book.destroy({
            where: {
                CategoryId: req.params.categoryId,
            },
        })

        // Supprimer la catégorie
        await category.destroy()
        res.status(200).json({
            message: 'Catégorie et livres associés supprimés avec succès.',
        })
    } catch (error) {
        handleError(
            res,
            'Erreur lors de la suppression de la catégorie et des livres associés.',
            error
        )
    }
}
