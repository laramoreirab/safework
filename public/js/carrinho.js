// Carregar carrinho ao abrir a aba
document.getElementById('open-carrinho').addEventListener('click', () => {
    console.log('Abrindo modal do carrinho...');
    carregarCarrinho();
});

// Fechar carrinho quando clicar no X
document.getElementById('btnFechar-filtrar').addEventListener('click', () => {
    document.getElementById('aba-carrinho').style.display = 'none';
    document.getElementById('escurecer-filtrar').style.display = 'none';
});

// Fechar carrinho quando clicar no escurecer
document.getElementById('escurecer-filtrar').addEventListener('click', () => {
    document.getElementById('aba-carrinho').style.display = 'none';
    document.getElementById('escurecer-filtrar').style.display = 'none';
});

async function carregarCarrinho() {
    try {
        console.log('Carregando carrinho...');
        
        const res = await fetch('/carrinho', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await res.json();
        console.log('Dados recebidos:', data);
        
        if (data.sucesso) {
            renderizarCarrinho(data.dados);
            // Mostrar o modal
            document.getElementById('aba-carrinho').style.display = 'block';
            document.getElementById('escurecer-filtrar').style.display = 'block';
        } else {
            console.error('Erro ao carregar carrinho:', data.mensagem);
            renderizarCarrinhoVazio();
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        renderizarCarrinhoVazio();
    }
}

function renderizarCarrinhoVazio() {
    const container = document.querySelector('.padding-filtrar');
    const subtotalElement = document.getElementById('subtotal-carrinho');
    
    container.innerHTML = '<p style="text-align: center; padding: 2rem;">Seu carrinho está vazio</p>';
    subtotalElement.textContent = '0,00';
    
    // Configurar botão finalizar para carrinho vazio
    configurarBotaoFinalizar(true);
}

// Renderizar itens do carrinho
function renderizarCarrinho(dados) {
    const container = document.querySelector('.padding-filtrar');
    const subtotalElement = document.getElementById('subtotal-carrinho');
    
    if (!dados.itens || dados.itens.length === 0) {
        renderizarCarrinhoVazio();
        return;
    }
    
    container.innerHTML = dados.itens.map(item => {
        const precoUnitario = item.preco_unitario || item.preco || 0;
        const quantidade = item.quantidade || 1;
        const totalItem = precoUnitario * quantidade;
        
        // Calcular quantidade em lotes (cada lote = 50 unidades)
        const quantidadeLotes = Math.ceil(quantidade / 50);
        
        return `
        <div class="one-produto-carrinho" data-item-id="${item.id}">
            <div class="space-img-carrinho">
                <img src="${item.img || '/public/img/abafador.svg'}" alt="${item.nome}">
            </div>

            <div class="space-meio-carrinho">
                <div class="names-carrinho">
                    <p><strong>${item.nome}</strong></p>
                    <span>CA: ${item.ca} | Tamanho: ${item.tamanho || 'Único'}</span>
                    <small style="display: block; color: #666; margin-top: 5px;">
                        ${quantidade} unidades (${quantidadeLotes} lote${quantidadeLotes > 1 ? 's' : ''})
                    </small>
                </div>

                <div class="add-remove-carrinho">
                    <button class="reduzir-carrinho" data-item-id="${item.id}" data-action="decrease" title="Diminuir 50 unidades">
                        <p>-</p>
                    </button>

                    <p class="quantidade-carrinho">${quantidade}</p>

                    <button class="add-carrinho" data-item-id="${item.id}" data-action="increase" title="Aumentar 50 unidades">
                        <p>+</p>
                    </button>
                </div>
            </div>

            <div class="space-final-carrinho">
                <i class="fi fi-br-cross-small" data-item-id="${item.id}" data-action="remove" title="Remover item"></i>
                <p>R$ <span class="preco-item">${totalItem.toFixed(2).replace('.', ',')}</span></p>
            </div>
        </div>`;
    }).join('');
    
    subtotalElement.textContent = (dados.total || 0).toFixed(2).replace('.', ',');
    
    // Configurar botão finalizar
    configurarBotaoFinalizar(false);
    
    // Adicionar event listeners aos botões
    adicionarEventListenersCarrinho();
}


// Configurar botão finalizar compra
function configurarBotaoFinalizar(carrinhoVazio = false) {
    const btnFinalizar = document.querySelector('#btn-finalizar-compra') || 
                        document.querySelector('a[href*="/dados"]') ||
                        document.querySelector('.btn-finalizar-compra')?.closest('a');
    
    if (btnFinalizar) {
        if (carrinhoVazio) {
            // Desabilita o botão se carrinho estiver vazio
            btnFinalizar.style.pointerEvents = 'none';
            btnFinalizar.style.opacity = '0.5';
            const button = btnFinalizar.querySelector('button');
            if (button) {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
            }
        } else {
            // Habilita o botão se carrinho tiver itens
            btnFinalizar.style.pointerEvents = 'auto';
            btnFinalizar.style.opacity = '1';
            const button = btnFinalizar.querySelector('button');
            if (button) {
                button.disabled = false;
                button.style.cursor = 'pointer';
            }
            
            // Garante que o link está correto
            const caminhoDados = obterCaminhoDados();
            btnFinalizar.href = caminhoDados;
            console.log('Link finalizar compra definido para:', caminhoDados);
        }
    }
}

// Função para detectar o caminho correto da página dados
function obterCaminhoDados() {
    const caminhoAtual = window.location.pathname;
    console.log('Caminho atual:', caminhoAtual);
    
    // Se está em /produtos/cabeca/37 ou similar
    if (caminhoAtual.includes('/produtos/')) {
        return '/dados';
    }
    // Se está na raiz
    else if (caminhoAtual === '/' || caminhoAtual.includes('/views/')) {
        return '/dados';
    }
    // Se está em outra pasta
    else {
        return '/dados';
    }
}

// Adicionar event listeners aos botões do carrinho
function adicionarEventListenersCarrinho() {
    const container = document.querySelector('.padding-filtrar');
    
    // Remove event listeners antigos para evitar duplicação
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);
    
    // Novo event listener com delegation
    document.querySelector('.padding-filtrar').addEventListener('click', function(e) {
        const target = e.target;
        
        // Encontrar o elemento clicado (botão ou ícone)
        const button = target.closest('button') || target.closest('i');
        if (!button) return;
        
        const itemId = button.dataset.itemId;
        const action = button.dataset.action;
        
        console.log('Botão clicado:', { itemId, action });
        
        if (!itemId) return;
        
        // Encontrar a quantidade atual
        const itemElement = button.closest('.one-produto-carrinho');
        const quantidadeElement = itemElement.querySelector('.quantidade-carrinho');
        const quantidadeAtual = parseInt(quantidadeElement.textContent);
        
        switch(action) {
            case 'increase':
                // Aumenta em 50 unidades (1 lote)
                atualizarQuantidade(itemId, quantidadeAtual + 50);
                break;
            case 'decrease':
                // Diminui em 50 unidades (1 lote), mínimo de 50 unidades
                if (quantidadeAtual > 50) {
                    atualizarQuantidade(itemId, quantidadeAtual - 50);
                } else if (quantidadeAtual === 50) {
                    // Se tem exatamente 50, pergunta se quer remover
                    if (confirm('Deseja remover este item do carrinho?')) {
                        removerItem(itemId);
                    }
                } else {
                    // Se tem menos de 50 (não deveria acontecer), remove
                    removerItem(itemId);
                }
                break;
            case 'remove':
                removerItem(itemId);
                break;
        }
    });
}

// Verificar se usuário está autenticado
async function verificarAutenticacao() {
    try {
        const res = await fetch('/carrinho/contador', {
            credentials: 'include'
        });
        
        if (res.status === 401) {
            console.log('❌ Usuário não autenticado');
            return false;
        }
        
        console.log('✅ Usuário autenticado');
        return true;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
}

// Função global para adicionar item ao carrinho
window.adicionarAoCarrinho = async function(produtoId, quantidade = 50, tamanho = null) {
    try {
        console.log('Adicionando ao carrinho:', { produtoId, quantidade, tamanho });
        
        // Verificar autenticação primeiro
        const estaAutenticado = await verificarAutenticacao();
        if (!estaAutenticado) {
            alert('Você precisa fazer login para adicionar produtos ao carrinho');
            window.location.href = '/login';
            return;
        }
        
        // Garante que a quantidade seja múltipla de 50
        const quantidadeFinal = Math.max(50, Math.ceil(quantidade / 50) * 50);
        
        console.log('Enviando requisição para /carrinho/adicionar');
        
        const res = await fetch('/carrinho/adicionar', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
                produtoId: parseInt(produtoId), 
                quantidade: quantidadeFinal, 
                tamanho: tamanho,
                tipoQuantidade: 'unidade'
            })
        });
        
        console.log('Status da resposta:', res.status);
        
        const data = await res.json();
        console.log('Resposta do servidor:', data);
        
        if (res.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login';
            return;
        }
        
        if (data.sucesso) {
            alert(`${quantidadeFinal} unidades adicionadas ao carrinho!`);
            // Atualiza contador
            atualizarContadorCarrinho();
        } else {
            alert(data.mensagem || 'Não foi possível adicionar ao carrinho');
        }
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro de conexão ao adicionar item ao carrinho');
    }
}

