const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(cors({
    origin: '*', // Em produção, especifique os domínios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_pejo',  // Atualizado para o nome correto do banco de dados
});

// Função para converter data no formato DD/MM/YYYY para YYYY-MM-DD
const convertDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
};

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Rota para verificar se o telefone já está registrado
app.get('/check-phone/:phone', (req, res) => {
    const phone = req.params.phone;
    const query = 'SELECT * FROM cadastros WHERE telefone = ?';

    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error('Erro ao verificar telefone:', err);
            return res.status(500).json({ erro: 'Erro no banco de dados ao verificar telefone', mensagem: err.message });
        }

        if (results.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    });
});

// Função para gerar um token aleatório
function generateToken() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
    const { nome, email, senha, telefone, data_nascimento } = req.body;
    const formattedDate = data_nascimento ? convertDateToISO(data_nascimento) : null;

    console.log('Iniciando processo de registro para:', email);

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        const confirmationToken = generateToken();
        const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        console.log('Token gerado:', confirmationToken);

        const query = 'INSERT INTO cadastros (nome, email, senha, telefone, data_nascimento, confirmation_token, token_expiration) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [nome, email, hashedPassword, telefone, formattedDate, confirmationToken, tokenExpiration], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário no banco de dados:', err);
                return res.status(500).json({ erro: 'Erro no banco de dados ao registrar usuário', mensagem: err.message });
            }

            console.log('Usuário inserido no banco de dados com sucesso');

            // Enviar e-mail de confirmação
            const confirmationLink = `http://10.111.9.44:3006/confirm-email?token=${confirmationToken}`;
                const mailOptions = {
                from: 'pejoapp@gmail.com',
                to: email,
                subject: 'Confirmação de E-mail - PejoApp',
                html: `
                    <h2>Confirmação de E-mail - PejoApp</h2>
                    <p>Olá ${nome},</p>
                    <p>Clique no link abaixo para confirmar seu e-mail:</p>
                    <a style="display: inline-block; padding: 10px 20px; background-color: #0088CC; color: white; text-decoration: none; border-radius: 5px;" href="${confirmationLink}">Confirmar E-mail</a>
                    <p>Se o link não funcionar, você pode usar o seguinte token de confirmação: <strong>${confirmationToken}</strong></p>
                    <p>Este token expira em 15 minutos.</p>
                    <p>Atenciosamente,<br>Equipe PejoApp</p>
                `
            };

            console.log('Tentando enviar e-mail para:', email);

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erro ao enviar e-mail de confirmação:', error);
                    return res.status(500).json({ erro: 'Erro ao enviar e-mail de confirmação', mensagem: error.message });
                }
                console.log('E-mail de confirmação enviado com sucesso:', info.response);
                res.json({ mensagem: 'Usuário registrado com sucesso. Verifique seu e-mail para confirmar.' });
            });
        });
    } catch (err) {
        console.error('Erro ao criptografar a senha:', err);
        res.status(500).json({ erro: 'Erro ao criptografar a senha', mensagem: err.message });
    }
});

// Update the GET /confirm-email route
app.get('/confirm-email', (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Token não fornecido. Acesso negado.');
    }

    const query = 'SELECT * FROM cadastros WHERE confirmation_token = ? AND token_expiration > ?';
    db.query(query, [token, new Date()], (err, results) => {
        if (err || results.length === 0) {
            // Token inválido ou expirado
            return res.status(400).send('Link inválido ou expirado. Acesso negado.');
        }
        
        // Token válido, enviar a página de confirmação
        res.sendFile(path.join(__dirname, 'public', 'siteConfirm.html'));
    });
});

// Update the POST /confirm-email route
app.post('/confirm-email', (req, res) => {
    const { token } = req.body;

    const query = 'SELECT * FROM cadastros WHERE confirmation_token = ? AND token_expiration > NOW()';
    db.query(query, [token], (err, results) => {
        if (err) {
            console.error('Erro ao verificar token de confirmação:', err);
            return res.status(500).json({ erro: 'Erro ao verificar token de confirmação', mensagem: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ erro: 'Token inválido ou expirado' });
        }

        const user = results[0];
        const updateQuery = 'UPDATE cadastros SET cargo = "user", confirmation_token = NULL, token_expiration = NULL WHERE id = ?';
        db.query(updateQuery, [user.id], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Erro ao atualizar status do usuário:', updateErr);
                return res.status(500).json({ erro: 'Erro ao atualizar status do usuário', mensagem: updateErr.message });
            }

            res.json({ mensagem: 'E-mail confirmado com sucesso. Você pode fechar esta página.' });
        });
    });
});

