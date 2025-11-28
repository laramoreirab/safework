// Selecionar método de pagamento
const paymentOptions = document.querySelectorAll('.one-option');
let metodoPagamentoSelecionado = 'credito'; // padrão

paymentOptions.forEach(option => {
    option.addEventListener('click', function() {
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const h2Text = this.querySelector('h2').textContent.trim().toLowerCase();
        
        if (h2Text.includes('cartão')) {
            metodoPagamentoSelecionado = 'credito';
        } else if (h2Text.includes('pix')) {
            metodoPagamentoSelecionado = 'pix';
        } else if (h2Text.includes('boleto')) {
            metodoPagamentoSelecionado = 'boleto';
        }
        
        console.log('Método selecionado:', metodoPagamentoSelecionado);
    });
});

// Processar pagamento
document.querySelector('.botao-resumo').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const dadosPagamento = {
        metodoPagamento: metodoPagamentoSelecionado
    };
    
    // Se for cartão, pegar dados do formulário
    if (metodoPagamentoSelecionado === 'credito') {
        dadosPagamento.numeroCartao = document.getElementById('numero-cartao').value;
        dadosPagamento.nomeTitular = document.getElementById('nome-titular').value;
        dadosPagamento.validadeCartao = document.getElementById('validade-card').value;
        dadosPagamento.cvv = document.getElementById('CVV').value;
        dadosPagamento.cpfTitular = document.getElementById('CPF').value;
        
        // Validar campos
        if (!dadosPagamento.numeroCartao || !dadosPagamento.nomeTitular || 
            !dadosPagamento.validadeCartao || !dadosPagamento.cvv || 
            !dadosPagamento.cpfTitular) {
            alert('Preencha todos os dados do cartão');
            return;
        }
    }
    
    try {
        const res = await fetch('http://localhost:3000/finalizacao/pagamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dadosPagamento)
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            // Status mudou para 'pago'
            // Salvar pedidoId para usar na página de finalizado
            localStorage.setItem('pedidoId', data.dados.pedidoId);
            window.location.href = 'finalizado.html';
        } else {
            alert(data.mensagem || 'Erro ao processar pagamento');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar pagamento');
    }
});