document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página entrega.html carregada');
    
    await carregarDadosSalvos();
    configurarMascaras();
    configurarFormulario();
});

// Carregar dados salvos da etapa anterior
async function carregarDadosSalvos() {
    try {
        const res = await fetch('/finalizacao/dados', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            document.getElementById('nome-empresa').value = data.dados.nomeEmpresa || '';
            document.getElementById('cnpj-empresa').value = data.dados.cnpj || '';
            
            console.log('Dados da empresa carregados');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Configurar máscaras nos campos
function configurarMascaras() {
    const cepInput = document.getElementById('cep-empresa');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
    
    const telefoneInput = document.getElementById('telefone-empresa');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
    
    const cpfInput = document.getElementById('CPF');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 9) {
                    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                } else if (value.length > 6) {
                    value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
                } else if (value.length > 3) {
                    value = value.replace(/(\d{3})(\d{0,3})/, '$1.$2');
                }
            }
            e.target.value = value;
        });
    }
}

// Configurar evento do formulário
function configurarFormulario() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await finalizarPedido();
        });
    }
    
    const cepInput = document.getElementById('cep-empresa');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCEP);
    }
}

// Buscar endereço via CEP
async function buscarCEP() {
    const cepInput = document.getElementById('cep-empresa');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return;
    }
    
    try {
        console.log('Buscando CEP:', cep);
        
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = await res.json();
        
        if (!endereco.erro) {
            document.getElementById('endereco-empresa').value = endereco.logradouro || '';
            document.getElementById('bairro-empresa').value = endereco.bairro || '';
            document.getElementById('cidade-empresa').value = endereco.localidade || '';
            document.getElementById('estado-empresa').value = endereco.uf || '';
            
            document.getElementById('numero-empresa').focus();
            
            console.log('Endereço preenchido automaticamente');
        } else {
            alert('CEP não encontrado');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP');
    }
}

// Finalizar pedido
async function finalizarPedido() {
    console.log('Finalizando pedido...');
    
    // Coletar dados do formulário
    const dadosEntrega = {
        endereco: `${document.getElementById('endereco-empresa').value}, ${document.getElementById('numero-empresa').value}`,
        cpfRepresentante: document.getElementById('CPF').value.replace(/\D/g, ''),
        telefoneRepresentante: document.getElementById('telefone-empresa').value.replace(/\D/g, ''),
        nomeRepresentante: document.getElementById('nome-representante').value,
        portaria: document.getElementById('portaria').value || null
    };
    
    // Validações
    if (!validarFormulario(dadosEntrega)) {
        return;
    }
    
    try {
        const btnSubmit = document.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Processando...';
        btnSubmit.disabled = true;
        
        console.log('Enviando dados de entrega:', dadosEntrega);
        
        // Salvar dados de entrega
        const resEntrega = await fetch('/finalizacao/entrega', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dadosEntrega)
        });
        
        const dataEntrega = await resEntrega.json();
        
        if (!dataEntrega.sucesso) {
            throw new Error(dataEntrega.mensagem || 'Erro ao salvar dados de entrega');
        }
        
        console.log('Dados de entrega salvos');
        
        // Redirecionar para página de pagamento
        alert('Dados de entrega salvos! Redirecionando para pagamento...');
        window.location.href = '/pagamento';
        
    } catch (error) {
        console.error('Erro ao finalizar pedido:', error);
        alert('Erro: ' + error.message);
        
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Continuar';
        btnSubmit.disabled = false;
    }
}

// Validar formulário
function validarFormulario(dados) {
    if (!dados.endereco || dados.endereco.trim() === '') {
        alert('Por favor, preencha o endereço completo');
        return false;
    }
    
    if (!dados.cpfRepresentante || dados.cpfRepresentante.length !== 11) {
        alert('CPF inválido');
        return false;
    }
    
    if (!dados.telefoneRepresentante || dados.telefoneRepresentante.length < 10) {
        alert('Telefone inválido');
        return false;
    }
    
    if (!dados.nomeRepresentante || dados.nomeRepresentante.trim() === '') {
        alert('Por favor, preencha o nome do representante');
        return false;
    }
    
    return true;
}