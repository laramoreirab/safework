import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class carrinhoModel {

    // Buscar carrinho ativo do usuário
    static async buscarCarrinhoUsuario(usuarioId) {
        try {
            const rows = await read('pedidos', `usuario_id = ${usuarioId} AND status = 'carrinho'`);
            return rows[0] || null;
        } catch (error) {
            console.error(' Erro ao buscar pedido no carrinho:', error);
            throw error;
        }
    }

    // Buscar itens do carrinho
    static async buscarItens(pedidoId) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                        SELECT 
                        ip.id,
                        ip.pedido_id,
                        ip.produto_id,
                        ip.quantidade,
                        ip.preco_unitario,
                        ip.tamanho,
                        p.nome,
                        p.preco as preco_produto,
                        CONCAT('/uploads/imagens/', p.img) as img,
                        p.ca,
                        p.descricao,
                        (ip.quantidade * ip.preco_unitario) AS subtotal
                    FROM itens_pedidos ip
                    JOIN produtos p ON ip.produto_id = p.id 
                    WHERE ip.pedido_id = ?
                    ORDER BY ip.id DESC
                `;
                const [rows] = await connection.execute(sql, [pedidoId]);
                return rows;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao obter itens do carrinho:', error);
            throw error;
        }
    }

    // Criar novo pedido (carrinho)
    static async criarPedido(usuarioId) {
        try {
            const result = await create('pedidos', {
                usuario_id: usuarioId,
                status: 'carrinho',
                total: 0.00,
                data_: new Date().toISOString().slice(0, 19).replace('T', ' ')
            });
            return result.insertId;
        } catch (error) {
            console.error(' Erro ao criar pedido:', error);
            throw error;
        }
    }

    // Buscar item existente no carrinho
    static async buscarItemExistente(pedidoId, produtoId, tamanho) {
        try {
            let whereClause = `pedido_id = ${pedidoId} AND produto_id = ${produtoId}`;
            
            if (tamanho) {
                whereClause += ` AND tamanho = '${tamanho}'`;
            } else {
                whereClause += ` AND (tamanho IS NULL OR tamanho = '')`;
            }
            
            const rows = await read('itens_pedidos', whereClause);
            return rows[0] || null;
        } catch (error) {
            console.error(' Erro ao buscar item existente:', error);
            throw error;
        }
    }

    // Buscar item específico por ID e pedido (para verificação de permissão)
    static async buscarItemPorId(itemId, pedidoId) {
        try {
            const rows = await read('itens_pedidos', `id = ${itemId} AND pedido_id = ${pedidoId}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar item por ID:', error);
            throw error;
        }
    }

    // Adicionar novo item ao carrinho
    static async adicionarItem(pedidoId, produtoId, quantidade, tamanho, precoUnitario) {
        try {
            const result = await create('itens_pedidos', {
                pedido_id: pedidoId,
                produto_id: produtoId,
                quantidade: quantidade,
                preco_unitario: precoUnitario,
                tamanho: tamanho || null
            });
            return result.insertId;
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            throw error;
        }
    }

    // Atualizar quantidade de um item
    static async atualizarQuantidadeItem(itemId, novaQuantidade) {
        try {
            const result = await update(
                'itens_pedidos',
                { quantidade: novaQuantidade },
                `id = ${itemId}`
            );
            return result;
        } catch (error) {
            console.error('Erro ao atualizar quantidade do item:', error);
            throw error;
        }
    }

    // Remover item do carrinho
    static async removerItem(itemId) {
        try {
            const result = await deleteRecord('itens_pedidos', `id = ${itemId}`);
            return result;
        } catch (error) {
            console.error('Erro ao remover item:', error);
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
                        SELECT COALESCE(SUM(quantidade * preco_unitario), 0)
                        FROM itens_pedidos 
                        WHERE pedido_id = ?
                    )
                    WHERE id = ?
                `;
                const [result] = await connection.execute(sql, [pedidoId, pedidoId]);
                return result;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao atualizar total do pedido:', error);
            throw error;
        }
    }

    // Obter total de itens no carrinho (soma das quantidades)
    static async obterTotalItens(pedidoId) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                    SELECT COALESCE(SUM(quantidade), 0) as total_itens
                    FROM itens_pedidos 
                    WHERE pedido_id = ?
                `;
                const [rows] = await connection.execute(sql, [pedidoId]);
                return rows[0].total_itens;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao obter total de itens:', error);
            throw error;
        }
    }

    // Limpar carrinho (remover todos os itens)
    static async limparCarrinho(pedidoId) {
        try {
            const connection = await getConnection();
            try {
                // Primeiro remover todos os itens
                const deleteSql = `DELETE FROM itens_pedidos WHERE pedido_id = ?`;
                await connection.execute(deleteSql, [pedidoId]);
                
                // Atualizar total para 0
                const updateSql = `UPDATE pedidos SET total = 0 WHERE id = ?`;
                await connection.execute(updateSql, [pedidoId]);
                
                return true;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
            throw error;
        }
    }

    // Finalizar pedido (mudar status de 'carrinho' para 'finalizado')
    static async finalizarPedido(pedidoId) {
        try {
            const result = await update(
                'pedidos',
                { 
                    status: 'finalizado',
                    data_finalizacao: new Date().toISOString().slice(0, 19).replace('T', ' ')
                },
                `id = ${pedidoId}`
            );
            return result;
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            throw error;
        }
    }
}

export default carrinhoModel;