// Tarefa agendada para excluir contas não confirmadas
setInterval(() => {
    const deleteQuery = 'DELETE FROM cadastros WHERE cargo = "pendente" AND token_expiration < NOW()';
    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error('Erro ao excluir contas não confirmadas:', err);
        } else {
            console.log(`${result.affectedRows} contas não confirmadas foram excluídas.`);
        }
    });
}, 15 * 60 * 1000); // Executar a cada 15 minutos

// Rota para buscar um usuário pelo ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT id, nome, email, telefone, DATE_FORMAT(data_nascimento, "%Y-%m-%d") as data_nascimento, imagem_url FROM cadastros WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao buscar usuário', mensagem: err.message });
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('Dados do usuário enviados:', user); // Log para debug
            res.status(200).json({ user });
        } else {
            res.status(404).json({ erro: 'Usuário não encontrado' });
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    console.log('Recebida requisição de login:', req.body);
    const { identifier, password } = req.body;
    const query = 'SELECT * FROM cadastros WHERE (email = ? OR telefone = ?)';
    db.query(query, [identifier, identifier], async (err, results) => {
        if (err) {
            console.error('Erro no banco de dados ao fazer login:', err);
            return res.status(500).json({ erro: 'Erro no banco de dados ao fazer login', mensagem: err.message });
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('Usuário encontrado:', user);
            try {
                const isMatch = await bcrypt.compare(password, user.senha);
                console.log('Resultado da comparação de senha:', isMatch);
                if (isMatch) {
                    console.log('Login bem-sucedido');
                    res.status(200).json({ mensagem: 'Login bem-sucedido', user: {
                        id: user.id,
                        nome: user.nome,
                        email: user.email,
                        cargo: user.cargo,
                    } });
                } else {
                    console.log('Senha incorreta');
                    res.status(401).json({ erro: 'Credenciais inválidas', detalhes: 'Senha incorreta' });
                }
            } catch (err) {
                console.error('Erro ao comparar senha:', err);
                res.status(500).json({ erro: 'Erro ao comparar senha', mensagem: err.message });
            }
        } else {
            console.log('Usuário não encontrado');
            res.status(401).json({ erro: 'Credenciais inválidas', detalhes: 'Usuário não encontrado' });
        }
    });
});

// Add this new route for updating user information
app.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const { nome } = req.body;

    const query = 'UPDATE cadastros SET nome = ? WHERE id = ?';
    db.query(query, [nome, userId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar usuário:', err);
            return res.status(500).json({ erro: 'Erro ao atualizar usuário', mensagem: err.message });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
        } else {
            res.status(404).json({ erro: 'Usuário não encontrado' });
        }
    });
});

// Function to generate a random token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465, // Porta correta para SMTPS
    secure: true, // true para SMTPS
    auth: {
        user: 'pejoapp@gmail.com',
        pass: 'ebwh dzei junm ypev' 
    },
    connectionTimeout: 10000, // 10 segundos
});

