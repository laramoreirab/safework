import usuarioModel from '../models/carrinhoModel.js';

class carrinhoController {
    
    // GET /carrinho - Obter carrinho do usuário logado
    static async obterCarrinho(req, res){
        try{
            const usuarioId = req.usuario.id; // Vem do authMiddleware

            //Buscar pedido com status 'carrinho' do usuario 
            const pedidos = await carrinhoModel.obterCarrinho(usuarioId)
            
        }catch (error) {
            console.error('Erro ao obter carrinho:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o carrinho'
            });
    }
}