import carrinhoModel from '../models/carrinhoModel.js';
import produtoModel from '../models/produtoModel.js';

class carrinhoController {

    // GET /carrinho - Obter carrinho do usuário logado
    static async obterCarrinho(req, res) {
        try {
            const usuarioId = req.usuario.id;
            console.log(`Buscando carrinho para usuário: ${usuarioId}`);

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            
            if (!pedido) {
                console.log('Carrinho vazio para usuário:', usuarioId);
                return res.json({
                    sucesso: true,
                    dados: { 
                        itens: [], 
                        total: 0,
                        pedidoId: null
                    }
                });
            }

            const itens = await carrinhoModel.buscarItens(pedido.id);
            console.log(`Carrinho encontrado com ${itens.length} itens para usuário: ${usuarioId}`);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    pedidoId: pedido.id,
                    itens: itens,
                    total: parseFloat(pedido.total) || 0
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

            console.log('Recebendo item para carrinho:', { 
                usuarioId, produtoId, quantidade, tamanho, tipoQuantidade 
            });

            // Validações básicas
            if (!produtoId || !quantidade) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Dados inválidos',
                    mensagem: 'Produto e quantidade são obrigatórios'
                });
            }

            if (quantidade <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Quantidade inválida',
                    mensagem: 'A quantidade deve ser maior que zero'
                });
            }

            // Converter lotes → unidades se necessário
            let quantidadeFinal = parseInt(quantidade);
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

            console.log('Produto encontrado:', produto.nome);

            // Buscar ou criar pedido
            let pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            let pedidoId;

            if (!pedido) {
                pedidoId = await carrinhoModel.criarPedido(usuarioId);
                console.log('Novo pedido criado:', pedidoId);
            } else {
                pedidoId = pedido.id;
                console.log('Pedido existente:', pedidoId);
            }

            // Verificar se item já existe (mesmo produto + mesmo tamanho)
            const itemExistente = await carrinhoModel.buscarItemExistente(pedidoId, produtoId, tamanho);
            
            if (itemExistente) {
                console.log('Item existente encontrado, atualizando quantidade...');
                const novaQuantidade = itemExistente.quantidade + quantidadeFinal;
                await carrinhoModel.atualizarQuantidadeItem(itemExistente.id, novaQuantidade);
                await carrinhoModel.atualizarTotalPedido(pedidoId);

                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Quantidade atualizada no carrinho',
                    dados: {
                        itemId: itemExistente.id,
                        quantidade: novaQuantidade
                    }
                });
            } else {
                console.log('Adicionando novo item ao carrinho...');
                const itemId = await carrinhoModel.adicionarItem(
                    pedidoId, 
                    produtoId, 
                    quantidadeFinal, 
                    tamanho, 
                    produto.preco_unitario || produto.preco
                );
                
                await carrinhoModel.atualizarTotalPedido(pedidoId);

                return res.status(201).json({
                    sucesso: true,
                    mensagem: 'Item adicionado ao carrinho com sucesso!',
                    dados: { itemId }
                });
            }
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível adicionar o item ao carrinho'
            });
        }
    }

    // PUT /carrinho/item/:id - Atualizar quantidade de item
    static async atualizarQuantidadeItem(req, res) {
        try {
            const { id } = req.params;
            const { quantidade } = req.body;
            const usuarioId = req.usuario.id;

            console.log('Atualizando quantidade do item:', { itemId: id, novaQuantidade: quantidade });

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

            // Verificar se o item pertence ao carrinho do usuário
            const item = await carrinhoModel.buscarItemPorId(id, pedido.id);
            if (!item) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Item não encontrado',
                    mensagem: 'Item não existe no seu carrinho'
                });
            }

            await carrinhoModel.atualizarQuantidadeItem(id, quantidade);
            await carrinhoModel.atualizarTotalPedido(pedido.id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Quantidade atualizada com sucesso'
            });
        } catch (error) {
            console.error('Erro ao atualizar quantidade:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar a quantidade'
            });
        }
    }

    // DELETE /carrinho/item/:id - Remover item do carrinho
    static async removerItem(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuario.id;

            console.log('Removendo item do carrinho:', { itemId: id });

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            if (!pedido) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Carrinho não encontrado',
                    mensagem: 'Não existe carrinho ativo'
                });
            }

            // Verificar se o item pertence ao carrinho do usuário
            const item = await carrinhoModel.buscarItemPorId(id, pedido.id);
            if (!item) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Item não encontrado',
                    mensagem: 'Item não existe no seu carrinho'
                });
            }

            await carrinhoModel.removerItem(id);
            await carrinhoModel.atualizarTotalPedido(pedido.id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Item removido do carrinho com sucesso'
            });
        } catch (error) {
            console.error('Erro ao remover item:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível remover o item do carrinho'
            });
        }
    }

    // GET /carrinho/contador - Obter contagem de itens no carrinho
    static async obterContador(req, res) {
        try {
            const usuarioId = req.usuario.id;

            const pedido = await carrinhoModel.buscarCarrinhoUsuario(usuarioId);
            if (!pedido) {
                return res.json({
                    sucesso: true,
                    dados: { totalItens: 0 }
                });
            }

            const totalItens = await carrinhoModel.obterTotalItens(pedido.id);

            return res.status(200).json({
                sucesso: true,
                dados: { totalItens }
            });
        } catch (error) {
            console.error('Erro ao obter contador:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o contador do carrinho'
            });
        }
    }
}

export default carrinhoController;