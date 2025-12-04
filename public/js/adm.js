
//  ========================================================================================================== SESSÃO DE PRODUTOS

// CRIAR PRODUTO

const form = document.getElementById('info_novoproduto')
form.addEventListener('submit', async (e) => {
    e.preventDefault()  // Evita o comportamento padrão do botão de submit


    const nomeProduto = document.getElementById('nome_prod-new').value
    const categoriaProduto = document.getElementById('categoria_prod-new').value
    const caProduto = document.getElementById('ca_prod-new').value
    const precoProduto = document.getElementById('preco_prod-new').value
    const estoqueProduto = document.getElementById('qtd_prod-new').value
    const descricaoProduto = document.getElementById('descricao_prod-new').value
    const marcaProduto = document.getElementById('marca_prod-new').value
    const InputImg = document.getElementById('img_prod-upload')

    console.log('esse é o nome do produto: ', nomeProduto)
    if (estoqueProduto < 1) {
        e.preventDefault()
        alert('O estoque deve ter pelo menos 1 item')
        return
    }
    if (nomeProduto.length <= 3) {
        alert('nome do produto deve ter pelo menos 3 caracteres')
        return
    }



    const formData = new FormData()
    formData.append('nome', nomeProduto)
    formData.append('tipo', categoriaProduto)
    formData.append('ca', caProduto)
    formData.append('preco', precoProduto)
    formData.append('estoque', estoqueProduto)
    formData.append('descricao', descricaoProduto)
    formData.append('marca', marcaProduto)

    if (InputImg.files.length > 0) {
        formData.append('imagem', InputImg.files[0])
    }


    const response = await fetch('/api/produtos/criar', {
        method: 'POST',
        body: formData
    })

    const data = await response.json()
    if (data.sucesso) {
        alert('Produto criado com sucesso!')
        window.location.reload()
    } else {
        alert('Erro ao criar produto: ' + data.mensagem)
    }
})
// EDITAR PRODUTO

async function atualizarProduto() {

    const nomeProduto = document.getElementById('atualiza-nome_prod-new').value
    const categoriaProduto = document.getElementById('atualiza-categoria_prod').value
    const caProduto = document.getElementById('atualiza-ca_prod').value
    const precoProduto = document.getElementById('atualiza-preco_prod').value
    const estoqueProduto = document.getElementById('atualiza-qtd_prod').value
    const descricaoProduto = document.getElementById('descricao_prod-new').value
    const InputImg = document.getElementById('atualiza-img_prod-upload')

    const formData = new FormData()
    formData.append('nome', nomeProduto)
    formData.append('tipo', categoriaProduto)
    formData.append('ca', caProduto)
    formData.append('preco', precoProduto)
    formData.append('estoque', estoqueProduto)
    formData.append('descricao', descricaoProduto)

    if (InputImg.files.length > 0) {
        formData.append('imagem', InputImg.files[0])
    }


    const response = await fetch('/api/produtos/atualizar', {
        method: 'PUT',
        body: formData
    })

    const data = await response.json()
    if (data.sucesso) {
        alert('Produto criado com sucesso!')
        window.location.reload()
    } else {
        alert('Erro ao criar produto: ' + data.mensagem)
    }
}

const searchInputProdutos = document.getElementById('searchProdutos')
renderizarProdutos()

