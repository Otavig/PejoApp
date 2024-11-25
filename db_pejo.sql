-- --------------------------------------------------------
-- Servidor:                     localhost
-- Versão do servidor:           5.7.24 - MySQL Community Server (GPL)
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
CREATE DATABASE IF NOT EXISTS `db_pejo` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `db_pejo`;

-- Copiando estrutura para tabela db_pejo.chats
CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `remetente_id` int(11) DEFAULT NULL,
  `destinatario_id` int(11) DEFAULT NULL,
  `mensagem` text NOT NULL,
  `data_envio` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `remetente_id` (`remetente_id`),
  KEY `destinatario_id` (`destinatario_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`remetente_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `chats_ibfk_2` FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.chats: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_pejo.desafios
CREATE TABLE IF NOT EXISTS `desafios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `descricao` text NOT NULL,
  `dificuldade` enum('facil','media','dificil') NOT NULL,
  `tipo` enum('diario','semanal','mensal') NOT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ativado','desativado') NOT NULL DEFAULT 'desativado',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.desafios: ~55 rows (aproximadamente)
INSERT INTO `desafios` (`id`, `titulo`, `descricao`, `dificuldade`, `tipo`, `data_criacao`, `estado`) VALUES
	(7, 'Cumprimente uma Pessoa Desconhecida', 'Cumprimente uma pessoa que você não conhece e inicie uma breve interação.\n', 'facil', 'diario', '2024-11-21 15:39:27', 'ativado'),
	(8, 'Sorria para o Espelho', 'Sorria para o espelho e diga com entusiasmo: "Eu me sinto ótimo!"\n', 'facil', 'diario', '2024-11-21 15:40:24', 'ativado'),
	(9, 'Vista-se para Elevar sua Autoestima', 'Use uma roupa confortável que faça você se sentir bem e atraia interações positivas.\n', 'facil', 'diario', '2024-11-21 15:40:43', 'ativado'),
	(10, 'Faça Contato Visual e Sorria', 'Olhe nos olhos de alguém e sorria durante o dia.', 'facil', 'diario', '2024-11-21 15:41:02', 'ativado'),
	(11, 'Diga "Obrigado" a um Atendente', 'Agradeça a um atendente em qualquer estabelecimento que você visitar.\n', 'facil', 'diario', '2024-11-21 15:41:26', 'ativado'),
	(12, 'Comente sobre o Clima', 'Converse com alguém que você encontra diariamente porém que não seja um amigo, comentando sobre o clima.\n', 'facil', 'diario', '2024-11-21 15:42:22', 'ativado'),
	(13, 'Pratique sua Voz em Voz Alta', 'Leia um livro ou qualquer texto em voz alta enquanto está sozinho.\n', 'facil', 'diario', '2024-11-21 15:42:55', 'ativado'),
	(14, 'Pergunte a um Estranho a Hora ou Direções', 'Aborde um desconhecido para perguntar a hora ou pedir direções.\n', 'facil', 'diario', '2024-11-21 15:43:13', 'ativado'),
	(15, 'Apresente-se Brevemente', 'Faça uma breve apresentação de si mesmo para um novo conhecido.', 'facil', 'diario', '2024-11-21 15:43:39', 'ativado'),
	(16, 'Compartilhe uma Curiosidade sobre Você', 'Diga algo curioso sobre você para um colega.\n', 'media', 'diario', '2024-11-21 15:44:05', 'ativado'),
	(17, 'Escreva um Comentário Positivo nas Redes Sociais', 'Deixe um comentário positivo em uma postagem de alguém nas redes sociais.\n', 'media', 'diario', '2024-11-21 15:44:32', 'ativado'),
	(18, 'Pergunte a um Colega sobre o Trabalho', 'Pergunte sobre um projeto ou tarefa em que um colega está trabalhando.\n', 'media', 'diario', '2024-11-21 15:44:50', 'ativado'),
	(19, 'Participe de uma Conversa em Grupo', 'Envolva-se em uma conversa durante um momento social em grupo.', 'media', 'diario', '2024-11-21 15:45:08', 'ativado'),
	(20, 'Pergunte sobre o Fim de Semana de um Colega', 'Pergunte a um colega como foi o fim de semana dele.\n', 'media', 'diario', '2024-11-21 15:45:27', 'ativado'),
	(21, 'Comente sobre o que Está Lendo ou Assistindo', 'Fale com alguém sobre o que você está lendo ou assistindo atualmente.\n', 'media', 'diario', '2024-11-21 15:45:47', 'ativado'),
	(22, 'Faça uma Ligação para Marcar um Compromisso', 'Ligue para marcar um compromisso, como uma consulta médica.\n\n', 'media', 'diario', '2024-11-21 15:46:10', 'ativado'),
	(23, 'Faça um Elogio Sincero a Alguém', 'Faça um elogio sincero a alguém que você não conhece bem.\n', 'dificil', 'diario', '2024-11-21 15:46:26', 'ativado'),
	(25, 'Participe de uma Discussão Online', 'Junte-se a uma discussão em um grupo online sobre um assunto de seu interesse.\n', 'dificil', 'diario', '2024-11-21 15:50:37', 'ativado'),
	(26, 'Interaja com Alguém em uma Fila', 'Converse com uma pessoa nova enquanto espera em uma fila.', 'dificil', 'diario', '2024-11-21 15:50:55', 'ativado'),
	(27, 'Participe de um Evento Social', 'Compareça a um evento social e fique por pelo menos 30 minutos.', 'facil', 'diario', '2024-11-21 15:51:15', 'ativado'),
	(28, 'Envie uma Mensagem para um Amigo', 'Pergunte como um amigo está via mensagem de texto.\n', 'facil', 'diario', '2024-11-21 15:51:39', 'ativado'),
	(29, 'Siga Alguém Novo nas Redes Sociais', 'Siga uma pessoa nova e interaja com uma de suas postagens.', 'facil', 'diario', '2024-11-21 15:51:58', 'ativado'),
	(30, 'Envie uma Mensagem de Bom Dia', 'Envie uma mensagem de bom dia para um amigo ou colega.\n', 'facil', 'diario', '2024-11-21 15:52:14', 'ativado'),
	(31, 'Envie um Emoji ou Sticker', 'Envie um emoji ou sticker divertido para um amigo em uma mensagem.\n', 'facil', 'diario', '2024-11-21 15:52:32', 'ativado'),
	(32, 'Faça uma Pergunta após a Aula', 'Pergunte algo a um professor ou mentor após a aula.\n', 'facil', 'diario', '2024-11-21 15:52:54', 'ativado'),
	(33, 'Mentalize Interações Positivas', 'Imagine-se tendo interações positivas com outras pessoas e anote seus desejos.', 'media', 'diario', '2024-11-21 15:53:52', 'ativado'),
	(34, 'Proponha uma Atividade em Grupo', 'Convide colegas para um café ou passeio em grupo.\n', 'media', 'diario', '2024-11-21 15:57:27', 'ativado'),
	(35, 'Junte-se a uma Discussão em Fórum Online', 'Participe de uma discussão em um fórum sobre um assunto de interesse.\n', 'media', 'diario', '2024-11-21 15:57:45', 'ativado'),
	(36, 'Participe de uma Aula Experimental', 'Experimente uma nova atividade, como yoga ou dança, em uma aula experimental.', 'media', 'diario', '2024-11-21 15:57:59', 'ativado'),
	(37, 'Dê Feedback Construtivo', 'Ofereça feedback construtivo a um colega sobre algo que ele fez.\n', 'media', 'diario', '2024-11-21 15:58:16', 'ativado'),
	(38, 'Apresente-se em uma Reunião', 'Apresente-se em uma reunião de trabalho e fale sobre suas funções.\n', 'media', 'diario', '2024-11-21 15:58:33', 'ativado'),
	(39, 'Junte-se a um Clube ou Grupo de Interesse', 'Participe de um clube ou grupo de interesse, como de leitura ou esportes.\n\n', 'media', 'diario', '2024-11-21 15:58:50', 'ativado'),
	(40, 'Tente Iniciar uma Conversa em um Intervalo', 'Converse com um colega durante um intervalo.', 'media', 'diario', '2024-11-21 15:59:13', 'ativado'),
	(41, 'Dê uma Opinião em uma Reunião ou Debate', 'Ofereça sua opinião durante uma reunião ou debate em grupo.', 'dificil', 'diario', '2024-11-21 15:59:36', 'ativado'),
	(42, 'Organize um Lanche ou Café para Amigos', 'Organize um lanche ou café para colegas ou amigos.', 'dificil', 'diario', '2024-11-21 15:59:50', 'ativado'),
	(43, 'Faça uma Chamada de Vídeo para um Amigo Distante', 'Ligue para alguém que você não vê há muito tempo via vídeo.', 'dificil', 'diario', '2024-11-21 16:00:04', 'ativado'),
	(44, 'Participe de um Grupo de Discussão Online', 'Compartilhe suas ideias em uma discussão online.\n', 'dificil', 'diario', '2024-11-21 16:00:17', 'ativado'),
	(45, 'Compartilhe uma Experiência Pessoal em Grupo', 'Compartilhe uma experiência pessoal durante uma reunião ou aula.\n', 'dificil', 'diario', '2024-11-21 16:00:34', 'ativado'),
	(46, 'Assista a um Filme Sozinho', 'Vá ao cinema ou teatro e assista a um filme sozinho.\n', 'facil', 'diario', '2024-11-21 16:01:01', 'ativado'),
	(47, 'Visite um Novo Local', 'Vá a um novo local e interaja com alguém lá.\n', 'facil', 'diario', '2024-11-21 16:01:14', 'ativado'),
	(48, 'Participe de um Evento Comunitário', 'Compareça a um evento comunitário e observe as interações.\n', 'facil', 'diario', '2024-11-21 16:01:29', 'ativado'),
	(49, 'Converse Durante uma Caminhada', 'Converse com alguém durante uma caminhada em um parque', 'facil', 'diario', '2024-11-21 16:01:42', 'ativado'),
	(50, 'Faça Compras em uma Loja Nova', 'Visite uma loja onde nunca esteve antes e converse com os vendedores.\n', 'facil', 'diario', '2024-11-21 16:02:01', 'ativado'),
	(51, 'Convide um Amigo para Fazer Algo Novo', 'Chame um amigo para experimentar algo novo juntos.', 'media', 'diario', '2024-11-21 16:02:16', 'ativado'),
	(52, 'Inicie um Projeto em Grupo', 'Proponha iniciar um projeto em grupo, como um trabalho voluntário.\n', 'media', 'diario', '2024-11-21 16:02:32', 'ativado'),
	(53, 'Organize um Passeio em Grupo', 'Organize um passeio em grupo e convide amigos.\n', 'media', 'diario', '2024-11-21 16:02:44', 'ativado'),
	(54, 'Crie uma Apresentação sobre um Hobby', 'Faça uma apresentação sobre um hobby e compartilhe com amigos ou familiares.\n', 'media', 'diario', '2024-11-21 16:03:02', 'ativado'),
	(55, 'Inscreva-se em um Curso em Grupo', 'Participe de um curso coletivo, como culinária ou arte.\n', 'media', 'diario', '2024-11-21 16:03:19', 'ativado'),
	(56, 'Faça Voluntariado em Grupo', 'Envolva-se em uma atividade voluntária com outras pessoas.\n', 'media', 'diario', '2024-11-21 16:03:37', 'ativado'),
	(57, 'Participe de um Evento Comunitário', 'Compareça a uma apresentação ou evento na comunidade.\n', 'media', 'diario', '2024-11-21 16:03:51', 'ativado'),
	(58, 'Dê uma Palestra sobre um Tema de Interesse', 'Apresente uma palestra de 10 minutos sobre um tema que você domina para alguém.', 'dificil', 'diario', '2024-11-21 16:04:22', 'ativado'),
	(59, 'Organize um Evento e Convide Novas Pessoas', 'Organize um jantar ou encontro e convide pessoas com quem deseja se conectar melhor.\n', 'dificil', 'diario', '2024-11-21 16:04:36', 'ativado'),
	(60, 'Realize uma Atividade em Público', 'Faça uma atividade pública, como cantar ou dançar, por um breve momento.\n\n', 'dificil', 'diario', '2024-11-21 16:04:54', 'ativado'),
	(61, 'Participe de um Evento de Networking', 'Participe de um evento de networking e converse com pelo menos três pessoas.\n\n', 'dificil', 'diario', '2024-11-21 16:05:12', 'ativado'),
	(62, 'Dê uma Aula ou Workshop', 'Dê uma aula ou workshop em um espaço comunitário sobre algo que você domina.\n', 'dificil', 'diario', '2024-11-21 16:05:30', 'ativado');

-- Copiando estrutura para tabela db_pejo.eventos
CREATE TABLE IF NOT EXISTS `eventos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `data_evento` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `local` varchar(255) NOT NULL,
  `imagens` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coordenadas` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.eventos: ~0 rows (aproximadamente)
INSERT INTO `eventos` (`id`, `nome`, `descricao`, `data_evento`, `local`, `imagens`, `data_criacao`, `coordenadas`) VALUES
	(12, 'Desenvoltura no trabalho', 'Palestra com o Gustavo Prado sobre como se comportar e destacar no seu ambiente de trabalho', '2024-12-06 17:30:00', 'SP - Presidente Prudente', '["1732205629239-matarazo.jpg"]', '2024-11-21 16:13:49', '-22.12082877981584, -51.37948396191292');

-- Copiando estrutura para tabela db_pejo.oportunidades
CREATE TABLE IF NOT EXISTS `oportunidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `cpf` varchar(50) NOT NULL DEFAULT '',
  `horarios` varchar(255) DEFAULT NULL,
  `forma_de_pagamento` varchar(50) DEFAULT NULL,
  `cfp` varchar(50) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `descricao_forma_pagamento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.oportunidades: ~0 rows (aproximadamente)
INSERT INTO `oportunidades` (`id`, `user_id`, `cpf`, `horarios`, `forma_de_pagamento`, `cfp`, `cidade`, `descricao_forma_pagamento`) VALUES
	(1, 10, '47348752861', '18:30 a 20:00', 'Pix', '123183', 'São Paulo', NULL);

-- Copiando estrutura para tabela db_pejo.ultimadata
CREATE TABLE IF NOT EXISTS `ultimadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `dia_desafio_feito` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.ultimadata: ~2 rows (aproximadamente)
INSERT INTO `ultimadata` (`id`, `userId`, `dia_desafio_feito`) VALUES
	(5, 10, '2024-11-25'),
	(6, 11, '2024-11-24'),
	(7, 12, '2024-11-25');

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
  `status_email` tinyint(1) DEFAULT '0',
  `tipo_usuario` enum('confirmação','usuario','profissional','admin') DEFAULT 'confirmação',
  `data_criacao` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_nascimento` date DEFAULT NULL,
  `nivel` int(11) DEFAULT '0',
  `bio` varchar(255) DEFAULT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `desafios_feitos` varchar(255) DEFAULT '[]',
  `ultimo_desafio_montado` int(11) DEFAULT NULL,
  `data_ultimo_desafio_entregue` date DEFAULT NULL,
  `avaliacao` float DEFAULT '0',
  `contratados` varchar(255) DEFAULT '[]',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_pejo.usuarios: ~2 rows (aproximadamente)
INSERT INTO `usuarios` (`id`, `token_expiration`, `nome`, `email`, `telefone`, `senha`, `token_confirmacao_email`, `token_recuperacao_senha`, `status_email`, `tipo_usuario`, `data_criacao`, `data_nascimento`, `nivel`, `bio`, `profileImage`, `token`, `desafios_feitos`, `ultimo_desafio_montado`, `data_ultimo_desafio_entregue`, `avaliacao`, `contratados`) VALUES
	(10, NULL, 'Otávio Garcia', 'admin@gmail.com', '18996660212', '$2b$10$B457wnrMbc57DRfEVcUHTuGv64m7rKrCIECDholKS6bWHI1TTbZRK', NULL, NULL, 0, 'admin', '2024-11-24 19:58:33', NULL, 60, NULL, '1732563896072-profile_10.jpg', NULL, '[52,59,58]', 58, '2024-11-25', 3.5, '[1,10]'),
	(12, NULL, 'Otavio ', 'murfpp321@gmail.com', '18996660211', '$2b$10$s3qV5U9xzy.fu3tK74N/5u85d1kAy0v/SDZVen7Xb9KJpueF9E7Wq', NULL, NULL, 1, 'usuario', '2024-11-25 22:38:46', '2006-03-29', 20, NULL, NULL, NULL, '[32]', 32, '2024-11-25', 0, '[10]');

-- Copiando estrutura para trigger db_pejo.after_user_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    -- Insere o registro na tabela ultimadata com userId e a data de ontem
    INSERT INTO ultimadata (userId, dia_desafio_feito)
    VALUES (NEW.id, DATE_SUB(NEW.data_criacao, INTERVAL 1 DAY));
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
