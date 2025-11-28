// ======================================================================= CRIAR PRODUTO
const salvar = document.getElementById('submit_prod-new')

salvar.addEventListener('click', (e) => {
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
            produtos.forEach(produto => { // percorre todos os registros do banco de dados produtos
                const bloco = document.createElement("tr"); // cria um elemento div
                bloco.className = "eachproduto"; // nome da classe do bloco é produto

                if (produto.estoque > 19) {
                    // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
                    bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                    <td class="cat_prod">${produto.tipo}</td>
                    <td class="ca_prod">${produto.ca}</td>
                    <td class="estoque_prod">
                        <!-- Observe que a quantidade de lotes no estoque é menor que 20, por isso a classe utilizada no p é .estoque-vermelho.
                         Essa classe é necessária para estilização. -->
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
                                    data-bs-target="#modalExcluirProd">
                                    <i class="fi fi-rs-trash"></i>
                                </button>
                            </div>
                        </div>
                </td>
            `;

         const submiteDel = document.getElementById('submit_delete_prod');           
            submiteDel.addEventListener('click', async (e) => {
                e.preventDefault();

                console.log('ID do produto a ser excluído:', produto.id);
            })
        }
                    if (produto.estoque <= 19) {
                        // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
                        bloco.innerHTML = ` 
                <td class="nome_prod">${produto.nome}</td>
                    <td class="cat_prod">${produto.tipo}</td>
                    <td class="ca_prod">${produto.ca}</td>
                    <td class="estoque_prod">
                        <!-- Observe que a quantidade de lotes no estoque é menor que 20, por isso a classe utilizada no p é .estoque-vermelho.
                         Essa classe é necessária para estilização. -->
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
                                    data-bs-target="#modalExcluirProd">
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


// ======================================================================= filtrar produtos com estoque baixo


// Chama a função para renderizar os produtos ao carregar a página
window.onload = renderizarProdutos(), categoriaProduto();