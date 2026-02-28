import comprovanteModel from '../models/comprovanteModel.js'
import PDFDocument from 'pdfkit'

class comprovanteController {

    static async baixarComprovante(req, res) {
        try {
            const pedidoId = req.params.id
            const empresaId = req.usuario.id

            const pedido = await comprovanteModel.buscarPedido(pedidoId)
            if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' })
            const empresa = await comprovanteModel.buscarEmpresa(empresaId)
            if (!empresa) return res.status(404).json({ erro: 'Empresa não encontrada' })
            console.log('Achando dados da empresa para o comprovante', empresa)
            const itens = await comprovanteModel.buscarItens(pedidoId)
            if (!itens || itens.length === 0) return res.status(404).json({ erro: 'Itens não encontrados' })
                console.log(itens)
            const dados_pedido = await comprovanteModel.buscarDadosCompra(pedidoId)
            if (!dados_pedido) return res.status(404).json({ erro: 'Dados da compra não encontrados' })
            const dados = {
                pedidoId: pedidoId,
                empresa: {
                    nome: empresa.nome,
                    email: empresa.email,
                    cnpj: Number(empresa.cnpj),
                    telefone: Number(empresa.telefone),
                },
                dados_pedido: {
                    endereco: dados_pedido.endereco,
                    cpf_representante: dados_pedido.cpf_representante,
                    nome_representante: dados_pedido.nome_representante,
                     telefone_representante: dados_pedido. telefone_representante,
                     portaria: dados_pedido.portaria,
                     metodo_pagamento: dados_pedido.metodo_pagamento,
                     numero_cartao: dados_pedido.numero_cartao,
                     nome_titular: dados_pedido.nome_titular,
                     cpf_titular: dados_pedido.cpf_titular
                },
                itens: itens.map(i => ({
                    produto: i.nome,
                    tamanho: i.tamanho,
                    ca: i.ca,
                    quantidade: parseFloat(i.quantidade),
                    preco_produto: parseFloat(i.preco_unitario),
                })),
                total: parseFloat(pedido.valor_total)
            }

            gerarComprovantePDF(res, dados);

            function gerarComprovantePDF(res, dados) {
                const doc = new PDFDocument({ margin: 50 });
                let total = 0;
                console.log(dados)

                // Configura o download no navegador
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=comprovante-${dados.pedidoId}.pdf`);
                doc.pipe(res);

                // ── LOGO ──────────────────────────────────────
                doc.image('public/img/logo.png', 50, 40, { width: 100 });
                doc.moveDown(7);

                // ── TÍTULO ────────────────────────────────────
                doc.fontSize(20).fillColor('#1a73e8')
                    .text('Comprovante de Compra', { align: 'center' });

                doc.fontSize(11).fillColor('#888')
                    .text(`Pedido #${dados.pedidoId} — ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

                doc.moveDown();

                // ── DADOS DO CLIENTE ──────────────────────────
                doc.fontSize(13).fillColor('#333').text('Dados do Cliente', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#555')
                    .text(`Empresa:  ${dados.empresa.nome}`)
                    .text(`Email: ${dados.empresa.email}`)
                    .text(`CNPJ:   ${dados.empresa.cnpj}`)
                    .text(`Telefone:   ${dados.empresa.telefone}`);

                doc.moveDown();

                //---------Dados da compra ----------------------
                doc.fontSize(13).fillColor('#333').text('Dados da Compra', { underline: true });
                doc.moveDown(0.5);
                doc.fontSize(11).fillColor('#555')
                    .text(`Nome do Representante:  ${dados.dados_pedido.nome_representante}`)
                    .text(`CPF do Representante: ${dados.dados_pedido.cpf_representante}`)
                    .text(`Telefone do Representante: ${dados.telefone_representante}`)
                    .text(`Endereço: ${dados.dados_pedido.endereco}`)
                    .text(`Portaria: ${dados.dados_pedido.portaria}`)
                    .text(`Método de pagamento: ${dados.dados_pedido.metodo_pagamento}`)
                    .text(`Titular: ${dados.dados_pedido.nome_titular}`)
                    .text(`CPF do Titular: ${dados.dados_pedido.cpf_titular}`)
                    .text(`Número do cartão: ${dados.dados_pedido.numero_cartao}`);

                doc.moveDown();
                
                // ── ITENS COMPRADOS ───────────────────────────
                doc.fontSize(13).fillColor('#333').text('Itens Comprados', { underline: true });
                doc.moveDown(0.5);

                dados.itens.forEach(item => {
                    const subtotal = (item.quantidade * item.preco_produto).toFixed(2);
                    const subtotal_conta = item.quantidade * item.preco_produto
                    total = total+subtotal_conta;
                    doc.fontSize(11).fillColor('#555')
                        .text(`• ${item.produto} — Tamanho: ${item.tamanho}, CA: ${item.ca}
${item.quantidade} unidades x R$ ${item.preco_produto.toFixed(2)} = R$ ${subtotal}
                        `);
                });
                total = total+9.9

                doc.moveDown();

                // ── TOTAL ─────────────────────────────────────
                doc.fontSize(15).fillColor('#1a73e8')
                    .text(`Total: R$ ${total.toFixed(2)}`, { align: 'right' });

                // ── RODAPÉ ────────────────────────────────────
                doc.moveDown(5);
                doc.fontSize(10).fillColor('#aaa')
                    .text(`SafeWork © ${new Date().getFullYear()} — Obrigado pela sua compra!`, { align: 'center' });

                doc.end(); // finaliza e envia o PDF
            }

        } catch (error) {
            console.error(' Erro ao criar comprovante:', error);
            throw error;
        }
    }
}

export default comprovanteController