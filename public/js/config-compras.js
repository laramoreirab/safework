// config-compras.js - VERSÃO ATUALIZADA
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📦 Carregando histórico de pedidos...');
    
    // Carregar dados do perfil primeiro
    await carregarDadosPerfil();
    
    // Depois carregar histórico de pedidos
    await carregarHistoricoPedidos();
});

// config-compras.js - função carregarDadosPerfil
async function carregarDadosPerfil() {
    try {
        const res = await fetch('/pedidos/dados-perfil', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!res.ok) {
            console.warn('Erro ao carregar dados do perfil, usando fallback...');
            const nomeElement = document.getElementById('nome-representante');
            if (nomeElement) {
                nomeElement.textContent = 'Usuário';
            }
            return;
        }
        
        const data = await res.json();
        console.log('Dados do perfil:', data);
        
        if (data.sucesso && data.dados) {
            const nomeElement = document.getElementById('nome-representante');
            if (nomeElement) {
                // Mostrar "Empresa (Representante)" ou apenas empresa
                let texto = data.dados.nomeEmpresa;
                if (data.dados.nomeRepresentante && data.dados.nomeRepresentante !== data.dados.nomeEmpresa) {
                    texto += ` (${data.dados.nomeRepresentante})`;
                }
                nomeElement.textContent = texto;
                console.log('✅ Nome atualizado:', texto);
            }
        }
        
    } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
    }
}

// Carregar histórico de pedidos
async function carregarHistoricoPedidos() {
    try {
        const res = await fetch('/pedidos/historico', {
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
        console.log('📊 Pedidos recebidos:', data);
        
        if (data.sucesso && data.dados) {
            renderizarPedidos(data.dados);
        } else {
            mostrarMensagemVazia();
        }
        
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        mostrarMensagemVazia();
    }
}

// Renderizar pedidos
// config-compras.js - Atualize a função renderizarPedidos:
function renderizarPedidos(pedidos) {
    const container = document.querySelector('.all-produtos-config');
    
    if (!pedidos || pedidos.length === 0) {
        mostrarMensagemVazia();
        return;
    }
    
    container.innerHTML = pedidos.map(pedido => {
        const numeroPedido = String(pedido.id).padStart(6, '0');
        const dataFormatada = new Date(pedido.created_at).toLocaleDateString('pt-BR');
        const status = pedido.status === 'enviado' ? 'Entregue' : 
                      pedido.status === 'pago' ? 'Pago' : 
                      pedido.status;
        
        // Determinar imagem do produto - usar p2.img da consulta
        let imagemProduto = '/public/img/abafador.svg'; // Imagem padrão
        
        // Se tiver imagem do primeiro item, usar
        if (pedido.primeiro_item_imagem && pedido.primeiro_item_imagem.trim() !== '') {
            // Verificar se é uma URL completa ou caminho relativo
            if (pedido.primeiro_item_imagem.startsWith('http') || 
                pedido.primeiro_item_imagem.startsWith('/')) {
                imagemProduto = pedido.primeiro_item_imagem;
            } else {
                // Se for apenas um nome de arquivo, montar o caminho
                imagemProduto = `/uploads/imagens/${pedido.primeiro_item_imagem}`;
            }
        }
        
        // Nome do produto (usar do primeiro item ou genérico)
        const nomeProduto = pedido.primeiro_item_nome || 'Pedido completo';
        const caProduto = pedido.primeiro_item_ca || 'N/A';
        
        // Valor total formatado
        const valorTotal = parseFloat(pedido.total || 0).toFixed(2).replace('.', ',');
        
        return `
        <div class="one-produto-config">
            <div class="titulo-produto-config">
                <div class="entregue-config">
                    <div class="circulo-entregue ${status.toLowerCase()}"></div>
                    <p>${status}</p>
                </div>
                <p>Pedido #PD-2025-<span class="numero-pedido">${numeroPedido}</span></p>
            </div>
            
            <div class="meio-produto-config">
                <img src="${imagemProduto}" 
                     alt="${nomeProduto}"
                     onerror="this.src='/public/img/abafador.svg'"
                     class="imagem-produto">
                
                <div class="informations-meio">
                    <h6 class="nome-produto">${nomeProduto}</h6>
                    <p>CA: <span class="ca-produto">${caProduto}</span></p>
                    <p class="data-pedido">${dataFormatada}</p>
                    <div style="margin-top: 8px;">
                        <p style="font-size: 12px; color: #666; margin-bottom: 3px;">
                            <i class="fi fi-sr-building" style="margin-right: 5px;"></i>
                            ${pedido.nome_empresa || 'Empresa'}
                        </p>
                        <p style="font-size: 12px; color: #666;">
                            <i class="fi fi-sr-user" style="margin-right: 5px;"></i>
                            ${pedido.nome_representante || 'Representante não informado'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="preco-produto-config">
                <p>Preço Total: <strong>R$ <span class="preco-total">${valorTotal}</span></strong></p>
            </div>
        </div>`;
    }).join('');
    
    console.log(`✅ ${pedidos.length} pedidos renderizados`);
}
// Mostrar mensagem quando não há pedidos
function mostrarMensagemVazia() {
    const container = document.querySelector('.all-produtos-config');
    if (container) {
        container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #666;">
            <i class="fi fi-sr-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
            <h3 style="margin-bottom: 0.5rem;">Nenhum pedido encontrado</h3>
            <p>Você ainda não fez nenhum pedido.</p>
            <a href="/produtos/todos" 
               style="display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; 
                      background: #007bff; color: white; border-radius: 4px; text-decoration: none;">
               Ver produtos
            </a>
        </div>`;
    }
}

// Adicionar estilo para o círculo de status
document.head.insertAdjacentHTML('beforeend', `
<style>
    .circulo-entregue {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #28a745;
        margin-right: 8px;
    }
    .circulo-entregue.entregue { background-color: #28a745; }
    .circulo-entregue.pago { background-color: #ffc107; }
    .circulo-entregue.processing { background-color: #17a2b8; }
    
    .imagem-produto {
        width: 145px;
        height: 145px;
        object-fit: cover;
        border-radius: 8px;
    }
    
    .one-produto-config {
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        transition: box-shadow 0.2s;
    }
    
    .one-produto-config:hover {
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
</style>
`);