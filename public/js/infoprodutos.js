const id = (window.location.pathname).split('/')[3] // pega o id do URL
const contaCaracID = (id.toString()).length // conta a quantidade de caracteres que o id tem (para fazer comparações que utilizam o numero do id)

//  elementos da página de informação do produto
const tituloProd = document.getElementById('tituloprod')
const caProd = document.getElementById('caprod')
const codProd = document.getElementById('codprod')

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
            // ===================================================================
            
            
            tituloProd.innerHTML = `${produto.nome}` //  imprimindo o titulo do produto
            caProd.innerHTML = `<p>C.A: ${produto.ca}</p>` // imprimindo o ca do produto 
            codProd.innerHTML = `${codigoProd}` // imprimindo o código do produto
            
        }


        )
} catch (err) {
    console.error('Erro ao procurar produto', err)
}

