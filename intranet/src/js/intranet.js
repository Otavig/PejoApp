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

    // Função para criar um novo desafio
    document.getElementById('createCardButton').addEventListener('click', () => {
        const newCard = {
            titulo: document.getElementById('newCardTitle')?.value,
            descricao: document.getElementById('newCardDescription')?.value,
            estado: document.getElementById('newCardState')?.value,
            dificuldade: document.getElementById('newCardDificuldade')?.value
        };

        // Verifique se todos os campos estão preenchidos
        if (!newCard.titulo || !newCard.descricao || !newCard.estado || !newCard.dificuldade) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

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
                    loadChallenges(); // Certifique-se de que esta função está definida
                    document.getElementById('newCardTitle').value = ""
                    document.getElementById('newCardDescription').value = ""
                } else {
                    console.error('Erro ao criar desafio');
                }
            })
            .catch(error => console.error('Erro ao criar desafio:', error));
    });

    // Variável para controlar a ordem de classificação
    let sortOrder = 'asc'; // 'asc' para crescente, 'desc' para decrescente

    // Função para ordenar cards
    function sortCards(containerId, criteria) {
        const container = document.getElementById(containerId);
        const cards = Array.from(container.children);

        cards.sort((a, b) => {
            const aValue = a.getAttribute(`data-${criteria}`);
            const bValue = b.getAttribute(`data-${criteria}`);

            // Lógica para comparar valores
            if (criteria === 'id') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue; // Ordenação numérica
            } else {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue); // Ordenação alfabética
            }
        });

        // Limpar o container e adicionar os cards ordenados
        container.innerHTML = '';
        cards.forEach(card => container.appendChild(card));
    }

    // Função para inverter a ordem de classificação
    function toggleSortOrder() {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Alterna entre 'asc' e 'desc'
        const sortOptions = document.getElementById('sortOptions');
        sortCards('desafiosContainer', sortOptions.value); // Reordena os cards com a nova ordem
    }

    // Adiciona evento para o botão de inverter a ordem
    document.getElementById('toggleSortOrderButton').addEventListener('click', toggleSortOrder);

    let currentPage = 1; // Página atual
    const itemsPerPage = 10; // Número de cards por página

    // Função para carregar os desafios
    function loadChallenges() {
        fetch('http://localhost:3000/getDesafios')  // URL do servidor Node.js
            .then(response => response.json())
            .then(data => {
                const desafiosContainer = document.getElementById('desafiosContainer');
                desafiosContainer.innerHTML = ''; // Limpa os desafios anteriores

                // Paginação
                const totalPages = Math.ceil(data.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = data.slice(startIndex, endIndex);

                paginatedData.forEach(desafio => {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    // Adicionando atributos de dados para ordenação
                    card.setAttribute('data-estado', desafio.estado);
                    card.setAttribute('data-id', desafio.id);
                    card.innerHTML += `
                        <div class="card-header">${desafio.titulo}</div>
                        <div class="card-body">
                            <p><strong>ID:</strong> ${desafio.id}</p>
                            <p><strong>Descrição:</strong> ${desafio.descricao}</p>
                            <p><strong>Estado:</strong> ${desafio.estado}</p>
                            <p><strong>Dificuldade:</strong> ${desafio.dificuldade}</p>
                        </div>
                        <div class="card-footer">
                            <button style="width: 40%;" onclick="editItemDesafio(${desafio.id})">✏️</button>
                            <button style="width: 40%;" onclick="deleteDesafio(${desafio.id})">🗑️</button>
                        </div>
                    `;
                    desafiosContainer.appendChild(card);
                });

                // Atualiza a informação da página
                document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
                document.getElementById('prevPage').disabled = currentPage === 1; // Desabilita botão se na primeira página
                document.getElementById('nextPage').disabled = currentPage === totalPages; // Desabilita botão se na última página
            })
            .catch(error => {
                console.error('Erro ao carregar desafios:', error);
            });
    }

    // Função para mudar de página
    function changePage(direction) {
        currentPage += direction;
        loadChallenges(); // Recarrega os desafios com a nova página
    }

    // Variável para controlar a ordem de classificação dos usuários
    let userSortOrder = 'asc'; // 'asc' para crescente, 'desc' para decrescente

    // Função para ordenar usuários
    function sortUsers(containerId, criteria) {
        const container = document.getElementById(containerId);
        const users = Array.from(container.children);

        users.sort((a, b) => {
            const aValue = a.getAttribute(`data-${criteria}`);
            const bValue = b.getAttribute(`data-${criteria}`);

            // Lógica para comparar valores
            return userSortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue); // Ordenação alfabética
        });

        container.innerHTML = '';
        users.forEach(user => container.appendChild(user));
    }

    // Função para inverter a ordem de classificação dos usuários
    function toggleUserSortOrder() {
        userSortOrder = userSortOrder === 'asc' ? 'desc' : 'asc'; // Alterna entre 'asc' e 'desc'
        const userSortOptions = document.getElementById('userSortOptions');
        sortUsers('usuariosContainer', userSortOptions.value); // Reordena os usuários com a nova ordem
    }

    // Adiciona evento para o botão de inverter a ordem dos usuários
    document.getElementById('userSortOptions').addEventListener('change', toggleUserSortOrder);

    // Função para alternar a exibição do campo de data e hora
    window.toggleDateInput = function () {
        const activationType = document.getElementById('activationType').value;
        const dateInputContainer = document.getElementById('dateInputContainer');
        dateInputContainer.style.display = activationType === 'pre-definido' ? 'block' : 'none';
    };

    // Função para abrir o modal de criação de evento
    window.openCreateEventModal = function () {
        // Limpa os campos do modal antes de abrir
        document.getElementById('eventName').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventImages').value = ''; // Limpa o campo de imagens

        document.getElementById('createEventModal').style.display = 'block'; // Abre o modal
    };

    // Função para fechar o modal de criação de evento
    window.closeCreateEventModal = function () {
        document.getElementById('createEventModal').style.display = 'none';
    };

    // Função para criar um novo evento
    document.getElementById('createEventButton').addEventListener('click', () => {
        saveNewEvent();
        // Limpa os campos do modal antes de abrir
        document.getElementById('eventName').value = '';
        document.getElementById('eventDescription').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventLocation').value = '';
        document.getElementById('eventCoordenadas').value = '';
        document.getElementById('eventImages').value = ''; // Limpa o campo de imagens
        closeCreateEventModal();
    });

    // Função para abrir o modal de criação de evento
    function openCreateEventModal() {
        document.getElementById('createEventModal').style.display = 'block';
    }

    // Função para salvar o novo evento
    function saveNewEvent() {
        const eventName = document.getElementById('eventName').value.trim();
        const eventDescription = document.getElementById('eventDescription').value.trim();
        const eventDate = document.getElementById('eventDate').value.trim();
        const eventLocation = document.getElementById('eventLocation').value.trim();
        const eventCoordenadas = document.getElementById('eventCoordenadas').value;
        const eventImages = document.getElementById('eventImages').files; // Pegando os arquivos de imagem

        // Verifique se todos os campos estão preenchidos
        if (!eventName || !eventDescription || !eventDate || !eventLocation || !eventCoordenadas) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        // Verifique se pelo menos uma imagem foi selecionada
        if (eventImages.length === 0) {
            alert('Você precisa adicionar pelo menos uma imagem para o evento.');
            return;
        }

        // Criação de um FormData para enviar os dados com as imagens
        const formData = new FormData();
        formData.append('nome', eventName);
        formData.append('descricao', eventDescription);
        formData.append('data_evento', eventDate);
        formData.append('local', eventLocation);
        formData.append('coordenadas', eventCoordenadas)

        // Adiciona todas as imagens ao FormData
        for (let i = 0; i < eventImages.length; i++) {
            formData.append('imagens', eventImages[i]);
        }

        // Envia a requisição POST para criar o evento
        fetch('http://localhost:3000/intra/createEvento', {
            method: 'POST',
            body: formData, // Envia os dados com as imagens
        })
        .then(response => {
            if (response.ok) {
                closeCreateEventModal();
                loadEventos(); // Recarregar os eventos para mostrar o novo evento
            } else {
                console.error('Erro ao criar evento');
                return response.json().then(err => {
                    console.error('Detalhes do erro:', err); // Loga detalhes do erro
                });
            }
        })
        .catch(error => console.error('Erro ao salvar evento:', error));
    }


    // Função para fechar o modal de criação de evento
    function closeCreateEventModal() {
        document.getElementById('createEventModal').style.display = 'none';
    }


    // Carregar os eventos
    loadEventos(); // Chama a função para carregar eventos

    // Função para salvar um desafio
    function saveChallenge() {
        // Lógica para salvar o desafio
        // ...

        // Após salvar, recarregar os desafios
        loadChallenges(); // Certifique-se de que esta função está definida
    }

    // Função para salvar um evento
    function saveEvent() {
        // Lógica para salvar o evento
        // ...

        // Após salvar, recarregar os eventos
        loadEvents(); // Certifique-se de que esta função está definida
    }

    // Adicionando EventListeners
    document.addEventListener('DOMContentLoaded', function () {
        const saveEditButton = document.getElementById('saveEditButton');
        if (saveEditButton) {
            saveEditButton.addEventListener('click', saveChallenge); // ou saveEvent, dependendo do contexto
        }
    });

    // Função para carregar dados do dashboard
    function loadDashboardData() {
        Promise.all([
            fetch('http://localhost:3000/api/desafios/count'), // Endpoint para contar desafios
            fetch('http://localhost:3000/api/usuarios/count'), // Endpoint para contar usuários
            fetch('http://localhost:3000/api/eventos/recent'), // Endpoint para eventos recentes
            fetch('http://localhost:3000/api/top-players') // Endpoint para jogadores com maiores níveis
        ])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(data => {
                const [activeChallengesCount, usersCount, recentEvents, topPlayers] = data;

                // Atualiza o DOM com os dados
                document.getElementById('activeChallenges').textContent = activeChallengesCount;
                document.getElementById('usersCount').textContent = usersCount.count;
                document.getElementById('recentEvents').textContent = recentEvents.map(event => event.nome).join(', ');
                document.getElementById('topPlayers').textContent = topPlayers
                    .slice(0, 3)
                    .map((player, index) => `${index + 1}: ${player.nome}`) // Adiciona o índice + 1
                    .join(', ');
            })
            .catch(error => console.error('Erro ao carregar dados do dashboard:', error));
    }

    // Chama a função para carregar os dados ao iniciar
    loadDashboardData();
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

