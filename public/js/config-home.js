// public/js/config-home.js - Versão Atualizada
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 Página de configurações carregada');
    
    // Carregar dados do perfil
    await carregarDadosPerfil();
    
    // Configurar eventos dos modais
    configurarModais();

    configurarBotoesSalvar()
    
    // Configurar logout
    configurarLogout();
});

// CARREGAR DADOS DO PERFIL
async function carregarDadosPerfil() {
    try {
        console.log('Carregando dados do perfil...');
        
        const res = await fetch('/usuarios/perfil', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Dados do perfil recebidos:', data);
        
        if (data.sucesso && data.dados) {
            preencherDadosPerfil(data.dados);
        } else {
            console.error('Erro na resposta:', data);
            alert('Erro ao carregar dados do perfil');
        }
        
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar dados do perfil: ' + error.message);
    }
}

// PREENCHER DADOS NA TELA
function preencherDadosPerfil(usuario) {
    console.log('Preenchendo dados do usuário:', usuario);
    
    // Nome nos títulos
    const nomesRepresentante = document.querySelectorAll('#nome-representante');
    nomesRepresentante.forEach(el => {
        if (el) el.textContent = usuario.nome || 'Usuário';
    });
    
    // Nome na seção de informações
    const nomeInfo = document.querySelector('#nome-representante-info');
    if (nomeInfo) {
        nomeInfo.textContent = usuario.nome || 'Não informado';
    }
    
    // Email
    const emailInfo = document.querySelector('#email-representante');
    if (emailInfo) {
        emailInfo.textContent = usuario.email || 'Não informado';
    }
    
    // Telefone formatado
    const telefoneInfo = document.querySelector('#numero-representante');
    if (telefoneInfo) {
        telefoneInfo.textContent = formatarTelefone(usuario.telefone) || 'Não informado';
    }
    
    // CNPJ formatado
    const cnpjInfo = document.querySelector('#cnpj-representante');
    if (cnpjInfo) {
        cnpjInfo.textContent = formatarCNPJ(usuario.cnpj) || 'Não informado';
    }
    
    console.log('✅ Dados preenchidos na tela');
    
    // Preencher os campos dos modais com os dados atuais
    preencherCamposModais(usuario);
}

// PREENCHER CAMPOS DOS MODAIS
function preencherCamposModais(usuario) {
    // Preencher campo do modal de nome
    const inputNome = document.querySelector('#modalAlterarNome input[name="nome-representante"]');
    if (inputNome) {
        inputNome.value = usuario.nome || '';
    }
    
    // Preencher campo do modal de email
    const inputEmail = document.querySelector('#modalAlterarEmail input[name="email-representante"]');
    if (inputEmail) {
        inputEmail.value = usuario.email || '';
    }
    
    // Preencher campo do modal de telefone
    const inputTelefone = document.querySelector('#modalAlterarNumero input[name="numero-representante"]');
    if (inputTelefone) {
        inputTelefone.value = formatarTelefone(usuario.telefone) || '';
    }
    
    // Preencher campo do modal de CNPJ
    const inputCnpj = document.querySelector('#modalAlterarCnpj input[name="cnpj-representante"]');
    if (inputCnpj) {
        inputCnpj.value = formatarCNPJ(usuario.cnpj) || '';
    }
}

// CONFIGURAR MODAIS
function configurarModais() {
    console.log('Configurando modais...');
    
    // Modal de Nome
    const btnAlterarNome = document.getElementById('alterar-nome');
    if (btnAlterarNome) {
        btnAlterarNome.addEventListener('click', () => {
            console.log('Abrindo modal de alterar nome');
            const modal = new bootstrap.Modal(document.getElementById('modalAlterarNome'));
            modal.show();
        });
    }
    
    // Modal de Email
    const btnAlterarEmail = document.getElementById('alterar-email');
    if (btnAlterarEmail) {
        btnAlterarEmail.addEventListener('click', () => {
            console.log('Abrindo modal de alterar email');
            const modal = new bootstrap.Modal(document.getElementById('modalAlterarEmail'));
            modal.show();
        });
    }
    
    // Modal de Telefone
    const btnAlterarNumero = document.getElementById('alterar-numero');
    if (btnAlterarNumero) {
        btnAlterarNumero.addEventListener('click', () => {
            console.log('Abrindo modal de alterar telefone');
            const modal = new bootstrap.Modal(document.getElementById('modalAlterarNumero'));
            modal.show();
        });
    }
    
    // Modal de CNPJ
    const btnAlterarCnpj = document.getElementById('alterar-cnpj');
    if (btnAlterarCnpj) {
        btnAlterarCnpj.addEventListener('click', () => {
            console.log('Abrindo modal de alterar CNPJ');
            const modal = new bootstrap.Modal(document.getElementById('modalAlterarCnpj'));
            modal.show();
        });
    }
    
    // Configurar botões de salvar
    configurarBotoesSalvar();
}

// CONFIGURAR BOTÕES DE SALVAR
function configurarBotoesSalvar() {
    console.log('Configurando botões de salvar...');
    
    // Salvar Nome
    const btnSalvarNome = document.querySelector('#modalAlterarNome .btn-primary');
    if (btnSalvarNome) {
        btnSalvarNome.addEventListener('click', async () => {
            const input = document.querySelector('#modalAlterarNome input[name="nome-representante"]');
            const novoNome = input.value.trim();
            
            if (!novoNome) {
                alert('Nome não pode estar vazio');
                return;
            }
            
            await atualizarCampo('nome', novoNome, 'Nome atualizado com sucesso!', 'modalAlterarNome');
        });
    }
    
    // Salvar Email
    const btnSalvarEmail = document.querySelector('#modalAlterarEmail .btn-primary');
    if (btnSalvarEmail) {
        btnSalvarEmail.addEventListener('click', async () => {
            const input = document.querySelector('#modalAlterarEmail input[name="email-representante"]');
            const novoEmail = input.value.trim();
            
            if (!novoEmail) {
                alert('Email não pode estar vazio');
                return;
            }
            
            // Validar formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(novoEmail)) {
                alert('Por favor, insira um email válido');
                return;
            }
            
            await atualizarCampo('email', novoEmail, 'Email atualizado com sucesso!', 'modalAlterarEmail');
        });
    }
    
    // Salvar Telefone
    const btnSalvarTelefone = document.querySelector('#modalAlterarNumero .btn-primary');
    if (btnSalvarTelefone) {
        btnSalvarTelefone.addEventListener('click', async () => {
            const input = document.querySelector('#modalAlterarNumero input[name="numero-representante"]');
            const novoTelefone = input.value.trim();
            
            if (!novoTelefone) {
                alert('Telefone não pode estar vazio');
                return;
            }
            
            // Limpar telefone (apenas números)
            const telefoneLimpo = novoTelefone.replace(/\D/g, '');
            
            if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
                alert('Telefone inválido. Deve ter 10 ou 11 dígitos.');
                return;
            }
            
            await atualizarCampo('telefone', telefoneLimpo, 'Telefone atualizado com sucesso!', 'modalAlterarNumero');
        });
    }
    
    // Salvar CNPJ
    const btnSalvarCnpj = document.querySelector('#modalAlterarCnpj .btn-primary');
    if (btnSalvarCnpj) {
        btnSalvarCnpj.addEventListener('click', async () => {
            const input = document.querySelector('#modalAlterarCnpj input[name="cnpj-representante"]');
            const novoCnpj = input.value.trim();
            
            if (!novoCnpj) {
                alert('CNPJ não pode estar vazio');
                return;
            }
            
            // Limpar CNPJ (apenas números)
            const cnpjLimpo = novoCnpj.replace(/\D/g, '');
            
            if (cnpjLimpo.length !== 14) {
                alert('CNPJ inválido. Deve ter 14 dígitos.');
                return;
            }
            
            await atualizarCampo('cnpj', cnpjLimpo, 'CNPJ atualizado com sucesso!', 'modalAlterarCnpj');
        });
    }
}

