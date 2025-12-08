import contatoModel from '../models/contatoModel.js'

class contatoController {

    static async criar(req, res) {
        try {
            const { nome, email, telefone, mensagem } = req.body

            // Verificando o nome
            if (!nome || nome.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome é obrigatório',
                    mensagem: 'Nome é obrigatório'
                });
            }

            if (nome.trim().length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome inválido',
                    mensagem: 'Nome deve ter pelo menos 2 caracteres'
                });
            }

            if (nome.trim().length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome inválido',
                    mensagem: 'Nome deve ter no máximo 255 caracteres'
                });
            }

            // verficando formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }
            // verificando o telefone
            if (telefone.length < 11) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone inválido',
                    mensagem: 'O telefone deve ter pelo menos 11 caracteres'
                });
            }

            if (mensagem.length < 10) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Mensagem Inválida',
                    mensagem: `Mensagem deve ter no mínimo 10 caracteres. (0${mensagem.length}/10)`
                })
            }
            if (mensagem.length > 999) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Mensagem Inválida',
                    mensagem: `Mensagem deve ter no máximo 999 caracteres. (${mensagem.length}/999)`
                })
            }

            const mensagemUser = {
                nome: nome,
                email: email,
                telefone: telefone,
                mensagem: mensagem
            }

            await contatoModel.criar(mensagemUser)

            res.status(200).json({
                sucesso: true,
                mensagem: 'Sua mensagem foi enviada com sucesso! Agradecemos o contato.',
                dados: {
                    nome: mensagemUser.nome,
                    email: mensagemUser.email,
                    telefone: mensagemUser.telefone,
                    mensagem: mensagemUser.mensagem
                }
            })
        } catch (err) {
            console.error('Erro ao enviar contato:', err);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao enviar contato',
                mensagem: err.message
            })
        }
    }


    static async listar(req,res) {
        try {
            // Obter parâmetros de paginação da query string
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            // Validações
            if (pagina < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite < 1 || limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }

            const resultado = await contatoModel.listar(pagina, limite);

            res.status(200).json({
                sucesso: true,
                dados: resultado.contatos,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuários'
            });
        }
    }
}

export default contatoController