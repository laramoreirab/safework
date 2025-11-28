import carrinhoModel from '../models/carrinhoModel.js';
import produtoModel from '../models/produtoModel.js';

class carrinhoController {
    
    // GET /carrinho - Obter carrinho do usuário logado
    static async obterCarrinho(req, res){
        try{
            const usuarioId = req.usuario.id; // Vem do authMiddleware

            //Buscar pedido com status 'carrinho' do usuario 
            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId)
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
        const usuarioId = req.usuario.id // Vem do authMiddleware
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

        // Buscar ou criar pedido com status 'carrinho'
        const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId)
        let pedidoId
        if (!pedido){
             pedidoId = await carrinhoModel.criarPedido(usuarioId)
        }else{
             pedidoId = pedido[0].id
        }

        // Verificar se item já existe no carrinho
        const itemExistente = await carrinhoModel.buscarItemPorId(pedidoId, tamanho, produtoId)
        if(itemExistente.length>0){ //se retornar uma tupla faz:
            const novaQuantidade = itemExistente[0].quantidade + quantidade;
            const atualizarQtd = await carrinhoModel.alterarQuantidade(novaQuantidade, itemExistente[0].id)
            if(atualizarQtd){
            return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Quantidade atualizada no carrinho',
                    dados: {
                        itemId: itemExistente[0].id,
                        quantidade: novaQuantidade
                    }
                });
            }
        }
        else{
            //adiciona novo item
            const itemId = await carrinhoModel.adicionarItem(pedidoId, produtoId, quantidade, tamanho)
            if(itemId){
                return res.status(201).json({
                    sucesso: true,
                    mensagem: 'Item adicionado ao carrinho',
                    dados: {
                        itemId: itemId
                    }
                });
            }
        }
        }catch(error){
            console.error('Erro ao adicionar item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível adicionar o item'
            });
        }

    }
    // PUT /carrinho/item/:id - Atualizar quantidade de item
    static async atualizarQuantidadeItem(req, res){
        try {
            const id = req.params; //id do produto que está na url
            const quantidade = req.body;
            const usuarioId = req.usuario.id;
            const tamanho = req.body;
            
            if (!quantidade || quantidade < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade inválida',
                    mensagem: 'A quantidade deve ser maior que zero'
                });
            }

            linhaPedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId) //pega o pedido que esta com status carrinho, para pegarmos o id da compra
            const item = await carrinhoModel.buscarItemPorId(linhaPedido[0].id, tamanho, id )
            if (!item){
                return res.status(404).json({
                        sucesso: false,
                        erro: 'Item não encontrado',
                        mensagem: 'Item não existe no seu carrinho'
                    });
            }

            //atualizar quantidade
            const atualizarQtd = await carrinhoModel.alterarQuantidade(quantidade, item[0].id)
            if(atualizarQtd){
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Quantidade atualizada'
                });
            }

        }catch{
            console.error('Erro ao atualizar item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o item'
            });
        }
    }

    // DELETE /carrinho/item/:id - Remover item do carrinho
    static async removerItem(req, res){
        try {
            const id = req.params; //id do produto que vem na url
            const usuarioId = req.usuario.id;
            const tamanho = req.body
            
            // Verificar se item pertence ao usuário
            linhaPedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId) //pega o pedido que esta com status carrinho, para pegarmos o id da compra
            const item = await carrinhoModel.buscarItemPorId(linhaPedido[0].id, tamanho, id )
            if (!item){
                return res.status(404).json({
                        sucesso: false,
                        erro: 'Item não encontrado',
                        mensagem: 'Item não existe no seu carrinho'
                    });
            }
            //deleta o item
            const removerItem = await carrinhoModel.deletarItem(tamanho, id)
            if(removerItem){
                 return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Item removido do carrinho'
                });
            }
        }catch(error){
            console.error('Erro ao remover item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível remover o item'
            });
        }
    }
}

export default carrinhoController;