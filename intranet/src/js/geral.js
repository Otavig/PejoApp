document.getElementById("profileIcon").addEventListener("click", function() {
    window.location.href = "./src/public/pages/login.html";
});

function scrollToMoreInfo() {
    const element = document.getElementById("more-info");
    const offset = -100; // valor para ajustar a posição final

    // Calcula a posição do elemento menos 30 pixels
    const elementPosition = element.getBoundingClientRect().top + window.scrollY + offset;

    window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
    });
}

// Função para definir um cookie
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// Função para obter um cookie
function getCookie(name) {
    return document.cookie.split('; ').reduce((res, current) => {
        const [key, value] = current.split('=');
        return key === name ? decodeURIComponent(value) : res;
    }, '');
}

// Função para excluir um cookie
function deleteCookie(name) {
    setCookie(name, '', -1);
}

// Exemplo de uso
document.addEventListener('DOMContentLoaded', () => {
    // Define um cookie
    setCookie('userName', 'PejoUser', 7); // Cookie expira em 7 dias

    // Obtém o cookie e exibe no console
    const userName = getCookie('userName');
    console.log('Nome do usuário:', userName);

    // Exclui o cookie
    // deleteCookie('userName');
});