//  mostrar produtos na tabela
function renderizarProdutos() { // função para puxar todos os produtos ja formatados para pagina produto
    fetch('/api/produtos/listar') // rota que puxa todos os produtos do banco de dados
        .then(response => response.json())
        .then(data => {
            console.log('produtos', data)
            const produtos = data.dados; // armazena os dados recebidos da API na variável produtos
            const container = document.getElementById("produtos-container"); // seleciona o container onde os produtos serão exibidos
            const modalExcluirProd = document.getElementById("modalExcluirProd")
            const modalEditarProd = document.getElementById('modalEditarProd')
            produtos.forEach(produto => { // percorre todos os registros do banco de dados produtos
                const bloco = document.createElement("tr"); // cria um elemento div
                bloco.className = "eachproduto"; // nome da classe do bloco é produto

                if (produto.estoque > 19) { // se estoque for maior que 19, o design das unidades ficara verde
                    // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
                    bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                <td class="cat_prod">${produto.tipo}</td>
                <td class="ca_prod">${produto.ca}</td>
                <td class="estoque_prod">
                <p class="estoque-verde">${produto.estoque} un.</p> 
                </td>
                <td class="preco_prod">R$ ${produto.preco}</td>
                <td>
                10-02-2025
                </td>
                <td class="status_prod">
                <p class="status_ativo">
                ativo
                </p>
                </td>
                <td class="actions_prod">
                <div class="acoes">
                <div class="editar-produto">
                <!---- Editar Produto modal ----->
                <button type="button" class="editar_prod" data-bs-toggle="modal"
                data-bs-target="#modalEditarProd" data-id = ${produto.id}>
                <i class="fi-sr-pencil"></i>
                </button>
                </div>
                <div class="excluir-produto">
                <!-- Botão Excluir Produto modal -->
                <button type="button" class="botao_excluirprod" data-bs-toggle="modal"
                data-bs-target="#modalExcluirProd" data-id=${produto.id}>
                <i class="fi fi-rs-trash"></i>
                </button>
                </div>
                </div>
                </td>
                `;
                }

                if (produto.estoque <= 19) { // se estoque for menor que 19, o design das unidades ficara vermelho
                    // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
                    bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                <td class="cat_prod">${produto.tipo}</td>
                <td class="ca_prod">${produto.ca}</td>
                <td class="estoque_prod">
                <p class="estoque-vermelho">${produto.estoque} un.</p>
                </td>
                <td class="preco_prod">R$ ${produto.preco}</td>
                <td class="status_prod">
                <p class="status_ativo">
                ativo
                </p>
                </td>
                <td class="actions_prod">
                <div class="acoes">
                <div class="editar-produto">
                <!---- Editar Produto modal ----->
                <button type="button" class="editar_prod" data-bs-toggle="modal"
                data-bs-target="#modalEditarProd" data-id = ${produto.id}>
                <i class="fi-sr-pencil"></i>
                </button>
                </div>
                <div class="excluir-produto">
                <!-- Botão Excluir Produto modal -->
                <button type="button" class="botao_excluirprod" data-bs-toggle="modal"
                data-bs-target="#modalExcluirProd" data-id = ${produto.id}>
                <i class="fi fi-rs-trash"></i>
                </button>
                </div>
                </div>
                </td>
                `;
                }

                container.appendChild(bloco); // fala para adicionar a div estilizada dentro do container (no caso, adicionar essa div dentro da main)
            })

            const contarProdutos = produtos.length; // conta a quantidade de produtos no banco de dados
            document.getElementById('qtd-produtos').innerText = contarProdutos; // mostra a quantidade de produtos na página de administração
        })
}

