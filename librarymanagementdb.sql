-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 12 nov. 2024 à 17:59
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `librarymanagementdb`
--

-- --------------------------------------------------------

--
-- Structure de la table `auditlog`
--

CREATE TABLE `auditlog` (
  `AuditID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Entity` varchar(100) DEFAULT NULL,
  `Action` varchar(255) NOT NULL,
  `Timestamp` date DEFAULT current_timestamp(),
  `Details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `book`
--

CREATE TABLE `book` (
  `BookID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Author` varchar(255) DEFAULT NULL,
  `ISBN` varchar(20) NOT NULL,
  `PublishedYear` int(11) DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `Availability` enum('Available','Borrowed','Reserved') DEFAULT 'Available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `book`
--

INSERT INTO `book` (`BookID`, `Title`, `Author`, `ISBN`, `PublishedYear`, `CategoryID`, `Availability`) VALUES
(1, 'Le monde de la science', 'Marie Curie', '978-1234567890', 2020, 1, 'Available'),
(2, 'Le seigneur des anneaux', 'J.R.R. Tolkien', '978-2345678901', 1954, 2, 'Available'),
(3, 'La République', 'Platon', '978-3456789012', -380, 3, 'Available'),
(4, 'Une brève histoire du temps', 'Stephen Hawking', '978-4567890123', 1988, 1, 'Available'),
(5, 'Les Misérables', 'Victor Hugo', '978-5678901234', 1862, 5, 'Available'),
(6, 'Le capital', 'Karl Marx', '978-6789012345', 1867, 13, 'Available'),
(7, 'La cuisine méditerranéenne', 'Gordon Ramsay', '978-7890123456', 2015, 10, 'Available'),
(8, 'Le guide du voyageur galactique', 'Douglas Adams', '978-8901234567', 1979, 11, 'Available'),
(9, 'L\'art du dessin', 'John Doe', '978-9012345678', 2018, 7, 'Available'),
(10, 'Introduction à la psychologie', 'Sigmund Freud', '978-0123456789', 1920, 8, 'Available'),
(11, 'Le voyage dans le temps', 'H.G. Wells', '978-1112223333', 1895, 1, 'Available'),
(12, '1984', 'George Orwell', '978-1233214567', 1949, 2, 'Available'),
(13, 'La Bible', 'Anonyme', '978-3216549876', 0, 14, 'Available'),
(14, 'L\'art de la guerre', 'Sun Tzu', '978-6549873210', -500, 3, 'Available');

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`) VALUES
(7, 'Art'),
(9, 'Biographies'),
(10, 'Cuisine'),
(13, 'Économie'),
(15, 'Éducation'),
(2, 'Fiction'),
(4, 'Histoire'),
(5, 'Littérature'),
(12, 'Musique'),
(3, 'Philosophie'),
(8, 'Psychologie'),
(14, 'Religion'),
(1, 'Science'),
(6, 'Technologie'),
(11, 'Voyage');

-- --------------------------------------------------------

--
-- Structure de la table `faq`
--

