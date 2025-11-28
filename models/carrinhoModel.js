import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class carrinhoModel {

    // Buscar carrinho ativo do usuário
    static async buscarCarrinhoUsuario(usuarioId) {
        try {
            const rows = await read('pedidos', `usuario_id = ${usuarioId} AND status = 'carrinho'`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar pedido no carrinho', error);
            throw error;
        }
    }

    // Buscar itens do carrinho
    static async buscarItens(pedido) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    SELECT 
                        ip.*,
                        p.nome,
                        p.preco,
                        p.imagem,
                        p.ca,
                        (ip.quantidade * ip.preco_unitario) AS subtotal
                    FROM itens_pedidos ip
                    JOIN produtos p ON ip.produto_id = p.id 
                    WHERE ip.pedido_id = ?
                `;
                const [rows] = await connection.execute(sql, [pedido.id]);
                return rows;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao obter itens do carrinho', error);
            throw error;
        }
    }

    // Criar novo pedido (carrinho)
    static async criarPedido(usuarioId) {
        try {
            const row = await create('pedidos', {
                usuario_id: usuarioId,
                status: 'carrinho',
                total: 0.00
            });
            return row;
        } catch (error) {
            console.error('Erro ao criar pedido', error);
            throw error;
        }
    }

    // Buscar item específico por produto+tamanho
    static async buscarItemPorId(pedidoId, tamanho, produtoId) {
        try {
            const row = await read(
                'itens_pedidos',
                `pedido_id = ${pedidoId} AND produto_id = ${produtoId}` +
                (tamanho ? ` AND tamanho = '${tamanho}'` : '')
            );
            return row;
        } catch (error) {
            console.error('Erro ao buscar item específico', error);
            throw error;
        }
    }

    // Alterar quantidade de um item (usando id do item)
    static async alterarQuantidade(novaQuantidade, itemId) {
        try {
            const row = await update(
                'itens_pedidos',
                { quantidade: novaQuantidade },
                `id = ${itemId}`
            );
            return row;
        } catch (error) {
            console.error('Erro ao alterar quantidade', error);
            throw error;
        }
    }

    // Adicionar novo item ao carrinho
    static async adicionarItem(pedidoId, produtoId, quantidade, tamanho) {
        try {
            const produto = await read('produtos', `id = ${produtoId}`);
            if (!produto || produto.length === 0) {
                throw new Error('Produto não encontrado');
            }

            const id = await create('itens_pedidos', {
                pedido_id: pedidoId,
                produto_id: produtoId,
                quantidade: quantidade,
                preco_unitario: produto[0].preco,
                tamanho: tamanho || null
            });
            return id;
        } catch (error) {
            console.error('Erro ao adicionar item', error);
            throw error;
        }
    }

    // Remover item do carrinho (usando id do item)
    static async deletarItem(itemId) {
        try {
            const row = await deleteRecord('itens_pedidos', `id = ${itemId}`);
            return row;
        } catch (error) {
            console.error('Erro ao deletar item', error);
            throw error;
        }
    }

    // Atualizar total do pedido
    static async atualizarTotalPedido(pedidoId) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    UPDATE pedidos 
                    SET total = (
                        SELECT SUM(ip.quantidade * ip.preco_unitario)
                        FROM itens_pedidos ip
                        WHERE ip.pedido_id = ?
                    )
                    WHERE id = ?
                `;
                await connection.execute(sql, [pedidoId, pedidoId]);
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao atualizar total do pedido', error);
            throw error;
        }
    }
}

export default carrinhoModel;
