import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class usuarioModel{

    static async buscarCarrinhoUsuario(usuarioId){
        try{
            const rows= await read('pedido', `usuario_id = ${usuarioId} and status = 'carrinho'`)
            return rows[0] || null
        }catch(error){
            console.log('Erro ao buscar pedido no carrinho')
            throw error
        }
    }

    static async  buscarItens(pedido){
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


}





export default carrinhoModel;