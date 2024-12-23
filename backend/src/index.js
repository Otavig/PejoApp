// Requerimentos de pacotes
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const multer = require('multer');
const fs = require('fs');

const directoryPath = path.join(__dirname, 'imgs_users');
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
}

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_pejo"
});


db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados.');
    }
});

// Função para gerar token de confirmação
function generateToken() {
    return crypto.randomBytes(16).toString('hex');
}

// Função para enviar email de confirmação
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pejoapp@gmail.com',
        pass: 'ebwh dzei junm ypev',
    },
    tls: {
        rejectUnauthorized: false  // Ignorar problemas com certificados SSL (use com cuidado)
    }
});

// Função para enviar email de confirmação
const sendConfirmationEmail = async (email, nome, confirmationLink) => {
    const mailOptions = {
        from: 'pejoapp@gmail.com',
        to: email,
        subject: 'Confirmação de Email',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h2 style="color: #2196F3;">Olá ${nome},</h2>
                <p>Por favor, confirme seu email clicando no link abaixo:</p>
                <a href="${confirmationLink}" style="background-color: #2196F3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Confirmar Email</a>
                <p>Obrigado!</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email de confirmação enviado para:', email);
    } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
    }
};


// Função para registrar usuário
const register = async (req, res) => {
    const { nome, email, senha, telefone, data_nascimento } = req.body;
    const formattedDate = data_nascimento ? new Date(data_nascimento).toISOString().split('T')[0] : null;

    // Verificação se o email ou telefone já existe
    const emailCheckQuery = 'SELECT * FROM usuarios WHERE email = "?" OR telefone = "?"';
    db.query(emailCheckQuery, [email, telefone], async (err, results) => {
        if (err) {
            console.error('Erro ao verificar email ou telefone:', err);
            return res.status(500).json({ erro: 'Erro ao verificar email ou telefone' });
        }
        if (results.length > 0) {
            return res.status(400).json({ erro: 'Email ou telefone já cadastrado.' });
        }

        // Verificação de força da senha
        const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!strongPasswordRegex.test(senha)) {
            return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres, incluir pelo menos um número e uma letra maiúscula.' });
        }

        // Função para gerar um token único
        const generateUniqueToken = async () => {
            let token;
            let exists = true;

            while (exists) {
                token = generateToken(); // Gera um novo token
                // Verifica se o token já existe no banco de dados
                const tokenCheckQuery = 'SELECT * FROM usuarios WHERE token_confirmacao_email = ?';
                const [rows] = await db.promise().query(tokenCheckQuery, [token]);
                exists = rows.length > 0; // Se o token já existe, gera um novo
            }

            return token; // Retorna um token único
        };

        // Continuação do registro
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(senha, salt);
            const confirmationToken = await generateUniqueToken(); // Gera um token único
            const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000);

            // Adiciona o campo 'tipo_usuario' com o valor 'confirmação'
            const query = 'INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, token_confirmacao_email, token_expiration, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            db.query(query, [nome, email, hashedPassword, telefone, formattedDate, confirmationToken, tokenExpiration, 'confirmação'], async (err, result) => {
                if (err) {
                    console.error('Erro ao registrar usuário:', err);
                    return res.status(500).json({ erro: 'Erro ao registrar usuário' });
                }

                const confirmationLink = `http://10.111.9.44:3000/siteConfirm.html?token=${confirmationToken}`;
                await sendConfirmationEmail(email, nome, confirmationLink);

                res.json({ mensagem: 'Usuário registrado com sucesso. Verifique seu e-mail para confirmar.' });
            });

        } catch (err) {
            console.error('Erro ao criptografar a senha:', err);
            res.status(500).json({ erro: 'Erro ao criptografar a senha' });
        }
    });
};

// Função para confirmar o e-mail
const confirmEmail = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).send({ erro: 'Token não fornecido. Acesso negado.' });
    }

    // Verificar o token no banco de dados
    const query = 'SELECT * FROM usuarios WHERE token_confirmacao_email = ? AND token_expiration > ?';
    db.query(query, [token, new Date()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send({ erro: 'Link inválido ou expirado. Acesso negado.' });
        }

        // Token válido, atualizar o status do e-mail
        const updateQuery = 'UPDATE usuarios SET tipo_usuario = "usuario", token_confirmacao_email = NULL WHERE token_confirmacao_email = ?';
        db.query(updateQuery, [token], (err) => {
            if (err) {
                console.error('Erro ao atualizar status do e-mail:', err);
                return res.status(500).send({ erro: 'Erro ao confirmar e-mail.' });
            }
            return res.status(200).send({ mensagem: 'E-mail confirmado com sucesso!' });
        });
    });
};


