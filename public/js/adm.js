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
    const InputImg = document.getElementById('img_prod-upload')

    const formData = new FormData()
    formData.append('nome', nomeProduto)
    formData.append('tipo', categoriaProduto)
    formData.append('ca', caProduto)
    formData.append('preco', precoProduto)
    formData.append('estoque', estoqueProduto)
    formData.append('descricao', descricaoProduto)

    if(InputImg.files.length > 0) {
        formData.append('imagem', InputImg.files[0])
    }
    

    const response = await fetch('/api/produtos/criar', {
        method: 'POST',
        body: formData 
    })

    const data = await response.json()
    console.log(data)

    
}