# Système de Gestion de Bibliothèque - Backend

## Développé par
- Arthur Junior Kameni Tchualeu
- Nizar Amanchar
- Jayson Lefebvre

## Description
API backend pour un système de gestion de bibliothèque développé avec Node.js, Express, et MySQL.

## Technologies Utilisées
- Node.js
- Express.js
- MySQL (via XAMPP)
- Sequelize ORM
- JWT pour l'authentification

## Installation

### Prérequis
- Node.js
- XAMPP

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/LibraryManagementBackend.git
cd LibraryManagementBackend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de la base de données**
- Démarrer XAMPP
- Démarrer Apache et MySQL
- Accéder à phpMyAdmin (http://localhost/phpmyadmin)
- Créer une nouvelle base de données nommée 'librarymanagementdb'
- Importer le fichier librarymanagementdb.sql

4. **Configuration de l'environnement**
- Copier le contenu depuis le fichier .env.example

5. **Démarrer le serveur**
```bash
# Mode développement
npm run dev
```
