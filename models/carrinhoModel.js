import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class carrinhoModel{

    static async buscarCarrinhoUsuario(usuarioId){
        try{
            const rows= await read('pedido', `usuario_id = ${usuarioId} and status = 'carrinho'`)
            return rows[0] || null
        }catch(error){
            console.log('Erro ao buscar pedido no carrinho')
            throw error
        }
    }

    static async buscarItens(pedido){
        try{
        const connection = await getConnection();
            try {
                const sql = `
                    SELECT 
                        ip.*,
                        p.nome,
                        p.preco,
                        p.imagem,
                        p.ca
                    FROM itens_pedidos ip
                    JOIN produtos p ON ip.produto_id = p.id 
                    WHERE ip.pedido_id = ?
                `;

            const [rows] = await connection.execute(sql, [pedido.id]);
            return rows
        }finally {
            connection.release();
        } 
        }catch(error){
            console.error('Erro ao obter itens do carrinho', error);
            throw error;
            }
    }

    static async criarPedido(usuarioId){
        try{
        const row = await create ('pedidos', {
            usuario_id: usuarioId,
            status: 'carrinho',
            total: 0.00
        })
        return row
        }catch(error){
            console.error('Erro ao criar pedido', error);
            throw error;
        }
    }

    static async buscarItemPorId(pedidoId, tamanho, produtoId){
        try{
            const row = await read('itens_pedidos',
            `pedido_id = ${pedidoId} AND produto_id = ${produtoId}` + 
            (tamanho ? ` AND tamanho = '${tamanho}'` : '') )
            return row
        }catch(error){
            console.error('Erro ao buscar item específico', error);
            throw error;
        }
    }

    static async alterarQuantidade(novaQuantidade, produtoId){
        try{
             const row = await update ('itens_pedidos',
                {quantidade: novaQuantidade},
                `produto_id = ${produtoId}`)
             return row
        }catch(error){
            console.error('Erro ao alterar quantidade', error);
            throw error;
        }
    }

    static async adicionarItem(pedidoId, produtoId, quantidade, tamanho){
        try{
            const produto = await read('produto', id = produtoId)
            const id = await create('itens_pedidos', {
                pedido_id: pedidoId,
                produto_id: produtoId,
                quantidade: quantidade,
                preco_unitario: produto[0].preco,
                tamanho: tamanho || null
            });
            return id
        }catch(error){
            console.error('Erro ao adicionar item', error);
            throw error;
        }
    }
}





export default carrinhoModel;