// Função global para atualizar quantidade (agora em múltiplos de 50)
window.atualizarQuantidade = async function(itemId, novaQuantidade) {
    try {
        console.log('Atualizando quantidade:', { itemId, novaQuantidade });
        
        // Garante que a quantidade seja múltipla de 50 e pelo menos 50
        const quantidadeFinal = Math.max(50, Math.ceil(novaQuantidade / 50) * 50);
        
        const res = await fetch(`/carrinho/item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ quantidade: quantidadeFinal })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            console.log(`Quantidade atualizada para ${quantidadeFinal} unidades`);
            carregarCarrinho(); // Recarrega todo o carrinho para atualizar preços
        } else {
            alert(data.mensagem || 'Erro ao atualizar quantidade');
        }
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
        alert('Erro ao atualizar quantidade');
    }
}

// Função global para remover item
window.removerItem = async function(itemId) {
    if (!confirm('Tem certeza que deseja remover este item do carrinho?')) return;
    
    try {
        console.log('Removendo item:', itemId);
        
        const res = await fetch(`/carrinho/item/${itemId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            console.log('Item removido com sucesso');
            carregarCarrinho(); // Recarrega todo o carrinho
            atualizarContadorCarrinho(); // Atualiza contador
        } else {
            alert(data.mensagem || 'Erro ao remover item');
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
        alert('Erro ao remover item');
    }
}

// Atualizar contador do carrinho
window.atualizarContadorCarrinho = async function() {
    try {
        const res = await fetch('/carrinho/contador', {
            credentials: 'include'
        });
        const data = await res.json();
        
        if (data.sucesso) {
            const contador = document.querySelector('.contador-carrinho');
            if (contador) {
                contador.textContent = data.dados.totalItens;
                contador.style.display = data.dados.totalItens > 0 ? 'flex' : 'none';
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar contador:', error);
    }
}

// Event listener para o botão finalizar compra (fallback)
document.addEventListener('click', function(e) {
    if (e.target.id === 'confirmar-filtrar' || 
        e.target.classList.contains('btn-finalizar-compra')) {
        
        e.preventDefault();
        
        // Verifica se o carrinho tem itens
        const subtotalText = document.getElementById('subtotal-carrinho').textContent;
        const subtotal = parseFloat(subtotalText.replace(',', '.'));
        
        if (subtotal > 0 && !isNaN(subtotal)) {
            console.log('Redirecionando para finalização...');
            window.location.href = '/dados';
        } else {
            alert('Seu carrinho está vazio! Adicione itens antes de finalizar a compra.');
        }
    }
});

// Inicializar contador ao carregar a página
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔧 Carrinho.js inicializado');
    
    // Verificar autenticação primeiro
    const autenticado = await verificarAutenticacao();
    
    if (autenticado) {
        // Carregar carrinho se usuário estiver logado
        await atualizarContadorCarrinho();
    } else {
        console.log('⚠️ Usuário não autenticado - carrinho vazio');
        renderizarCarrinhoVazio();
    }
});