// Função para login
const login = (req, res) => {
    const { identificador, senha } = req.body;
    const query = 'SELECT * FROM usuarios WHERE (email = ? OR telefone = ?)';

    db.query(query, [identificador, identificador], async (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro no banco de dados ao fazer login' });
        if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

        const usuario = results[0];
        const isMatch = await bcrypt.compare(senha, usuario.senha);
        if (isMatch) {
            res.status(200).json({ mensagem: 'Login bem-sucedido', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo_usuario: usuario.tipo_usuario } });
        } else {
            res.status(401).json({ erro: 'Senha incorreta' });
        }
    });
};

const criptografar_senha = async (req, res) => { 
    const {senha} = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    console.log(`A senha é ${hashedPassword}`);
}

// Função para login admin
const adminLogin = (req, res) => {
    const { email, senha } = req.body;
    const query = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ erro: 'Erro no banco de dados ao fazer login' });
        if (results.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

        const usuario = results[0];

        if (usuario.tipo_usuario !== "admin") {
            return res.status(401).json({ erro: 'Usuário não é admin' });
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha);
        if (isMatch) {
            res.status(200).json({ mensagem: 'Login admin bem-sucedido', usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo_usuario: usuario.tipo_usuario } });
        } else {
            res.status(401).json({ erro: 'Senha incorreta' });
        }
    });
};

const getDesafioIntra = (req, res) => {
    const { id } = req.params; // Obtém o ID do desafio da URL
    const query = 'SELECT * FROM desafios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar desafio:', err);
            return res.status(500).json({ error: 'Erro ao buscar desafio' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Desafio não encontrado' });
        }
        res.json(results[0]); // Retorna o desafio encontrado
    });
};

// Rota para atualizar um desafio
const updateDesafio = (req, res) => {
    const { id } = req.params; // Obtém o ID do desafio da URL
    const { titulo, descricao, estado, dificuldade } = req.body; // Removido tipo

    const query = 'UPDATE desafios SET titulo = ?, descricao = ?, estado = ?, dificuldade = ? WHERE id = ?'; // Removido tipo
    db.query(query, [titulo, descricao, estado, dificuldade, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar desafio:', err);
            return res.status(500).json({ error: 'Erro ao atualizar desafio' });
        }
        res.json({ mensagem: 'Desafio atualizado com sucesso.' });
    });
};

const deleteUsuario = (req, res) => {
    const { id } = req.params; // Obtém o ID do usuário da URL
    const query = 'DELETE FROM usuarios WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao deletar usuário:', err);
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }
        res.json({ mensagem: 'Usuário deletado com sucesso.' });
    });
};

// Rota para deletar um desafio
const deleteDesafio = (req, res) => {
    const { id } = req.params; // Obtém o ID do desafio da URL
    const query = 'DELETE FROM desafios WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao deletar desafio:', err);
            return res.status(500).json({ error: 'Erro ao deletar desafio' });
        }
        res.json({ mensagem: 'Desafio deletado com sucesso.' });
    });
};

// Função para enviar e-mail de recuperação de senha
// Função para enviar o e-mail de recuperação de senha
const sendPasswordResetEmail = async (email, token) => {
    const mailOptions = {
        from: 'pejoapp@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h2 style="color: #2196F3;">Redefinição de Senha</h2>
                <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
                <a href="http://10.111.9.44:3000/siteRecovery.html?token=${token}" style="background-color: #2196F3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
                <p>Se você não solicitou essa mudança, ignore este e-mail.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail de recuperação de senha enviado para:', email);
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperação de senha:', error);
    }
};


// Rota para solicitar recuperação de senha
const forgot_password = async (req, res) => {
    const { email } = req.body;
    const token = generateToken();

    // Armazenar o token no banco de dados
    const updateQuery = 'UPDATE usuarios SET token_recuperacao_senha = ?, token_expiration = ? WHERE email = ?';
    db.query(updateQuery, [token, new Date(Date.now() + 15 * 60 * 1000), email], async (err) => {
        if (err) {
            console.error('Erro ao atualizar o token de recuperação de senha:', err);
            return res.status(500).json({ erro: 'Erro ao solicitar recuperação de senha.' });
        }

        await sendPasswordResetEmail(email, token);
        res.json({ mensagem: 'E-mail de recuperação de senha enviado.' });
    });
};