// Funão de Logout (não alterada)
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

            // Verifique se o elemento existe antes de definir o valor
            const titleInput = document.getElementById('editDesafioTitle');
            if (titleInput) {
                titleInput.value = data.titulo; // Preenche o título
            }

            const descriptionInput = document.getElementById('editDesafioDescription');
            if (descriptionInput) {
                descriptionInput.value = data.descricao; // Preenche a descrição
            }

            const estadoInput = document.getElementById('editDesafioEstado');
            if (estadoInput) {
                estadoInput.value = data.estado; // Preenche o estado
            }

            const dificuldadeInput = document.getElementById('editDesafioDificuldade');
            if (dificuldadeInput) {
                dificuldadeInput.value = data.dificuldade; // Preenche a dificuldade
            }

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
        dificuldade: document.getElementById('editDesafioDificuldade').value
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

// Funço para abrir o modal de criação de desafio
function openCreateCardModal() {
    document.getElementById('createCardModal').style.display = 'block';
}

// Função para fechar o modal de criação de desafio
function closeCreateCardModal() {
    document.getElementById('createCardModal').style.display = 'none';
}

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

// Função para deletar um desafio
function deleteDesafio(id) {
    fetch(`http://localhost:3000/intra/deleteDesafio/${id}`, {
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
                console.error('Erro ao deletar desafio');
            }
        })
        .catch(error => console.error('Erro ao deletar desafio:', error));
}

