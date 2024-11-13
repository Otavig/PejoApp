// Função para logout
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = "../../../index.html"; // Redireciona para login
}
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
});

const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });
    card.addEventListener("mouseleave", () => {
        card.style.setProperty("--x", "0px");
        card.style.setProperty("--y", "0px");
    });
});