// mostra os produtos da tabela após pesquisar algum item
function filtroProduto() {
    const searchTermProd = searchInputProdutos.value.toLowerCase().trim();
    fetch('api/produtos/listar')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("produtos-container"); // seleciona o container onde os produtos serão exibidos
            const produtos = data.dados // pega todos os produtos do banco de dados
            const campos = ["nome", "tipo", "ca"]
            const produtoFiltrado = produtos.filter(produto => campos.some(campo => produto[campo].toString().toLowerCase().includes(searchTermProd)))
            container.querySelectorAll('.eachproduto').forEach(el => el.remove())

            produtoFiltrado.forEach(produto => {
                const bloco = document.createElement("tr"); // cria um elemento div
                bloco.className = "eachproduto"; // nome da classe do bloco é produto

                if (produto.estoque > 19) { // se estoque for maior que 19, o design das unidades ficara verde
                    // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos

                    bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                    <td class="cat_prod">${produto.tipo}</td>
                    <td class="ca_prod">${produto.ca}</td>
                    <td class="estoque_prod">
                        <p class="estoque-verde">${produto.estoque} un.</p> 
                    </td>
                    <td class="preco_prod">R$ ${produto.preco}</td>
                                        <td>
                    10-02-2025
                    </td>
                    <td class="status_prod">
                        <p class="status_ativo">
                            ativo
                        </p>
                    </td>
                    <td class="actions_prod">
                        <div class="acoes">
                            <div class="editar-produto">
                                <!---- Editar Produto modal ----->
                                <button type="button" class="editar_prod" data-bs-toggle="modal"
                                    data-bs-target="#modalEditarProd" data-id = ${produto.id}>
                                    <i class="fi-sr-pencil"></i>
                                </button>
                            </div>
                            <div class="excluir-produto">
                                <!-- Botão Excluir Produto modal -->
                                <button type="button" class="botao_excluirprod" data-bs-toggle="modal"
                                    data-bs-target="#modalExcluirProd" data-id=${produto.id}>
                                    <i class="fi fi-rs-trash"></i>
                                </button>
                            </div>
                        </div>
                </td>
            `;
                }

                if (produto.estoque <= 19) { // se estoque for menor que 19, o design das unidades ficara vermelho
                    // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
                    bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                    <td class="cat_prod">${produto.tipo}</td>
                    <td class="ca_prod">${produto.ca}</td>
                    <td class="estoque_prod">
                        <p class="estoque-vermelho">${produto.estoque} un.</p>
                    </td>
                    <td class="preco_prod">R$ ${produto.preco}</td>
                    <td class="status_prod">
                        <p class="status_ativo">
                            ativo
                        </p>
                    </td>
                    <td class="actions_prod">
                        <div class="acoes">
                            <div class="editar-produto">
                                <!---- Editar Produto modal ----->
                                <button type="button" class="editar_prod" data-bs-toggle="modal"
                                    data-bs-target="#modalEditarProd" data-id = ${produto.id}>
                                    <i class="fi-sr-pencil"></i>
                                </button>
                            </div>
                            <div class="excluir-produto">
                                <!-- Botão Excluir Produto modal -->
                                <button type="button" class="botao_excluirprod" data-bs-toggle="modal"
                                    data-bs-target="#modalExcluirProd" data-id = ${produto.id}>
                                    <i class="fi fi-rs-trash"></i>
                                </button>
                            </div>
                        </div>
                </td>
            `;
                }

                container.appendChild(bloco); // fala para adicionar a div estilizada dentro do container (no caso, adicionar essa div dentro da main)
            })
        })
}




let idDoProd = null
let imgDoProd = null


// BOTÃO EDITAR
modalEditarProd.addEventListener('show.bs.modal', () => {
    const botao = event.relatedTarget
    const produtoId = botao.getAttribute('data-id')
    idDoProd = produtoId
    console.log('esse é o id que esta sendo enviado pelo editar: ', idDoProd)


    const formatualiza = document.getElementById('info_atualizaproduto')
    formatualiza.addEventListener('submit', async (e) => {
        e.preventDefault()  // Evita o comportamento padrão do botão de submit



        await fetch(`/api/produtos/listar/id/${idDoProd}`)
            .then(res => res.json())
            .then(data => {
                imgDoProd = (data.dados).img
            })

        const nomeProduto = document.getElementById('atualiza-nome_prod-new').value
        const categoriaProduto = document.getElementById('atualiza-categoria_prod').value
        const caProduto = document.getElementById('atualiza-ca_prod').value
        const precoProduto = document.getElementById('atualiza-preco_prod').value
        const estoqueProduto = document.getElementById('atualiza-qtd_prod').value
        const descricaoProduto = document.getElementById('atualiza-descricao_prod').value
        const marcaProduto = document.getElementById('atualiza-marca_prod').value
        const InputImg = document.getElementById('atualiza-img_prod-upload')

        console.log('esse é o nome do produto: ', nomeProduto)
        if (estoqueProduto < 1) {
            e.preventDefault()
            alert('O estoque deve ter pelo menos 1 item')
            return
        }
        if (nomeProduto.length <= 3) {
            alert('nome do produto deve ter pelo menos 3 caracteres')
            return
        }





        const formData = new FormData()
        formData.append('id', idDoProd)
        formData.append('nome', nomeProduto)
        formData.append('tipo', categoriaProduto)
        formData.append('ca', caProduto)
        formData.append('preco', precoProduto)
        formData.append('estoque', estoqueProduto)
        formData.append('descricao', descricaoProduto)
        formData.append('marca', marcaProduto)
        formData.append('img', imgDoProd)

        if (InputImg.files.length > 0) {
            formData.append('imagem', InputImg.files[0])
        }


        const response = await fetch('/api/produtos/atualizar', {
            method: 'PUT',
            body: formData
        })

        const data = await response.json()
        if (data.sucesso) {
            alert('Produto atualizado com sucesso!')
            window.location.reload()
        } else {
            alert('Erro ao atualizar produto: ' + data.mensagem)
        }
    })
})


