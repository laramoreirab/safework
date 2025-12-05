// pagamento.js - VERSÃO COMPLETA CORRIGIDA

// Carregar resumo do pedido quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔄 Página de pagamento carregada');
    
    // Carregar resumo do pedido
    await carregarResumoPedido();
    
    // Configurar eventos
    configurarEventos();
});

// Carregar resumo do pedido do servidor
async function carregarResumoPedido() {
    try {
        console.log('📦 Carregando resumo do carrinho...');
        
        // Buscar carrinho do usuário
        const res = await fetch('/carrinho', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status da resposta do carrinho:', res.status);
        
        if (!res.ok) {
            if (res.status === 401) {
                alert('❌ Sessão expirada. Faça login novamente.');
                window.location.href = '/login';
                return;
            }
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📊 Dados do carrinho recebidos:', data);
        
        if (data.sucesso && data.dados) {
            const subtotal = parseFloat(data.dados.total) || 0;
            const taxaEntrega = 9.90;
            const total = subtotal + taxaEntrega;
            
            console.log('💰 Valores calculados:', {
                subtotal: subtotal,
                taxaEntrega: taxaEntrega,
                total: total
            });
            
            // Atualizar valores na tela
            atualizarResumoTela({
                subtotal: subtotal,
                taxaEntrega: taxaEntrega,
                total: total,
                pedidoId: data.dados.pedidoId,
                itens: data.dados.itens || []
            });
            
            // Salvar o ID do pedido
            if (data.dados.pedidoId) {
                localStorage.setItem('pedidoAtualId', data.dados.pedidoId);
                console.log('💾 Pedido ID salvo:', data.dados.pedidoId);
            }
        } else {
            console.error('❌ Erro no carrinho:', data.mensagem);
            alert('⚠️ Carrinho vazio ou erro ao carregar dados');
            
            // Redirecionar para produtos se carrinho vazio
            setTimeout(() => {
                window.location.href = '/produtos/todos';
            }, 2000);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar resumo:', error);
        alert('Erro ao carregar resumo do pedido: ' + error.message);
    }
}

// Atualizar valores na tela
function atualizarResumoTela(dados) {
    console.log('🖼️ Atualizando tela com dados:', dados);
    
    // Subtotal
    const subtotalElement = document.getElementById('subtotal-resumo');
    if (subtotalElement) {
        subtotalElement.textContent = formatarMoeda(dados.subtotal);
        console.log('✅ Subtotal atualizado:', formatarMoeda(dados.subtotal));
    } else {
        console.warn('⚠️ Elemento subtotal-resumo não encontrado');
    }
    
    // Total
    const totalElement = document.getElementById('total-resumo');
    if (totalElement) {
        totalElement.textContent = formatarMoeda(dados.total);
        console.log('✅ Total atualizado:', formatarMoeda(dados.total));
    } else {
        console.warn('⚠️ Elemento total-resumo não encontrado');
    }
    
    // Se quiser mostrar mais detalhes dos itens
    if (dados.itens && dados.itens.length > 0) {
        console.log(`📦 ${dados.itens.length} itens no carrinho`);
    }
}

// Formatar valor monetário
function formatarMoeda(valor) {
    if (typeof valor === 'string') {
        valor = parseFloat(valor.replace(',', '.'));
    }
    
    if (isNaN(valor)) {
        return 'R$ 0,00';
    }
    
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// Configurar eventos da página
function configurarEventos() {
    // Selecionar método de pagamento
    const paymentOptions = document.querySelectorAll('.one-option');
    let metodoPagamentoSelecionado = 'credito';
    
    // Ativar cartão por padrão
    if (paymentOptions.length > 0) {
        paymentOptions[0].classList.add('active');
    }
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            const h2Text = this.querySelector('h2').textContent.trim().toLowerCase();
            
            if (h2Text.includes('cartão') || h2Text.includes('crédito')) {
                metodoPagamentoSelecionado = 'credito';
                mostrarFormularioCartao(true);
            } else if (h2Text.includes('pix')) {
                metodoPagamentoSelecionado = 'pix';
                mostrarFormularioCartao(false);
            } else if (h2Text.includes('boleto')) {
                metodoPagamentoSelecionado = 'boleto';
                mostrarFormularioCartao(false);
            }
            
            console.log('💳 Método selecionado:', metodoPagamentoSelecionado);
        });
    });
    
    // Configurar evento do botão de finalizar
    const botaoFinalizar = document.querySelector('.botao-resumo');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', async (e) => {
            e.preventDefault();
            await processarPagamento(metodoPagamentoSelecionado);
        });
    }
}

