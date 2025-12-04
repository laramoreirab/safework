// pagamento.js - VERSÃO COMPLETA

// Carregar resumo do pedido quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página de pagamento carregada');
    
    // Carregar resumo do pedido
    await carregarResumoPedido();
    
    // Configurar eventos
    configurarEventos();
});

// Carregar resumo do pedido do servidor
async function carregarResumoPedido() {
    try {
        console.log('Carregando resumo do pedido...');
        //preciso pegar o id do cookie pois é o msm que o id do pedido para a rota


        const res = await fetch('/finalizacao/resumo/${pedidoId}', { //arrumar aqui
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status da resposta:', res.status);
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados do resumo:', data);
        
        if (data.sucesso && data.dados) {
            // Atualizar valores na página
            atualizarResumoTela(data.dados);
        } else {
            console.error('Erro no resumo:', data.mensagem);
            alert('Erro ao carregar resumo: ' + (data.mensagem || 'Dados não encontrados'));
        }
        
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
        alert('Erro ao carregar resumo do pedido');
    }
}

// Atualizar valores na tela
function atualizarResumoTela(dados) {
    // Subtotal
    const subtotalElement = document.getElementById('subtotal-resumo');
    if (subtotalElement && dados.subtotal) {
        subtotalElement.textContent = formatarMoeda(dados.subtotal);
    }
    
    // Total
    const totalElement = document.getElementById('total-resumo');
    if (totalElement && dados.total) {
        totalElement.textContent = formatarMoeda(dados.total);
    }
    
    // Taxa de entrega (se vier do servidor)
    const taxaElement = document.querySelector('.row-resumo:nth-child(2) strong span');
    if (taxaElement && dados.taxaEntrega) {
        taxaElement.textContent = formatarMoeda(dados.taxaEntrega);
    }
    
    // Se quiser mostrar mais detalhes
    if (dados.itens && dados.itens.length > 0) {
        console.log('Itens no pedido:', dados.itens);
    }
}

// Formatar valor monetário
function formatarMoeda(valor) {
    if (typeof valor === 'string') {
        valor = parseFloat(valor.replace(',', '.'));
    }
    
    return 'R$' + valor.toFixed(2).replace('.', ',');
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
            
            console.log('Método selecionado:', metodoPagamentoSelecionado);
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
        if (mostrar) {
            formCartao.style.display = 'block';
        } else {
            formCartao.style.display = 'none';
        }
    }
}

// Processar pagamento
async function processarPagamento(metodo) {
    console.log('Processando pagamento com método:', metodo);
    
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
        dadosPagamento.cpfTitular = document.getElementById('CPF').value.replace(/\D/g, '');
    }
    // Se for PIX ou Boleto, não precisa de dados adicionais
    
    try {
        // Desabilitar botão para evitar múltiplos cliques
        const botao = document.querySelector('.botao-resumo');
        const textoOriginal = botao.textContent;
        botao.textContent = 'Processando...';
        botao.disabled = true;
        
        console.log('Enviando dados de pagamento:', dadosPagamento);
        
        const res = await fetch('/finalizacao/pagamento', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(dadosPagamento)
        });
        
        console.log('Status da resposta:', res.status);
        
        const data = await res.json();
        console.log('Resposta do servidor:', data);
        
        if (data.sucesso) {
            // Salvar ID do pedido se necessário
            if (data.dados && data.dados.pedidoId) {
                localStorage.setItem('pedidoId', data.dados.pedidoId);
            }
            
            // Redirecionar para página de confirmação
            alert('Pagamento processado com sucesso!');
            window.location.href = '/finalizado';
            
        } else {
            alert(data.mensagem || 'Erro ao processar pagamento');
            botao.textContent = textoOriginal;
            botao.disabled = false;
        }
        
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao processar pagamento');
        
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
    const cpf = document.getElementById('CPF').value.replace(/\D/g, '');
    
    // Validações básicas
    if (!numeroCartao || numeroCartao.length !== 16) {
        alert('Número do cartão inválido. Deve ter 16 dígitos.');
        document.getElementById('numero-cartao').focus();
        return false;
    }
    
    if (!nomeTitular || nomeTitular.length < 3) {
        alert('Nome do titular é obrigatório.');
        document.getElementById('nome-titular').focus();
        return false;
    }
    
    if (!validade || !/^\d{2}\/\d{2}$/.test(validade)) {
        alert('Validade inválida. Use o formato MM/AA.');
        document.getElementById('validade-card').focus();
        return false;
    }
    
    if (!cvv || (cvv.length !== 3 && cvv.length !== 4)) {
        alert('CVV inválido. Deve ter 3 ou 4 dígitos.');
        document.getElementById('CVV').focus();
        return false;
    }
    
    if (!cpf || cpf.length !== 11) {
        alert('CPF inválido. Deve ter 11 dígitos.');
        document.getElementById('CPF').focus();
        return false;
    }
    
    // Validar data (não permitir cartão vencido)
    const [mes, ano] = validade.split('/').map(num => parseInt(num, 10));
    const agora = new Date();
    const anoAtual = agora.getFullYear() % 100;
    const mesAtual = agora.getMonth() + 1;
    
    if (ano < anoAtual || (ano === anoAtual && mes < mesAtual)) {
        alert('Cartão vencido. Verifique a data de validade.');
        document.getElementById('validade-card').focus();
        return false;
    }
    
    return true;
}