CREATE TABLE `faq` (
  `FAQID` int(11) NOT NULL,
  `Question` text NOT NULL,
  `Answer` text NOT NULL,
  `CreatedAt` date DEFAULT current_timestamp(),
  `UpdatedAt` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `loan`
--

CREATE TABLE `loan` (
  `LoanID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `BookID` int(11) DEFAULT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `ReturnDate` date DEFAULT NULL,
  `Status` enum('Borrowed','Returned','Late') DEFAULT 'Borrowed',
  `DueNotificationSent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notification`
--

CREATE TABLE `notification` (
  `NotificationID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Message` text DEFAULT NULL,
  `CreatedAt` date DEFAULT current_timestamp(),
  `IsRead` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permission`
--

CREATE TABLE `permission` (
  `PermissionID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `permission`
--

INSERT INTO `permission` (`PermissionID`, `Name`, `Description`) VALUES
(1, 'create_user', 'Permet de créer un nouvel utilisateur'),
(2, 'update_user', 'Permet de mettre à jour un utilisateur existant'),
(3, 'delete_user', 'Permet de supprimer un utilisateur'),
(4, 'view_users', 'Permet de consulter la liste des utilisateurs'),
(5, 'assign_roles_to_users', 'Permet d\'assigner des rôles à des utilisateurs'),
(6, 'create_role', 'Permet de créer un nouveau rôle'),
(7, 'update_role', 'Permet de mettre à jour un rôle existant'),
(8, 'delete_role', 'Permet de supprimer un rôle'),
(9, 'view_roles', 'Permet de consulter la liste des rôles existants'),
(10, 'assign_permissions_to_roles', 'Permet d\'assigner des permissions à un rôle'),
(11, 'add_book', 'Permet d\'ajouter un nouveau livre à la bibliothèque'),
(12, 'update_book', 'Permet de mettre à jour un livre existant'),
(13, 'delete_book', 'Permet de supprimer un livre de la bibliothèque'),
(14, 'view_books', 'Permet de consulter la liste des livres'),
(15, 'search_books', 'Permet de rechercher des livres par auteur, titre, genre, etc.'),
(16, 'borrow_books', 'Permet à un utilisateur d\'emprunter des livres'),
(17, 'return_books', 'Permet à un utilisateur de retourner des livres empruntés'),
(18, 'approve_borrow_requests', 'Permet aux administrateurs de valider les demandes d\'emprunts'),
(19, 'view_borrowed_books', 'Permet de voir la liste des livres empruntés par un utilisateur'),
(20, 'send_notifications', 'Permet d\'envoyer des notifications aux utilisateurs'),
(21, 'view_notifications', 'Permet de consulter l\'historique des notifications envoyées'),
(22, 'view_system_logs', 'Permet de consulter les journaux système pour surveiller l\'activité de l\'application'),
(23, 'system_configuration', 'Permet de modifier les paramètres de configuration du système'),
(24, 'manage_users_and_roles', 'Permet de gérer à la fois les utilisateurs et les rôles'),
(25, 'manage_books_and_borrowing', 'Permet de gérer les livres et le processus d\'emprunt');

-- --------------------------------------------------------

--
-- Structure de la table `report`
--

CREATE TABLE `report` (
  `ReportID` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `GeneratedBy` int(11) DEFAULT NULL,
  `GeneratedAt` date DEFAULT current_timestamp(),
  `ReportPath` varchar(255) DEFAULT NULL,
  `ReportType` enum('User Activity','Usage Stats','Error Log','Custom') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reportparameter`
--

CREATE TABLE `reportparameter` (
  `ParameterID` int(11) NOT NULL,
  `ReportID` int(11) DEFAULT NULL,
  `ParameterName` varchar(100) NOT NULL,
  `ParameterValue` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `ReservationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `BookID` int(11) NOT NULL,
  `ReservationDate` date DEFAULT current_timestamp(),
  `Status` enum('Reserved','Notification Sent','Cancelled') DEFAULT 'Reserved',
  `ReservationEndDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `RoleID` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`RoleID`, `Name`, `Description`) VALUES
(1, 'superAdmin', 'Super administrateur avec tous les droits d\'administration, y compris la gestion des utilisateurs et des rôles'),
(2, 'admin', 'Administrateur avec la possibilité de gérer les utilisateurs et les permissions'),
(3, 'librarian', 'Bibliothécaire ayant des droits sur les livres et les emprunts'),
(4, 'client', 'Utilisateur standard avec des droits d\'emprunt de livres et de consultation');

-- --------------------------------------------------------

--
-- Structure de la table `rolepermission`
--

CREATE TABLE `rolepermission` (
  `RoleID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rolepermission`
--

INSERT INTO `rolepermission` (`RoleID`, `PermissionID`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 12),
(1, 13),
(1, 14),
(1, 15),
(1, 16),
(1, 17),
(1, 18),
(1, 19),
(1, 20),
(1, 21),
(1, 22),
(1, 23),
(1, 24),
(1, 25),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 11),
(2, 12),
(2, 13),
(2, 14),
(2, 16),
(2, 17),
(2, 18),
(2, 19),
(2, 20),
(2, 21),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 16),
(3, 17),
(3, 18),
(3, 19),
(4, 14),
(4, 16),
(4, 17),
(4, 19);

-- --------------------------------------------------------

--
-- Structure de la table `supportticket`
--

CREATE TABLE `supportticket` (
  `TicketID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `Subject` varchar(255) NOT NULL,
  `Description` text NOT NULL,
  `Status` enum('Open','In Progress','Closed') DEFAULT 'Open',
  `CreatedAt` date DEFAULT current_timestamp(),
  `UpdatedAt` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ticketresponse`
--

CREATE TABLE `ticketresponse` (
  `ResponseID` int(11) NOT NULL,
  `TicketID` int(11) DEFAULT NULL,
  `UserID` int(11) DEFAULT NULL,
  `ResponseText` text NOT NULL,
  `ResponseDate` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Email` text NOT NULL,
  `Password` text NOT NULL,
  `CreationDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `IsActive` tinyint(1) DEFAULT 1,
  `RoleID` int(11) NOT NULL,
  `LoanCount` int(11) DEFAULT 0,
  `LoanLimit` int(11) DEFAULT 3,
  `LateReturnCount` int(11) DEFAULT 0,
  `PenaltyPoints` int(11) DEFAULT 0,
  `LoanSuspendedUntil` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`UserID`, `Username`, `Email`, `Password`, `CreationDate`, `IsActive`, `RoleID`, `LoanCount`, `LoanLimit`, `LateReturnCount`, `PenaltyPoints`, `LoanSuspendedUntil`) VALUES
(1, 'Arthur', 'arthur.kamenitchualeu@gmail.com', '$2a$10$c/.qsSC2vrktw4ewlzKLpeN5m444xVZN/d5qvqi92GvFbhYrRUQFK', '2024-11-12 15:56:33', 1, 1, 0, 3, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `userpermission`
--

CREATE TABLE `userpermission` (
  `UserID` int(11) NOT NULL,
  `PermissionID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `auditlog`
--
ALTER TABLE `auditlog`
  ADD PRIMARY KEY (`AuditID`),
  ADD KEY `UserID` (`UserID`);

--
-- Index pour la table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`BookID`),
  ADD UNIQUE KEY `ISBN` (`ISBN`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`),
  ADD UNIQUE KEY `CategoryName` (`CategoryName`);

--
-- Index pour la table `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`FAQID`);

--
-- Index pour la table `loan`
--
ALTER TABLE `loan`
  ADD PRIMARY KEY (`LoanID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `BookID` (`BookID`);

--
-- Index pour la table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `UserID` (`UserID`);

--
-- Index pour la table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`PermissionID`);

--
-- Index pour la table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`ReportID`),
  ADD KEY `GeneratedBy` (`GeneratedBy`);

--
-- Index pour la table `reportparameter`
--
ALTER TABLE `reportparameter`
  ADD PRIMARY KEY (`ParameterID`),
  ADD KEY `ReportID` (`ReportID`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`ReservationID`),
  ADD KEY `UserID` (`UserID`),
  ADD KEY `BookID` (`BookID`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`RoleID`);

--
-- Index pour la table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD PRIMARY KEY (`RoleID`,`PermissionID`),
  ADD KEY `PermissionID` (`PermissionID`);

--
-- Index pour la table `supportticket`
--
ALTER TABLE `supportticket`
  ADD PRIMARY KEY (`TicketID`),
  ADD KEY `UserID` (`UserID`);

--
-- Index pour la table `ticketresponse`
--
ALTER TABLE `ticketresponse`
  ADD PRIMARY KEY (`ResponseID`),
  ADD KEY `TicketID` (`TicketID`),
  ADD KEY `UserID` (`UserID`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`) USING HASH,
  ADD KEY `RoleID` (`RoleID`);

--
-- Index pour la table `userpermission`
--
ALTER TABLE `userpermission`
  ADD PRIMARY KEY (`UserID`,`PermissionID`),
  ADD KEY `PermissionID` (`PermissionID`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `auditlog`
--
ALTER TABLE `auditlog`
  MODIFY `AuditID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `book`
--
ALTER TABLE `book`
  MODIFY `BookID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT pour la table `faq`
--
ALTER TABLE `faq`
  MODIFY `FAQID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `loan`
--
ALTER TABLE `loan`
  MODIFY `LoanID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notification`
--
ALTER TABLE `notification`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permission`
--
ALTER TABLE `permission`
  MODIFY `PermissionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `report`
--
ALTER TABLE `report`
  MODIFY `ReportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reportparameter`
--
ALTER TABLE `reportparameter`
  MODIFY `ParameterID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `ReservationID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `RoleID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `supportticket`
--
ALTER TABLE `supportticket`
  MODIFY `TicketID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ticketresponse`
--
ALTER TABLE `ticketresponse`
  MODIFY `ResponseID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `auditlog`
--
ALTER TABLE `auditlog`
  ADD CONSTRAINT `auditlog_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Contraintes pour la table `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `book_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `loan`
--
ALTER TABLE `loan`
  ADD CONSTRAINT `loan_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `loan_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `book` (`BookID`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`GeneratedBy`) REFERENCES `user` (`UserID`) ON DELETE SET NULL;

--
-- Contraintes pour la table `reportparameter`
--
ALTER TABLE `reportparameter`
  ADD CONSTRAINT `reportparameter_ibfk_1` FOREIGN KEY (`ReportID`) REFERENCES `report` (`ReportID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`BookID`) REFERENCES `book` (`BookID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `rolepermission`
--
ALTER TABLE `rolepermission`
  ADD CONSTRAINT `rolepermission_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`),
  ADD CONSTRAINT `rolepermission_ibfk_2` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`);

--
-- Contraintes pour la table `supportticket`
--
ALTER TABLE `supportticket`
  ADD CONSTRAINT `supportticket_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ticketresponse`
--
ALTER TABLE `ticketresponse`
  ADD CONSTRAINT `ticketresponse_ibfk_1` FOREIGN KEY (`TicketID`) REFERENCES `supportticket` (`TicketID`) ON DELETE CASCADE,
  ADD CONSTRAINT `ticketresponse_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role` (`RoleID`);

--
-- Contraintes pour la table `userpermission`
--
ALTER TABLE `userpermission`
  ADD CONSTRAINT `userpermission_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `userpermission_ibfk_2` FOREIGN KEY (`PermissionID`) REFERENCES `permission` (`PermissionID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
