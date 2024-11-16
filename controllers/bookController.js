import { Book, Category } from '../models/index.js'
import { handleError } from '../utils/handleError.js'

// Obtenir la liste de tous les livres
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            include: [{
                model: Category,
                attributes: ['CategoryName']
            }]
        })
        res.status(200).json(books)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération des livres.', error)
    }
}


// Obtenir un livre par son ID
export const getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId, {
            include: [{
                model: Category,
                attributes: ['CategoryName']
            }]
        })

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé.' })
        }

        res.status(200).json(book)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération du livre.', error)
    }
}


// Créer un nouveau livre
export const createBook = async (req, res) => {
    const { Title, Author, ISBN, PublishedYear, CategoryId } = req.body

    if (!Title || !Author || !ISBN || !PublishedYear || !CategoryId) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    try {
        const category = await Category.findByPk(CategoryId)
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' })
        }

        const newBook = await Book.create({ Title: Title, Author: Author, ISBN: ISBN, PublishedYear: PublishedYear, CategoryID: CategoryId, Availability: 'Available' })
        res.status(201).json(newBook)
    } catch (error) {
        handleError(res, 'Erreur lors de la création du livre.', error)
    }
}


// Mettre à jour un livre par son ID
export const updateBook = async (req, res) => {
    const { bookId } = req.params    
    try {
        const book = await Book.findByPk(bookId)
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' })
        }

        await book.update(req.body)
        res.status(200).json(book)
    } catch (error) {
        handleError(res, 'Erreur lors de la mise à jour du livre.', error)
    }
}


// Supprimer un livre par son ID
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId)
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' })
        }

        await book.destroy()
        res.status(200).json({ message: 'Livre supprimé avec succès' })
    } catch (error) {
        handleError(res, 'Erreur lors de la suppression du livre.', error)
    }
}

// Filtrer les livres par catégorie
export const getBooksByCategory = async (req, res) => {
    try {
        const books = await Book.findAll({
            where: {
                CategoryId: req.params.categoryId
            },
            include: [{
                model: Category,
                attributes: ['CategoryName']
            }]
        })

        if (books.length === 0) {
            return res.status(404).json({ message: 'Aucun livre trouvé dans cette catégorie.' })
        }

        res.status(200).json(books)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération des livres par catégorie.', error)
    }
}