// Rota pegar desafios no intranet
const getDesafios = async (req, res) => {
    const query = 'SELECT * FROM desafios';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar desafios', details: err });
        }
        res.json(results);  // Retorna os dados em formato JSON
    });
};

// Rota pegar usuarios no intranet
const getUsuarios = async (req, res) => {
    const query = 'SELECT * FROM usuarios';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar usuários', details: err });
        }
        res.json(results);  // Retorna os dados em formato JSON
    });
};

// Rota para redefinir a senha
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Verificar se o token e a nova senha foram fornecidos
    if (!token || !newPassword) {
        return res.status(400).json({ erro: 'Token e nova senha são obrigatórios.' });
    }

    // Verificar se o token é válido e não expirou
    const query = 'SELECT * FROM usuarios WHERE token_recuperacao_senha = ? AND token_expiration > ?';
    db.query(query, [token, new Date()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ erro: 'Token inválido ou expirado.' });
        }

        const usuario = results[0];

        try {
            // Criptografar a nova senha
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Atualizar a senha no banco de dados e limpar o token
            const updateQuery = 'UPDATE usuarios SET senha = ?, token_recuperacao_senha = NULL, token_expiration = NULL WHERE id = ?';
            db.query(updateQuery, [hashedPassword, usuario.id], (err) => {
                if (err) {
                    console.error('Erro ao atualizar a senha:', err);
                    return res.status(500).json({ erro: 'Erro ao redefinir a senha.' });
                }

                // Sucesso na atualização
                res.json({ mensagem: 'Senha redefinida com sucesso!' });
            });
        } catch (err) {
            console.error('Erro ao criptografar a nova senha:', err);
            res.status(500).json({ erro: 'Erro ao redefinir a senha.' });
        }
    });
};

// Rota para obter informações do usuário pelo ID
const getUserById = (req, res) => {
    const { id } = req.params; // Obtém o ID do usuário da URL
    const query = 'SELECT * FROM usuarios WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.json(results[0]); // Retorna o usuário encontrado
    });
};

// Configuração do multer para armazenar as imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imgs_eventos/'); // Pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nomeia a imagem com um timestamp
    },
});

const upload = multer({ storage });

// Definição do armazenamento para imagens de perfil
const storagePerfil = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imgs_users/'); // Diretório onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nome único com timestamp
    },
});

const uploadPerfil = multer({ storage: storagePerfil });

// Função para atualizar o usuário
const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    // Se uma imagem foi enviada, usa ela. Caso contrário, mantém a imagem anterior.
    const profileImage = req.file ? req.file.filename : req.body.profileImage;

    const query = 'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, profileImage = ? WHERE id = ?';
    db.query(query, [name, email, phone, profileImage, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
        res.json({ mensagem: 'Usuário atualizado com sucesso.' });
    });
};

const novoLevelConcluido = (req, res) => {
    const { id, quantia } = req.params;  // Correct way to destructure both id and quantia from req.params

    // Primeiro, obtemos o nível atual do usuário
    const getCurrentLevelQuery = 'SELECT nivel FROM usuarios WHERE id = ?';

    db.query(getCurrentLevelQuery, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar nível atual do usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar nível do usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const currentLevel = results[0].nivel;
        const newLevel = currentLevel + parseInt(quantia, 10); // Ensure quantia is an integer

        // Agora, atualizamos o nível do usuário no banco
        const updateQuery = 'UPDATE usuarios SET nivel = ? WHERE id = ?';
        db.query(updateQuery, [newLevel, id], (err) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }
            res.json({ mensagem: `Nível do usuário atualizado com sucesso. Novo nível: ${newLevel}`, novoNivel: newLevel });
        });
    });
};

// Rota para criar uma oportunidade
const criarOportunidade = (req, res) => {
    const { idUser, cpf, horarios, cfp, cidade, forma_de_pagamento, descricao_forma_pagamento } = req.body;

    const query = `INSERT INTO oportunidades (user_id, cpf, horarios, cfp, forma_de_pagamento, cidade, descricao_forma_pagamento) 
                    VALUES (${idUser}, '${cpf}', '${horarios}', '${cfp}', '${forma_de_pagamento}', '${cidade}, '${descricao_forma_pagamento}');`;

    db.query(query, (err, results) => {
        if (err) return res.status(500).send(`Houve um erro: ${err}`);
        res.json(results);
    });
};