// BOTÃO EXCLUIR
modalExcluirProd.addEventListener('show.bs.modal', () => {
    const botao = event.relatedTarget;
    const produtoId = botao.getAttribute('data-id')
    idDoProd = produtoId
    console.log(produtoId)
})

const botaoExcluir = document.getElementById('submit_delete_prod')
botaoExcluir.onclick = function () {
    try {
        fetch(`/api/produtos/listar/id/${idDoProd}`)
            .then(res => res.json())
            .then(data => {
                const produto = data.dados
                imgDoProd = produto.img
                fetch(`api/produtos/excluir/${idDoProd}/${imgDoProd}`, {
                    method: 'DELETE'
                })
                alert('Produto excluido com sucesso!')
                return location.reload()
            })
    } catch (err) {
        console.error('Erro excluir produto', err)
    }

}


//  filtrar produtos com estoque baixo
function produtoEstoqueBaixo() {
    fetch('/api/produtos/listar') // rota que puxa todos os produtos do banco de dados
        .then(response => response.json())
        .then(data => {
            console.log('produtos', data)
            const container = document.getElementById("tabela_estoquebaixo"); // seleciona o container onde os produtos serão exibidos
            const produtos = data.dados; // armazena os dados recebidos da API na variável produtos
            const produtoFilter = produtos.filter(produto => produto.estoque < 20)
            produtoFilter.forEach(produto => {
                const bloco = document.createElement("tr"); // cria um elemento div
                bloco.className = "eachproduto"; // nome da classe do bloco é produto

                bloco.innerHTML = `<td class="nome_prod">
                                                            <!-- Colocar aqui o nome do produto -->
                                                            ${produto.nome}
                                                        </td>
                                                        <td class="cat_prod">
                                                            <!-- Colocar aqui a categoria do produto -->
                                                            ${produto.tipo}
                                                        </td>
                                                        <td class="ca_prod">
                                                            <!-- Colocar aqui o ca do produto -->
                                                            ${produto.ca}
                                                        </td>
                                                        <td class="estoque_prod">
                                                            <p class="estoque-vermelho">
                                                                <!-- Colocar aqui a quantidade de produtos no estoque, ele deve ficar dentro do p.estoque-vermelho para pegar a estilização -->
                                                                ${produto.estoque} un.
                                                            </p>
                                                        </td>
                                                        <td class="preco_prod">
                                                            <!-- Colocar aqui o preço do produto, ele dev estar formatado da seguinte maneira: R$ NN.NN -->
                                                            R$ ${produto.preco}
                                                        </td>
                                                        <td class="status_prod">
                                                            <p class="status_ativo">
                                                                ativo
                                                            </p>
                                                </td>`


                container.appendChild(bloco); // fala para adicionar a div estilizada dentro do container (no caso, adicionar essa div dentro da main)
            })
            document.getElementById('qtd-estoquebaixo').innerText = produtoFilter.length; // mostra a quantidade de produtos com estoque baixo
        })
}


// Chama a função para renderizar os produtos ao carregar a página
window.onload = renderizarProdutos(), produtoEstoqueBaixo(), listarUsuarios();
searchInputProdutos.addEventListener('input', renderizarProdutos)
searchInputProdutos.addEventListener('input', filtroProduto)






//  ========================================================================================================== SESSÃO DE USUÁRIOS






// LISTAR USUÁRIOS

const qtdUsers = document.getElementById('qtd-users') // pega o ID do numerador da quantidade de usuarios
const tabelaUser = document.getElementById('tabela_users')

