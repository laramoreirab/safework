// Carregar resumo do pedido
document.addEventListener('DOMContentLoaded', async () => {
    const pedidoId = localStorage.getItem('pedidoId');
    
    if (!pedidoId) {
        alert('Nenhum pedido encontrado');
        window.location.href = 'produtos.html';
        return;
    }
    
    try {
        const res = await fetch(`http://localhost:3000/finalizacao/resumo/${pedidoId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            renderizarResumo(data.dados);
            
            // Finalizar pedido (mudar status para 'enviado')
            await finalizarPedido(pedidoId);
        } else {
            alert('Erro ao carregar resumo');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar resumo do pedido');
    }
    
    // Limpar localStorage
    localStorage.removeItem('pedidoId');
});

// Finalizar pedido (status -> enviado)
async function finalizarPedido(pedidoId) {
    try {
        await fetch('http://localhost:3000/finalizacao/finalizar', {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
    }
}

// Renderizar resumo
function renderizarResumo(dados) {
    const { pedido, dadosPedido, itens } = dados;
    
    // Número do pedido
    const numeroPedido = String(pedido.id).padStart(6, '0');
    document.getElementById('number-pedido').textContent = numeroPedido;
    
    // Informações de entrega
    if (dadosPedido) {
        const infoEntrega = `
            <p><strong>Endereço: </strong>${dadosPedido.endereco}</p>
            <p><strong>Previsão de Entrega: </strong>15 a 18 de ${obterMesProximo()}</p>
            <p><strong>Destinatário: </strong>${dadosPedido.nome_representante}</p>
        `;
        document.querySelector('.descricao-info').innerHTML = infoEntrega;
        
        // Forma de pagamento
        let formaPagamento = 'Não informado';
        if (dadosPedido.metodo_pagamento === 'credito') {
            formaPagamento = 'Cartão de Crédito';
        } else if (dadosPedido.metodo_pagamento === 'pix') {
            formaPagamento = 'PIX';
        } else if (dadosPedido.metodo_pagamento === 'boleto') {
            formaPagamento = 'Boleto';
        }
        document.getElementById('forma-pedido').textContent = formaPagamento;
    }
    
    // Valores
    const subtotal = parseFloat(pedido.total || 0);
    const taxaEntrega = 9.90;
    const total = subtotal + taxaEntrega;
    
    // Atualizar todos os spans de subtotal
    document.querySelectorAll('#subtotal-pedido').forEach(el => {
        el.textContent = subtotal.toFixed(2).replace('.', ',');
    });
    
    // Atualizar total
    const totalElements = document.querySelectorAll('#total-pedido, [id*="total"]');
    totalElements.forEach(el => {
        el.textContent = total.toFixed(2).replace('.', ',');
    });
}

// Obter mês próximo
function obterMesProximo() {
    const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    const data = new Date();
    data.setDate(data.getDate() + 15);
    return meses[data.getMonth()] + ' de ' + data.getFullYear();
}