const buscarOportunidades = async (req, res) =>{
    const query = "SELECT * FROM oportunidades;"
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(`Houve um erro: ${err}`);
        res.json(results);
    })
}


const buscarNome = async (req, res) => {
    const { id } = req.params; // Desestrutura o parâmetro id da URL

    // Valida se o id é um número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'O ID fornecido é inválido.' });
    }

    const query = 'SELECT nome FROM usuarios WHERE id = ?'; // Usa ? para prevenir SQL Injection

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar nome:', err); // Log no servidor para debug
            return res.status(500).json({ error: `Houve um erro: ${err.message}` });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json(results[0]); // Envia apenas o primeiro resultado, já que é por ID
    });
};

// Rota para obter mensagens
const getMessages = (req, res) => {
    const personId = req.params.personId;
    db.query('SELECT * FROM chats WHERE remetente_id = ? OR destinatario_id = ?', [personId, personId], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};


// Rota para criar um novo desafio
const createDesafio = (req, res) => {
    const { titulo, descricao, estado, dificuldade } = req.body; // Removido tipo e data_ativacao

    // Verifique se todos os campos necessários estão presentes
    if (!titulo || !descricao || !estado || !dificuldade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO desafios (titulo, descricao, estado, dificuldade) VALUES (?, ?, ?, ?)'; // Removido tipo e data_ativacao
    db.query(query, [titulo, descricao, estado, dificuldade], (err) => {
        if (err) {
            console.error('Erro ao criar desafio:', err);
            return res.status(500).json({ error: 'Erro ao criar desafio' });
        }
        res.json({ mensagem: 'Desafio criado com sucesso.' });
    });
};

// Rota para criar um novo evento
const createEvento = (req, res) => {
    const { nome, descricao, data_evento, local, coordenadas } = req.body; // Captura os dados do evento
    const imagens = req.files; // Captura as imagens

    // Verifique se todos os campos necessários estão presentes
    if (!nome || !descricao || !data_evento || !local || !coordenadas) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Lógica para armazenar as imagens (se necessário)
    // Aqui você pode implementar a lógica para salvar as imagens no servidor ou no banco de dados

    const query = 'INSERT INTO eventos (nome, descricao, data_evento, local, imagens, coordenadas) VALUES (?, ?, ?, ?, ?, ?)'; // Adicione lógica para armazenar imagens
    db.query(query, [nome, descricao, data_evento, local, JSON.stringify(imagens), coordenadas], (err) => {
        if (err) {
            console.error('Erro ao criar evento:', err);
            return res.status(500).json({ error: 'Erro ao criar evento' });
        }
        res.json({ mensagem: 'Evento criado com sucesso.' });
    });
};

// Rota para carregar eventos
const loadEventosIntra = async (req, res) => {
    const query = 'SELECT * FROM eventos'; // Consulta para pegar todos os eventos
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar eventos:', err);
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
        res.json(results); // Retorna os eventos encontrados
    });
};

// Rota para atualizar um evento
const updateEvento = (req, res) => {
    const { id } = req.params; // Obtém o ID do evento da URL
    const { nome, descricao, data_evento, local, coordenadas } = req.body; // Obtém os dados do evento a serem atualizados

    console.log('Atualizando evento com ID:', id);
    console.log('Dados recebidos:', { nome, descricao, data_evento, local, coordenadas });

    const query = 'UPDATE eventos SET nome = ?, descricao = ?, data_evento = ?, local = ?, coordenadas = ? WHERE id = ?';
    db.query(query, [nome, descricao, data_evento, local, coordenadas, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar evento:', err);
            return res.status(500).json({ error: 'Erro ao atualizar evento', details: err });
        }
        res.json({ mensagem: 'Evento atualizado com sucesso.' });
    });
};

// Rota para deletar um evento
const deleteEvento = (req, res) => {
    const { id } = req.params; // Obtém o ID do evento da URL
    const query = 'DELETE FROM eventos WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Erro ao deletar evento:', err);
            return res.status(500).json({ error: 'Erro ao deletar evento' });
        }
        res.json({ mensagem: 'Evento deletado com sucesso.' });
    });
};

// Rota para obter um evento pelo ID
const getEventoById = (req, res) => {
    const { id } = req.params; // Obtém o ID do evento da URL
    const query = 'SELECT * FROM eventos WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar evento:', err);
            return res.status(500).json({ error: 'Erro ao buscar evento' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Evento não encontrado' });
        }
        res.json(results[0]); // Retorna o evento encontrado
    });
};

