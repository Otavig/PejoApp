document.addEventListener('DOMContentLoaded', () => {
    // Remover loading após 1 segundo
    setTimeout(() => {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) loadingElement.remove();
    }, 1000);

    // Verifica se o usuário está logado
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = "../../../index.html"; // Redireciona para login
    }

    // Exibe o email do usuário logado
    document.getElementById('user-email').textContent = localStorage.getItem('userEmail');

    // Função para alternar telas
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = screen.id === screenId ? 'block' : 'none';
        });
    }

    // Exibe a tela inicial (Dashboard) e define o link ativo
    showScreen('dashboard');
    const dashboardLink = document.querySelector('.nav-link[data-target="dashboard"]');
    if (dashboardLink) {
        dashboardLink.classList.add('active-page');
    }

    // Adiciona evento para links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault(); // Evita reload da página
            const targetScreen = link.getAttribute('data-target');
            showScreen(targetScreen);

            // Remove a classe 'active-page' de todos os links e adiciona no link clicado
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active-page'));
            link.classList.add('active-page');
        });
    });

    // Adiciona o evento de clique no botão de logout
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Carregar os desafios
    loadChallenges();

    // Carregar os usuários
    loadUsers();
});

// Função para filtrar cards (desafios ou usuários) com base no texto digitado
function searchCard(containerId, searchTerm) {
    const container = document.getElementById(containerId);
    const cards = container.getElementsByClassName('card'); // Pega todos os cards do container
    const searchQuery = searchTerm.toLowerCase(); // Converte o texto da busca para minúsculas para facilitar a comparação

    Array.from(cards).forEach(card => {
        const cardText = card.innerText.toLowerCase(); // Pega todo o texto do card, também em minúsculas
        // Verifica se o texto do card contém o termo de pesquisa
        if (cardText.includes(searchQuery)) {
            card.style.display = 'block'; // Exibe o card se contiver o termo de busca
        } else {
            card.style.display = 'none'; // Oculta o card caso contrário
        }
    });
}


