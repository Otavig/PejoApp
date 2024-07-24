const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'bd_pejo',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

app.post('/register', (req, res) => {
  const { user_name, user_email, user_password, phone } = req.body;
  const query = 'INSERT INTO cadastro (user_name, user_email, user_password, phone) VALUES (?, ?, ?, ?)';
  console.log([user_name, user_email, user_password, phone])
  db.query(query, [user_name, user_email, user_password, phone], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário no banco de dados:', err);
      return res.status(500).json({ error: 'Erro no banco de dados ao registrar usuário', message: err.message });
    }

    console.log('Usuário registrado com sucesso:', result);
    res.json({ message: 'Usuário registrado com sucesso', user: result.insertId });
  });
});

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM cadastro WHERE id = ?';

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


app.post('/login', (req, res) => {
  console.log('Recebida requisição de login:', req.body);
  const { identifier, password } = req.body;
  const query = 'SELECT * FROM cadastro WHERE (user_email = ? OR phone = ?) AND user_password = ?';
  db.query(query, [identifier, identifier, password], (err, results) => {
    if (err) {
      console.error('Erro no banco de dados ao fazer login:', err);
      return res.status(500).json({ error: 'Erro no banco de dados ao fazer login', message: err.message });
    }

    if (results.length > 0) {
      console.log('Login bem-sucedido');
      res.status(200).json({ message: 'Login successful', user: results[0] }); // Retorna o usuário encontrado
    } else {
      console.log('Credenciais inválidas');
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

const PORT = process.env.PORT || 3006;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
