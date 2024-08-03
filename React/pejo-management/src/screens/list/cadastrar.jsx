import React, { useState } from 'react';
import './cad.css';

function Cadastrar({ theme, closeCadastrar }) {
    const [name, setName] = useState('');
    const [challenge, setChallenge] = useState('');
    const [difficulty, setDifficulty] = useState(0);

    const handleSubmit = async () => {
        // Verifica se os campos estão vazios
        if (!name.trim() || !challenge.trim()) {
            alert('Preencha os campos vazios');
            return;
        }

        // Verifica o comprimento dos campos
        if (name.length > 255 || challenge.length > 255) {
            alert('Nome e Desafio não podem ultrapassar os 255 caracteres.');
            return;
        }

        // Prepare data to send to backend
        const data = {
            id_challenge: Date.now().toString(), // Example ID
            name_challenge: name,
            description_challenge: challenge,
        };

        try {
            const response = await fetch(`http://localhost:3000/add-challenge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Desafio adicionado com sucesso');
                closeCadastrar();
            } else {
                alert('Falhou :(');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Um erro ao adicionar o desafio');
        }
    };

    return (
        <div className={`container ${theme}`}>
            <div className={`card ${theme}`}>
                <div className="card-header">Cadastro Desafio</div>
                <div className="card-body">
                    <blockquote className="blockquote mb-0">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Insert the name of challenge"
                                aria-label="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength="255"
                            />
                        </div>
                        <br />
                        <div className="form-group">
                            <label htmlFor="challenge">Challenge</label>
                            <textarea
                                id="challenge"
                                className="form-control"
                                placeholder="Describe the challenge"
                                aria-label="Challenge"
                                value={challenge}
                                onChange={(e) => setChallenge(e.target.value)}
                                maxLength="255"
                            ></textarea>
                        </div>
                        <br />
                        <div className='difficulty'>
                            <label htmlFor="difficultyRange">Difficulty</label>
                            <input
                                type="range"
                                id="difficultyRange"
                                min="0"
                                max="10"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            />
                            <span>{difficulty}</span>
                        </div>
                        <br />
                        <div className='buttons'>
                            <button className='btn btn-primary' onClick={handleSubmit}>Cadastrar desafio!</button>
                            <button className='btn btn-primary' onClick={closeCadastrar}>Fechar</button>
                        </div>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}

export default Cadastrar;