// Função para obter desafios ativos e usuários de alto nível
const getChallengesData = async (req, res) => {
    try {
        // Consulta para pegar desafios ativos e desativados
        const desafiosQuery = `
            SELECT 
                SUM(CASE WHEN estado = "ativado" THEN 1 ELSE 0 END) AS desafiosAtivos,
                SUM(CASE WHEN estado = "desativado" THEN 1 ELSE 0 END) AS desafiosDesativados
            FROM desafios
        `;
        const [desafiosResults] = await db.promise().query(desafiosQuery);

        // Consulta para pegar usuários com nível acima de 50
        const usuariosQuery = 'SELECT COUNT(*) AS usuariosNivelAlto FROM usuarios WHERE nivel > 50';
        const [usuariosResults] = await db.promise().query(usuariosQuery);

        // Retorna os dados em formato JSON
        res.json({
            desafiosAtivos: desafiosResults[0].desafiosAtivos,
            desafiosDesativados: desafiosResults[0].desafiosDesativados,
            usuariosNivelAlto: usuariosResults[0].usuariosNivelAlto
        });
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
};
// Rota para obter a contagem de desafios
const getDesafiosCount = async (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM desafios';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao contar desafios', details: err });
        }
        res.json({ count: results[0].count });
    });
};

// Rota para obter a contagem de usuários
const getUsuariosCount = async (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM usuarios';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao contar usuários', details: err });
        }
        res.json({ count: results[0].count });
    });
};

// Rota para obter eventos recentes
const getRecentEventos = async (req, res) => {
    const query = 'SELECT * FROM eventos ORDER BY data_evento DESC LIMIT 5';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar eventos recentes', details: err });
        }
        res.json(results);
    });
};

// Rota para obter os jogadores de nível mais alto
const getTopPlayers = async (req, res) => {
    const query = 'SELECT * FROM usuarios ORDER BY nivel DESC LIMIT 5';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar jogadores de nível mais alto', details: err });
        }
        res.json(results);
    });
};

// Rota pegar desafios feitos
const desafiosFeitos = (req, res) => {
    const userId = req.query.userId;

    const query = 'SELECT desafios_feitos FROM usuarios WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar desafios concluídos' });
        }

        // Verifique se há resultados
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Pegue o valor de desafios_feitos do primeiro item do resultado
        const desafiosFeitos = results[0].desafios_feitos;

        res.json({ desafiosConcluidos: desafiosFeitos });
    });
}

// Rota para resetar desafios feitos
const resetDesafiosFeitos = (req, res) => {
    const userId = req.params;

    // A consulta de atualização para resetar desafios_feitos
    const query = 'UPDATE usuarios SET desafios_feitos = ? WHERE id = ?';

    // Aqui, você define o valor como um array vazio
    db.query(query, [JSON.stringify([]), userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao resetar desafios concluídos' });
        }

        // Verifique se o usuário foi encontrado
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Desafios concluídos resetados com sucesso' });
    });
};

