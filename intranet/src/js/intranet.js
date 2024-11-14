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
    fetch('http://localhost:3000/intra/getDesafios')  // URL do servidor Node.js
        .then(response => response.json())
        .then(data => {
            const desafiosContainer = document.getElementById('desafiosContainer');
            desafiosContainer.innerHTML = ''; // Limpa os desafios anteriores

            data.forEach(desafio => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML += `
                    <div class="card-header">${desafio.titulo}</div>
                    <div class="card-body">
                        <p>ID: ${desafio.id}</p>
                        <p>Descrição: ${desafio.descricao}</p>
                        <p>Estado: ${desafio.estado}</p>
                        <p>Tipo: ${desafio.tipo}</p>
                    </div>
                    <div class="card-footer">
                        <button style="width: 40%;" onclick="editItem(${desafio.id})">✏️</button>
                        <button style="width: 40%;" onclick="deleteItem(${desafio.id})">🗑️</button>
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
    fetch('http://localhost:3000/intra/getUsuarios')  // URL do servidor Node.js
        .then(response => response.json())
        .then(data => {
            const usuariosContainer = document.getElementById('usuariosContainer');
            usuariosContainer.innerHTML = ''; // Limpa os usuários anteriores

            data.forEach(user => {
                const cardUser = document.createElement('div');
                cardUser.classList.add('card');
                cardUser.innerHTML += `
                    <div class="card-header">${user.nome}</div>
                    <div class="card-body">
                        <p>ID: ${user.id}</p>
                        <p>Email: ${user.email}</p>
                        <p>Telefone: ${user.telefone}</p>
                        <p>Tipo do Usuário: ${user.tipo_usuario}</p>
                        <p>Nivel: ${user.nivel}</p>
                    </div>
                    <div class="card-footer">
                        <button style="width: 40%;" onclick="editItem(${user.id})">✏️</button>
                        <button style="width: 40%;" onclick="deleteItem(${user.id})">🗑️</button>
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
