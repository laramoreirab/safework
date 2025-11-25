import { create, read, update, deleteRecord, comparePassword, hashPassword, getConnection } from '../config/database.js';

class usuarioModel {

     // Buscar usuário por email
    static async buscarPorEmail(email) {
        try {
            const rows = await read('empresas', "email = ?", [email]); //houve mudanças
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    // Criar novo usuário
    static async criar(dadosUsuario) {
        try {
            // Hash da senha antes de salvar
            const senhaHash = await hashPassword(dadosUsuario.senha);
            const dadosComHash = {
                ...dadosUsuario,
                senha: senhaHash
            };
            
            return await create('empresas', dadosComHash);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

     // Verificar credenciais de login
     static async verificarCredenciais(email, senha) {
        try {
            const usuario = await this.buscarPorEmail(email);
            
            if (!usuario) {
                return null;
            }

            const senhaValida = await comparePassword(senha, usuario.senha);
            
            if (!senhaValida) {
                return null;
            }

            // Retornar usuário sem a senha
            const { senha: _, ...usuarioSemSenha } = usuario;
            return usuarioSemSenha;
        } catch (error) {
            console.error('Erro ao verificar credenciais:', error);
            throw error;
        }
    }

}
export default usuarioModel;