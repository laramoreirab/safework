// Salvar dados de entrega e ir para pagamento
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const endereco = document.getElementById('endereco').value;
    const cpfRepresentante = document.getElementById('CPF').value;
    const telefoneRepresentante = document.getElementById('telefone-empresa').value;
    const nomeRepresentante = document.getElementById('nome-representante').value;
    const portaria = document.getElementById('portaria').value;
    
    try {
        const res = await fetch('http://localhost:3000/finalizacao/entrega', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                endereco,
                cpfRepresentante,
                telefoneRepresentante,
                nomeRepresentante,
                portaria
            })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            // Status mudou de 'carrinho' para 'aguardando_pagamento'
            window.location.href = 'pagamento.html';
        } else {
            alert(data.mensagem || 'Erro ao salvar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar dados de entrega');
    }
});