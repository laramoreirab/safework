// Carregar dados iniciais ao abrir a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Página dados.html carregada');
        console.log('URL atual:', window.location.href);
        
        // Verificar se veio do carrinho
        if (document.referrer && document.referrer.includes('carrinho')) {
            console.log('Veio do carrinho');
        }

        const res = await fetch('/finalizacao/dados', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            // Preencher campos
            const nomeEmpresaInput = document.getElementById('nome-empresa');
            const emailInput = document.getElementById('email-empresa');
            const telefoneInput = document.getElementById('telefone-empresa');
            
            if (nomeEmpresaInput) nomeEmpresaInput.value = data.dados.nomeEmpresa || '';
            if (emailInput) emailInput.value = data.dados.emailEmpresa || '';
            if (telefoneInput) telefoneInput.value = data.dados.telefoneEmpresa || '';
            
        } else {
            alert('Erro: ' + data.mensagem);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados');
    }
});

// Salvar dados - CORREÇÃO DO REDIRECIONAMENTO
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nomeEmpresa = document.getElementById('nome-empresa').value;
    const cnpj = document.getElementById('CNPJ').value;
    const telefone = document.getElementById('telefone-empresa').value;
    const email = document.getElementById('email-empresa').value;
    
    // Validação
    if (!cnpj || cnpj.length < 14) {
        alert('CNPJ inválido');
        return;
    }
    
    try {
        const res = await fetch('/finalizacao/dados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nomeEmpresa,
                cnpj,
                telefoneEmpresa: telefone,
                emailEmpresa: email
            })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            alert('Dados salvos! Redirecionando...');
            
            // CORREÇÃO: Redirecionamento inteligente
            const caminhoAtual = window.location.pathname;
            let proximaPagina = 'entrega.html';
            
            if (caminhoAtual.includes('/views/')) {
                proximaPagina = 'entrega.html';
            } else if (caminhoAtual.includes('/produtos/')) {
                proximaPagina = '../entrega.html';
            } else {
                proximaPagina = '/views/entrega.html';
            }
            
            console.log('Indo para:', proximaPagina);
            window.location.href = proximaPagina;
            
        } else {
            alert('Erro: ' + data.mensagem);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar dados');
    }
});

// Verificar se o carrinho tem itens
async function verificarCarrinho() {
    try {
        const res = await fetch('/carrinho', {
            credentials: 'include'
        });
        const data = await res.json();
        
        if (data.sucesso && (!data.dados.itens || data.dados.itens.length === 0)) {
            alert('Carrinho vazio! Voltando para produtos...');
            setTimeout(() => {
                window.location.href = '/produtos';
            }, 2000);
        }
    } catch (error) {
        console.log('Não foi possível verificar carrinho:', error);
    }
}

// Executar verificação
verificarCarrinho();