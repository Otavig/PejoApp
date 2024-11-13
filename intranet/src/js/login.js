document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/admin-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            // Salva os dados do usuário no localStorage
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userEmail', email);
            // Redireciona para a intranet
            window.location.href = "intranet.html"; // Ajuste o caminho conforme necessário
        } else {
            alert(data.erro);
        }
    } catch (error) {
        console.error("Erro ao fazer login:", error);
    }
});
