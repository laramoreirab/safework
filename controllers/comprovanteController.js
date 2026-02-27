import comprovanteModel from '../models/comprovanteModel.js'
import PDFDocument from 'pdfkit'

class comprovanteController {

    static async baixarComprovante(req, res) {
        try {
            const pedidoId = req.params.id
            const empresaId = req.usuario.id

            const pedido = await comprovanteModel.buscarPedido(pedidoId)
            const empresa = await comprovanteModel.buscarEmpresa(empresaId)
            const itens = await comprovanteModel.buscarItens(pedidoId)

            const dados = {
                pedidoId: pedidoId,
                empresa: {
                    nome: empresa.nome,
                    email: empresa.email,
                    cpf: empresa.cpf
                },
                itens: itens.map(i => ({
                    produto: i.nome_produto,
                    qtd: i.quantidade,
                    preco: i.preco_unitario
                })),
                total: pedido.valor_total
            }

            gerarComprovantePDF(res, dados);

            function gerarComprovantePDF(res, dados) {
                const doc = new PDFDocument({ margin: 50 });

                // Configura o download no navegador
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=comprovante-${dados.pedidoId}.pdf`);
                doc.pipe(res);

                // ── LOGO ──────────────────────────────────────
                doc.image('public/logo.png', 50, 40, { width: 100 });
                doc.moveDown(3);

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
                    .text(`Nome:  ${dados.empresa.nome}`)
                    .text(`Email: ${dados.empresa.email}`)
                    .text(`CPF:   ${dados.empresa.cpf}`);

                doc.moveDown();

                // ── ITENS COMPRADOS ───────────────────────────
                doc.fontSize(13).fillColor('#333').text('Itens Comprados', { underline: true });
                doc.moveDown(0.5);

                dados.itens.forEach(item => {
                    const subtotal = (item.qtd * item.preco).toFixed(2);
                    doc.fontSize(11).fillColor('#555')
                        .text(`• ${item.produto} — ${item.qtd}x R$ ${item.preco.toFixed(2)} = R$ ${subtotal}`);
                });

                doc.moveDown();

                // ── TOTAL ─────────────────────────────────────
                doc.fontSize(15).fillColor('#1a73e8')
                    .text(`Total: R$ ${dados.total.toFixed(2)}`, { align: 'right' });

                // ── RODAPÉ ────────────────────────────────────
                doc.moveDown(3);
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