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


-- Copiando estrutura do banco de dados para db_pejo
CREATE DATABASE IF NOT EXISTS `db_pejo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_pejo`;

-- Copiando estrutura para tabela db_pejo.cadastros
CREATE TABLE IF NOT EXISTS `cadastros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `telefone` varchar(14) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(256) NOT NULL,
  `cargo` varchar(50) NOT NULL DEFAULT 'user',
  `data_nascimento` date DEFAULT NULL,
  `confirmation_token` varchar(255) DEFAULT NULL,
  `token_expiration` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.cadastros: ~3 rows (aproximadamente)
INSERT INTO `cadastros` (`id`, `nome`, `telefone`, `senha`, `email`, `cargo`, `data_nascimento`, `confirmation_token`, `token_expiration`, `reset_token`, `reset_token_expires`) VALUES
	(9, 'otavio', '18996666665', '$2b$10$a15qRHficy7NBIFFET6f5esJfmTbuJsD2jQchekGXJZq2vhLG.DsG', 'otavio@gmail.com', 'user', '2024-08-29', NULL, NULL, NULL, NULL),
	(10, 'Matheus', '18996665555', '$2b$10$KfWk..ptvS3JllfaEO4pB.lrEM.zlpEfRYi/FhJ.em7dFqq6Q1B0G', 'matheus.oi@gmail.com', 'user', '1965-08-29', NULL, NULL, NULL, NULL),
	(11, 'Anelise dos Anjos Zárate', '18997679022', '$2b$10$oSaB5wnyvpZ5bGYAWDni9.5T.TufaExO1V2cWCEFo2/R/HBZ75Sp2', 'anelisezarateanjos2018@gmail.com', 'user', '2006-11-16', NULL, NULL, NULL, NULL);

-- Copiando estrutura para tabela db_pejo.comentarios
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `date_post` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1_user` (`user`),
  CONSTRAINT `FK1_user` FOREIGN KEY (`user`) REFERENCES `cadastros` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.comentarios: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.desafios
CREATE TABLE IF NOT EXISTS `desafios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `desafio_nome` varchar(150) NOT NULL,
  `desafio_descricao` varchar(255) NOT NULL,
  `desafio_nivel` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.desafios: ~0 rows (aproximadamente)
INSERT INTO `desafios` (`id`, `desafio_nome`, `desafio_descricao`, `desafio_nivel`) VALUES
	(6, 'Ir para rua', 'Vá para rua de noite 00:00 em um lugar não público, em um beco escuro e se encontre com 2 homens (provavel assalto)', 'hard');

-- Copiando estrutura para tabela db_pejo.perfil
CREATE TABLE IF NOT EXISTS `perfil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `img_perfil_url` varchar(255) NOT NULL,
  `bio` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1_userPerfil` (`id_user`),
  CONSTRAINT `FK1_userPerfil` FOREIGN KEY (`id_user`) REFERENCES `cadastros` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.perfil: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.profissional
CREATE TABLE IF NOT EXISTS `profissional` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_documento` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.profissional: ~0 rows (aproximadamente)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
