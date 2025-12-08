import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class contatoModel {

    static async criar(mensagemUser) {
        try {

            return await create('contatos', mensagemUser);
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            throw error;
        }
    }


    static async listar(pagina, limite) {
        try {
            const offset = (pagina - 1) * limite;

            // Buscar usuários com paginação (usando prepared statements para segurança)
            const connection = await getConnection();
            try {
                const sql = 'SELECT * FROM contatos ORDER BY id DESC LIMIT ? OFFSET ?';
                const [contatos] = await connection.query(sql, [limite, offset]);

                // Contar total de registros
                const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM contatos');
                const total = totalResult[0].total;

                return {
                    contatos,
                    total,
                    pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar contatos:', error);
            throw error;
        }
    }
}

export default contatoModel