// Mostrar/esconder formulário do cartão
function mostrarFormularioCartao(mostrar) {
    const formCartao = document.getElementById('form-pagamento');
    if (formCartao) {
        formCartao.style.display = mostrar ? 'block' : 'none';
        
        // Limpar required se não for cartão
        const inputs = formCartao.querySelectorAll('input');
        inputs.forEach(input => {
            if (mostrar) {
                input.setAttribute('required', 'required');
            } else {
                input.removeAttribute('required');
            }
        });
    }
}

// Processar pagamento
async function processarPagamento(metodo) {
    console.log('💳 Processando pagamento com método:', metodo);
    
    const dadosPagamento = {
        metodoPagamento: metodo
    };
    
    // Se for cartão, validar e pegar dados
    if (metodo === 'credito') {
        // Validar campos do cartão
        if (!validarCartao()) {
            return;
        }
        
        dadosPagamento.numeroCartao = document.getElementById('numero-cartao').value.replace(/\s/g, '');
        dadosPagamento.nomeTitular = document.getElementById('nome-titular').value.trim();
        dadosPagamento.validadeCartao = document.getElementById('validade-card').value;
        dadosPagamento.cvv = document.getElementById('CVV').value;
        
        const cpfInput = document.getElementById('CPF');
        if (cpfInput) {
            dadosPagamento.cpfTitular = cpfInput.value.replace(/\D/g, '');
        }
    }
    
    try {
        // Desabilitar botão para evitar múltiplos cliques
        const botao = document.querySelector('.botao-resumo');
        const textoOriginal = botao.textContent;
        botao.textContent = 'Processando...';
        botao.disabled = true;
        
        console.log('📤 Enviando dados de pagamento:', dadosPagamento);
        
        const res = await fetch('/finalizacao/pagamento', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(dadosPagamento)
        });
        
        console.log('📥 Status da resposta:', res.status);
        
        const data = await res.json();
        console.log('📊 Resposta do servidor:', data);
        
        if (data.sucesso) {
            console.log('✅ Pagamento processado com sucesso!');
            
            // Salvar ID do pedido de várias formas
            const pedidoId = data.dados?.pedidoId || localStorage.getItem('pedidoAtualId');
            
            if (pedidoId) {
                localStorage.setItem('pedidoId', pedidoId);
                sessionStorage.setItem('pedidoId', pedidoId);
                console.log('💾 Pedido ID salvo:', pedidoId);
            }
            
            // Mostrar mensagem de sucesso
            alert('✅ Pagamento processado com sucesso! Redirecionando...');
            
            // Redirecionar para página de confirmação
            setTimeout(() => {
                window.location.href = '/finalizar';
            }, 1000);
            
        } else {
            alert('❌ ' + (data.mensagem || 'Erro ao processar pagamento'));
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
        
    } catch (error) {
        console.error('❌ Erro:', error);
        alert('Erro de conexão ao processar pagamento: ' + error.message);
        
        const botao = document.querySelector('.botao-resumo');
        botao.textContent = 'Finalizar Pedido';
        botao.disabled = false;
    }
}

// Validar dados do cartão
function validarCartao() {
    const numeroCartao = document.getElementById('numero-cartao').value.replace(/\s/g, '');
    const nomeTitular = document.getElementById('nome-titular').value.trim();
    const validade = document.getElementById('validade-card').value;
    const cvv = document.getElementById('CVV').value;
    
    const cpfInput = document.getElementById('CPF');
    const cpf = cpfInput ? cpfInput.value.replace(/\D/g, '') : '';
    
    // Validações básicas
    if (!numeroCartao || numeroCartao.length !== 16) {
        alert('❌ Número do cartão inválido. Deve ter 16 dígitos.');
        document.getElementById('numero-cartao').focus();
        return false;
    }
    
    if (!nomeTitular || nomeTitular.length < 3) {
        alert('❌ Nome do titular é obrigatório.');
        document.getElementById('nome-titular').focus();
        return false;
    }
    
    if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
        alert('❌ Validade inválida. Use o formato MM/AA.');
        document.getElementById('validade-card').focus();
        return false;
    }
    
    if (!cvv || (cvv.length !== 3 && cvv.length !== 4)) {
        alert('❌ CVV inválido. Deve ter 3 ou 4 dígitos.');
        document.getElementById('CVV').focus();
        return false;
    }
    
    if (cpfInput && (!cpf || cpf.length !== 11)) {
        alert('❌ CPF inválido. Deve ter 11 dígitos.');
        cpfInput.focus();
        return false;
    }
    
    // Validar data (não permitir cartão vencido)
    const [mes, ano] = validade.split('/').map(num => parseInt(num, 10));
    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;
    
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        alert('❌ Cartão vencido. Verifique a data de validade.');
        document.getElementById('validade-card').focus();
        return false;
    }
    
    return true;
}