const id = (window.location.pathname).split('/')[3] // pega o id do URL
const contaCaracID = (id.toString()).length // conta a quantidade de caracteres que o id tem

//  elementos da página de informação do produto
const tituloProd = document.getElementById('tituloprod')
const caProd = document.getElementById('caprod')
const codProd = document.getElementById('codprod')
const descProd = document.getElementById('descricao_prod')
const imgProd = document.getElementById('imgProd')
const containerInteresses = document.getElementById('produtos_interesse')

console.log('esse é o id: ', id) //  mostra o id que foi pego

// Variável global para armazenar o produto
let produtoAtual = null;

try {
    fetch(`/api/produtos/listar/id/${id}`)
        .then(res => res.json())
        .then(data => {
            return data.dados
        })
        .then(produto => {
            // Armazenar produto globalmente
            produtoAtual = produto;
        
            let codigoProd

            if (contaCaracID == 1) {
                codigoProd = `<p>Cód: 000${produto.id}</p>`
            }
            if (contaCaracID === 2) {
                codigoProd = `<p>Cód: 00${produto.id}</p>`
            }
            if (contaCaracID === 3) {
                codigoProd = `<p>Cód: 0${produto.id}</p>`
            }
            if (contaCaracID === 4) {
                codigoProd = `<p>Cód: ${produto.id}</p>`
            }

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
                    return data.dados
                })
                .then(produtos => {
                    containerInteresses.innerHTML = ''
                    produtos.slice(0, 4).forEach(produto => {
                        const bloco = document.createElement('div')
                        bloco.classList.add('col-12', 'col-md-3')

                        bloco.innerHTML = `
                        <a href="/produtos/${tipoProd}/${produto.id}">
                            <div class="one-produto">
                                <img src="/uploads/imagens/${produto.img}" alt="" />
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
                                <h4 class="preco-produtos" id="preco-produtos">R$${produto.preco}</h4>
                            </div>
                        </a>`

                        containerInteresses.appendChild(bloco)
                    });
                })

            // imprimindo os dados do produto na página de informação do produto
            tituloProd.innerHTML = `${produto.nome}`
            caProd.innerHTML = `<p>C.A: ${produto.ca}</p>`
            codProd.innerHTML = `${codigoProd}`
            descProd.innerHTML = `<p>${produto.descricao}</p>`
            imgProd.src = `/uploads/imagens/${produto.img}`

            // Atualizar preço inicial
            const precoProdElement = document.querySelector('.preco_produto');
            if (precoProdElement) {
                precoProdElement.textContent = `R$ ${produto.preco}`;
            }

            // Configurar botões de quantidade
            configurarBotoesQuantidade();

            // Configurar botão comprar
            configurarBotaoComprar();
        })
} catch (err) {
    console.error('Erro ao procurar produto', err)
}

// Função para configurar os botões de aumentar/diminuir
function configurarBotoesQuantidade() {
    const linhas = document.querySelectorAll('.linha_informacoes');

    linhas.forEach(linha => {
        const btnAumentar = linha.querySelector('.aumentar-btn');
        const btnDiminuir = linha.querySelector('.diminuir-btn');
        const input = linha.querySelector('.quantidade-input');

        // adicionar eventos nos botões + e -
            document.querySelectorAll('.aumentar-btn, .diminuir-btn, .quantidade-input').forEach(el => {
                el.addEventListener('click', atualizarPrecoTotal);
                el.addEventListener('input', atualizarPrecoTotal);
            });

        // Input manual
        input.addEventListener('input', () => {
            let valor = parseInt(input.value) || 0;
            if (valor < 0) input.value = 0;
            if (valor > 50) input.value = 50;
            atualizarPrecoTotal();
        });
    });
}

// Função para atualizar preço total
function atualizarPrecoTotal() {
    if (!produtoAtual) return;

    const linhas = document.querySelectorAll('.linha_informacoes');
    let total = 0;

    linhas.forEach(linha => {
        const quantidadeLotes = parseInt(linha.querySelector('.quantidade-input').value) || 0;
        if (quantidadeLotes > 0) {
            // Cada lote = 50 unidades
            const quantidadeUnidades = quantidadeLotes * 50;
            total += quantidadeUnidades * produtoAtual.preco;
        }
    });

    const precoProdElement = document.querySelector('.preco_produto');
    if (precoProdElement) {
        precoProdElement.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
}

// Função para configurar o botão de comprar
function configurarBotaoComprar() {
    const btnComprar = document.querySelector('.addcarrinho_informacoes');
    
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            if (!produtoAtual) {
                alert('Erro: Produto não carregado');
                return;
            }

            const linhas = document.querySelectorAll('.linha_informacoes');
            let itensAdicionados = 0;

            linhas.forEach(linha => {
                const tamanho = linha.dataset.tamanho;
                const quantidadeLotes = parseInt(linha.querySelector('.quantidade-input').value) || 0;

                if (quantidadeLotes > 0) {
                    // Converter lotes em unidades (1 lote = 50 unidades)
                    const quantidadeUnidades = quantidadeLotes * 50;
                    
                    // Verificar se a função global existe
                    if (typeof window.adicionarAoCarrinho === 'function') {
                        window.adicionarAoCarrinho(produtoAtual.id, quantidadeUnidades, tamanho);
                        itensAdicionados++;
                    } else {
                        console.error('Função adicionarAoCarrinho não encontrada');
                        alert('Erro ao adicionar ao carrinho. Recarregue a página.');
                    }
                }
            });

            if (itensAdicionados === 0) {
                alert('Selecione pelo menos um tamanho e quantidade!');
            }
        });
    }
}