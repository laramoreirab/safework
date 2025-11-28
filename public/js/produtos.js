// document.addEventListener("DOMContentLoaded", function () {
//   const style = document.createElement("style");
//   style.textContent = `
//         .no-results-message {
//             grid-column: 1 / -1;
//             text-align: center;
//             padding: 3rem;
//             background-color: #f9f9f9;
//             border-radius: 1rem;
//             margin-top: 2rem;
//             box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//             transition: all 0.3s ease;
//             cursor: pointer;
//         }

//         .no-results-message:hover {
//             transform: translateY(-1dvh);
//             box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
//         }

//         .no-results-message:active {
//             transform: translateY(0.5dvh);
//         }
//     `;
//   document.head.appendChild(style);

//   const searchInput = document.getElementById("search-bar");
//   const productList = document.querySelector("main");
//   const quantidadeProdutos = document.getElementById("quantidade-produtos");
//   const allProducts = Array.from(productList.querySelectorAll("a"));

//   updateProductCount(allProducts.length);

//   function filterProducts() {
//     const searchTerm = searchInput.value.toLowerCase().trim();

//     let visibleCount = 0;

//     allProducts.forEach((productLink) => {
//       const product = productLink.querySelector(".one-produto");

//       const productName = product.querySelector("h5").textContent.toLowerCase();

//       if (productName.includes(searchTerm)) {
//         productLink.style.display = "block";
//         visibleCount++;
//       } else {
//         productLink.style.display = "none";
//       }
//     });

//     updateProductCount(visibleCount);

//     showNoResultsMessage(visibleCount, searchTerm);
//   }

//   function updateProductCount(count) {
//     quantidadeProdutos.textContent = count;
//   }

//   function showNoResultsMessage(count, searchTerm) {
//     const existingMessage = document.getElementById("no-results-message");
//     if (existingMessage) {
//       existingMessage.remove();
//     }

//     if (count === 0 && searchTerm !== "") {
//       const message = document.createElement("div");
//       message.id = "no-results-message";
//       message.className = "no-results-message";
//       message.innerHTML = `
//                 <i class="fi fi-rr-search" style="font-size: 3rem; color: var(--azul-crepusculo); margin-bottom: 1rem;"></i>
//                 <h3 style="color: var(--cinza-escuro); margin-bottom: 0.5rem; font-weight: 700;">
//                     Nenhum produto encontrado
//                 </h3>
//                 <p style="color: var(--azul-crepusculo);">
//                     Não encontramos produtos com o termo "<strong>${searchTerm}</strong>"
//                 </p>
//             `;
//       productList.appendChild(message);
//     }
//   }

//   searchInput.addEventListener("keyup", filterProducts);

//   searchInput.addEventListener("input", filterProducts);
// });

// ================= SIDEBARS =================
const btnAbrir = document.getElementById("open-filtrar");
const sidebar = document.getElementById("aba-filtrar");
const ordenarSidebar = document.getElementById("aba-ordenar");
const overlay = document.getElementById("escurecer-filtrar");
const btnFechar = document.querySelector("#aba-filtrar .titulo-filtrar i");
const btnFecharOrdenar = document.querySelector(
  "#aba-ordenar .titulo-filtrar i"
);
const btnAbrirOrdenar = document.querySelector(
  ".buttons-info .one-button:first-child"
);

function closeAllSidebars() {
  sidebar.classList.remove("active");
  ordenarSidebar.classList.remove("active");
  overlay.classList.remove("active");
}