const oportunidadeCriadaOuNao = (req, res) => {
    const { id } = req.params;
    const queryVerify = `SELECT user_id FROM oportunidades WHERE user_id = ?`;

    db.query(queryVerify, [id], (err, resultado) => {
        if (err) {
            console.error("Erro ao consultar o banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Verifique se o usuário foi encontrado
        if (resultado.length === 0) {
            return res.status(200).json({ "existe": false });
        }
        res.status(200).json({ "existe": true });
    });
};

const buscarAvaliacoes = (req, res) => {
    const { id } = req.params;

    // console.log(`Recebida solicitação para buscar avaliações com ID: ${id}`);

    if (!id || isNaN(id)) {
        console.error("ID inválido:", id);
        return res.status(400).json({ error: "ID inválido" });
    }

    const queryVerify = `SELECT avaliacao FROM usuarios WHERE id = ?;`;
    db.query(queryVerify, [id], (err, resultado) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (resultado.length === 0) {
            console.warn("Nenhuma avaliação encontrada para o ID:", id);
            return res.status(404).json({ message: "Nenhuma avaliação encontrada" });
        }

        // console.log("Avaliação encontrada:", resultado);
        // Retorna apenas o campo 'avaliacao' para melhor clareza
        res.json({ avaliacao: resultado[0].avaliacao });
    });
};

const buscarContratadoPorId = (req, res) => {
    const { idUser, idContratado } = req.query;
    console.log(idUser,idContratado)

    // Verifica se os IDs fornecidos são válidos
    if (!idUser || isNaN(idUser)) {
        console.error("ID do usuário inválido:", idUser);
        return res.status(400).json({ error: "ID do usuário inválido" });
    }
    if (!idContratado || isNaN(idContratado)) {
        console.error("ID do contratado inválido:", idContratado);
        return res.status(400).json({ error: "ID do contratado inválido" });
    }

    const query = `SELECT contratados FROM usuarios WHERE id = ?;`;
    db.query(query, [idUser], (err, resultado) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (resultado.length === 0) {
            console.warn("Nenhum contratado encontrado para o ID do usuário:", idUser);
            return res.status(404).json({ message: "Nenhum contratado encontrado" });
        }

        const contratadosString = resultado[0].contratados;

        try {
            // Converte a string para um array
            const contratadosArray = JSON.parse(contratadosString);

            if (!Array.isArray(contratadosArray)) {
                throw new Error("Formato de contratados inválido");
            }

            // Verifica se o idContratado está na lista
            const isContratado = contratadosArray.includes(parseInt(idContratado, 10));

            res.json({
                contratado: { idContratado },
                canHire: !isContratado, // Se não estiver contratado, o botão aparece
            });
        } catch (parseError) {
            console.error("Erro ao processar a lista de contratados:", parseError);
            return res.status(500).json({ error: "Erro ao processar a lista de contratados" });
        }
    });
};

const adicionarContratado = (req, res) => {
    const { id, contratadoId } = req.body;

    console.log(`Recebida solicitação para adicionar contratado ${contratadoId} para o usuário com ID: ${id}`);

    // Verifica se os IDs são válidos
    if (!id || isNaN(id) || !contratadoId || isNaN(contratadoId)) {
        console.error("ID ou contratadoId inválido:", { id, contratadoId });
        return res.status(400).json({ error: "ID ou contratadoId inválido" });
    }

    // Consulta para verificar os contratados atuais do usuário
    const queryVerify = `SELECT contratados FROM usuarios WHERE id = ?;`;
    db.query(queryVerify, [id], (err, resultado) => {
        if (err) {
            console.error("Erro no banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (resultado.length === 0) {
            console.warn("Usuário não encontrado com ID:", id);
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Converte a coluna 'contratados' de JSON para um array
        let contratados = JSON.parse(resultado[0].contratados);

        // Verifica se o contratadoId já está na lista de contratados
        if (!contratados.includes(Number(contratadoId))) {
            contratados.push(Number(contratadoId)); // Adiciona o contratadoId à lista
        }

        // Atualiza a coluna 'contratados' no banco de dados
        const queryUpdate = `UPDATE usuarios SET contratados = ? WHERE id = ?;`;
        db.query(queryUpdate, [JSON.stringify(contratados), id], (err, updateResult) => {
            if (err) {
                console.error("Erro ao atualizar banco de dados:", err);
                return res.status(500).json({ error: "Erro ao atualizar os contratados" });
            }

            console.log("Contratado adicionado com sucesso.");
            res.json({ message: "Contratado adicionado com sucesso", contratados });
        });
    });
};


// Rota pegar ultima data
const ultimaData = (req, res) => {
    const userId = req.params.id;
    const query = `SELECT dia_desafio_feito FROM ultimadata WHERE userId = "${userId}"`;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar a última data' });
        }

        if (results.length > 0) {
            res.json({ date: results[0].dia_desafio_feito });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });
}

const ultimaDataMarcar = (req, res) => {
    const userId = req.params.id;
    const novaData = req.params.dia_desafio_feito; // Agora pega do parâmetro da URL.

    // Query para atualizar a data
    const query = `UPDATE ultimadata SET dia_desafio_feito = ? WHERE userId = ?`;

    db.query(query, [novaData, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar a última data', details: err.message });
        }

        if (results.affectedRows > 0) {
            res.json({ success: true, message: 'Data atualizada com sucesso' });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado para atualização' });
        }
    });
};

