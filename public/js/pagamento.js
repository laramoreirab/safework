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
        console.log('📦 Carregando resumo do pedido...');
        
        // Buscar pedido ativo (que deve estar aguardando pagamento)
        const res = await fetch('/finalizacao/resumo', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status da resposta do resumo:', res.status);
        
        if (!res.ok) {
            if (res.status === 401) {
                alert('❌ Sessão expirada. Faça login novamente.');
                window.location.href = '/login';
                return;
            }
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📊 Dados do pedido recebidos:', data);
        
        if (data.sucesso && data.dados) {
            const subtotal = parseFloat(data.dados.subtotal) || 0;
            const taxaEntrega = parseFloat(data.dados.taxaEntrega) || 9.90;
            const total = parseFloat(data.dados.total) || 0;
            
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
            
            // NOVO: Renderizar itens do pedido
            renderizarItensPedido(data.dados.itens || []);
            
            // Salvar o ID do pedido
            if (data.dados.pedidoId) {
                localStorage.setItem('pedidoAtualId', data.dados.pedidoId);
                console.log('💾 Pedido ID salvo:', data.dados.pedidoId);
            }
        } else {
            console.error('❌ Erro no pedido:', data.mensagem);
            alert('⚠️ Pedido não encontrado ou erro ao carregar dados');
            
            // Redirecionar para produtos se pedido não encontrado
            setTimeout(() => {
                window.location.href = '/produtos/todos';
            }, 2000);
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar resumo:', error);
        alert('Erro ao carregar resumo do pedido: ' + error.message);
    }
}

// NOVA FUNÇÃO: Renderizar itens do pedido DENTRO do resumo
function renderizarItensPedido(itens) {
    console.log('🎨 Renderizando itens do pedido:', itens);
    
    // Procurar o container de detalhes do resumo
    const detalhesResumo = document.querySelector('.detalhes-resumo');
    
    if (!detalhesResumo) {
        console.warn('⚠️ Container .detalhes-resumo não encontrado');
        return;
    }
    
    // Procurar se já existe um container de itens
    let containerItens = detalhesResumo.querySelector('.itens-resumo-pedido');
    
    // Se não existir, criar e inserir ANTES do primeiro .row-resumo (subtotal)
    if (!containerItens) {
        containerItens = document.createElement('div');
        containerItens.className = 'itens-resumo-pedido';
        
        const primeiraRow = detalhesResumo.querySelector('.row-resumo');
        if (primeiraRow) {
            detalhesResumo.insertBefore(containerItens, primeiraRow);
        } else {
            detalhesResumo.insertBefore(containerItens, detalhesResumo.firstChild);
        }
    }
    
    // Limpar conteúdo anterior
    containerItens.innerHTML = '';
    
    if (!itens || itens.length === 0) {
        containerItens.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">Nenhum item no carrinho</p>';
        return;
    }
    
    // Renderizar cada item
    itens.forEach(item => {
        const precoUnitario = parseFloat(item.preco_unitario || item.preco || 0);
        const quantidade = parseInt(item.quantidade || 1);
        const totalItem = precoUnitario * quantidade;
        const quantidadeLotes = Math.ceil(quantidade / 50);
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-resumo';
        itemDiv.style.cssText = `
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 1rem;
            align-items: center;
        `;
        
        itemDiv.innerHTML = `
        <div style="flex-shrink: 0;">
                <img src="/uploads/imagens/${item.img || item.imagem || '/public/img/abafador.svg'}" 
                     alt="${item.nome || 'Produto'}"
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"
                     onerror="this.src='/public/img/abafador.svg'">
            </div>
            <div style="flex-grow: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: bold;">
                    ${item.nome || 'Produto'}
                </h4>
                <p style="margin: 0; color: #666; font-size: 0.875rem;">
                    CA: ${item.ca || 'N/A'}
                    ${item.tamanho ? ` | Tamanho: ${item.tamanho}` : ''}
                </p>
                <p style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.875rem;">
                    ${quantidade} unidades (${quantidadeLotes} lote${quantidadeLotes > 1 ? 's' : ''})
                </p>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <p style="margin: 0; font-size: 0.875rem; color: #666;">
                    R$ ${precoUnitario.toFixed(2).replace('.', ',')} / un
                </p>
                <p style="margin: 0.25rem 0 0 0; font-size: 1.125rem; font-weight: bold; color: #333;">
                    R$ ${totalItem.toFixed(2).replace('.', ',')}
                </p>
            </div>
        `;
        
        containerItens.appendChild(itemDiv);
    });
    
    console.log(`✅ ${itens.length} itens renderizados dentro do resumo`);
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