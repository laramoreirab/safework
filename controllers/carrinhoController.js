import carrinhoModel from '../models/carrinhoModel.js';
import produtoModel from '../models/produtoModel.js';

class carrinhoController {

    // GET /carrinho - Obter carrinho do usuário logado
    static async obterCarrinho(req, res) {
        try {
            const usuarioId = req.usuario.id;

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            if (!pedido) {
                return res.json({
                    sucesso: true,
                    dados: { itens: [], total: 0 }
                });
            }

            const itens = await carrinhoModel.buscarItens(pedido);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    pedidoId: pedido.id,
                    itens: itens,
                    total: pedido.total || 0
                }
            });
        } catch (error) {
            console.error('Erro ao obter carrinho:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o carrinho'
            });
        }
    }

    // POST /carrinho/adicionar - Adicionar item ao carrinho
    static async adicionarItem(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { produtoId, quantidade, tamanho, tipoQuantidade } = req.body;

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

            // Converter lotes → unidades se necessário
            let quantidadeFinal = quantidade;
            if (tipoQuantidade === 'lote') {
                quantidadeFinal = quantidade * 50;
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

            // Buscar ou criar pedido
            let pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            let pedidoId;
            if (!pedido) {
                pedidoId = await carrinhoModel.criarPedido(usuarioId);
            } else {
                pedidoId = pedido.id;
            }

            // Verificar se item já existe (produto+tamanho)
            const itemExistente = await carrinhoModel.buscarItemPorId(pedidoId, tamanho, produtoId);
            if (itemExistente.length > 0) {
                const novaQuantidade = itemExistente[0].quantidade + quantidadeFinal;
                await carrinhoModel.alterarQuantidade(novaQuantidade, itemExistente[0].id);

                await carrinhoModel.atualizarTotalPedido(pedidoId);

                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Quantidade atualizada no carrinho',
                    dados: {
                        itemId: itemExistente[0].id,
                        quantidade: novaQuantidade
                    }
                });
            } else {
                const itemId = await carrinhoModel.adicionarItem(pedidoId, produtoId, quantidadeFinal, tamanho);
                await carrinhoModel.atualizarTotalPedido(pedidoId);

                return res.status(201).json({
                    sucesso: true,
                    mensagem: 'Item adicionado ao carrinho',
                    dados: { itemId }
                });
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível adicionar o item'
            });
        }
    }

    // PUT /carrinho/item/:id - Atualizar quantidade de item
    static async atualizarQuantidadeItem(req, res) {
        try {
            const { id } = req.params; // id do item
            const { quantidade } = req.body;
            const usuarioId = req.usuario.id;

            if (!quantidade || quantidade < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade inválida',
                    mensagem: 'A quantidade deve ser maior que zero'
                });
            }

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            if (!pedido) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Carrinho não encontrado',
                    mensagem: 'Não existe carrinho ativo'
                });
            }

            const item = await read('itens_pedidos', `id = ${id} AND pedido_id = ${pedido.id}`);
            if (!item || item.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Item não encontrado',
                    mensagem: 'Item não existe no seu carrinho'
                });
            }

            await carrinhoModel.alterarQuantidade(quantidade, id);
            await carrinhoModel.atualizarTotalPedido(pedido.id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade atualizada'
            });
        } catch (error) {
            console.error('Erro ao atualizar item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o item'
            });
        }
    }

    // DELETE /carrinho/item/:id - Remover item do carrinho
    static async removerItem(req, res) {
        try {
            const { id } = req.params; // id do item
            const usuarioId = req.usuario.id;

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            if (!pedido) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Carrinho não encontrado',
                    mensagem: 'Não existe carrinho ativo'
                });
            }

            const item = await read('itens_pedidos', `id = ${id} AND pedido_id = ${pedido.id}`);
            if (!item || item.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Item não encontrado',
                    mensagem: 'Item não existe no seu carrinho'
                });
            }

            await carrinhoModel.deletarItem(id);
            await carrinhoModel.atualizarTotalPedido(pedido.id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Item removido do carrinho'
            });
        } catch (error) {
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