async function listarUsuarios() {
    fetch('/usuarios')
        .then(res => res.json())
        .then(data => {
            tabelaUser.querySelectorAll('.eachUser').forEach(el => el.remove())
            const usuarios = data.dados // retorna a array com as informações dos usuários
            qtdUsers.innerHTML = usuarios.length // adiciona a quantidade de usuarios no bloco do modal usuarios na página do administrador
            usuarios.forEach(usuario => {
                const bloco = document.createElement('tr')
                bloco.className = 'eachUser'
                bloco.innerHTML = `
                                                        <td class="nome_user">
                                                            <!-- Colocar aqui o nome do user -->
                                                            ${usuario.nome}
                                                        </td>
                                                        <td class="id_user">
                                                            <!-- Colocar aqui o id do user -->
                                                            ${usuario.id}
                                                        </td>
                                                        <td class="email_user">
                                                            <!-- Colocar aqui o email do user -->
                                                            ${usuario.email}
                                                        </td>
                                                        <td class="tel_user">
                                                            <!-- Colocar aqui o telefone do user -->
                                                            ${usuario.telefone}
                                                        </td>
                                                        <td class="status_prod">
                                                            <p class="status_ativo">
                                                               ativo
                                                            </p>
                                                        </td>
                                                        <td class="actions_prod">
                                                            <div class="acoes">
                                                                <div class="excluir-produto">
                                                                    <!-- Botão Excluir Usuário -->
                                                                    <button type="button" class="botao_excluirprod"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#excluirUsuario" data-id = ${usuario.id}>
                                                                        <i class="fi fi-rs-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
            `
                tabelaUser.appendChild(bloco)
            })

        })
}

 let idDoUser = null

    excluirUsuario.addEventListener('show.bs.modal', () => { // pega o id ao abrir o modal excluirUser 
        const botao = event.relatedTarget;
        const usuarioId = botao.getAttribute('data-id')
        idDoUser = usuarioId
        console.log(idDoUser)

    })

    const botaoExcluirUser = document.getElementById('submit-delete_usuario')  // botão de excluir user
    botaoExcluirUser.onclick = function () { // evento ao clicar no botão de excluir user 
        try {
            fetch(`/usuarios/${idDoUser}`, {
                method: 'DELETE'
            })
            alert('Usuário excluído com sucesso!')
            return location.reload()
        } catch (err) {
            console.error('Erro excluir usuário', err)
        }

    }


    // CRIAR USUÁRIO

    const formUser = document.getElementById('criarUser')

    try {
        formUser.addEventListener('submit', async (e) => {
            e.preventDefault()

            const nomeUser = document.getElementById('nome_user-new').value
            const emailUser = document.getElementById('email_user-new').value
            const telefoneUser = document.getElementById('tel_user-new').value
            const senhaUser = document.getElementById('senha_user-new').value

            fetch(`/usuarios`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    nome: nomeUser,
                    email: emailUser,
                    telefone: telefoneUser,
                    senha: senhaUser,
                    tipo: 'admin'
                })
            })
            alert('Usuário criado com sucesso!')
            return location.reload()
        })
    } catch (err) {
        console.error("não foi possivel enviar esse usuário: ", err)
    }

//  SEARCH DOS USUÁRIOS
const searchInputUser = document.getElementById('searchUser')

async function filtrarUsuarios() {
    fetch('/usuarios')
    .then(res => res.json())
    .then(data => {
        tabelaUser.querySelectorAll('.eachUser').forEach(el => el.remove())
        const usuarios = data.dados
        const searchTermUser = searchInputUser.value.toLowerCase().trim()
        const usuarioFiltro =  usuarios.filter(usuario => String(usuario.id).includes(searchTermUser))   
        
        usuarioFiltro.forEach(usuario => {
            const bloco = document.createElement('tr')
            bloco.className = 'eachUser'
            bloco.innerHTML = `
                                                        <td class="nome_user">
                                                            <!-- Colocar aqui o nome do user -->
                                                            ${usuario.nome}
                                                        </td>
                                                        <td class="id_user">
                                                            <!-- Colocar aqui o id do user -->
                                                            ${usuario.id}
                                                        </td>
                                                        <td class="email_user">
                                                            <!-- Colocar aqui o email do user -->
                                                            ${usuario.email}
                                                        </td>
                                                        <td class="tel_user">
                                                            <!-- Colocar aqui o telefone do user -->
                                                            ${usuario.telefone}
                                                        </td>
                                                        <td class="status_prod">
                                                            <p class="status_ativo">
                                                               ativo
                                                            </p>
                                                        </td>
                                                        <td class="actions_prod">
                                                            <div class="acoes">
                                                                <div class="excluir-produto">
                                                                    <!-- Botão Excluir Usuário -->
                                                                    <button type="button" class="botao_excluirprod"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#excluirUsuario" data-id = ${usuario.id}>
                                                                        <i class="fi fi-rs-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
            `
            tabelaUser.appendChild(bloco)
        })
    })
} 
searchInputUser.addEventListener('input', listarUsuarios)
searchInputUser.addEventListener('input', filtrarUsuarios)