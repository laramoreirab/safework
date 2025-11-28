import { read, create, update, getConnection } from '../config/database.js';

class FinalizacaoModel {

    // EMPRESAS
    static async buscarEmpresaPorId(id) {
        return read('empresas', `id = ${id}`);
    }

    static async atualizarEmpresa(id, data) {
        return update('empresas', data, `id = ${id}`);
    }

    static async criarEmpresa(data) {
        return create('empresas', data);
    }

    // PEDIDOS
    static async buscarCarrinho(usuarioId) {
        return read('pedidos', `usuario_id = ${usuarioId} AND status = 'carrinho'`);
    }

    static async atualizarStatusPedido(pedidoId, status) {
        return update('pedidos', { status }, `id = ${pedidoId}`);
    }

    static async buscarPedidoPorId(id, usuarioId) {
        return read('pedidos', `id = ${id} AND usuario_id = ${usuarioId}`);
    }

    static async buscarPedidoAguardandoPagamento(usuarioId) {
        return read('pedidos', `usuario_id = ${usuarioId} AND status = 'aguardando_pagamento'`);
    }

    static async buscarPedidoPago(usuarioId) {
        return read('pedidos', `usuario_id = ${usuarioId} AND status = 'pago'`);
    }

    // DADOS_PEDIDO
    static async buscarDadosPedido(pedidoId) {
        return read('dados_pedido', `pedidoId = ${pedidoId}`);
    }

    static async criarDadosPedido(data) {
        return create('dados_pedido', data);
    }

    static async atualizarDadosPedido(pedidoId, data) {
        return update('dados_pedido', data, `pedidoId = ${pedidoId}`);
    }

    // ITENS DO PEDIDO
    static async buscarItensPedido(pedidoId) {
        const connection = await getConnection();
        try {
            const sql = `
                SELECT 
                    ip.*,
                    p.nome,
                    p.preco,
                    p.ca
                FROM itens_pedidos ip
                JOIN produtos p ON ip.produto_id = p.id
                WHERE ip.pedido_id = ?
            `;
            const [itens] = await connection.execute(sql, [pedidoId]);
            return itens;
        } finally {
            connection.release();
        }
    }
}

export default FinalizacaoModel;

