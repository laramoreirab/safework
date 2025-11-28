// entrega.js
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Página entrega.html carregada');
    
    // Carregar dados salvos anteriormente
    await carregarDadosSalvos();
    
    // Configurar máscaras
    configurarMascaras();
    
    // Configurar evento do formulário
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
            // Preencher dados da empresa (readonly)
            document.getElementById('nome-empresa').value = data.dados.nomeEmpresa || '';
            document.getElementById('cnpj-empresa').value = data.dados.cnpj || '';
            
            console.log('Dados da empresa carregados');
        } else {
            console.warn('Não foi possível carregar dados da empresa');
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Configurar máscaras nos campos
function configurarMascaras() {
    // Máscara para CEP
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
    
    // Máscara para telefone
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
    
    // Evento para buscar CEP
    const cepInput = document.getElementById('cep-empresa');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarCEP);
    }
}

// Buscar endereço via CEP
async function buscarCEP() {
    const cep = document.getElementById('cep-empresa').value.replace(/\D/g, '');
    
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
            
            // Focar no número
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
    console.log(' Finalizando pedido...');
    
    // Coletar dados do formulário
    const dadosEntrega = {
        cep: document.getElementById('cep-empresa').value,
        endereco: document.getElementById('endereco-empresa').value,
        numero: document.getElementById('numero-empresa').value,
        complemento: document.getElementById('complemento-empresa').value,
        bairro: document.getElementById('bairro-empresa').value,
        cidade: document.getElementById('cidade-empresa').value,
        estado: document.getElementById('estado-empresa').value,
        nome_representante: document.getElementById('nome-representante').value,
        telefone: document.getElementById('telefone-empresa').value,
        metodo_pagamento: document.querySelector('input[name="pagamento"]:checked')?.value
    };
    
    // Validações
    if (!validarFormulario(dadosEntrega)) {
        return;
    }
    
    try {
        // Mostrar loading
        const btnSubmit = document.querySelector('button[type="submit"]');
        const btnOriginalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Processando...';
        btnSubmit.disabled = true;
        
        console.log(' Enviando dados de entrega:', dadosEntrega);
        
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
        
        console.log(' Dados de entrega salvos');
        
        // Finalizar pedido
        const resFinalizar = await fetch('/finalizacao/finalizar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                metodo_pagamento: dadosEntrega.metodo_pagamento
            })
        });
        
        const dataFinalizar = await resFinalizar.json();
        
        console.log('Resposta finalização:', dataFinalizar);
        
        if (dataFinalizar.sucesso) {
            // SALVAR O PEDIDO ID NO LOCALSTORAGE
            const pedidoId = dataFinalizar.dados.pedidoId || dataFinalizar.dados.id;
            localStorage.setItem('pedidoId', pedidoId);
            sessionStorage.setItem('pedidoId', pedidoId);
            
            console.log(' Pedido finalizado! ID:', pedidoId);
            
            // Redirecionar para página de confirmação
            setTimeout(() => {
                window.location.href = 'finalizado.html';
            }, 1000);
            
        } else {
            throw new Error(dataFinalizar.mensagem || 'Erro ao finalizar pedido');
        }
        
    } catch (error) {
        console.error(' Erro ao finalizar pedido:', error);
        alert('Erro: ' + error.message);
        
        // Restaurar botão
        const btnSubmit = document.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Finalizar Compra';
        btnSubmit.disabled = false;
    }
}

// Validar formulário
function validarFormulario(dados) {
    const camposObrigatorios = [
        'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado', 
        'nome_representante', 'telefone', 'metodo_pagamento'
    ];
    
    for (let campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].trim() === '') {
            alert(`Por favor, preencha o campo: ${campo.replace('_', ' ')}`);
            document.getElementById(`${campo}-empresa` || campo)?.focus();
            return false;
        }
    }
    
    // Validar CEP
    const cep = dados.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido');
        document.getElementById('cep-empresa').focus();
        return false;
    }
    
    // Validar telefone
    const telefone = dados.telefone.replace(/\D/g, '');
    if (telefone.length < 10) {
        alert('Telefone inválido');
        document.getElementById('telefone-empresa').focus();
        return false;
    }
    
    return true;
}