// Função para carregar os desafios
function loadChallenges() {
    fetch('http://localhost:3000/getDesafios')  // URL do servidor Node.js
        .then(response => response.json())
        .then(data => {
            const desafiosContainer = document.getElementById('desafiosContainer');
            desafiosContainer.innerHTML = ''; // Limpa os desafios anteriores

            data.forEach(desafio => {
                const card = document.createElement('div');
                card.classList.add('card');
                // Adicionando atributos de dados para ordenação
                card.setAttribute('data-estado', desafio.estado);
                card.setAttribute('data-id', desafio.id);
                card.setAttribute('data-tipo', desafio.tipo);
                card.innerHTML += `
                    <div class="card-header">${desafio.titulo}</div>
                    <div class="card-body">
                        <p><strong>ID:</strong> ${desafio.id}</p>
                        <p><strong>Descrição:</strong> ${desafio.descricao}</p>
                        <p><strong>Estado:</strong> ${desafio.estado}</p>
                        <p><strong>Tipo:</strong> ${desafio.tipo}</p>
                        <p><strong>Data de ativação:</strong> ${desafio.data_ativacao || "Sem data definida"}</p>
                    </div>
                    <div class="card-footer">
                        <button style="width: 40%;" onclick="editItemDesafio(${desafio.id})">✏️</button>
                        <button style="width: 40%;" onclick="deleteDesafio(${desafio.id})">🗑️</button>
                    </div>
                `;
                desafiosContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar desafios:', error);
        });
}

// Função para carregar os usuários
function loadUsers() {
    fetch('http://localhost:3000/getUsuarios')  // URL do servidor Node.js
        .then(response => response.json())
        .then(data => {
            const usuariosContainer = document.getElementById('usuariosContainer');
            usuariosContainer.innerHTML = ''; // Limpa os usuários anteriores

            data.forEach(user => {
                const cardUser = document.createElement('div');
                cardUser.classList.add('card');
                // Adicionando atributos de dados para ordenação
                cardUser.setAttribute('data-nivel', user.nivel);
                cardUser.setAttribute('data-tipo_usuario', user.tipo_usuario);
                cardUser.innerHTML += `
                    <div class="card-header">${user.nome}</div>
                    <div class="card-body">
                        <p><strong>ID:</strong> ${user.id}</p>
                        <p><strong>Email:</strong> ${user.email}</p>
                        <p><strong>Tipo do Usuário:</strong> ${user.tipo_usuario}</p>
                        <p><strong>Telefone:</strong> ${user.telefone}</p>
                        <p><strong>Nivel:</strong> ${user.nivel}</p>
                    </div>
                    <div class="card-footer">
                        <button style="width: 40%;" onclick="editItemUsers(${user.id})">✏️</button>
                        <button style="width: 40%;" onclick="deleteUser(${user.id})">🗑️</button>
                    </div>
                `;
                usuariosContainer.appendChild(cardUser);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
        });
}

// Função de Logout (não alterada)
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = "../../../index.html"; // Redireciona para login
}

// Função para editar um desafio
function editItemDesafio(id) {
    fetch(`http://localhost:3000/intra/getDesafio/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar desafio: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('modalTitle').textContent = 'Editar Desafio';
            document.getElementById('editDesafioTitle').value = data.titulo;
            document.getElementById('editDesafioDescription').value = data.descricao;
            document.getElementById('editDesafioEstado').value = data.estado;
            document.getElementById('editDesafioTipo').value = data.tipo;
            document.getElementById('editDesafioNivel').value = data.nivel;

            document.getElementById('editDesafioModal').style.display = 'block';
            document.getElementById('saveDesafioEditButton').onclick = () => saveDesafioEdit(id);
        })
        .catch(error => {
            console.error('Erro ao carregar desafio:', error);
            alert('Erro ao carregar desafio. Verifique o console para mais detalhes.');
        });
}

// Função para salvar as edições do desafio
function saveDesafioEdit(id) {
    const updatedDesafio = {
        titulo: document.getElementById('editDesafioTitle').value,
        descricao: document.getElementById('editDesafioDescription').value,
        estado: document.getElementById('editDesafioEstado').value,
        tipo: document.getElementById('editDesafioTipo').value,
        nivel: document.getElementById('editDesafioNivel').value,
    };

    fetch(`http://localhost:3000/intra/updateDesafio/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDesafio),
    })
    .then(response => {
        if (response.ok) {
            closeEditDesafioModal();
            loadChallenges(); // Recarregar os desafios para mostrar as alterações
        } else {
            console.error('Erro ao atualizar desafio');
        }
    })
    .catch(error => console.error('Erro ao salvar desafio:', error));
}

// Função para fechar o modal de edição de desafio
function closeEditDesafioModal() {
    document.getElementById('editDesafioModal').style.display = 'none';
}

function editItemUsers(id) {
    fetch(`http://localhost:3000/user/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('userModalTitle').textContent = 'Editar Usuário';
            document.getElementById('editUserName').value = data.nome;
            document.getElementById('editUserEmail').value = data.email;
            document.getElementById('editUserPhone').value = data.telefone;
            document.getElementById('editUserType').value = data.tipo_usuario;
            document.getElementById('editUserLevel').value = data.nivel;

            document.getElementById('editUserModal').style.display = 'block';
            document.getElementById('saveUserEditButton').onclick = () => saveUserEdit(id);
        })
        .catch(error => {
            console.error('Erro ao carregar usuário:', error);
            alert('Erro ao carregar usuário. Verifique o console para mais detalhes.');
        });
}

// Função para fechar o modal de edição de usuário
function closeEditUserModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Função para salvar as edições do usuário
function saveUserEdit(id) {
    const updatedUser = {
        nome: document.getElementById('editUserName').value,
        email: document.getElementById('editUserEmail').value,
        telefone: document.getElementById('editUserPhone').value,
        tipo_usuario: document.getElementById('editUserType').value,
        nivel: document.getElementById('editUserLevel').value,
    };

    fetch(`http://localhost:3000/intra/updateUsuario/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => {
        if (response.ok) {
            closeEditUserModal();
            loadUsers(); // Recarregar os usuários para mostrar as alterações
        } else {
            console.error('Erro ao atualizar usuário');
        }
    })
    .catch(error => console.error('Erro ao salvar usuário:', error));
}

// Função para abrir o modal de criação de card
function openCreateCardModal() {
    document.getElementById('createCardModal').style.display = 'block';
}

// Função para fechar o modal de criação de card
function closeCreateCardModal() {
    document.getElementById('createCardModal').style.display = 'none';
}

// Função para criar um novo card
document.getElementById('createCardButton').onclick = () => {
    const newCard = {
        titulo: document.getElementById('newCardTitle').value,
        descricao: document.getElementById('newCardDescription').value,
        estado: document.getElementById('newCardState').value,
        tipo: document.getElementById('newCardType').value,
        nivel: document.getElementById('newCardLevel').value,
    };

    fetch('http://localhost:3000/intra/createDesafio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
    })
    .then(response => {
        if (response.ok) {
            closeCreateCardModal();
            loadChallenges(); // Recarregar os desafios para mostrar o novo card
        } else {
            console.error('Erro ao criar desafio');
        }
    })
    .catch(error => console.error('Erro ao criar desafio:', error));
};

function deleteUser(id) {
    fetch(`http://localhost:3000/intra/deleteUsuario/${id}`, { // Supondo que você tenha uma rota para deletar
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            // Remove o card correspondente da interface
            const card = document.querySelector(`.card[data-id="${id}"]`);
            if (card) {
                card.remove(); // Remove o card do DOM
            }
        } else {
            console.error('Erro ao deletar item');
        }
    })
    .catch(error => console.error('Erro ao deletar item:', error));
}