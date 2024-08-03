import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Atualize com sua senha
  database: 'bd_pejo',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('MySQL connected...');
});

// Endpoint para adicionar um desafio
app.post('/add-challenge', (req, res) => {
  const { name_challenge, description_challenge } = req.body;

  console.log('Received data:', { name_challenge, description_challenge });

  const query = 'INSERT INTO desafios (name_challenge, description_challenge) VALUES (?, ?)';
  
  db.query(query, [name_challenge, description_challenge], (err, result) => {
    if (err) {
      console.error('Error inserting challenge into database:', err);
      return res.status(500).json({ error: 'Error adding challenge to database', message: err.message });
    }

    console.log('Challenge added successfully:', result);
    res.json({ message: 'Challenge added successfully', challengeId: result.insertId });
  });
});

// Endpoint para buscar um desafio
app.get('/challenge/:id', (req, res) => {
  const challengeId = req.params.id;

  const query = 'SELECT * FROM desafios WHERE id_challenge = ?';
  
  db.query(query, [challengeId], (err, results) => {
    if (err) {
      console.error('Error fetching challenge:', err);
      return res.status(500).json({ error: 'Error fetching challenge', message: err.message });
    }

    if (results.length > 0) {
      res.status(200).json({ challenge: results[0] });
    } else {
      res.status(404).json({ error: 'Challenge not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