// FILTRAR
btnAbrir.addEventListener("click", () => {
  // Se ordenar estiver aberto, fecha
  if (ordenarSidebar.classList.contains("active")) {
    ordenarSidebar.classList.remove("active");
  }
  // Toggle do filtrar
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

btnFechar.addEventListener("click", () => {
  closeAllSidebars();
});

// ORDENAR
if (btnAbrirOrdenar) {
  btnAbrirOrdenar.addEventListener("click", () => {
    // Se filtrar estiver aberto, fecha
    if (sidebar.classList.contains("active")) {
      sidebar.classList.remove("active");
    }
    // Toggle do ordenar
    ordenarSidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

if (btnFecharOrdenar) {
  btnFecharOrdenar.addEventListener("click", () => {
    closeAllSidebars();
  });
}

// Overlay - fecha qualquer sidebar que esteja aberto
overlay.addEventListener("click", () => {
  closeAllSidebars();
});


// ================= LISTA DE PRODUTOS =================

const container = document.getElementById("produtosDaPagina"); // cria um container no elemento html que tem ID = "produtosDaPagina", no caso, a main
container.innerHTML = ""; // limpa antes de renderizar
const categoria = ((window.location.pathname).split('/'))[2] // https://localhost:3000/produtos/variavel => retornando variavel
let url
if (categoria === 'todos') {
  url = '/api/produtos/listar'

}
if (categoria !== 'todos') {
  url = `/api/produtos/listar/${categoria}`
}
if (categoria === 'pesepernas') {
  url = `/api/produtos/listar/Pés e Pernas`
}

fetch(url) // usa a rota da api produtos para puxar a array com informação dos produtos (nome, descricao, valorUni)
  .then(res => res.json()) // transforma o valor que está vindo em um array.json
  .then(data => {
    const produtos = data.dados // cria uma variavel chamada produtos pegando os dados da array data
    const searchInput = document.getElementById("search-bar");
    renderizarProdutos() // função para puxar todos os produtos ja formatados para pagina produto
    contarProdutos()

    function contarProdutos() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const produtosFilter = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm))
      const quantidadeProd = document.getElementById('quantidade-produtos') // pega o elemento pelo ID que serve para aparecer a quantidade de items na pagina
      quantidadeProd.innerHTML = (produtosFilter.length) // faz uma contagem dos registros do filter
    }

    function renderizarProdutos() { // função para puxar todos os produtos ja formatados para pagina produto
      container.innerHTML = ''
      produtos.forEach(produto => { // percorre todos os registros do banco de dados produtos
        const bloco = document.createElement("div"); // cria um elemento div
        bloco.className = "produto"; // nome da classe do bloco é produto


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

        // cria uma div já formatada com as informações e classes para deixar estilizada na pagina de produtos
        bloco.innerHTML = ` 
            <a href='/produtos/${tipoProd}/${produto.id}'>
              <div class="one-produto">
                <img src="/uploads/imagens/${produto.img}" alt=""/>
                <h5>${produto.nome}</h5>
                <p>
                  CA: ${produto.ca} | <span id="marca-produtos">${produto.marca}</span> |
                  <span id="tipo-produtos"> ${produto.tipo}</span>
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
            </a>
            `;

        container.appendChild(bloco); // fala para adicionar a div estilizada dentro do container (no caso, adicionar essa div dentro da main)
        contarProdutos()
      })
    }

    function filtrarProduto() {

      container.innerHTML = ''

      const searchTerm = searchInput.value.toLowerCase().trim();
      const produtosFilter = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm))

      produtosFilter.forEach(produto => { // percorre todos os registros do banco de dados produtos
        const bloco = document.createElement("div"); // cria um elemento div
        bloco.className = "produto"; // nome da classe do bloco é produto


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

        // escreve o que vai ter nesse bloco
        bloco.innerHTML = ` 
            <a href='/produtos/${tipoProd}/${produto.id}'>
              <div class="one-produto">
                <img src="/uploads/imagens/${produto.img}" alt="" />
                <h5>${produto.nome}</h5>
                <p>
                  CA: ${produto.ca} | <span id="marca-produtos">${produto.marca}</span> |
                  <span id="tipo-produtos">${produto.tipo}</span>
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
            </a>
            `;


        container.appendChild(bloco); // fala para adicionar o bloco dentro do container (no caso, adicionar esse bloco dentro da main)
        contarProdutos()
      })
    }
    searchInput.addEventListener('input', contarProdutos) // atualiza o contador ao escrever na barra de tarefas
    searchInput.addEventListener('input', filtrarProduto) // atualiza as informações ao escrever na barra de pesquisa
  })
