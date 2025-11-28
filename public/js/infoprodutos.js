const id = (window.location.pathname).split('/')[3] // pega o id do URL
const contaCaracID = (id.toString()).length // conta a quantidade de caracteres que o id tem (para fazer comparações que utilizam o numero do id)

//  elementos da página de informação do produto
const tituloProd = document.getElementById('tituloprod')
const caProd = document.getElementById('caprod')
const codProd = document.getElementById('codprod')
const descProd = document.getElementById('descricao_prod')
const containerInteresses = document.getElementById('produtos_interesse')

console.log('esse é o id: ', id) //  mostra o id que foi pego

try {
    fetch(`/api/produtos/listar/id/${id}`) // funcionamento onde vai identificar o id do produto
        .then(res => res.json())
        .then(data => {
            return data.dados // retorna os dados que chega no object retornando a tabela do produto com (nome, preço, ...)
        })

        .then(produto => { // produto é a variavel que retornou o valor "data.dados"


            //  ================= FORMATAÇÃO PARA O CÓDIGO  DO PRODUTO =================            

            let codigoProd  // variavel que ta sujeita a modificações

            // se o numero for unidade ex:  X, retorne  000X
            if (contaCaracID == 1) {
                codigoProd = `<p>Cód: 000${produto.id}</p>`
            }
            // se o numero for dezena ex:  XX, retorne  00XX
            if (contaCaracID === 2) {
                codigoProd = `<p>Cód: 00${produto.id}</p>`
            }

            // se o numero for centena ex:  XXX, retorne  0XXX
            if (contaCaracID === 3) {
                codigoProd = `<p>Cód: 0${produto.id}</p>`
            }
            // se o numero for milhar ex:  XXXX, retorne  XXXX
            if (contaCaracID === 4) {
                codigoProd = `<p>Cód: 0${produto.id}</p>`
            }
            // ===========================================================================

            let tipoProd;
            switch (produto.tipo) {
                case 'Facial': tipoProd = 'facial'; break;
                case 'Ocular': tipoProd = 'ocular'; break;
                case 'Corporal': tipoProd = 'corporal'; break;
                case 'Respiratório': tipoProd = 'respiratorio'; break;
                case 'Auditivo': tipoProd = 'auditivo'; break;
                case 'Manual': tipoProd = 'manual'; break;
                case 'Pés e Pernas': tipoProd = 'pesepernas'; break;
                case 'Cabeça': tipoProd = 'cabeca'; break;
                default: tipoProd = 'todos';
            }


            //  buscar produtos da mesma categoria para mostrar em "produtos relacionados"
            fetch(`/api/produtos/listar/${produto.tipo}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data.dados)
                    return data.dados // retorna os quatro primeiros produtos da categoria
                })
                .then(produtos => {
                    containerInteresses.innerHTML = '' // limpa o container antes de adicionar os produtos
                    produtos.slice(0,4).forEach(produto => {
                        const bloco = document.createElement('div')
                        bloco.classList.add('col-12', 'col-md-3')

                        bloco.innerHTML = `
                        <a href="/produtos/${tipoProd}/${produto.id}">
                            <div class="one-produto">
                                <img src="${produto.img}" alt="" />
                                <h5>${produto.nome}</h5>
                                <p>
                                    CA: ${produto.ca} | <span id="marca-produtos">${produto.marca}</span>
                                </p>
                                <div class="estrelas">
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ss-star"></i>
                                    <i class="fi fi-ts-star-sharp-half-stroke"></i>
                                    <p id="quantidade-avaliacoes">(201)</p>
                                </div>
                                <h4 class="preco-produtos" id="preco-produtos">R$200,90</h4>
                            </div>
                        </a>`

                        containerInteresses.appendChild(bloco)
                    });
                })



            // imprimindo os dados do produto na página de informação do produto

            tituloProd.innerHTML = `${produto.nome}` //  imprimindo o titulo do produto
            caProd.innerHTML = `<p>C.A: ${produto.ca}</p>` // imprimindo o ca do produto 
            codProd.innerHTML = `${codigoProd}` // imprimindo o código do produto
            descProd.innerHTML = `<p>${produto.descricao}</p>` // imprimindo a descrição do produto
        })
} catch (err) {
    console.error('Erro ao procurar produto', err)
}

