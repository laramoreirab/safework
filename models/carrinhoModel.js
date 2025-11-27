import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class usuarioModel{

    static async buscarPedidoCarrinho(usuarioId){
        try{
            const rows= await read('pedido', `usuario_id = ${usuarioId} and status = 'carrinho'`)
            return rows[0] || null
        }catch(error){
            console.log('Erro ao buscar pedido no carrinho')
            throw error
        }
    }
    static async 

    static async 
}






export default carrinhoModel;