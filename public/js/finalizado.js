// finalizado.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página finalizado.html carregada');
    console.log('Referrer:', document.referrer);
    
    // Tentar obter o pedidoId de múltiplas fontes
    const pedidoId = await obterPedidoId();
    
    console.log('Pedido ID encontrado:', pedidoId);
    
    if (!pedidoId) {
        mostrarErro('Nenhum pedido encontrado');
        return;
    }
    
    try {
        // Buscar resumo do pedido
        await carregarResumoPedido(pedidoId);
        
    } catch (error) {
        console.error('Erro no carregamento:', error);
        mostrarErro('Erro ao carregar resumo do pedido');
    }
    
    // Limpar storages após uso
    limparStorages();
});

// Obter pedidoId de múltiplas fontes
async function obterPedidoId() {
    // 1. Tentar do localStorage
    let pedidoId = localStorage.getItem('pedidoId');
    if (pedidoId) {
        console.log('Pedido ID do localStorage:', pedidoId);
        return pedidoId;
    }
    
    // 2. Tentar do sessionStorage
    pedidoId = sessionStorage.getItem('pedidoId');
    if (pedidoId) {
        console.log('Pedido ID do sessionStorage:', pedidoId);
        return pedidoId;
    }
    
    // 3. Tentar da URL (query parameter)
    const urlParams = new URLSearchParams(window.location.search);
    pedidoId = urlParams.get('pedidoId');
    if (pedidoId) {
        console.log('Pedido ID da URL:', pedidoId);
        return pedidoId;
    }
    
    // 4. Buscar último pedido pago do usuário
    console.log('Buscando último pedido pago do usuário...');
    pedidoId = await buscarUltimoPedidoPago();
    if (pedidoId) {
        console.log('Último pedido pago encontrado:', pedidoId);
        return pedidoId;
    }
    
    return null;
}

