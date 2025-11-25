import {create, read, update, deleteRecord, getConnection} from '../config/database.js'

// Model para operações com produtos
class ProdutoModel {
    // Listar todos os produtos (com paginação)
    static async listarTodos(limite, offset) {
        try{
            const connection = await getConnection()
            try{
                const sql = 'SELECT * FROM produtos ORDER BY id DESC LIMIT ? OFFSET ?'

                const [produtos] = await connection.query(sql, [limite, offset])
                
                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM produtos')
                const total = totalResult[0].total;

                const paginaAtual = (offset / limite) + 1
                const totalPaginas = Math.ceil(total / limite)

                return {
                    produtos,
                    total,
                    pagina: paginaAtual,
                    limite, 
                    totalPaginas
                }

            } finally {
                connection.release()
            }
        } catch(err) {
            console.error('Erro ao lstar produtos', err)
            throw err
        } 
    }  

    // Buscar produto por ID
    static async buscarPorId(id) {
        try {
            const rows = await read('produtos', `id = ${id}`) // le a tabela produtos e caso houver o id enviado, 
            return rows[0] || null // retorna essa linha ou um valor nulo 
        } catch (err) {
            console.error('Erro ao buscar produto por ID:', err)
            throw err
        }
    }

    // Criar novo produto
    static async criar(dadosProduto) {
        try{
            return await create('produtos', dadosProduto) // cria um produto puxando os dados enviados e adicionando a tabela produtos
        } catch (err) {
            console.error('Erro ao criar produto:', err)
            throw err
        }
    }

    // Atualizar produto
    static async atualizar(id, dadosProduto) { // pega o id e os dados do produto
        try {
            return await update('produtos', dadosProduto, `id = ${id}`) // atualiza o item na tabela produto puxando os dados caso tiver o id enviado
        } catch (err) {
            console.error('Erro ao atualizar produto:', err)
            throw err
        }
    }

    // Excluir produto
    static async excluir(id) {
        try {
            return deleteRecord('produtos', `id = ${id}`) // procura na tabela produtos o id enviado para ser excluido usando a função deleteRecord do database
        } catch(err) {
            console.error('Erro ao excluir produto', err) // aparece um erro caso não encontrar o produto para excluir
            throw err
        }
    }
    // Buscar por categoria
    static async buscarPorCategoria(categoria) { // pega a variavel categoria
        try{
            return await read('produtos', `categoria = ${categoria}`) // procura na tabela produtos a categoria enviada
        } catch(err) {
            console.error('Erro ao buscar Categoria', err) // aparece o erro caso houver
            throw err 
        }
    }
}

export default ProdutoModel // exporta a classe ProdutoModel para ser utilizada em outros arquivos