// Rota cadastrar Último Desafio Realizado!
const cadastrarUltimoDesafioRealizado = (req, res) => {
    // Corrigindo o destructuring dos parâmetros
    const { idUser, desafioId } = req.params;

    const hoje = new Date();

    // Usando prepared statements para evitar SQL Injection
    const query = `UPDATE usuarios SET ultimo_desafio_montado = ?, data_ultimo_desafio_entregue = ? WHERE id = ?`;

    // Executando a query
    db.query(query, [desafioId, hoje, idUser], (err, results) => {
        if (err) {
            // Se houver erro, retorna status 500
            return res.status(500).json({ error: 'Erro ao dar um update no ultimo desafio Realizado' });
        }

        // Se a atualização for bem-sucedida, retorna um status 200 com sucesso
        return res.status(200).json({ message: 'Último desafio realizado atualizado com sucesso!' });
    });
};

// Rota para consultar ultima data_ultimo_desafio_entregue
const dataUltimoDesafioEntregue = (req, res) => {
        const idUsuario = req.params.id

        // Usando prepared statements para evitar SQL Injection
        const query = `SELECT data_ultimo_desafio_entregue FROM usuarios WHERE id = ${idUsuario}`;

        // Executando a query
        db.query(query, (err, results) => {
            if (err) {
                // Se houver erro, retorna status 500
                return res.status(500).json({ error: 'Erro de puxar as informações' });
            }
            
            // Verifique se há resultados
            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Pegue o valor de desafios_feitos do primeiro item do resultado
            const data = results[0];

            return res.json({ utlimoDataDesafio: data });
        });
}



// Rota para buscar o Último Desafio Realizado
const buscarUltimoDesafioMontado = (req, res) => {
    // Corrigindo o destructuring dos parâmetros
    const { idUser } = req.params;

    // Usando prepared statement para evitar SQL Injection
    const query = `SELECT ultimo_desafio_montado FROM usuarios WHERE id = ?`;

    // Executando a query
    db.query(query, [idUser], (err, results) => {
        if (err) {
            // Se houver erro, retorna status 500
            return res.status(500).json({ error: 'Erro ao buscar o último desafio realizado' });
        }

        if (results.length === 0) {
            // Se não encontrar o usuário, retorna status 404
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Se encontrado, retorna o desafio
        return res.status(200).json({ ultimoDesafioRealizado: results[0].ultimo_desafio_montado });
    });
};


// 3. Registrar um desafio como concluído
const desafiosConcluidos = (req, res) => {
    const userId = req.params.userId; // Identificador do usuário
    const idDesafio = Number(req.params.idDesafio); // Convertendo o idDesafio para número

    // Query para buscar os desafios concluídos do usuário
    const querySelect = 'SELECT desafios_feitos FROM usuarios WHERE id = ?';

    db.query(querySelect, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar desafios concluídos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Recupera os desafios concluídos (em formato de string)
        let desafiosFeitos = results[0].desafios_feitos;

        // Converte a string de desafios para um array
        if (desafiosFeitos) {
            desafiosFeitos = JSON.parse(desafiosFeitos);
        } else {
            desafiosFeitos = [];
        }

        // Adiciona o novo desafio, caso ainda não esteja presente no array
        if (!desafiosFeitos.includes(idDesafio)) {
            desafiosFeitos.push(idDesafio);
        }

        // Converte o array de volta para uma string
        const desafiosFeitosString = JSON.stringify(desafiosFeitos);

        // Query para atualizar os desafios do usuário no banco de dados
        const queryUpdate = 'UPDATE usuarios SET desafios_feitos = ? WHERE id = ?';

        db.query(queryUpdate, [desafiosFeitosString, userId], (err, updateResults) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao registrar desafio concluído' });
            }

            if (updateResults.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.status(200).json({ message: 'Desafio registrado como concluído' });
        });
    });
};


const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new  Date(date).toLocaleDateString('en-GB', options); // Formato 'DD/MM/YYYY'
    const [day, month, year] = formattedDate.split('/');
    return `${year}-${month}-${day}`; // Formato 'YYYY-MM-DD'
};


