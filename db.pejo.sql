-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
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

-- Copiando estrutura para tabela db_pejo.agendamentos
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_desafio` int(11) NOT NULL,
  `dia_semana` enum('domingo','segunda','terca','quarta','quinta','sexta','sabado') NOT NULL,
  `hora` time NOT NULL,
  `estado` enum('ativado','desativado') NOT NULL DEFAULT 'desativado',
  PRIMARY KEY (`id`),
  KEY `id_desafio` (`id_desafio`),
  CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`id_desafio`) REFERENCES `desafios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.agendamentos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.assinaturas
CREATE TABLE IF NOT EXISTS `assinaturas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `data_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_fim` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `assinaturas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.assinaturas: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.avaliacoes_profissionais
CREATE TABLE IF NOT EXISTS `avaliacoes_profissionais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `profissional_id` int(11) DEFAULT NULL,
  `avaliacao` float NOT NULL,
  `comentario` text DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `profissional_id` (`profissional_id`),
  CONSTRAINT `avaliacoes_profissionais_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `avaliacoes_profissionais_ibfk_2` FOREIGN KEY (`profissional_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.avaliacoes_profissionais: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.cartao_profissional
CREATE TABLE IF NOT EXISTS `cartao_profissional` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profissional_id` int(11) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `avaliacao` float DEFAULT 0,
  `estrelas` int(11) DEFAULT 0,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `profissional_id` (`profissional_id`),
  CONSTRAINT `cartao_profissional_ibfk_1` FOREIGN KEY (`profissional_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.cartao_profissional: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.chats
CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `remetente_id` int(11) DEFAULT NULL,
  `destinatario_id` int(11) DEFAULT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `remetente_id` (`remetente_id`),
  KEY `destinatario_id` (`destinatario_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.chats: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.desafios
CREATE TABLE IF NOT EXISTS `desafios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `dificuldade` enum('facil','media','dificil') NOT NULL,
  `tipo` enum('diario','semanal','mensal') NOT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('ativado','desativado') NOT NULL DEFAULT 'desativado',
  `tipo_ativacao` enum('manual','pre-definido') NOT NULL DEFAULT 'manual',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.desafios: ~2 rows (aproximadamente)
INSERT INTO `desafios` (`id`, `titulo`, `descricao`, `dificuldade`, `tipo`, `data_criacao`, `estado`, `tipo_ativacao`) VALUES
	(2, 'Teste', 'Desafio de teste sabe', 'facil', 'diario', '2024-11-14 16:57:29', 'ativado', 'manual'),
	(3, 'Teste2', 'Desafio de teste 2 sabe', 'media', 'semanal', '2024-11-14 19:16:41', 'ativado', 'manual');

-- Copiando estrutura para tabela db_pejo.eventos
CREATE TABLE IF NOT EXISTS `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `data_evento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `local` varchar(255) NOT NULL,
  `imagens` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.eventos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token_expiration` datetime DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `token_confirmacao_email` varchar(255) DEFAULT NULL,
  `token_recuperacao_senha` varchar(255) DEFAULT NULL,
  `status_email` tinyint(1) DEFAULT 0,
  `tipo_usuario` enum('confirmação','usuario','profissional','admin') DEFAULT 'confirmação',
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_nascimento` date DEFAULT NULL,
  `nivel` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Copiando dados para a tabela db_pejo.usuarios: ~2 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `token_expiration`, `nome`, `email`, `telefone`, `senha`, `token_confirmacao_email`, `token_recuperacao_senha`, `status_email`, `tipo_usuario`, `data_criacao`, `data_nascimento`, `nivel`) VALUES
	(4, '2024-11-14 13:25:26', 'José Otávio ', 'jocbrandao2@gmail.com', '18998091310', '$2b$10$ak6S5Ap9blhQwdlnisvmnelKjC1xrKHgSZ5nUjZnkagtZSj0TxOo.', '7394eee73b5aef61d18fac4fa0c6c69b', NULL, 0, 'usuario', '2024-11-14 16:10:26', '2007-02-16', NULL),
	(5, '2024-11-14 13:41:29', 'Otávio Garcia', 'otaviogarcia.santos4@gmail.com', '18996660212', '$2b$10$2XsJSM1Jqr90B0inS5OBN.mq1ysxF6EzpZDsHg3eCOEEbR969H1Eu', '57c794eae1121dbec36ae0db1553b460', NULL, 0, 'admin', '2024-11-14 16:26:29', '2006-03-29', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