// Função para carregar os eventos
function loadEventos() {
    fetch('http://localhost:3000/getEventos')  // URL do servidor Node.js
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar eventos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Eventos carregados:', data); // Verifique se os dados estão corretos
            const eventosContainer = document.getElementById('eventosContainer');
            eventosContainer.innerHTML = ''; // Limpa os eventos anteriores

            data.forEach(evento => {
                const cardEvento = document.createElement('div');
                cardEvento.classList.add('card');
                // Adicionando atributos de dados para ordenação
                cardEvento.setAttribute('data-id', evento.id);
                cardEvento.innerHTML += `
                    <div class="card-header">${evento.nome}</div>
                    <div class="card-body">
                        <p><strong>ID:</strong> ${evento.id}</p>
                        <p><strong>Descrição:</strong> ${evento.descricao}</p>
                        <p><strong>Data:</strong> ${new Date(evento.data_evento).toLocaleString('pt-BR')}</p>
                        <p><strong>Local:</strong> ${evento.local}</p>
                        <p><strong>Coordenadas:</strong> ${evento.coordenadas || "Vazio"}</p>
                    </div>
                    <div class="card-footer">
                        <button style="width: 40%;" onclick="editItemEvento(${evento.id})">✏️</button>
                        <button style="width: 40%;" onclick="deleteEvento(${evento.id})">🗑️</button>
                    </div>
                `;
                eventosContainer.appendChild(cardEvento);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
        });
}