// Configuração do Express e rotas
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.post('/reset-desafios-feitos/:idUser', resetDesafiosFeitos);
app.post('/verificar-oportunidade-foi-criada/:id', oportunidadeCriadaOuNao)
app.get('/buscar-avaliacoes/:id', buscarAvaliacoes);
app.get('/buscar-contratado-por-id', buscarContratadoPorId)
app.post('/contratar', adicionarContratado);
app.post('/criar-oportunidade', criarOportunidade);
app.get('/buscar-oportunidades', buscarOportunidades);
app.get('/buscar-nome-usuario-unico/:id', buscarNome);
app.get('/data-ultimo-desafio-entregue/:id', dataUltimoDesafioEntregue);
app.put('/user/:idUser/desafio/:desafioId', cadastrarUltimoDesafioRealizado);
app.get('/ultimaData/:id', ultimaData);
app.get('/ultimoDesafioMontado/:idUser', buscarUltimoDesafioMontado);
app.put('/ultimaData/marcar/:id/:dia_desafio_feito', ultimaDataMarcar);
app.put('/desafios/concluir/:userId/:idDesafio', desafiosConcluidos);
app.get('/desafios/feitos', desafiosFeitos);
app.get('/api/desafios/count', getDesafiosCount);
app.get('/api/usuarios/count', getUsuariosCount);
app.get('/api/eventos/recent', getRecentEventos);
app.get('/api/top-players', getTopPlayers);
app.post('/login', login);
app.post('/register', register);
app.post('/confirm-email', confirmEmail);
app.post('/forgot-password', forgot_password);
app.post('/reset-password', resetPassword);
app.post('/admin-login', adminLogin);
app.get('/getDesafios', getDesafios);
app.get('/getUsuarios', getUsuarios);
app.get('/intra/getDesafio/:id', getDesafioIntra);
app.put('/intra/updateDesafio/:id', updateDesafio); // Rota para atualizar um desafio
app.put('/upUser/:id/:quantia', novoLevelConcluido); // Rota para atualizar um desafio
app.delete('/intra/deleteUsuario/:id', deleteUsuario); // Rota para deletar um usuário
app.delete('/intra/deleteDesafio/:id', deleteDesafio); // Rota para deletar um desafio
app.get('/user/:id', getUserById); // Adiciona a rota para obter usuário
app.put('/userEdit/:id', uploadPerfil.single('profileImage'), updateUser);
app.post('/intra/createDesafio', createDesafio); // Rota para criar um novo desafio
app.get('/api/messages/:personId', getMessages); // Rota para obter mensagens
app.post('/intra/createEvento', upload.array('imagens'), (req, res) => {
    const { nome, descricao, data_evento, local, coordenadas} = req.body; // Captura os dados do evento
    const imagens = req.files.map(file => file.filename); // Captura os nomes das imagens

    // Verifique se todos os campos necessários estão presentes
    if (!nome || !descricao || !data_evento || !local || !coordenadas) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const query = 'INSERT INTO eventos (nome, descricao, data_evento, local, imagens, coordenadas) VALUES (?, ?, ?, ?, ?, ?)'; // Adicione lógica para armazenar imagens
    db.query(query, [nome, descricao, data_evento, local, JSON.stringify(imagens), coordenadas], (err) => {
        if (err) {
            console.error('Erro ao criar evento:', err);
            return res.status(500).json({ error: 'Erro ao criar evento' });
        }
        res.json({ mensagem: 'Evento criado com sucesso.' });
    });
});
app.post('/criptografar_senha', criptografar_senha); // Rota para criar senha temporarias
app.get('/getEventos', loadEventosIntra); // Certifique-se de que a função loadEventos está definida
app.put('/intra/updateEvento/:id', updateEvento); // Rota para atualizar um evento
app.delete('/intra/deleteEvento/:id', deleteEvento); // Rota para deletar um evento
app.get('/intra/getEvento/:id', getEventoById); // Rota para obter evento pelo ID
app.put('/intra/updateUsuario/:id', (req, res) => {
    const { id } = req.params; // Obtém o ID do usuário da URL
    const { nome, email, telefone, tipo_usuario, nivel } = req.body; // Obtém os dados do usuário a serem atualizados

    const query = 'UPDATE usuarios SET nome = ?, email = ?, telefone = ?, tipo_usuario = ?, nivel = ? WHERE id = ?';
    db.query(query, [nome, email, telefone, tipo_usuario, nivel, id], (err) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
        res.json({ mensagem: 'Usuário atualizado com sucesso.' });
    });
});

app.get('/api/challenges', getChallengesData);

// Serve imagens da pasta 'imgs_eventos'
app.use('/imagesEventos', express.static(path.join(__dirname, 'imgs_eventos')));
app.use('/imagesUsers', express.static(path.join(__dirname, 'imgs_users')));


io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('send_message', (message) => io.emit('receive_message', message));
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

// Iniciar servidor
server.listen(process.env.PORT || 3000, () => {
    console.log('Servidor rodando na porta 3000');
});
