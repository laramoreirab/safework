// Verificar se usuário está logado e redirecionar o ícone
async function verificarUsuarioLogado() {
    try {
        const res = await fetch('/auth/perfil', {
            credentials: 'include'
        });
        
        if (res.ok) {
            // Usuário logado - mudar href do ícone
            const userIcon = document.getElementById('user-icon');
            if (userIcon) {
                userIcon.href = '/config-compras';
            }
        }
    } catch (error) {
        console.log('Usuário não logado');
    }
}

// Executar ao carregar a página
verificarUsuarioLogado();
