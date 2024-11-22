import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { User } from '../models/index.js'
import emailValidator from 'email-validator'

dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

// Fonction pour envoyer un e-mail
export const sendEmailNotification = async (userId, subject, message) => {
    try {
        const user = await User.findByPk(userId)
        if (!user) {
            throw new Error('Utilisateur non trouvé')
        }

        // Valider l'email
        if (!emailValidator.validate(user.Email)) {
            throw new Error("L'adresse e-mail de l'utilisateur est invalide")
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.Email,
            subject: subject,
            text: message,
        }

        // Envoi de l'e-mail
        console.log(
            `Envoi d'un email à ${user.Email} avec le sujet: ${subject}`
        )
        await transporter.sendMail(mailOptions)
        console.log('Email envoyé à', user.Email)
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email:", error)
        throw new Error(`Échec de l'envoi de l'email: ${error.message}`)
    }
}
