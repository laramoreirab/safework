// Carregar carrinho ao abrir a aba
async function carregarCarrinho() {
    try {
        const res = await fetch('http://localhost:3000/carrinho', {
            method: 'GET',
            credentials: 'include' // Importante para enviar o cookie do token
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            renderizarCarrinho(data.dados);
        } else {
            console.error('Erro ao carregar carrinho:', data.mensagem);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

// Renderizar itens do carrinho
function renderizarCarrinho(dados) {
    const container = document.querySelector('.padding-filtrar');
    const subtotalElement = document.getElementById('subtotal-carrinho');
    
    if (dados.itens.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem;">Seu carrinho está vazio</p>';
        subtotalElement.textContent = '0,00';
        return;
    }
    
    container.innerHTML = dados.itens.map(item => `
        <div class="one-produto-carrinho" data-item-id="${item.id}">
            <div class="space-img-carrinho">
                <img src="${item.imagem || '../public/img/abafador.svg'}" alt="${item.nome}">
            </div>

            <div class="space-meio-carrinho">
                <div class="names-carrinho">
                    <p><strong>${item.nome}</strong></p>
                    <span>CA: ${item.ca} | Tamanho: ${item.tamanho}</span>
                </div>

                <div class="add-remove-carrinho">
                    <button class="reduzir-carrinho" onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1})">
                        <p>-</p>
                    </button>

                    <p class="quantidade-carrinho">${item.quantidade}</p>

                    <button class="add-carrinho" onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1})">
                        <p>+</p>
                    </button>
                </div>
            </div>

            <div class="space-final-carrinho">
                <i class="fi fi-br-cross-small" onclick="removerItem(${item.id})"></i>
                <p>R$ <span>${(item.preco_unitario * item.quantidade).toFixed(2).replace('.', ',')}</span></p>
            </div>
        </div>
    `).join('');
    
    subtotalElement.textContent = dados.total.toFixed(2).replace('.', ',');
}

// Adicionar item ao carrinho
async function adicionarAoCarrinho(produtoId, quantidade = 1, tamanho = null) {
    try {
        const res = await fetch('http://localhost:3000/carrinho/adicionar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ produtoId, quantidade, tamanho })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            alert('Item adicionado ao carrinho!');
            carregarCarrinho(); // Recarregar carrinho
        } else {
            alert(data.mensagem);
        }
    } catch (error) {
        console.error('Erro ao adicionar item:', error);
        alert('Erro ao adicionar item ao carrinho');
    }
}

// Atualizar quantidade
async function atualizarQuantidade(itemId, novaQuantidade) {
    if (novaQuantidade < 1) {
        removerItem(itemId);
        return;
    }
    
    try {
        const res = await fetch(`http://localhost:3000/carrinho/item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ quantidade: novaQuantidade })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            carregarCarrinho();
        } else {
            alert(data.mensagem);
        }
    } catch (error) {
        console.error('Erro ao atualizar quantidade:', error);
    }
}

// Remover item
async function removerItem(itemId) {
    if (!confirm('Deseja remover este item do carrinho?')) return;
    
    try {
        const res = await fetch(`http://localhost:3000/carrinho/item/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
        const data = await res.json();
        
        if (data.sucesso) {
            carregarCarrinho();
        } else {
            alert(data.mensagem);
        }
    } catch (error) {
        console.error('Erro ao remover item:', error);
    }
}

// Carregar carrinho ao abrir a aba
document.getElementById('open-carrinho').addEventListener('click', () => {
    carregarCarrinho();
});