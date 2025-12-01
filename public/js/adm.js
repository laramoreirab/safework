// ======================================================================= CRIAR PRODUTO
// const salvar = document.getElementById('submit_prod-new')
const form = document.getElementById('info_novoproduto')

form.addEventListener('submit', (e) => {
    e.preventDefault()  // Evita o comportamento padrão do botão de submit
    criarProduto()
})

async function criarProduto() {

    const nomeProduto = document.getElementById('nome_prod-new').value
    const categoriaProduto = document.getElementById('categoria_prod-new').value
    const caProduto = document.getElementById('ca_prod-new').value
    const precoProduto = document.getElementById('preco_prod-new').value
    const estoqueProduto = document.getElementById('qtd_prod-new').value
    const descricaoProduto = document.getElementById('descricao_prod-new').value
    const marcaProduto = document.getElementById('marca_prod-new').value
    const InputImg = document.getElementById('img_prod-upload')

    console.log('esse é o nome do produto: ', nomeProduto)

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
}

// ======================================================================= EDITAR PRODUTO

const editar = document.getElementById('atualizar-prod') // Botão de atualizar produto

editar.addEventListener('click', (e) => {
    e.preventDefault()  // Evita o comportamento padrão do botão de submit
    atualizarProduto()
})

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



// ======================================================================= mostrar produtos na tabela

function renderizarProdutos() { // função para puxar todos os produtos ja formatados para pagina produto
    fetch('/api/produtos/listar') // rota que puxa todos os produtos do banco de dados
        .then(response => response.json())
        .then(data => {
            console.log('produtos', data)
            const produtos = data.dados; // armazena os dados recebidos da API na variável produtos
            const container = document.getElementById("produtos-container"); // seleciona o container onde os produtos serão exibidos
            const modalExcluirProd = document.getElementById("modalExcluirProd")
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
                                    data-bs-target="#modalEditarProd">
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
                                    data-bs-target="#modalEditarProd">
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
    // =========================================================== BOTÃO EXCLUIR

    let idDoProdExcluir = null

    modalExcluirProd.addEventListener('show.bs.modal', () => {
        const botao = event.relatedTarget;
        const produtoId = botao.getAttribute('data-id')
        idDoProdExcluir = produtoId
        console.log(produtoId)
    })

    const botaoExcluir = document.getElementById('submit_delete_prod')
    let imgDoProd = null
    botaoExcluir.onclick = function () {
        try {
            fetch(`/api/produtos/listar/id/${idDoProdExcluir}`)
                .then(res => res.json())
                .then(data => {
                    const produto = data.dados
                    imgDoProd = produto.img
                    fetch(`api/produtos/excluir/${idDoProdExcluir}/${imgDoProd}`, {
                        method: 'DELETE'
                    })
                    alert('Produto excluido com sucesso!')
                    return location.reload()
                })
        } catch (err) {
            console.error('Erro excluir produto', err)
        }

    }
}


// ======================================================================= filtrar produtos com estoque baixo

function categoriaProduto() {
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
window.onload = renderizarProdutos(), categoriaProduto();