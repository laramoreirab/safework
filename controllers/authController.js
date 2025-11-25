import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';
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
                httpOnly: true, // protege contra acesso via JS no browser
                secure: false, //o navegador só vai enviar esse cookie em conexões HTTPS
                sameSite: 'Strict'

            });
            res.status(200).json({
                sucesso: true,
                mensagem: "Login realizado com sucesso!",
                dados: {
                    usuario:{
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo: usuario.tipo
                    }
                }
            });
        } catch(error){
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o login'
            });
        }
    }

    //POST /auth/registrar - Registrar usuário 

    static async registrar(req, res){
        try{
            const { nome, email, telefone, senha, tipo } = req.body;

            //validaçõe básicas 
            if(!nome || nome.trim() === ''){  // verifica se o campo nome está vazio, ele vem sem espaços
                return res.status(400).json({  
                    sucesso: false,
                    erro: 'Nome obrigatório',
                    mensagem: 'O nome é obigatório para cadastro'
                });
            }
            if (!email || email.trim() === '') {  // verifica se o campo email está vazio, ele vem sem espaços
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email obrigatório',
                    mensagem: 'O email é obrigatório'
                });
            }

            if (!telefone || telefone.trim() === '') { // verifica se o campo telefone está vazio, ele vem sem espaços
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone é obrigatório',
                    mensagem: 'O telefone é obrigatória'
                });
            }

            if (!senha || senha.trim() === '') { // verifica se o campo senha está vazio, ele vem sem espaços
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha obrigatória',
                    mensagem: 'A senha é obrigatória'
                });
            }

            // validações de formato
            // verificando o nome 
            if (nome.length < 2){ 
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito curto',
                    mensagem: 'O nome deve ter pelo menos 2 caracteres'
                })
            }
            if (nome.length > 255) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito longo',
                    mensagem: 'O nome deve ter no máximo 255 caracteres'
                });
            }
            // verficando formato de eamil
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido'
                });
            }
            // verificando o telefone
            if (telefone.length < 11) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Telefone inválido',
                    mensagem: 'O telefone deve ter pelo menos 11 caracteres'
                });
            }
            // verificando a senha
            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres'
                });
            }
            // verifica se o email ja esta cadastrado no banco de dados da empresa
            const usuarioExistente = await usuarioModel.buscarPorEmail(email); //recebe como argumento o email colocado pelo usuário 
            if (usuarioExistente){
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário'
                });
            }

            //Preparar dados do usuário para ser alocado no banco de dados
            const dadosUsuario = {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                telefone: telefone.trim(),
                senha: senha,
                tipo: tipo || 'comum'
            };

            //Criar usuário no banco de dados
            const usuarioId = await usuarioModel.criar(dadosUsuario);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário registrado com sucesso',
                dados: {
                    id: usuarioId,
                    nome: dadosUsuario.nome,
                    email: dadosUsuario.email,
                    telefone: dadosUsuario.telefone,
                    tipo: dadosUsuario.tipo
                }
            })
        }catch (error) {
            console.error('Erro ao registrar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível registrar o usuário'
            });
        }
    }

    // aqui o adm será capaz de excluir, listar, criar, Obter perfil do usuário logado, .....



}

export default authController;