import { read, create, update, getConnection } from '../config/database.js';

class FinalizacaoModel {
    // EMPRESAS
    static async buscarEmpresaPorId(id) {
        try {
            console.log('Buscando empresa por ID:', id);
            const empresas = await read('empresas', `id = ${id}`);
            
            if (!empresas || empresas.length === 0) {
                console.log('Nenhuma empresa encontrada para ID:', id);
                return null;
            }
            
            console.log('Empresa encontrada:', empresas[0]);
            return empresas[0];
            
        } catch(error) {
            console.error('Erro ao buscar empresa por ID:', error);
            throw error;
        }
    }

    static async atualizarEmpresa(id, data) { 
        try {
            console.log('Atualizando empresa ID:', id, 'com dados:', data);
            
            // Remover campos vazios ou undefined
            const dadosParaAtualizar = {};
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                    dadosParaAtualizar[key] = data[key];
                }
            });
            
            console.log('Dados para atualizar:', dadosParaAtualizar);
            
            if (Object.keys(dadosParaAtualizar).length === 0) {
                console.log('Nenhum dado para atualizar');
                return false;
            }
            
            // Chamar função update do banco
            const resultado = await update('empresas', dadosParaAtualizar, `id = ${id}`);
            
            console.log('Resultado da atualização:', resultado);
            return resultado;
            
        } catch(error) {
            console.error('Erro ao atualizar empresa:', error);
            throw error;
        }
    }

    static async criarEmpresa(data) {
        try {
            console.log('Criando empresa com dados:', data);
            const resultado = await create('empresas', data);
            console.log('Empresa criada com ID:', resultado.insertId);
            return resultado;
        } catch(error) {
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
    }

    // PEDIDOS - usar empresaId como usuario_id
    static async buscarCarrinho(empresaId) {
        try {
            console.log('Buscando carrinho para empresa ID:', empresaId);
            const pedidos = await read('pedidos', `usuario_id = ${empresaId} AND status = 'carrinho' ORDER BY id DESC LIMIT 1`);
            console.log('Pedidos no carrinho:', pedidos.length);
            return pedidos || [];
        } catch(error) {
            console.error('Erro ao buscar carrinho:', error);
            throw error;
        }
    }

    static async atualizarStatusPedido(pedidoId, status) {
        try {
            console.log('Atualizando status do pedido', pedidoId, 'para:', status);
            const resultado = await update('pedidos', { status }, `id = ${pedidoId}`);
            console.log('Status atualizado:', resultado);
            return resultado;
        } catch(error) {
            console.error('Erro ao atualizar status do pedido:', error);
            throw error;
        }
    }

    static async buscarPedidoPorId(id, empresaId) {
        try {
            console.log('Buscando pedido ID:', id, 'para empresa:', empresaId);
            const pedidos = await read('pedidos', `id = ${id} AND usuario_id = ${empresaId} ORDER BY id DESC LIMIT 1`);
            console.log('Pedidos encontrados:', pedidos.length);
            return pedidos || [];
        } catch(error) {
            console.error('Erro ao buscar pedido:', error);
            throw error;
        }
    }

    static async buscarPedidoAguardandoPagamento(empresaId) {
        try {
            console.log('Buscando pedidos aguardando pagamento para empresa:', empresaId);
            const pedidos = await read('pedidos', `usuario_id = ${empresaId} AND status = 'aguardando_pagamento' ORDER BY id DESC LIMIT 1`);
            console.log('Pedidos encontrados:', pedidos.length);
            return pedidos || [];
        } catch(error) {
            console.error('Erro ao buscar pedidos aguardando pagamento:', error);
            throw error;
        }
    }

    static async buscarPedidoPago(empresaId) {
        try {
            console.log('Buscando pedidos pagos para empresa:', empresaId);
            const pedidos = await read('pedidos', `usuario_id = ${empresaId} AND status = 'pago' ORDER BY id DESC LIMIT 1`);
            console.log('Pedidos encontrados:', pedidos.length);
            return pedidos || [];
        } catch(error) {
            console.error('Erro ao buscar pedidos pagos:', error);
            throw error;
        }
    }

    static async buscarPedidoFinalizado(empresaId) {
        try {
            console.log('Buscando pedidos finalizados para empresa:', empresaId);
            const pedidos = await read('pedidos', `usuario_id = ${empresaId} AND status = 'enviado' ORDER BY id DESC LIMIT 1`);
            console.log('Pedidos encontrados:', pedidos.length);
            return pedidos || [];
        } catch(error) {
            console.error('Erro ao buscar pedidos finalizados:', error);
            throw error;
        }
    }

    // DADOS_PEDIDO
    static async buscarDadosPedido(pedidoId) {
        try {
            console.log('Buscando dados do pedido ID:', pedidoId);
            const dados = await read('dados_pedido', `pedidoId = ${pedidoId} LIMIT 1`);
            console.log('Dados encontrados:', dados.length);
            return dados || [];
        } catch(error) {
            console.error('Erro ao buscar dados do pedido:', error);
            throw error;
        }
    }

    static async criarDadosPedido(data) {
        try {
            console.log('Criando dados do pedido:', data);
            const resultado = await create('dados_pedido', data);
            console.log('Dados criados com ID:', resultado.insertId);
            return resultado;
        } catch(error) {
            console.error('Erro ao criar dados do pedido:', error);
            throw error;
        }
    }

    static async atualizarDadosPedido(pedidoId, data) {
        try {
            console.log('Atualizando dados do pedido ID:', pedidoId, 'com:', data);
            
            // Remover campos vazios
            const dadosParaAtualizar = {};
            Object.keys(data).forEach(key => {
                if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
                    dadosParaAtualizar[key] = data[key];
                }
            });
            
            console.log('Dados para atualizar:', dadosParaAtualizar);
            
            if (Object.keys(dadosParaAtualizar).length === 0) {
                console.log('Nenhum dado para atualizar');
                return false;
            }
            
            const resultado = await update('dados_pedido', dadosParaAtualizar, `pedidoId = ${pedidoId}`);
            console.log('Dados atualizados:', resultado);
            return resultado;
            
        } catch(error) {
            console.error('Erro ao atualizar dados do pedido:', error);
            throw error;
        }
    }

    // ITENS DO PEDIDO
    static async buscarItensPedido(pedidoId) {
        try {
            console.log('Buscando itens do pedido ID:', pedidoId);
            const connection = await getConnection();
            
            const sql = `
                SELECT 
                    ip.*,
                    p.nome,
                    p.preco,
                    p.ca,
                    p.img
                FROM itens_pedidos ip
                JOIN produtos p ON ip.produto_id = p.id
                WHERE ip.pedido_id = ?
                ORDER BY ip.id ASC
            `;
            
            const [itens] = await connection.execute(sql, [pedidoId]);
            connection.release();
            
            console.log('Itens encontrados:', itens.length);
            return itens || [];
            
        } catch(error) {
            console.error('Erro ao buscar itens do pedido:', error);
            throw error;
        }
    }
}

export default FinalizacaoModel;