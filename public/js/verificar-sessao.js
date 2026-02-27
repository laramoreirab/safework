// Verificar se usuário está logado e redirecionar o ícone
async function verificarUsuarioLogado() {
    try {
        const res = await fetch('/auth/perfil', {
            credentials: 'include'
        });
        
        if (res.ok) {
            const dados = await res.json();
            const userIcon = document.getElementById('user-icon');

            if (userIcon) {
                // Admin vai para /adm, usuário comum vai para /config-compras
                userIcon.href = dados.dados.tipo === 'admin' ? '/adm' : '/config-compras';
            }
        }
    } catch (error) {
        console.log('Usuário não logado');
    }
}

// Executar ao carregar a página
verificarUsuarioLogado();