// Buscar último pedido pago do usuário
async function buscarUltimoPedidoPago() {
    try {
        const res = await fetch('/finalizacao/ultimo-pedido-pago', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!res.ok) {
            console.warn('Não foi possível buscar último pedido');
            return null;
        }
        
        const data = await res.json();
        
        if (data.sucesso && data.dados && data.dados.id) {
            return data.dados.id;
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao buscar último pedido:', error);
        return null;
    }
}

// Carregar resumo do pedido
async function carregarResumoPedido(pedidoId) {
    try {
        console.log('Buscando resumo do pedido:', pedidoId);
        
        const res = await fetch(`/finalizacao/resumo/${pedidoId}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Status da resposta:', res.status);
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.erro || errorData.mensagem || 'Erro ao buscar resumo');
        }
        
        const data = await res.json();
        console.log('Dados do resumo recebidos:', data);
        
        if (data.sucesso && data.dados) {
            renderizarResumo(data.dados);
            
            // Atualizar status do pedido para "finalizado" (se ainda não estiver)
            await atualizarStatusPedido(pedidoId);
            
        } else {
            throw new Error(data.mensagem || 'Dados do pedido não encontrados');
        }
        
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
        throw error;
    }
}

// Atualizar status do pedido
async function atualizarStatusPedido(pedidoId) {
    try {
        console.log('Atualizando status do pedido:', pedidoId);
        
        const res = await fetch('/finalizacao/finalizar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                pedidoId: pedidoId
            })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            console.log('Status do pedido atualizado para "enviado"');
        } else {
            console.warn('Aviso ao atualizar status:', data.mensagem);
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
    }
}

// Renderizar resumo do pedido
function renderizarResumo(dados) {
    console.log('Renderizando resumo:', dados);
    
    const { pedido, dadosPedido, itens } = dados;
    
    if (!pedido) {
        throw new Error('Dados do pedido não encontrados');
    }
    
    // 1. Número do pedido
    const numeroPedido = String(pedido.id).padStart(6, '0');
    const numberElement = document.getElementById('number-pedido');
    if (numberElement) {
        numberElement.textContent = numeroPedido;
        console.log('Número do pedido:', numeroPedido);
    }
    
    // 2. Data do pedido
    const dataPedido = new Date(pedido.data_criacao || new Date()).toLocaleDateString('pt-BR');
    const dataElement = document.getElementById('data-pedido');
    if (dataElement) {
        dataElement.textContent = dataPedido;
        console.log('Data do pedido:', dataPedido);
    }
    
    // 3. Informações de entrega
    renderizarInformacoesEntrega(dadosPedido);
    
    // 4. Forma de pagamento
    renderizarFormaPagamento(dadosPedido);
    
    // 5. Itens do pedido
    renderizarItensPedido(itens);
    
    // 6. Valores (subtotal, taxa, total)
    renderizarValores(pedido);
    
    console.log('Resumo renderizado com sucesso!');
}

// Renderizar informações de entrega
function renderizarInformacoesEntrega(dadosPedido) {
    const container = document.querySelector('.descricao-info');
    
    if (!container) {
        console.warn('Container de informações de entrega não encontrado');
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
        console.log('Informações de entrega renderizadas');
    } else {
        container.innerHTML = `
            <p><strong>Endereço: </strong>Não informado</p>
            <p><strong>Previsão de Entrega: </strong>15 a 18 de ${obterMesProximo()}</p>
        `;
        console.warn('Dados de entrega não disponíveis');
    }
}

// Renderizar forma de pagamento
function renderizarFormaPagamento(dadosPedido) {
    const elementoPagamento = document.getElementById('forma-pedido');
    
    if (!elementoPagamento) {
        console.warn('Elemento de forma de pagamento não encontrado');
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
    console.log('Forma de pagamento:', formaPagamento);
}

// Renderizar itens do pedido
function renderizarItensPedido(itens) {
    const container = document.getElementById('itens-pedido') || 
                     document.querySelector('.itens-pedido') ||
                     document.querySelector('.padding-filtrar');
    
    if (!container) {
        console.warn('Container de itens não encontrado');
        return;
    }
    
    if (itens && itens.length > 0) {
        container.innerHTML = itens.map(item => {
            const precoUnitario = parseFloat(item.preco_unitario || item.preco || 0);
            const quantidade = parseInt(item.quantidade || 1);
            const totalItem = precoUnitario * quantidade;
            const quantidadeLotes = Math.ceil(quantidade / 50);
            
            return `
            <div class="one-produto-carrinho" data-item-id="${item.id}">
                <div class="space-img-carrinho">
                    <img src="${item.imagem || item.img || '/public/img/abafador.svg'}" alt="${item.nome || 'Produto'}">
                </div>

                <div class="space-meio-carrinho">
                    <div class="names-carrinho">
                        <p><strong>${item.nome || 'Produto'}</strong></p>
                        <span>CA: ${item.ca || 'N/A'} | Tamanho: ${item.tamanho || 'Único'}</span>
                        <small style="display: block; color: #666; margin-top: 5px;">
                            ${quantidade} unidades (${quantidadeLotes} lote${quantidadeLotes > 1 ? 's' : ''})
                        </small>
                    </div>
                </div>

                <div class="space-final-carrinho">
                    <p>R$ <span>${totalItem.toFixed(2).replace('.', ',')}</span></p>
                </div>
            </div>`;
        }).join('');
        
        console.log(`✅ ${itens.length} itens renderizados`);
    } else {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Nenhum item encontrado no pedido</p>';
        console.warn('Nenhum item encontrado no pedido');
    }
}

// Renderizar valores (subtotal, taxa, total)
function renderizarValores(pedido) {
    const subtotal = parseFloat(pedido.total || 0);
    const taxaEntrega = 9.90;
    const total = subtotal + taxaEntrega;
    
    console.log('Valores calculados:', { subtotal, taxaEntrega, total });
    
    // Atualizar TODOS os elementos de subtotal
    const subtotalElements = document.querySelectorAll('#subtotal-pedido, [id*="subtotal"]');
    subtotalElements.forEach(el => {
        el.textContent = subtotal.toFixed(2).replace('.', ',');
    });
    
    // Atualizar taxa de entrega
    const taxaElements = document.querySelectorAll('#taxa-entrega, [id*="taxa"]');
    taxaElements.forEach(el => {
        el.textContent = taxaEntrega.toFixed(2).replace('.', ',');
    });
    
    // Atualizar TODOS os elementos de total
    const totalElements = document.querySelectorAll('#total-pedido, [id*="total"]');
    totalElements.forEach(el => {
        el.textContent = total.toFixed(2).replace('.', ',');
    });
    
    console.log('Valores renderizados');
}

// Funções auxiliares de formatação
function formatarCPF(cpf) {
    if (!cpf) return '';
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return cpf;
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
    if (!telefone) return '';
    const telLimpo = telefone.replace(/\D/g, '');
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
    alert(`❌ ${mensagem}\n\nRedirecionando para produtos...`);
    
    setTimeout(() => {
        window.location.href = '/produtos/todos';
    }, 3000);
}

// Limpar storages
function limparStorages() {
    setTimeout(() => {
        localStorage.removeItem('pedidoId');
        sessionStorage.removeItem('pedidoId');
        console.log(' Storages limpos');
    }, 1000);
}