import FinalizacaoModel from '../models/finalizacaoModel.js';
import usuarioModel from '../models/usuarioModel.js';

class finalizacaoController {
    
    // GET /finalizacao/dados - Obter dados iniciais
    static async obterDadosIniciais(req, res) {
        try {
            const usuarioId = req.usuario.id;
            
            // Buscar dados do usuário/empresa
            const usuario = await usuarioModel.buscarPorId(usuarioId);
            if (!usuario) {
                return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
            }
            
            // Buscar carrinho
            const pedidos = await FinalizacaoModel.buscarCarrinho(usuarioId);
            if (pedidos.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Carrinho vazio' });
            }
            
            return res.status(200).json({
                sucesso: true,
                dados: {
                    nomeEmpresa: usuario.nome,
                    emailEmpresa: usuario.email,
                    telefoneEmpresa: usuario.telefone,
                    pedidoId: pedidos[0].id
                }
            });
        } catch (error) {
            console.error('Erro ao obter dados iniciais:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // POST /finalizacao/dados - Salvar dados empresariais
    static async salvarDadosEmpresariais(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { nomeEmpresa, cnpj, telefoneEmpresa, emailEmpresa } = req.body;
            
            // Validações
            if (!nomeEmpresa || !cnpj || !telefoneEmpresa || !emailEmpresa) {
                return res.status(400).json({ sucesso: false, erro: 'Dados incompletos' });
            }
            
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            if (cnpjLimpo.length !== 14) {
                return res.status(400).json({ sucesso: false, erro: 'CNPJ inválido' });
            }
            
            const telefoneLimpo = telefoneEmpresa.replace(/\D/g, '');
            if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
                return res.status(400).json({ sucesso: false, erro: 'Telefone inválido' });
            }
            
            // Atualizar dados da empresa
            await FinalizacaoModel.atualizarEmpresa(usuarioId, {
                nome: nomeEmpresa,
                cnpj: cnpjLimpo,
                telefone: telefoneLimpo,
                email: emailEmpresa
            });
            
            return res.status(200).json({ sucesso: true, mensagem: 'Dados empresariais salvos com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar dados empresariais:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // POST /finalizacao/entrega - Salvar dados de entrega
    static async salvarDadosEntrega(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { endereco, cpfRepresentante, telefoneRepresentante, nomeRepresentante, portaria } = req.body;
            
            if (!endereco || !cpfRepresentante || !telefoneRepresentante || !nomeRepresentante) {
                return res.status(400).json({ sucesso: false, erro: 'Dados incompletos' });
            }
            
            const cpfLimpo = cpfRepresentante.replace(/\D/g, '');
            if (cpfLimpo.length !== 11) {
                return res.status(400).json({ sucesso: false, erro: 'CPF inválido' });
            }
            
            const pedidos = await FinalizacaoModel.buscarCarrinho(usuarioId);
            if (pedidos.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Carrinho vazio' });
            }
            
            const pedidoId = pedidos[0].id;
            
            await FinalizacaoModel.atualizarDadosPedido(pedidoId, {
                endereco,
                cpf_representante: cpfLimpo,
                telefone_representante: telefoneRepresentante,
                nome_representante: nomeRepresentante,
                portaria: portaria || null
            });
            
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'aguardando_pagamento');
            
            return res.status(200).json({ sucesso: true, mensagem: 'Dados de entrega salvos com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar dados de entrega:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // POST /finalizacao/pagamento - Processar pagamento
    static async processarPagamento(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { metodoPagamento, numeroCartao, nomeTitular, validadeCartao, cvv, cpfTitular } = req.body;
            
            if (!metodoPagamento) {
                return res.status(400).json({ sucesso: false, erro: 'Método de pagamento obrigatório' });
            }
            
            if (metodoPagamento === 'credito') {
                const cartaoLimpo = numeroCartao.replace(/\D/g, '');
                if (cartaoLimpo.length !== 16) {
                    return res.status(400).json({ sucesso: false, erro: 'Número do cartão inválido' });
                }
                const cvvLimpo = cvv.replace(/\D/g, '');
                if (cvvLimpo.length < 3 || cvvLimpo.length > 4) {
                    return res.status(400).json({ sucesso: false, erro: 'CVV inválido' });
                }
            }
            
            const pedidos = await FinalizacaoModel.buscarPedidoAguardandoPagamento(usuarioId);
            if (pedidos.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Nenhum pedido aguardando pagamento' });
            }
            
            const pedidoId = pedidos[0].id;
            
            const dadosPagamento = { metodo_pagamento: metodoPagamento };
            if (metodoPagamento === 'credito') {
                dadosPagamento.numero_cartao = numeroCartao.slice(-4);
                dadosPagamento.nome_titular = nomeTitular;
                dadosPagamento.validade = validadeCartao;
                dadosPagamento.cpf_titular = cpfTitular;
            }
            
            await FinalizacaoModel.atualizarDadosPedido(pedidoId, dadosPagamento);
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'pago');
            
            return res.status(200).json({ sucesso: true, mensagem: 'Pagamento processado com sucesso', dados: { pedidoId } });
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // POST /finalizacao/finalizar - Finalizar pedido
    static async finalizarPedido(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const pedidos = await FinalizacaoModel.buscarPedidoPago(usuarioId);
            if (pedidos.length === 0) {
                return res.status(400).json({ sucesso: false, erro: 'Nenhum pedido pago encontrado' });
            }
            
            const pedidoId = pedidos[0].id;
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'enviado');
            
            return res.status(200).json({ sucesso: true, mensagem: 'Pedido finalizado com sucesso', dados: { pedidoId } });
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
    
    // GET /finalizacao/resumo/:id - Obter resumo do pedido
    static async obterResumoPedido(req, res) {
        try {
            const { id } = req.params;
            const usuarioId = req.usuario.id;
            
            const pedidos = await FinalizacaoModel.buscarPedidoPorId(id, usuarioId);
            if (pedidos.length === 0) {
                return res.status(404).json({ sucesso: false, erro: 'Pedido não encontrado' });
            }
            
            const pedido = pedidos[0];
            const dadosPedido = await FinalizacaoModel.buscarDadosPedido(id);
            const itens = await FinalizacaoModel.buscarItensPedido(id);
            
            return res.status(200).json({
                sucesso: true,
                dados: {
                    pedido,
                    dadosPedido: dadosPedido[0] || null,
                    itens
                }
            });
        } catch (error) {
            console.error('Erro ao obter resumo:', error);
            res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
}

export default finalizacaoController;