// Rota para solicitar redefinição de senha
app.post('/forgot-password', (req, res) => {
    const { email } = req.body; 
    const token = generateToken(); 
    const expirationTime = Date.now() + 3600000; // token expira em 1 hora

    const query = 'UPDATE cadastros SET reset_token = ?, reset_token_expires = ? WHERE email = ?';
    db.query(query, [token, expirationTime, email], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar token de redefinição:', err);
            return res.status(500).json({ erro: 'Erro ao atualizar token de redefinição', mensagem: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        const resetLink = `http://10.111.9.44:3006/reset-password?token=${token}`;
        const mailOptions = {
            from: 'pejoapp@gmail.com',
            to: email,
            subject: 'Redefinição de Senha - PejoApp',
            html: `
                <h2>Redefinição de Senha - PejoApp</h2>
                <p>Olá,</p>
                <p>Você solicitou a redefinição de senha para sua conta no PejoApp.</p>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0088CC; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
                <p>Este link expira em uma hora.</p>
                <p>Se você não solicitou esta redefinição, por favor ignore este e-mail.</p>
                <p>Atenciosamente,<br>Equipe PejoApp</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
                return res.status(500).json({ erro: 'Erro ao enviar e-mail', mensagem: error.message });
            }
            console.log('E-mail enviado com sucesso:', info.response);
            res.json({ mensagem: 'E-mail de redefinição de senha enviado' });
        });
    });
});

// Replace the existing /reset-password route with this new implementation
app.get('/reset-password', (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).send('Token não fornecido. Acesso negado.');
    }

    const query = 'SELECT * FROM cadastros WHERE reset_token = ? AND reset_token_expires > ?';
    db.query(query, [token, Date.now()], (err, results) => {
        if (err || results.length === 0) {
            // Token inválido ou expirado
            return res.status(400).send('Link inválido ou expirado. Acesso negado.');
        }
        
        // Token válido, enviar a página de redefinição de senha
        res.sendFile(path.join(__dirname, 'public', 'siteRecovery.html'));
    });
});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    const query = 'SELECT * FROM cadastros WHERE reset_token = ? AND reset_token_expires > ?';
    db.query(query, [token, Date.now()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ erro: 'Token inválido ou expirado' });
        }

        const user = results[0];

        try {
            // Verifica se a nova senha é igual à senha atual
            const isSamePassword = await bcrypt.compare(newPassword, user.senha);
            if (isSamePassword) {
                return res.status(400).json({ erro: 'A nova senha não pode ser igual à senha atual' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const updateQuery = 'UPDATE cadastros SET senha = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?';
            db.query(updateQuery, [hashedPassword, user.id], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Erro ao atualizar senha:', updateErr);
                    return res.status(500).json({ erro: 'Erro ao atualizar senha', mensagem: updateErr.message });
                }

                res.json({ mensagem: 'Senha atualizada com sucesso' });
            });
        } catch (error) {
            console.error('Erro ao criptografar senha:', error);
            res.status(500).json({ erro: 'Erro ao atualizar senha', mensagem: error.message });
        }
    });
});

// Configura o multer para upload de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Add this new route for uploading profile picture
app.post('/user/:id/profile-picture', upload.single('profile_picture'), (req, res) => {
    console.log('Recebida solicitação de upload de foto de perfil');
    const userId = req.params.id;
    const file = req.file;

    console.log('UserId:', userId);
    console.log('File:', file);

    if (!file) {
        console.log('Nenhum arquivo recebido');
        return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    console.log('Arquivo recebido:', file);

    const query = 'UPDATE cadastros SET imagem_url = ? WHERE id = ?';

    const profilePictureUrl = `http://10.111.9.44:3006/uploads/${file.filename}`;


    db.query(query, [profilePictureUrl, userId], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar foto de perfil no banco de dados:', err);
            return res.status(500).json({ erro: 'Erro ao atualizar foto de perfil', mensagem: err.message });
        }

        if (result.affectedRows > 0) {
            console.log('Foto de perfil atualizada com sucesso');
            res.status(200).json({ mensagem: 'Foto de perfil atualizada com sucesso', imagem_url: profilePictureUrl });
        } else {
            console.log('Usuário não encontrado');
            res.status(404).json({ erro: 'Usuário não encontrado' });
        }
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Replace the existing /today-challenge route with this new route
app.get('/random-challenge', (req, res) => {
    const query = 'SELECT desafio_nome, desafio_descricao, desafio_nivel FROM desafios ORDER BY RAND() LIMIT 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar desafio aleatório:', err);
            return res.status(500).json({ erro: 'Erro ao buscar desafio aleatório', mensagem: err.message });
        }

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ erro: 'Nenhum desafio encontrado' });
        }

    });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Adicione esta rota antes da linha app.use(express.static(...))
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'siteRecovery.html'));
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
