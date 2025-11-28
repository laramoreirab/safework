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
                sameSite: 'Strict',
                path: "/"

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
            const { nome, email, telefone, senha, tipo} = req.body;

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
            // verficando formato de email
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

// ----------------------------------aqui o adm será capaz de excluir, listar, criar, Obter perfil do usuário logado, ..... ------------------------------------------------

    
    // / GET /usuarios - Listar todos os usuários (apenas admin, com paginação)
    static async listarUsuarios(req, res) {
        try {
            // Obter parâmetros de paginação da query string
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            
            // Validações
            if (pagina < 1) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser um número maior que zero'
                });
            }
            
            const limiteMaximo = parseInt(process.env.PAGINACAO_LIMITE_MAXIMO) || 100;
            if (limite < 1 || limite > limiteMaximo) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: `O limite deve ser um número entre 1 e ${limiteMaximo}`
                });
            }
            
            const resultado = await usuarioModel.listarTodos(pagina, limite);
            
            // Remover senha de todos os usuários
            const usuariosSemSenha = resultado.usuarios.map(({ senha, ...usuario }) => usuario);

            res.status(200).json({
                sucesso: true,
                dados: usuariosSemSenha,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível listar os usuários'
            });
        }
    }

    // GET /auth/perfil - Obter perfil do usuário logado
    static async obterPerfil(req, res) {
        try {
            const usuario = await usuarioModel.buscarPorId(req.usuario.id);
            
            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: 'Usuário não foi encontrado'
                });
            }

            // Remover senha dos dados retornados
            const { senha, ...usuarioSemSenha } = usuario;

            res.status(200).json({
                sucesso: true,
                dados: usuarioSemSenha
            });
        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter o perfil'
            });
        }
    }


    // POST /usuarios - Criar novo usuário (apenas admin)
    static async criarUsuario(req, res) {
        try {
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
            // verficando formato de email
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

            console.log(`esse é os dados do usuario: ${dadosUsuario}`)

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

    // excluir usuário (apenas o adm)
    // DELETE /usuarios/:id - Excluir usuário (apenas admin)
    static async excluirUsuario(req, res) {
        try {
            const { id } = req.params;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await usuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Excluir usuário
            const resultado = await usuarioModel.excluir(id);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário excluído com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível excluir o usuário'
            });
        }
    }

    // PUT /usuarios/:id - Atualizar usuário (apenas admin)----------------------------------------
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, tipo } = req.body;
            
            // Validação do ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O ID deve ser um número válido'
                });
            }

            // Verificar se o usuário existe
            const usuarioExistente = await usuarioModel.buscarPorId(id);
            if (!usuarioExistente) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado',
                    mensagem: `Usuário com ID ${id} não foi encontrado`
                });
            }

            // Preparar dados para atualização
            const dadosAtualizacao = {};
            
            if (nome !== undefined) {
                if (nome.trim() === '') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome inválido',
                        mensagem: 'O nome não pode estar vazio'
                    });
                }
                if (nome.length < 2) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome muito curto',
                        mensagem: 'O nome deve ter pelo menos 2 caracteres'
                    });
                }
                dadosAtualizacao.nome = nome.trim();
            }

            if (email !== undefined) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Email inválido',
                        mensagem: 'Formato de email inválido'
                    });
                }
                
                // Verificar se o email já está em uso por outro usuário
                const usuarioComEmail = await usuarioModel.buscarPorEmail(email);
                if (usuarioComEmail && usuarioComEmail.id !== parseInt(id)) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Email já cadastrado',
                        mensagem: 'Este email já está sendo usado por outro usuário'
                    });
                }
                
                dadosAtualizacao.email = email.trim().toLowerCase();
            }

            if (senha !== undefined) {
                if (senha.length < 6) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Senha muito curta',
                        mensagem: 'A senha deve ter pelo menos 6 caracteres'
                    });
                }
                dadosAtualizacao.senha = senha;
            }

            if (tipo !== undefined) {
                dadosAtualizacao.tipo = tipo;
            }

            // Verificar se há dados para atualizar
            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nenhum dado para atualizar',
                    mensagem: 'Forneça pelo menos um campo para atualizar'
                });
            }

            // Atualizar usuário
            const resultado = await usuarioModel.atualizar(id, dadosAtualizacao);
            
            res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado com sucesso',
                dados: {
                    linhasAfetadas: resultado || 1
                }
            });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível atualizar o usuário'
            });
        }
    }

}

export default authController;