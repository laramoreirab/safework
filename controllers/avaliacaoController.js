import { getConnection } from '../config/database.js';

class AvaliacaoController {

    // GET /avaliacoes/:produtoId — listar avaliações do produto
    static async listar(req, res) {
        try {
            const { produtoId } = req.params;
            const connection = await getConnection();

            const sql = `
                SELECT 
                    a.id,
                    a.nota,
                    a.comentario,
                    a.data_criacao,
                    e.nome AS nome_avaliador
                FROM avaliacoes a
                JOIN empresas e ON a.usuario_id = e.id
                WHERE a.produto_id = ?
                ORDER BY a.data_criacao DESC
            `;

            const [avaliacoes] = await connection.execute(sql, [produtoId]);
            connection.release();

            // Calcula média
            const media = avaliacoes.length > 0
                ? (avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length).toFixed(1)
                : null;

            return res.status(200).json({
                sucesso: true,
                media,
                total: avaliacoes.length,
                dados: avaliacoes
            });

        } catch (error) {
            console.error('Erro ao listar avaliações:', error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }

    // POST /avaliacoes/:produtoId — criar avaliação
    static async criar(req, res) {
        try {
            const { produtoId } = req.params;
            const usuarioId = req.usuario.id;
            const { nota, comentario } = req.body;

            if (!nota || nota < 1 || nota > 5) {
                return res.status(400).json({ sucesso: false, mensagem: 'Nota inválida. Deve ser entre 1 e 5.' });
            }

            const connection = await getConnection();

            // Verifica se o usuário já avaliou esse produto
            const [jaAvaliou] = await connection.execute(
                'SELECT id FROM avaliacoes WHERE produto_id = ? AND usuario_id = ?',
                [produtoId, usuarioId]
            );

            if (jaAvaliou.length > 0) {
                connection.release();
                return res.status(400).json({ sucesso: false, mensagem: 'Você já avaliou este produto.' });
            }

            await connection.execute(
                'INSERT INTO avaliacoes (produto_id, usuario_id, nota, comentario) VALUES (?, ?, ?, ?)',
                [produtoId, usuarioId, nota, comentario || null]
            );

            connection.release();

            return res.status(201).json({ sucesso: true, mensagem: 'Avaliação enviada com sucesso!' });

        } catch (error) {
            console.error('Erro ao criar avaliação:', error);
            res.status(500).json({ sucesso: false, mensagem: error.message });
        }
    }
}

export default AvaliacaoController;