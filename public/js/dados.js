// Carregar dados iniciais ao abrir a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('=== Página de dados carregada ===');

        const res = await fetch('/finalizacao/dados', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status da resposta GET:', res.status);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Dados recebidos do servidor:', data);
        
        if (data.sucesso && data.dados) {
            // Preencher campos
            const nomeEmpresaInput = document.getElementById('nome-empresa');
            const emailInput = document.getElementById('email-empresa');
            const telefoneInput = document.getElementById('telefone-empresa');
            const cnpjInput = document.getElementById('cnpj-empresa');
            
            if (nomeEmpresaInput) {
                nomeEmpresaInput.value = data.dados.nomeEmpresa || '';
                console.log('Preenchendo nome:', data.dados.nomeEmpresa);
            }
            if (emailInput) {
                emailInput.value = data.dados.emailEmpresa || '';
                console.log('Preenchendo email:', data.dados.emailEmpresa);
            }
            if (telefoneInput) {
                telefoneInput.value = data.dados.telefoneEmpresa || '';
                console.log('Preenchendo telefone:', data.dados.telefoneEmpresa);
            }
            if (cnpjInput && data.dados.cnpj) {
                cnpjInput.value = data.dados.cnpj || '';
                console.log('Preenchendo CNPJ:', data.dados.cnpj);
            }
            
            console.log('=== Campos preenchidos com sucesso ===');
            
        } else {
            const erroMsg = data.erro || data.mensagem || 'Erro desconhecido';
            console.error('Erro do servidor:', erroMsg);
            alert('Erro: ' + erroMsg);
            
            // Se for carrinho vazio, redirecionar
            if (erroMsg.includes('Carrinho vazio') || erroMsg.includes('carrinho')) {
                setTimeout(() => {
                    window.location.href = '/produtos/todos';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert('Erro ao carregar dados da empresa: ' + error.message);
    }
});

// Salvar dados 
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Coletar dados - INCLUINDO CNPJ
    const nomeEmpresa = document.getElementById('nome-empresa').value.trim();
    const cnpj = document.getElementById('cnpj-empresa').value.trim();
    const telefone = document.getElementById('telefone-empresa').value.trim();
    const email = document.getElementById('email-empresa').value.trim();
    
    console.log('=== Enviando dados do formulário ===');
    console.log('Dados coletados:', { nomeEmpresa, cnpj, telefone, email });
    
    // Validações
    if (!nomeEmpresa) {
        alert('Nome da empresa é obrigatório');
        return;
    }
    
    // Validar CNPJ
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (!cnpjLimpo || cnpjLimpo.length !== 14) {
        alert('CNPJ inválido. Deve conter 14 dígitos.');
        return;
    }
    
    // Desabilitar botão para evitar múltiplos cliques
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';
    
    try {
        const res = await fetch('/finalizacao/dados', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                nomeEmpresa,
                cnpj,
                telefoneEmpresa: telefone,
                emailEmpresa: email
            })
        });
        
        console.log('Status da resposta POST:', res.status);
        console.log('Headers:', Object.fromEntries(res.headers.entries()));
        
        // Verificar se a resposta é JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.error('Resposta não é JSON:', text.substring(0, 200));
            throw new Error(`Resposta inesperada do servidor: ${text.substring(0, 100)}`);
        }
        
        const data = await res.json();
        console.log('Resposta completa do servidor:', data);
        
        if (!res.ok) {
            console.error('Erro HTTP:', res.status);
            throw new Error(data.erro || data.mensagem || `Erro ${res.status}`);
        }
        
        if (data.sucesso) {
            console.log('Dados salvos com sucesso!');
            alert('Dados salvos com sucesso!');
            
            // Pequeno delay antes de redirecionar
            setTimeout(() => {
                window.location.href = '/entrega';
            }, 500);
            
        } else {
            console.error('Erro do servidor:', data.erro || data.mensagem);
            alert('Erro: ' + (data.erro || data.mensagem || 'Falha ao salvar dados'));
        }
        
    } catch (error) {
        console.error('Erro completo na requisição:', error);
        alert('Erro ao salvar dados: ' + error.message);
        
    } finally {
        // Reabilitar o botão
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

// Verificar se o carrinho tem itens
async function verificarCarrinho() {
    try {
        console.log('Verificando carrinho...');
        
        const res = await fetch('/carrinho', {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            console.warn('Erro ao verificar carrinho:', res.status);
            return;
        }
        
        const data = await res.json();
        console.log('Resposta do carrinho:', data);
        
        if (data.sucesso && (!data.dados.itens || data.dados.itens.length === 0)) {
            console.warn('Carrinho vazio detectado');
            alert('Carrinho vazio! Voltando para produtos...');
            
            setTimeout(() => {
                window.location.href = '/produtos/todos';
            }, 2000);
        }
        
    } catch (error) {
        console.log('Não foi possível verificar carrinho:', error);
    }
}

// Executar verificação após carregar a página
setTimeout(() => {
    verificarCarrinho();
}, 1000);
