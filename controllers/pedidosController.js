// PedidosController.js - VERSÃO ATUALIZADA
import FinalizacaoModel from '../models/finalizacaoModel.js';
import { getConnection } from '../config/database.js';

class PedidosController {
    // GET /pedidos/historico - Buscar histórico de pedidos do usuário
    static async obterHistorico(req, res) {
        try {
            const empresaId = req.usuario.id;
            
            console.log('Buscando histórico para empresa:', empresaId);
            
            // Buscar todos os pedidos finalizados (status 'enviado' ou 'pago')
            const connection = await getConnection();
            
            // PedidosController.js - VERSÃO CORRIGIDA
const sql = `
    SELECT 
        p.id,
        p.total,
        p.status,
        p.data_criacao as created_at,
        dp.nome_representante,
        dp.metodo_pagamento,
        e.nome as nome_empresa,  -- Nome da empresa da tabela empresas
        -- Buscar dados do primeiro item do pedido
        (SELECT ip.id 
         FROM itens_pedidos ip 
         WHERE ip.pedido_id = p.id 
         ORDER BY ip.id ASC 
         LIMIT 1) as primeiro_item_id,
        (SELECT p2.nome 
         FROM itens_pedidos ip2 
         JOIN produtos p2 ON ip2.produto_id = p2.id 
         WHERE ip2.pedido_id = p.id 
         ORDER BY ip2.id ASC 
         LIMIT 1) as primeiro_item_nome,
        (SELECT p2.ca 
         FROM itens_pedidos ip2 
         JOIN produtos p2 ON ip2.produto_id = p2.id 
         WHERE ip2.pedido_id = p.id 
         ORDER BY ip2.id ASC 
         LIMIT 1) as primeiro_item_ca,
        -- Usar a coluna correta da imagem: p2.img (da tabela produtos)
        (SELECT p2.img 
         FROM itens_pedidos ip2 
         JOIN produtos p2 ON ip2.produto_id = p2.id 
         WHERE ip2.pedido_id = p.id 
         ORDER BY ip2.id ASC 
         LIMIT 1) as primeiro_item_imagem
    FROM pedidos p
    LEFT JOIN dados_pedido dp ON p.id = dp.pedidoId
    LEFT JOIN empresas e ON p.usuario_id = e.id  -- JOIN com a tabela empresas
    WHERE p.usuario_id = ? 
    AND p.status IN ('enviado', 'pago')
    ORDER BY p.data_criacao DESC
    LIMIT 50
`;

const [pedidos] = await connection.execute(sql, [empresaId]);
            connection.release();
            
            console.log(`✅ ${pedidos.length} pedidos encontrados`);
            
            return res.status(200).json({
                sucesso: true,
                dados: pedidos
            });
            
        } catch (error) {
            console.error('❌ Erro ao buscar histórico:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar histórico',
                mensagem: error.message
            });
        }
    }
    
    // GET /pedidos/dados-perfil - Buscar dados do perfil (nome da empresa e representante)
static async obterDadosPerfil(req, res) {
    try {
        const empresaId = req.usuario.id;
        
        console.log('Buscando dados do perfil para empresa:', empresaId);
        
        const connection = await getConnection();
        const sql = `
            SELECT 
                e.nome as nome_empresa,
                dp.nome_representante
            FROM empresas e
            LEFT JOIN pedidos p ON e.id = p.usuario_id
            LEFT JOIN dados_pedido dp ON p.id = dp.pedidoId
            WHERE e.id = ?
            ORDER BY p.data_criacao DESC
            LIMIT 1
        `;
        
        const [resultado] = await connection.execute(sql, [empresaId]);
        connection.release();
        
        // Se não encontrar nome do representante em pedidos, usar apenas nome da empresa
        let nomeEmpresa = resultado[0]?.nome_empresa || 'Empresa';
        let nomeRepresentante = resultado[0]?.nome_representante;
        
        // Se não encontrou nome do representante em pedidos recentes,
        // buscar da empresa ou de qualquer pedido antigo
        if (!nomeRepresentante) {
            const sql2 = `
                SELECT nome_representante 
                FROM dados_pedido dp
                JOIN pedidos p ON dp.pedidoId = p.id
                WHERE p.usuario_id = ?
                AND nome_representante IS NOT NULL
                LIMIT 1
            `;
            
            const [resultado2] = await connection.execute(sql2, [empresaId]);
            connection.release();
            
            nomeRepresentante = resultado2[0]?.nome_representante;
        }
        
        const dadosPerfil = {
            nomeEmpresa: nomeEmpresa,
            nomeRepresentante: nomeRepresentante || nomeEmpresa
        };
        
        console.log('✅ Dados do perfil encontrados:', dadosPerfil);
        
        return res.status(200).json({
            sucesso: true,
            dados: dadosPerfil
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar dados do perfil:', error);
        res.status(500).json({
            sucesso: false,
            erro: 'Erro ao buscar dados do perfil',
            mensagem: error.message
        });
    }
}
}

export default PedidosController;