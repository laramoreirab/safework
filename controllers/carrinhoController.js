import carrinhoModel from '../models/carrinhoModel.js';
import carrinhoModel from '../models/carrinhoModel.js';
import produtoModel from '../models/produtoModel.js';

class carrinhoController {
    
    // GET /carrinho - Obter carrinho do usuário logado
    static async obterCarrinho(req, res){
        try{
            const usuarioId = req.usuario.id; // Vem do authMiddleware

            //Buscar pedido com status 'carrinho' do usuario 
            const pedido = await carrinhoModel.buscarCarrinhoUusario(usuarioId)
             if (!pedido) {
            return res.json({ 
                sucesso: true, 
                dados: { itens: [],
                total: 0 } });
            }

            const itens = await carrinhoModel.buscarItensCarrinho(pedido)

            return res.status(200).json({
                    sucesso: true,
                    dados: {
                        pedidoId: pedido.id,
                        itens: itens,
                        total: pedido.total || 0
                    }
            })
            
        }catch (error) {
            console.error('Erro ao obter carrinho:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o carrinho'
            });
        }
    }

    // POST /carrinho/adicionar - Adicionar item ao carrinho
    static async adicionarItem (req,res){
        try{
        usuarioId = req.usuario.id // Vem do authMiddleware
        const { produtoId, quantidade, tamanho } = req.body;
            
        // Validações
        if (!produtoId || !quantidade) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    mensagem: 'Produto e quantidade são obrigatórios'
                });
        }
        if (quantidade < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade inválida',
                    mensagem: 'A quantidade deve ser maior que zero'
                });
        }
        // Verificar se produto existe
        const produto = await produtoModel.buscarPorId(produtoId);
        if (!produto) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Produto não encontrado',
                mensagem: 'O produto solicitado não existe'    
            });
        }

        



        }catch(error){

        }

    }
}