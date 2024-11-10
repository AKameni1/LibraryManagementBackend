import { validationResult } from 'express-validator'
import { User } from '../models/index.js'
import { generateToken } from '../utils/authHelpers.js'

export const loginUser = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body);
    

    const { username, email } = req.body

    try {
        const user = await User.findOne({ where: { Username: username, Email: email } })    
        console.log(user);
        
        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        }
        
        // const isMatch = bcrypt.compareSync(bcrypt.hashSync(password), user.Password)

        // console.log(`password match: ${isMatch}`)
        

        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        // }
        
        const token = await generateToken(user)

        return res.status(200).json({ token: token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Erreur provenant du serveur' })
    }
}