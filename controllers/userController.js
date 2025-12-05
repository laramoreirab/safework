// aqui o usuário poderá alterar suas informações na página perfil 
// controllers/userController.js
import usuarioModel from '../models/usuarioModel.js';

class UserController {
    
    // GET /usuarios/perfil - Obter dados do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuarioId = req.usuario.id;
            
            console.log('Buscando perfil do usuário:', usuarioId);
            
            // Buscar usuário no banco
            const usuario = await usuarioModel.buscarPorId(usuarioId);
            
            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }
            
            // Remover senha dos dados
            const { senha, ...usuarioSemSenha } = usuario;
            
            return res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });
            
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao buscar perfil',
                mensagem: error.message
            });
        }
    }
    
    // PUT /usuarios/atualizar-nome - Atualizar nome
    static async atualizarNome(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { nome } = req.body;
            
            console.log('Atualizando nome do usuário:', usuarioId);
            
            // Validações
            if (!nome || nome.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome é obrigatório'
                });
            }
            
            if (nome.trim().length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome deve ter pelo menos 2 caracteres'
                });
            }
            
            if (nome.trim().length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome deve ter no máximo 255 caracteres'
                });
            }
            
            // Atualizar no banco
            const resultado = await usuarioModel.atualizarCampo(
                usuarioId, 
                { nome: nome.trim() }
            );
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Nome atualizado com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao atualizar nome:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao atualizar nome',
                mensagem: error.message
            });
        }
    }
    
    // PUT /usuarios/atualizar-email - Atualizar email
    static async atualizarEmail(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { email } = req.body;
            
            console.log('Atualizando email do usuário:', usuarioId);
            
            // Validações
            if (!email || email.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email é obrigatório'
                });
            }
            
            // Validar formato
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Formato de email inválido'
                });
            }
            
            // Verificar se email já está em uso
            const emailExistente = await usuarioModel.buscarPorEmail(email);
            if (emailExistente && emailExistente.id !== usuarioId) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Este email já está sendo usado'
                });
            }
            
            // Atualizar no banco
            await usuarioModel.atualizarCampo(
                usuarioId, 
                { email: email.trim().toLowerCase() }
            );
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Email atualizado com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao atualizar email:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao atualizar email',
                mensagem: error.message
            });
        }
    }
    
    // PUT /usuarios/atualizar-telefone - Atualizar telefone
    static async atualizarTelefone(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { telefone } = req.body;
            
            console.log('Atualizando telefone do usuário:', usuarioId);
            
            // Validações
            if (!telefone || telefone.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone é obrigatório'
                });
            }
            
            // Limpar telefone (apenas números)
            const telefoneLimpo = telefone.replace(/\D/g, '');
            
            if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone inválido (deve ter 10 ou 11 dígitos)'
                });
            }
            
            // Atualizar no banco
            await usuarioModel.atualizarCampo(
                usuarioId, 
                { telefone: telefoneLimpo }
            );
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Telefone atualizado com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao atualizar telefone:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao atualizar telefone',
                mensagem: error.message
            });
        }
    }
    
    // PUT /usuarios/atualizar-cnpj - Atualizar CNPJ
    static async atualizarCNPJ(req, res) {
        try {
            const usuarioId = req.usuario.id;
            const { cnpj } = req.body;
            
            console.log('Atualizando CNPJ do usuário:', usuarioId);
            
            // Validações
            if (!cnpj || cnpj.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ é obrigatório'
                });
            }
            
            // Limpar CNPJ (apenas números)
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            
            if (cnpjLimpo.length !== 14) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CNPJ inválido (deve ter 14 dígitos)'
                });
            }
            
            // Atualizar no banco
            await usuarioModel.atualizarCampo(
                usuarioId, 
                { cnpj: cnpjLimpo }
            );
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'CNPJ atualizado com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao atualizar CNPJ:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao atualizar CNPJ',
                mensagem: error.message
            });
        }
    }
    
    // POST /usuarios/logout - Fazer logout
    static async logout(req, res) {
        try {
            console.log('Realizando logout do usuário:', req.usuario.id);
            
            // Limpar cookie do token
            res.clearCookie('token', {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                path: '/'
            });
            
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Logout realizado com sucesso'
            });
            
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao fazer logout',
                mensagem: error.message
            });
        }
    }
}

export default UserController;