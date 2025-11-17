import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuarioModel';
import cookieParser from 'cookie-parser';

class authController{

    //POST /auth/login - Fazer Login

    static async login(req, res) {
        try{
            const {email, senha} = req.body; //vai receber email e senha no corpo da requisição

            //validações básicas
            if(!email || email.trim() === ''){ //trim remove os espaços antes e depois da string
                return res.status(400).json({ //verifica se email está vazio
                    sucesso: false,
                    erro: 'Email obrigatório',
                    mensagem: 'O email é obrigatório'
                });
            }
            if(!senha || senha.trim() === ''){ //verifica se senha esta vazia
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha é obrigatória',
                    mensagem: 'A senha é obrigatóra'
                });
            } 
            //Validação básica de formato de email
            const emailRegexe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //esse regex garante que o email tenha parte antes do @, domínio depois do @, e extensão depois do ponto, sem espaços ou caracteres inválidos.
            if(!emailRegexe.test(email)){ //O método .test() do objeto RegExp verifica se a string email casa com o padrão do regex.
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }
            //Verifica se há as informações de login enviados no banco de dados da empresa, e manda como argumento a senha e o email se espaços
            const usuario = await usuarioModel.verificarCredenciais(email.trim(), senha);//essa verificação terá que ocorrer na pasta Model pois é nela que nos comunicamos com o banco de dados
            //caso ele não encontre as informações de login no banco de dados
            if(!usuario){
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Credencias inválidas',
                    mensagem: 'Email ou senha incorretos'
                });
            }

            //Caso tenha encontrado as credenciais vai gerar o token para o usuário efetuar o login
            const token = jwt.sign(
                {
                    //playload
                    id: usuario.id, //essas informações vem da const usuário que retorna o usuário sem a senha da verificação do banco de dados
                    email: usuario.email,
                    tipo: usuario.tipo
                },
                JWT_CONFIG.secret, //assinatura do token que  vem do .env tbm
                { expiresIn: JWT_CONFIG.expiresIn } //pega informações como período de expiração do token no .env
            );
            //agora o token vai ser enviado para a verificação via cookie
            res.cookie('token',token, {
                httpOnly: 
            })
        }
    }

}

export default authController;