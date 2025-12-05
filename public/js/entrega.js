document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página /entrega carregada');
    
    await configurarFormulario();
});

// Configurar evento do formulário
function configurarFormulario() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await finalizarPedido(e);
        });
    }
}

// Finalizar pedido
async function finalizarPedido(e) {
    console.log('Finalizando pedido...');
    
    // Coletar dados do formulário
    const dadosEntrega = {
        endereco: document.getElementById('endereco').value,
        cpfRepresentante: document.getElementById('CPF').value.replace(/\D/g, ''),
        telefoneRepresentante: document.getElementById('telefone-empresa').value.replace(/\D/g, ''),
        nomeRepresentante: document.getElementById('nome-representante').value,
        portaria: document.getElementById('portaria').value || null
    };
    
    // Validações
    if (!validarFormulario(dadosEntrega)) {
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Processando...';
        btnSubmit.disabled = true;
        
        console.log('Enviando dados de entrega:', dadosEntrega);

        // Desabilitar botão para evitar múltiplos cliques
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';
        
        // Salvar dados de entrega
        const resEntrega = await fetch('/finalizacao/entrega', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dadosEntrega)
        });
        
        const dataEntrega = await resEntrega.json();
        console.log('Resposta completa do servidor:', dataEntrega);
        
        if (!dataEntrega.sucesso) {
            throw new Error(dataEntrega.mensagem || 'Erro ao salvar dados de entrega');
        }
        
        console.log('Dados de entrega salvos');
        
        // Redirecionar para página de pagamento
        alert('Dados de entrega salvos! Redirecionando para pagamento...');
        // Pequeno delay antes de redirecionar
        setTimeout(() => {
            window.location.href = '/pagamento';
        }, 500);
        
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Continuar';
        btnSubmit.disabled = false;
    }
}

// Validar formulário
function validarFormulario(dados) {
    if (!dados.endereco || dados.endereco.trim() === '') {
        alert('Por favor, preencha o endereço completo');
        return false;
    }
    
    if (!dados.cpfRepresentante || dados.cpfRepresentante.length !== 11) {
        alert('CPF inválido');
        return false;
    }
    
    if (!dados.telefoneRepresentante || dados.telefoneRepresentante.length < 10) {
        alert('Telefone inválido');
        return false;
    }
    
    if (!dados.nomeRepresentante || dados.nomeRepresentante.trim() === '') {
        alert('Por favor, preencha o nome do representante');
        return false;
    }
    
    return true;
}