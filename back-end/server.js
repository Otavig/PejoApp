const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

app.use(cors());
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
            return res.status(500).json({ error: 'Erro no banco de dados ao verificar telefone', message: err.message });
        }

        if (results.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    });
});

// Rota para registrar um novo usuário
app.post('/register', async (req, res) => {
    const { nome, email, senha, telefone, data_nascimento } = req.body;

    // Converte data de DD/MM/YYYY para YYYY-MM-DD
    const formattedDate = data_nascimento ? convertDateToISO(data_nascimento) : null;

    try {
        // Gera um salt e criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const query = 'INSERT INTO cadastros (nome, email, senha, telefone, data_nascimento) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nome, email, hashedPassword, telefone, formattedDate], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário no banco de dados:', err);
                return res.status(500).json({ error: 'Erro no banco de dados ao registrar usuário', message: err.message });
            }

            console.log('Usuário registrado com sucesso:', result);
            res.json({ message: 'Usuário registrado com sucesso', user: result.insertId });
        });
    } catch (err) {
        console.error('Erro ao criptografar a senha:', err);
        res.status(500).json({ error: 'Erro ao criptografar a senha', message: err.message });
    }
});

// Rota para buscar um usuário pelo ID
app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM cadastros WHERE id = ?';  // Atualizado para refletir a nova estrutura
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ error: 'Erro ao buscar usuário', message: err.message });
        }

        if (results.length > 0) {
            res.status(200).json({ user: results[0] });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });
});

// Rota para login
app.post('/login', (req, res) => {
    console.log('Recebida requisição de login:', req.body);
    const { identifier, senha } = req.body;
    const query = 'SELECT * FROM cadastros WHERE (email = ? OR telefone = ?)';  // Atualizado para refletir a nova estrutura
    db.query(query, [identifier, identifier], async (err, results) => {
        if (err) {
            console.error('Erro no banco de dados ao fazer login:', err);
            return res.status(500).json({ error: 'Erro no banco de dados ao fazer login', message: err.message });
        }

        if (results.length > 0) {
            const user = results[0];
            try {
                const isMatch = await bcrypt.compare(senha, user.senha);
                if (isMatch) {
                    console.log('Login bem-sucedido');
                    res.status(200).json({ message: 'Login bem-sucedido', user });
                } else {
                    console.log('Credenciais inválidas');
                    res.status(401).json({ error: 'Credenciais inválidas', details: 'Senha incorreta' });
                }
            } catch (err) {
                console.error('Erro ao comparar senha:', err);
                res.status(500).json({ error: 'Erro ao comparar senha', message: err.message });
            }
        } else {
            console.log('Credenciais inválidas');
            res.status(401).json({ error: 'Credenciais inválidas', details: 'Usuário não encontrado' });
        }
    });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