// FUNÇÃO GENÉRICA PARA ATUALIZAR CAMPOS
async function atualizarCampo(campo, valor, mensagemSucesso, idModal) {
    try {
        const endpoint = `/usuarios/atualizar-${campo}`;
        console.log(`Atualizando ${campo}:`, valor);
        
        const res = await fetch(endpoint, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ [campo]: valor })
        });
        
        const data = await res.json();
        console.log(`Resposta da atualização de ${campo}:`, data);
        
        if (data.sucesso) {
            alert(mensagemSucesso);
            
            // Fechar modal
            const modalElement = document.getElementById(idModal);
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
            
            // Recarregar dados
            await carregarDadosPerfil();
        } else {
            alert(data.erro || `Erro ao atualizar ${campo}`);
        }
        
    } catch (error) {
        console.error(`Erro ao atualizar ${campo}:`, error);
        alert(`Erro ao atualizar ${campo}: ${error.message}`);
    }
}

// CONFIGURAR LOGOUT
function configurarLogout() {
    // Botão abrir modal de sair
    const btnOpenSair = document.getElementById('openSairConta');
    if (btnOpenSair) {
        btnOpenSair.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('modalSairConta'));
            modal.show();
        });
    }
    
    // Botão NÃO (fechar modal)
    const btnNaoSair = document.getElementById('nao-sair');
    if (btnNaoSair) {
        btnNaoSair.addEventListener('click', () => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalSairConta'));
            if (modal) modal.hide();
        });
    }
    
    // Botão SIM (fazer logout)
    const btnSimSair = document.getElementById('sim-sair');
    if (btnSimSair) {
        btnSimSair.addEventListener('click', async () => {
            await fazerLogout();
        });
    }
}

async function fazerLogout() {
    try {
        console.log('Fazendo logout...');
        
        const res = await fetch('/usuarios/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        const data = await res.json();
        
        if (data.sucesso) {
            console.log('✅ Logout realizado com sucesso');
            
            // Redirecionar para login
            window.location.href = '/login';
        } else {
            alert('Erro ao fazer logout');
        }
        
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout');
    }
}

// FUNÇÕES DE FORMATAÇÃO
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

function formatarCNPJ(cnpj) {
    if (!cnpj) return '';
    const cnpjLimpo = cnpj.toString().replace(/\D/g, '');
    if (cnpjLimpo.length === 14) {
        return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
}