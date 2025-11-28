// Carregar dados iniciais ao abrir a página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('http://localhost:3000/finalizacao/dados', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            // Preencher campo nome da empresa (readonly)
            document.getElementById('nome-empresa').value = data.dados.nomeEmpresa;
            document.getElementById('nome-empresa').readOnly = true;
            
            // Preencher email e telefone
            document.getElementById('email-empresa').value = data.dados.emailEmpresa;
            document.getElementById('telefone-empresa').value = data.dados.telefoneEmpresa;
        } else {
            alert('Erro ao carregar dados: ' + data.mensagem);
            window.location.href = 'produtos.html';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados');
    }
});

// Salvar dados e ir para próxima página
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nomeEmpresa = document.getElementById('nome-empresa').value;
    const cnpj = document.getElementById('CNPJ').value;
    const telefoneEmpresa = document.getElementById('telefone-empresa').value;
    const emailEmpresa = document.getElementById('email-empresa').value;
    
    try {
        const res = await fetch('http://localhost:3000/finalizacao/dados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                nomeEmpresa,
                cnpj,
                telefoneEmpresa,
                emailEmpresa
            })
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            window.location.href = 'entrega.html';
        } else {
            alert(data.mensagem || 'Erro ao salvar dados');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar dados');
    }
});