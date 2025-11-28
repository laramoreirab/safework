import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js'

const authMiddleware = (req, res, next) =>{
    try {
        // pega o token do cookie
        const token = req.cookies.token;

        if(!token){ // caso falhe a operação de pegar o token do cookie
            return res.status(401).json({
                erro: 'Token de acesso não encontrado'
            });
        }
        
        //verificar e decodificar o token
        const decoded = jwt.verify(token, JWT_CONFIG.secret);

        // Adicionar informações do usuário ao request
        req.usuario = {
            id: decoded.id,
            tipo: decoded.tipo,
            email: decoded.email
        };

        next();
    } catch (error){
        if (error.name === 'TokenExpiredError'){ // Exibe o erro do token expirado
            return res.status(401).json({
                erro: 'Token expirado',
                mensagem: 'Faça login novamente'
            });
        }
        if (error.name === 'JsonWebTokenError') { // Exibe o erro do token inválido
            return res.status(401).json({ 
                erro: 'Token inválido',
                mensagem: 'Token de autenticação inválido'
            });
        }
        // Se não for nenhum desses
        console.error('Erro no middleware de autenticação:', error); // erro no middleware
        return res.status(500).json({ 
            erro: 'Erro interno do servidor',
            mensagem: 'Erro ao processar autenticação'
        });
    }
};

//Middleware para verificar se o usuário é administrador 
const adminMiddleware = (req, res, next) => {
    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            erro: 'Acesso negado!',
            mensagem: 'Apenas administradores podem acessar esse recurso!'
        })
    };
        next();
};

export { authMiddleware, adminMiddleware } //exportando as autenticações de Token e de Administrador