document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 Página /finalizado carregada');
    
    try {
        // Buscar ID do pedido finalizado
        const pedidoId = await obterPedidoIdFinalizado();
        
        if (!pedidoId) {
            mostrarErro('❌ Nenhum pedido finalizado encontrado');
            return;
        }
        
        console.log('✅ Pedido ID encontrado:', pedidoId);
        
        // Buscar dados completos do pedido
        await carregarPedidoCompleto(pedidoId);
        
    } catch (error) {
        console.error('❌ Erro no carregamento:', error);
        mostrarErro('Erro ao carregar resumo do pedido');
    }
});

// Obter ID do pedido finalizado
async function obterPedidoIdFinalizado() {
    // 1. Tentar do localStorage (salvo após pagamento)
    let pedidoId = localStorage.getItem('pedidoId');
    if (pedidoId) {
        console.log('📱 Pedido ID do localStorage:', pedidoId);
        return pedidoId;
    }
    
    // 2. Tentar da URL
    const urlParams = new URLSearchParams(window.location.search);
    pedidoId = urlParams.get('pedidoId');
    if (pedidoId) {
        console.log('🔗 Pedido ID da URL:', pedidoId);
        return pedidoId;
    }
    
    // 3. Buscar último pedido finalizado
    try {
        const res = await fetch('/finalizacao/ultimo-pedido-finalizado', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📊 Status da resposta (finalizado):', res.status);
        
        if (res.ok) {
            const data = await res.json();
            console.log('📊 Resposta último pedido finalizado:', data);
            
            if (data.sucesso && data.dados && data.dados.id) {
                return data.dados.id;
            }
        }
    } catch (error) {
        console.error('❌ Erro ao buscar último pedido finalizado:', error);
    }
    
    // 4. Fallback: buscar último pedido pago
    try {
        const res = await fetch('/finalizacao/ultimo-pedido-pago', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📊 Status da resposta (pago):', res.status);
        
        if (res.ok) {
            const data = await res.json();
            console.log('📊 Resposta último pedido pago:', data);
            
            if (data.sucesso && data.dados && data.dados.id) {
                return data.dados.id;
            }
        }
    } catch (error) {
        console.error('❌ Erro ao buscar último pedido pago:', error);
    }
    
    console.warn('⚠️ Nenhum pedido encontrado');
    return null;
}

// Carregar pedido completo
async function carregarPedidoCompleto(pedidoId) {
    try {
        console.log('📦 Carregando pedido completo:', pedidoId);
        
        // Primeiro tenta a rota com parâmetro
        let res = await fetch(`/finalizacao/resumo/${pedidoId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📊 Status da resposta (com ID):', res.status);
        
        // Se não encontrar, tenta a rota ativa (que pode retornar o mesmo pedido)
        if (!res.ok && res.status === 404) {
            console.log('⚠️ Rota com ID não encontrada, tentando rota ativa...');
            res = await fetch('/finalizacao/resumo', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
        }
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📊 Dados do pedido recebidos:', data);
        
        if (data.sucesso && data.dados) {
            renderizarResumo(data.dados);
        } else {
            throw new Error(data.mensagem || 'Dados do pedido não encontrados');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar pedido completo:', error);
        throw error;
    }
}

// Renderizar resumo do pedido
function renderizarResumo(dados) {
    console.log('🖼️ Renderizando resumo:', dados);
    
    const { pedidoId, status, subtotal, total, taxaEntrega, itens, dadosEntrega, createdAt } = dados;
    
    if (!pedidoId) {
        mostrarErro('Dados do pedido incompletos');
        return;
    }
    
    // 1. Número do pedido
    const numeroPedido = String(pedidoId).padStart(6, '0');
    const numberElement = document.getElementById('number-pedido');
    if (numberElement) {
        numberElement.textContent = numeroPedido;
        console.log('🔢 Número do pedido:', numeroPedido);
    }
    
    // 2. Data do pedido
    const dataPedido = new Date(createdAt || new Date()).toLocaleDateString('pt-BR');
    const dataElement = document.getElementById('data-pedido');
    if (dataElement) {
        dataElement.textContent = dataPedido;
        console.log('📅 Data do pedido:', dataPedido);
    }
    
    // 3. Informações de entrega
    renderizarInformacoesEntrega(dadosEntrega);
    
    // 4. Forma de pagamento
    renderizarFormaPagamento(dadosEntrega);
    
    // 5. IMPORTANTE: Renderizar itens do pedido
    renderizarItensPedido(itens);
    
    // 6. Valores (subtotal, taxa, total)
    renderizarValores(dados);
    
    console.log('✅ Resumo renderizado com sucesso!');
}

// Renderizar informações de entrega
function renderizarInformacoesEntrega(dadosPedido) {
    const container = document.querySelector('.descricao-info');
    
    if (!container) {
        console.warn('⚠️ Container de informações de entrega não encontrado');
        return;
    }
    
    if (dadosPedido && dadosPedido.endereco) {
        container.innerHTML = `
            <p><strong>Endereço: </strong>${dadosPedido.endereco || 'Não informado'}</p>
            <p><strong>Nome do Representante: </strong>${dadosPedido.nome_representante || 'Não informado'}</p>
            <p><strong>CPF do Representante: </strong>${formatarCPF(dadosPedido.cpf_representante) || 'Não informado'}</p>
            <p><strong>Telefone: </strong>${formatarTelefone(dadosPedido.telefone_representante) || 'Não informado'}</p>
            ${dadosPedido.portaria ? `<p><strong>Portaria: </strong>${dadosPedido.portaria}</p>` : ''}
            <p><strong>Previsão de Entrega: </strong>15 a 18 de ${obterMesProximo()}</p>
        `;
        console.log('✅ Informações de entrega renderizadas');
    } else {
        container.innerHTML = `
            <p><strong>Endereço: </strong>Não informado</p>
            <p><strong>Previsão de Entrega: </strong>15 a 18 de ${obterMesProximo()}</p>
        `;
        console.warn('⚠️ Dados de entrega não disponíveis');
    }
}

// Renderizar forma de pagamento
function renderizarFormaPagamento(dadosPedido) {
    const elementoPagamento = document.getElementById('forma-pedido');
    
    if (!elementoPagamento) {
        console.warn('⚠️ Elemento de forma de pagamento não encontrado');
        return;
    }
    
    let formaPagamento = 'Não informado';
    
    if (dadosPedido && dadosPedido.metodo_pagamento) {
        switch(dadosPedido.metodo_pagamento) {
            case 'credito':
                formaPagamento = 'Cartão de Crédito';
                break;
            case 'pix':
                formaPagamento = 'PIX';
                break;
            case 'boleto':
                formaPagamento = 'Boleto';
                break;
            case 'debito':
                formaPagamento = 'Cartão de Débito';
                break;
            default:
                formaPagamento = dadosPedido.metodo_pagamento;
        }
    }
    
    elementoPagamento.textContent = formaPagamento;
    console.log('💳 Forma de pagamento:', formaPagamento);
}

// Renderizar itens do pedido DENTRO do resumo (SEM IMAGEM)
function renderizarItensPedido(itens) {
    console.log('🎨 Renderizando itens do pedido:', itens);
    
    // Procurar a descrição do pedido (onde ficam subtotal, taxa, etc)
    const descricaoPedido = document.querySelector('.descricao-pedido');
    
    if (!descricaoPedido) {
        console.warn('⚠️ Container .descricao-pedido não encontrado');
        return;
    }
    
    // Procurar se já existe um container de itens
    let containerItens = descricaoPedido.querySelector('.itens-resumo-pedido');
    
    // Se não existir, criar e inserir NO INÍCIO da descrição
    if (!containerItens) {
        containerItens = document.createElement('div');
        containerItens.className = 'itens-resumo-pedido';
        
        // Inserir no início (antes de tudo)
        descricaoPedido.insertBefore(containerItens, descricaoPedido.firstChild);
    }
    
    // Limpar conteúdo anterior
    containerItens.innerHTML = '';
    
    if (!itens || itens.length === 0) {
        containerItens.innerHTML = '<p style="text-align: center; color: #666; padding: 1rem;">Nenhum item no pedido</p>';
        console.warn('⚠️ Nenhum item encontrado no pedido');
        return;
    }
    
    // Adicionar título
    const titulo = document.createElement('h3');
    titulo.textContent = 'Itens do Pedido';
    titulo.style.cssText = `
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
        font-weight: bold;
        color: #333;
    `;
    containerItens.appendChild(titulo);
    
    // Renderizar cada item (SEM IMAGEM, apenas texto)
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
    
    // Adicionar um divisor após os itens
    const divisor = document.createElement('hr');
    divisor.style.cssText = 'margin: 1rem 0; border: none; border-top: 2px solid #ddd;';
    containerItens.appendChild(divisor);
    
    console.log(`✅ ${itens.length} itens renderizados dentro do resumo`);
}

// Renderizar valores (subtotal, taxa, total)
function renderizarValores(dados) {
    console.log('💰 Renderizando valores:', dados);
    
    const subtotal = parseFloat(dados.subtotal) || 0;
    const taxaEntrega = parseFloat(dados.taxaEntrega) || 9.90;
    const total = parseFloat(dados.total) || 0;
    
    console.log('💰 Valores calculados:', { subtotal, taxaEntrega, total });
    
    // Atualizar elementos na tela
    const subtotalElements = document.querySelectorAll('#subtotal-pedido, [id*="subtotal"]');
    subtotalElements.forEach(el => {
        el.textContent = subtotal.toFixed(2).replace('.', ',');
    });
    
    const taxaElements = document.querySelectorAll('#taxa-entrega, [id*="taxa"]');
    taxaElements.forEach(el => {
        el.textContent = taxaEntrega.toFixed(2).replace('.', ',');
    });
    
    const totalElements = document.querySelectorAll('#total-pedido, [id*="total"]');
    totalElements.forEach(el => {
        el.textContent = total.toFixed(2).replace('.', ',');
    });
    
    console.log('✅ Valores renderizados');
}

// Funções auxiliares de formatação
function formatarCPF(cpf) {
    if (!cpf) return '';
    const cpfLimpo = cpf.toString().replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    const telLimpo = telefone.toString().replace(/\D/g, '');
    if (telLimpo.length === 11) {
        return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (telLimpo.length === 10) {
        return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

// Obter mês próximo para previsão de entrega
function obterMesProximo() {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const data = new Date();
    data.setDate(data.getDate() + 15);
    return meses[data.getMonth()] + ' de ' + data.getFullYear();
}

// Mostrar erro
function mostrarErro(mensagem) {
    console.error('❌ Erro:', mensagem);
    
    // Exibir mensagem amigável
    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        text-align: center;
        z-index: 1000;
        max-width: 90%;
        width: 400px;
    `;
    
    errorContainer.innerHTML = `
        <h3 style="color: #e74c3c; margin-bottom: 1rem;">${mensagem}</h3>
        <p>Redirecionando para a página inicial...</p>
    `;
    
    document.body.appendChild(errorContainer);
    
    setTimeout(() => {
        window.location.href = '/';
    }, 3000);
}