import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class comprovanteModel{
    static async buscarPedido(pedidoId){
        try {
            const rows = await read('pedidos', `id = ${pedidoId}`)  
            return rows // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar pedido', error) // aparece o erro caso houver
            throw error
        }
    }

    static async buscarEmpresa(empresaId){
        try {
            const rows = await read('empresas', `id = ${empresaId}`)
            return rows[0] // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar Empresa por ID', error) // aparece o erro caso houver
            throw error
        }
    }

    static async buscarItens(pedidoId){
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

    static async buscarDadosCompra(pedidoId){
        try {
            const rows = await read('dados_pedido', `pedidoId = ${pedidoId}`)  
            return rows[0] // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar pedido', error) // aparece o erro caso houver
            throw error
        }
    }
}

export default comprovanteModel