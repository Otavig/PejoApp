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

// Criação da conexão com o banco de dados
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
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
        user: "pejoapp@gmail.com",
        pass: "ebwh dzei junm ypev",
    },
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
    const emailCheckQuery = 'SELECT * FROM usuarios WHERE email = ? OR telefone = ?';
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

        // Continuação do registro
        try {
            const salt = await bcrypt.genSalt(10); // `await` works because this function is async
            const hashedPassword = await bcrypt.hash(senha, salt);
            const confirmationToken = generateToken();
            const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000);

            const query = 'INSERT INTO usuarios (nome, email, senha, telefone, data_nascimento, token_confirmacao_email, token_expiration) VALUES (?, ?, ?, ?, ?, ?, ?)';
            
            db.query(query, [nome, email, hashedPassword, telefone, formattedDate, confirmationToken, tokenExpiration], async (err, result) => {
                if (err) {
                    console.error('Erro ao registrar usuário:', err);
                    return res.status(500).json({ erro: 'Erro ao registrar usuário' });
                }

                const confirmationLink = `http://10.111.9.61:3000/confirm-email?token=${confirmationToken}`;
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
        return res.status(400).json({ erro: 'Token não fornecido. Acesso negado.' });
    }

    const query = 'SELECT * FROM usuarios WHERE token_confirmacao_email = ? AND token_expiration > ?';
    db.query(query, [token, new Date()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ erro: 'Link inválido ou expirado. Acesso negado.' });
        }

        // Token válido, atualizar o status do e-mail e tipo de usuário
        const updateQuery = 'UPDATE usuarios SET status_email = 1, tipo_usuario = "usuario", token_confirmacao_email = NULL WHERE token_confirmacao_email = ?';
        db.query(updateQuery, [token], (err) => {
            if (err) {
                console.error('Erro ao atualizar status do e-mail:', err);
                return res.status(500).json({ erro: 'Erro ao confirmar e-mail' });
            }

            res.json({ mensagem: 'E-mail confirmado com sucesso!' });
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

// Rota pegar desafio diario
const getDesafios = (req, res) => {
    const query = 'SELECT * FROM desafios;';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ erro: 'Erro ao receber dados' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ erro: 'Desafios não encontrados' });
        }

        // Retorna a lista de desafios
        res.status(200).json({ mensagem: 'Dados Recebidos', desafios: results });
    });
};

// Função para enviar e-mail de recuperação de senha
const sendPasswordResetEmail = async (email, token) => {
    const mailOptions = {
        from: 'pejoapp@gmail.com',
        to: email,
        subject: 'Redefinição de Senha',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                <h2 style="color: #2196F3;">Redefinição de Senha</h2>
                <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
                <a href="http://10.111.9.61:3000/reset-password?token=${token}" style="background-color: #2196F3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
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

// Rota para redefinir a senha
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    // Verificar se o token é válido
    const query = 'SELECT * FROM usuarios WHERE token_recuperacao_senha = ? AND token_expirate > ?';
    db.query(query, [token, new Date()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ erro: 'Token inválido ou expirado.' });
        }

        // Atualizar a senha do usuário
        const usuario = results[0];
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const updateQuery = 'UPDATE usuarios SET senha = ?, token_recuperacao_senha = NULL WHERE id = ?';
            db.query(updateQuery, [hashedPassword, usuario.id], (err) => {
                if (err) {
                    console.error('Erro ao atualizar a senha:', err);
                    return res.status(500).json({ erro: 'Erro ao redefinir a senha.' });
                }
                res.json({ mensagem: 'Senha redefinida com sucesso.' });
            });
        } catch (err) {
            console.error('Erro ao criptografar a nova senha:', err);
            res.status(500).json({ erro: 'Erro ao redefinir a senha.' });
        }
    });
};

// Configuração do Express e rotas
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', login);
app.post('/register', register);
app.post('/confirm-email', confirmEmail);
app.get('/desafios', getDesafios);
app.post('/forgot-password', forgot_password);
app.post('/reset-password', resetPassword);
app.post('/admin-login', adminLogin);

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('send_message', (message) => io.emit('receive_message', message));
    socket.on('disconnect', () => console.log('Cliente desconectado'));
});

// Iniciar servidor
server.listen(process.env.PORT || 3000, () => {
    console.log('Servidor rodando na porta 3000');
});
