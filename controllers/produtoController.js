import ProdutoModel from '../models/produtoModel.js'
import { fileURLToPath } from 'url'
import path from 'path'
// import { removerArquivoAntigo } from '../middlewares/uploadMiddleware.js'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

// Controller para operações com produtos

class ProdutoController {

    // GET /produtos  para listar todos os produtos (paginação)
    static async ListarProdutos(req, res) {
        try {

            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 40;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página Inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                })
            }
            if (limite <= 0) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser um número maior que zero'
                })
            }

            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100
            if (limite > limiteMaximo) {
                res.status(400).json({
                    sucesso: false,
                    erro: 'Limite Inválido',
                    mensagem: `O limite deve ser um numero entre 1 e ${limiteMaximo}`
                })
            }

            const offset = (pagina - 1) * limite;

            const resultado = await ProdutoModel.listarTodos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.produtos,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            })
        } catch (err) {
            console.error('Erro ao listar produtos:', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os produtos'
            })
        }
    }

    // GET /produtos/:id
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params

            if (!id || isNaN(id)) { // caso for diferente ou não for um numero 
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID Inválido',
                    mensagem: 'O ID deve ser um número válido'
                })
            }

            const produto = await ProdutoModel.buscarPorId(id);

            if (!produto) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com ID ${id} não foi encontrado`
                })
            }

            res.status(200).json({
                suceso: true,
                dados: produto
            })
        } catch (err) {
            console.error('Erro ao buscar produto', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: "Não foi possível buscar o produto"
            })
        }
    }

    // GET /produtos/:categoria
    static async buscarPorCategoria(req, res) {
        try {
            const { categoria } = req.params

            const produto = await ProdutoModel.buscarPorCategoria(categoria);

            if (!produto) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Produto não encontrado',
                    mensagem: `Produto com categoria ${id} não foi encontrado`
                })
            }

            res.status(200).json({
                suceso: true,
                dados: produto
            })
        } catch (err) {
            console.error('Erro ao buscar produto', err)
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: "Não foi possível buscar o produto"
            })
        }
    }

    static async criar(req, res) {
        try {
            const { nome, tipo, ca, preco, estoque, descricao, marca } = req.body;
            console.log(`esse é o req :`, req.body);

            // Validações manuais - coletar todos os erros
            const erros = [];

            // Validar nome
            if (!nome || nome.trim() === '') {
                erros.push({
                    campo: 'nome',
                    mensagem: 'Nome é obrigatório'
                });
            } else {
                if (nome.trim().length < 3) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter pelo menos 3 caracteres'
                    });
                }

                if (nome.trim().length > 255) {
                    erros.push({
                        campo: 'nome',
                        mensagem: 'O nome deve ter no máximo 255 caracteres'
                    });
                }
            }

            // Validar preço
            if (!preco || isNaN(preco) || preco <= 0) {
                erros.push({
                    campo: 'preco',
                    mensagem: 'Preço deve ser um número positivo'
                });
            }

            // Se houver erros, retornar todos de uma vez
            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    detalhes: erros
                });
            }

            // Preparar dados do produto
            const dadosProduto = {
                nome: nome.trim(),
                preco: parseFloat(preco),
                tipo: tipo,
                ca: ca,
                estoque: estoque,
                descricao: descricao,
                marca: marca
            };


            // Adicionar imagem se foi enviada
            if (req.file) {
                dadosProduto.img = req.file.filename;
            }

            const produtoId = await ProdutoModel.criar(dadosProduto);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Produto criado com sucesso',
                dados: {
                    id: produtoId,
                    ...dadosProduto
                }
            });
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível criar o produto'
            });
        }
    }

}

export default ProdutoController 
