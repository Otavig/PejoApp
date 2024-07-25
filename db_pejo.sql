-- --------------------------------------------------------
-- Servidor:                     localhost
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para bd_pejo
CREATE DATABASE IF NOT EXISTS `bd_pejo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `bd_pejo`;

-- Copiando estrutura para tabela bd_pejo.cadastro
CREATE TABLE IF NOT EXISTS `cadastro` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(256) NOT NULL,
  `user_password` varchar(256) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela bd_pejo.comentarios
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id_comment` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `comment_text` varchar(120) DEFAULT NULL,
  `date_send` date NOT NULL,
  PRIMARY KEY (`id_comment`),
  KEY `FK_comentarios_cadastro` (`id_user`),
  CONSTRAINT `FK_comentarios_cadastro` FOREIGN KEY (`id_user`) REFERENCES `cadastro` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela bd_pejo.desafios
CREATE TABLE IF NOT EXISTS `desafios` (
  `id_challenge` int(11) NOT NULL,
  `name_challenge` varchar(50) NOT NULL,
  `description_challenge` varchar(255) NOT NULL,
  PRIMARY KEY (`id_challenge`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela bd_pejo.entrega_de_dados
CREATE TABLE IF NOT EXISTS `entrega_de_dados` (
  `id_challenge_delivery` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `delivery_text` varchar(255) NOT NULL,
  `delivery_media_url` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id_challenge_delivery`),
  KEY `FK_entrega de dados_desafios` (`challenge_id`),
  KEY `FK_entrega de dados_cadastro` (`id_user`),
  CONSTRAINT `FK_entrega de dados_cadastro` FOREIGN KEY (`id_user`) REFERENCES `cadastro` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_entrega de dados_desafios` FOREIGN KEY (`challenge_id`) REFERENCES `desafios` (`id_challenge`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

-- Copiando estrutura para tabela bd_pejo.perfil
CREATE TABLE IF NOT EXISTS `perfil` (
  `id_profile` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `profile_picture_url` varchar(400) NOT NULL,
  `bio` varchar(600) NOT NULL,
  PRIMARY KEY (`id_profile`),
  KEY `FK_perfil_cadastro` (`id_user`),
  CONSTRAINT `FK_perfil_cadastro` FOREIGN KEY (`id_user`) REFERENCES `cadastro` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Exportação de dados foi desmarcado.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
