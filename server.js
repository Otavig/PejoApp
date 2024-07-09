const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapp',
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

app.post('/register', (req, res) => {
  const { name, email, dob, phone, password } = req.body;
  const query = 'INSERT INTO users (name, email, dob, phone, password) VALUES (?, ?, ?, ?, ?)';
  
  db.query(query, [name, email, dob, phone, password], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário no banco de dados:', err);
      return res.status(500).json({ error: 'Erro no banco de dados ao registrar usuário', message: err.message });
    }

    console.log('Usuário registrado com sucesso:', result);
    res.json({ message: 'Usuário registrado com sucesso', user: result.insertId });
  });
});


app.post('/login', (req, res) => {
  console.log('Recebida requisição de login:', req.body);
  const { identifier, password } = req.body;
  const query = 'SELECT * FROM users WHERE (email = ? OR name = ? OR phone = ?) AND password = ?';
  db.query(query, [identifier, identifier, identifier, password], (err, results) => {
    if (err) {
      console.error('Erro no banco de dados ao fazer login:', err);
      return res.status(500).send({ message: 'Database error', err });
    }
    if (results.length > 0) {
      console.log('Login bem-sucedido:', results[0]);
      res.send({ message: 'Login successful', user: results[0] });
    } else {
      console.log('Credenciais inválidas');
      res.status(401).send({ message: 'Invalid credentials' });
    }
  });
});


app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on port 3000');
});