// Função para editar um evento
function editItemEvento(id) {
    fetch(`http://localhost:3000/intra/getEvento/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar evento: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Evento para editar:', data); // Verifique se os dados estão corretos
            document.getElementById('modalTitle').textContent = 'Editar Evento';
            document.getElementById('updateEventName').value = data.nome; // Preenche o nome
            document.getElementById('updateEventDescription').value = data.descricao; // Preenche a descrição
            document.getElementById('updateEventDate').value = data.data_evento; // Preenche a data do evento
            document.getElementById('updateEventCoordenadas').value = data.coordenadas; 
            document.getElementById('updateEventLocation').value = data.local; // Preenche o local

            document.getElementById('editEventModal').style.display = 'block';
            document.getElementById('saveEventEditButton').onclick = () => saveEventEdit(id);
        })
        .catch(error => {
            console.error('Erro ao carregar evento:', error);
            alert('Erro ao carregar evento. Verifique o console para mais detalhes.');
        });
}

// Função para salvar as edições do evento
function saveEventEdit(id) {
    const updatedEvent = {
        nome: document.getElementById('updateEventName').value.trim(),
        descricao: document.getElementById('updateEventDescription').value.trim(),
        data_evento: document.getElementById('updateEventDate').value.trim(),
        local: document.getElementById('updateEventLocation').value.trim(),
        coordenadas: document.getElementById('updateEventCoordenadas').value
    };

    // Verifique se todos os campos estão preenchidos
    if (!updatedEvent.nome || !updatedEvent.descricao || !updatedEvent.data_evento || !updatedEvent.local || !updatedEvent.coordenadas) {
        alert('Todos os campos são obrigatórios.');
        return;
    }

    // Adicione um console.log para verificar os valores
    console.log('Dados do evento:', updatedEvent);

    // Envia a requisição PUT para atualizar o evento
    fetch(`http://localhost:3000/intra/updateEvento/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', // Definindo o tipo de conteúdo como JSON
        },
        body: JSON.stringify(updatedEvent), // Envia o objeto atualizado como JSON
    })
        .then(response => {
            if (response.ok) {
                closeEditEventModal();
                loadEventos(); // Recarregar os eventos para mostrar as alterações
            } else {
                console.error('Erro ao atualizar evento');
                return response.json().then(err => {
                    console.error('Detalhes do erro:', err); // Loga detalhes do erro
                });
            }
        })
        .catch(error => console.error('Erro ao salvar evento:', error));
}

// Função para fechar o modal de edição de evento
function closeEditEventModal() {
    document.getElementById('editEventModal').style.display = 'none';
}

// Função para deletar um evento
function deleteEvento(id) {
    fetch(`http://localhost:3000/intra/deleteEvento/${id}`, {
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
                console.error('Erro ao deletar evento');
            }
        })
        .catch(error => console.error('Erro ao deletar evento:', error));
}