import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class comprovanteModel{
    static async buscarPedido(pedidoId){
        try {
            const rows = await read('pedidos', `id = ${pedidoId}`)  
            return rows[0] || null // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar pedido', err) // aparece o erro caso houver
            throw err 
        }
    }

    static async buscarEmpresa(empresaId){
        try {
            const rows = await read('empresa', `id = ${empresaId}`)
            return rows[0] || null // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar Empresa por ID', err) // aparece o erro caso houver
            throw err 
        }
    }

    static async buscarItens(pedidoId){
        try {
            const rows = await read('itens_pedidos', ` pedido_id= ${pedidoId}`)
            return rows[0] || null // retorna essa linha ou um valor nulo
        } catch (error) {
            console.error('Erro ao buscar Itens por ID do pedido', err) // aparece o erro caso houver
            throw err 
        }
    }
}

export default comprovanteModel