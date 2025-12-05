import FinalizacaoModel from '../models/finalizacaoModel.js';

class FinalizacaoController {
    
    // GET /finalizacao/dados - Obter dados iniciais
    static async obterDadosIniciais(req, res) {
        try {
            // req.usuario.id já é o ID da empresa
            const empresaId = req.usuario.id;
            
            console.log('Obtendo dados para empresa ID:', empresaId);
            
            // Buscar empresa diretamente
            const empresa = await FinalizacaoModel.buscarEmpresaPorId(empresaId);
            
            if (!empresa) {
                console.log('Empresa não encontrada para ID:', empresaId);
                return res.status(404).json({ 
                    sucesso: false, 
                    erro: 'Empresa não encontrada' 
                });
            }
            
            console.log('Empresa encontrada:', {
                id: empresa.id,
                nome: empresa.nome,
                email: empresa.email,
                telefone: empresa.telefone,
                cnpj: empresa.cnpj
            });
            
            // Verificar carrinho
            const pedidos = await FinalizacaoModel.buscarCarrinho(empresaId);
            
            console.log('Pedidos no carrinho:', pedidos.length);
            
            if (pedidos.length === 0) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Carrinho vazio' 
                });
            }
            
            return res.status(200).json({
                sucesso: true,
                dados: {
                    nomeEmpresa: empresa.nome || '',
                    emailEmpresa: empresa.email || '',
                    telefoneEmpresa: empresa.telefone || '',
                    cnpj: empresa.cnpj || '',
                    pedidoId: pedidos[0].id
                }
            });
            
        } catch (error) {
            console.error('Erro ao obter dados iniciais:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro interno do servidor',
                mensagem: error.message 
            });
        }
    }
    
    // POST /finalizacao/dados - Salvar dados empresariais
    static async salvarDadosEmpresariais(req, res) {
        try {
            const empresaId = req.usuario.id;
            const { nomeEmpresa, cnpj, telefoneEmpresa, emailEmpresa } = req.body;
            
            console.log('Salvando dados para empresa ID:', empresaId);
            console.log('Dados recebidos:', { nomeEmpresa, cnpj, telefoneEmpresa, emailEmpresa });
            
            // Validações
            if (!nomeEmpresa || !cnpj || !telefoneEmpresa || !emailEmpresa) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Todos os campos são obrigatórios' 
                });
            }
            
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            if (cnpjLimpo.length !== 14) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'CNPJ inválido (deve ter 14 dígitos)'
                });
            }
            
            const telefoneLimpo = telefoneEmpresa.replace(/\D/g, '');
            if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Telefone inválido (10 ou 11 dígitos)'
                });
            }
            
            // Verificar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailEmpresa)) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Email inválido'
                });
            }
            
            // Preparar dados para atualização
            const dadosAtualizacao = {
                nome: nomeEmpresa.trim(),
                cnpj: cnpjLimpo,
                telefone: telefoneLimpo,
                email: emailEmpresa.toLowerCase().trim()
            };
            
            console.log('Atualizando empresa com dados:', dadosAtualizacao);
            
            // Atualizar empresa
            const resultado = await FinalizacaoModel.atualizarEmpresa(empresaId, dadosAtualizacao);
            
            console.log('Resultado da atualização:', resultado);
            
            return res.status(200).json({ 
                sucesso: true, 
                mensagem: 'Dados empresariais salvos com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao salvar dados empresariais:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro interno do servidor',
                mensagem: error.message
            });
        }
    }
    
    // POST /finalizacao/entrega - Salvar dados de entrega
    static async salvarDadosEntrega(req, res) {
        try {
            const empresaId = req.usuario.id;
            const { endereco, cpfRepresentante, telefoneRepresentante, nomeRepresentante, portaria } = req.body;
            
            console.log('=== SALVANDO DADOS DE ENTREGA ===');
            console.log('Empresa ID:', empresaId);
            console.log('Dados recebidos:', req.body);
            
            // Validações
            if (!endereco?.trim()) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Endereço é obrigatório' 
                });
            }
            
            if (!cpfRepresentante?.trim()) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'CPF do representante é obrigatório' 
                });
            }
            
            if (!telefoneRepresentante?.trim()) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Telefone do representante é obrigatório' 
                });
            }
            
            if (!nomeRepresentante?.trim()) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Nome do representante é obrigatório' 
                });
            }
            
            // Limpar CPF (apenas números)
            const cpfLimpo = cpfRepresentante.replace(/\D/g, '');
            console.log('CPF limpo (11 dígitos):', cpfLimpo);
            
            if (cpfLimpo.length !== 11) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'CPF deve conter 11 dígitos',
                    digitosRecebidos: cpfLimpo.length
                });
            }
            
            // Buscar pedido
            const pedidos = await FinalizacaoModel.buscarCarrinho(empresaId);
            console.log('Pedidos no carrinho:', pedidos.length);
            
            if (pedidos.length === 0) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Carrinho vazio' 
                });
            }
            
            const pedidoId = pedidos[0].id;
            console.log('Pedido ID encontrado:', pedidoId);
            
            // Preparar dados - SALVAR CPF APENAS COM NÚMEROS (11 dígitos)
            const dadosEntrega = {
                endereco: endereco.trim(),
                cpf_representante: cpfLimpo,
                telefone_representante: telefoneRepresentante.replace(/\D/g, '').slice(0, 11),
                nome_representante: nomeRepresentante.trim(),
                portaria: portaria?.trim() || null
            };
            
            console.log('Dados para salvar:', dadosEntrega);
            
            // Verificar se já existem dados
            const dadosExistentes = await FinalizacaoModel.buscarDadosPedido(pedidoId);
            
            if (dadosExistentes.length > 0) {
                console.log('Atualizando registro existente...');
                await FinalizacaoModel.atualizarDadosPedido(pedidoId, dadosEntrega);
            } else {
                console.log('Criando novo registro...');
                await FinalizacaoModel.criarDadosPedido({
                    pedidoId: pedidoId,
                    ...dadosEntrega
                });
            }
            
            // Atualizar status do pedido
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'aguardando_pagamento');
            
            console.log('✅ Dados de entrega salvos com sucesso!');
            
            return res.status(200).json({ 
                sucesso: true, 
                mensagem: 'Dados de entrega salvos com sucesso',
                pedidoId: pedidoId
            });
            
        } catch (error) {
            console.error('❌ ERRO ao salvar dados de entrega:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro ao salvar dados',
                mensagem: error.message
            });
        }
    }
    
    // POST /finalizacao/pagamento - Processar pagamento
    static async processarPagamento(req, res) {
        try {
            const empresaId = req.usuario.id;
            const { metodoPagamento, numeroCartao, nomeTitular, validadeCartao, cvv, cpfTitular } = req.body;
            
            console.log('=== PROCESSANDO PAGAMENTO ===');
            console.log('Empresa ID:', empresaId);
            console.log('Método de pagamento:', metodoPagamento);
            
            if (!metodoPagamento) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Método de pagamento obrigatório' 
                });
            }
            
            // Validações para cartão de crédito
            if (metodoPagamento === 'credito') {
                if (!numeroCartao) {
                    return res.status(400).json({ 
                        sucesso: false, 
                        erro: 'Número do cartão é obrigatório' 
                    });
                }
                
                const cartaoLimpo = numeroCartao.replace(/\D/g, '');
                if (cartaoLimpo.length !== 16) {
                    return res.status(400).json({ 
                        sucesso: false, 
                        erro: 'Número do cartão inválido (16 dígitos)'
                    });
                }
                
                if (!cvv) {
                    return res.status(400).json({ 
                        sucesso: false, 
                        erro: 'CVV é obrigatório' 
                    });
                }
                
                const cvvLimpo = cvv.replace(/\D/g, '');
                if (cvvLimpo.length < 3 || cvvLimpo.length > 4) {
                    return res.status(400).json({ 
                        sucesso: false, 
                        erro: 'CVV inválido (3 ou 4 dígitos)'
                    });
                }
            }
            
            // Buscar pedido aguardando pagamento
            let pedidos = await FinalizacaoModel.buscarPedidoAguardandoPagamento(empresaId);
            
            // Se não encontrar, buscar carrinho (caso o status não tenha sido atualizado)
            if (pedidos.length === 0) {
                pedidos = await FinalizacaoModel.buscarCarrinho(empresaId);
                console.log('⚠️ Nenhum pedido aguardando pagamento, buscando carrinho...');
            }
            
            if (pedidos.length === 0) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Nenhum pedido aguardando pagamento ou carrinho encontrado' 
                });
            }
            
            const pedidoId = pedidos[0].id;
            console.log('Pedido ID para pagamento:', pedidoId);
            
            // Preparar dados do pagamento
            const dadosPagamento = { 
                metodo_pagamento: metodoPagamento 
            };
            
            if (metodoPagamento === 'credito') {
                // Salvar apenas os últimos 4 dígitos (segurança)
                const ultimosDigitos = numeroCartao.replace(/\D/g, '').slice(-4);
                dadosPagamento.numero_cartao = ultimosDigitos;
                dadosPagamento.nome_titular = nomeTitular?.trim() || '';
                dadosPagamento.validade = validadeCartao?.trim() || '';
                dadosPagamento.cvv = cvv.replace(/\D/g, '');
                
                // Se tiver CPF do titular, salvar apenas números
                if (cpfTitular) {
                    const cpfTitularLimpo = cpfTitular.replace(/\D/g, '');
                    if (cpfTitularLimpo.length === 11) {
                        dadosPagamento.cpf_titular = cpfTitularLimpo;
                    }
                }
            }
            
            console.log('Dados de pagamento para salvar:', dadosPagamento);
            
            // Atualizar dados do pedido
            await FinalizacaoModel.atualizarDadosPedido(pedidoId, dadosPagamento);
            
            // Atualizar status do pedido para "pago"
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'pago');
            
            console.log('✅ Pagamento processado com sucesso!');
            
            return res.status(200).json({ 
                sucesso: true, 
                mensagem: 'Pagamento processado com sucesso', 
                dados: { pedidoId } 
            });
            
        } catch (error) {
            console.error('❌ ERRO ao processar pagamento:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro ao processar pagamento',
                mensagem: error.message
            });
        }
    }
    
    // POST /finalizacao/finalizar - Finalizar pedido
    static async finalizarPedido(req, res) {
        try {
            const empresaId = req.usuario.id;
            
            console.log('Finalizando pedido para empresa:', empresaId);
            
            const pedidos = await FinalizacaoModel.buscarPedidoPago(empresaId);
            if (pedidos.length === 0) {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Nenhum pedido pago encontrado' 
                });
            }
            
            const pedidoId = pedidos[0].id;
            console.log('Finalizando pedido ID:', pedidoId);
            
            await FinalizacaoModel.atualizarStatusPedido(pedidoId, 'enviado');
            
            console.log('✅ Pedido finalizado com sucesso!');
            
            return res.status(200).json({ 
                sucesso: true, 
                mensagem: 'Pedido finalizado com sucesso', 
                dados: { pedidoId } 
            });
            
        } catch (error) {
            console.error('❌ ERRO ao finalizar pedido:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro ao finalizar pedido',
                mensagem: error.message
            });
        }
    }
    
    // GET /finalizacao/resumo - Obter resumo do pedido ATIVO (para tela de pagamento)
    static async obterResumoPedidoAtivo(req, res) {
        try {
            const empresaId = req.usuario.id;
            
            console.log('Buscando resumo do pedido ATIVO para empresa:', empresaId);
            
            // Buscar pedido ativo (aguardando pagamento ou carrinho)
            let pedidos = await FinalizacaoModel.buscarPedidoAguardandoPagamento(empresaId);
            
            if (pedidos.length === 0) {
                pedidos = await FinalizacaoModel.buscarCarrinho(empresaId);
            }
            
            if (pedidos.length === 0) {
                return res.status(404).json({ 
                    sucesso: false, 
                    erro: 'Nenhum pedido ativo encontrado' 
                });
            }
            
            const pedido = pedidos[0];
            const pedidoId = pedido.id;
            
            console.log('✅ Pedido ATIVO encontrado:', pedidoId, 'Status:', pedido.status);
            
            // Buscar dados do pedido
            const dadosPedido = await FinalizacaoModel.buscarDadosPedido(pedidoId);
            const itens = await FinalizacaoModel.buscarItensPedido(pedidoId);
            
            // Calcular totais
            let subtotal = 0;
            if (itens && itens.length > 0) {
                subtotal = itens.reduce((acc, item) => {
                    return acc + (item.preco * item.quantidade);
                }, 0);
            }
            
            const taxaEntrega = 9.90;
            const total = subtotal + taxaEntrega;
            
            console.log('💰 Valores calculados:', { subtotal, taxaEntrega, total });
            
            return res.status(200).json({
                sucesso: true,
                dados: {
                    pedidoId: pedidoId,
                    status: pedido.status,
                    subtotal: subtotal.toFixed(2),
                    total: total.toFixed(2),
                    taxaEntrega: taxaEntrega.toFixed(2),
                    itens: itens,
                    dadosEntrega: dadosPedido[0] || null,
                    createdAt: pedido.created_at
                }
            });
            
        } catch (error) {
            console.error('❌ ERRO ao obter resumo ativo:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro ao obter resumo',
                mensagem: error.message
            });
        }
    }
    
    // GET /finalizacao/resumo/:id - Obter resumo do pedido por ID
    static async obterResumoPedido(req, res) {
        try {
            const { id } = req.params;
            const empresaId = req.usuario.id;
            
            console.log('Buscando resumo do pedido:', id, 'para empresa:', empresaId);
            
            // Verificar se o pedido pertence à empresa
            const pedidos = await FinalizacaoModel.buscarPedidoPorId(id, empresaId);
            if (pedidos.length === 0) {
                return res.status(404).json({ 
                    sucesso: false, 
                    erro: 'Pedido não encontrado' 
                });
            }
            
            const pedido = pedidos[0];
            const dadosPedido = await FinalizacaoModel.buscarDadosPedido(id);
            const itens = await FinalizacaoModel.buscarItensPedido(id);
            
            // CORRIGIDO: Usar o total do pedido salvo no banco
            const subtotal = parseFloat(pedido.total) || 0;
            const taxaEntrega = 9.90;
            const total = subtotal + taxaEntrega;
            
            console.log('Resumo encontrado para pedido:', id);
            
            return res.status(200).json({
                sucesso: true,
                dados: {
                    pedidoId: pedido.id,
                    status: pedido.status,
                    subtotal: subtotal.toFixed(2),
                    total: total.toFixed(2),
                    taxaEntrega: taxaEntrega.toFixed(2),
                    itens: itens,
                    dadosEntrega: dadosPedido[0] || null,
                    createdAt: pedido.created_at
                }
            });
            
        } catch (error) {
            console.error('❌ ERRO ao obter resumo:', error);
            res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro ao obter resumo',
                mensagem: error.message
            });
        }
    }
    
    // GET /finalizacao/ultimo-pedido-finalizado - Buscar último pedido finalizado
    static async buscarUltimoPedidoFinalizado(req, res) {
        try {
            const empresaId = req.usuario.id;
            
            console.log('Buscando último pedido finalizado para empresa:', empresaId);
            
            const pedidos = await FinalizacaoModel.buscarPedidoFinalizado(empresaId);
            
            if (pedidos.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Nenhum pedido finalizado encontrado'
                });
            }
            
            const pedido = pedidos[0];
            
            return res.status(200).json({
                sucesso: true,
                dados: pedido
            });
            
        } catch (error) {
            console.error('Erro ao buscar último pedido finalizado:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: error.message
            });
        }
    }
    
    // GET /finalizacao/ultimo-pedido-pago - Buscar último pedido pago
    static async buscarUltimoPedidoPago(req, res) {
        try {
            const empresaId = req.usuario.id;
            
            console.log('Buscando último pedido pago para empresa:', empresaId);
            
            const pedidos = await FinalizacaoModel.buscarPedidoPago(empresaId);
            
            if (pedidos.length === 0) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Nenhum pedido pago encontrado'
                });
            }
            
            const pedido = pedidos[0];
            
            return res.status(200).json({
                sucesso: true,
                dados: pedido
            });
            
        } catch (error) {
            console.error('Erro ao buscar último pedido pago:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: error.message
            });
        }
    }
}

export default FinalizacaoController;