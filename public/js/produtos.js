const style = document.createElement("style"); // estilização da mensagem (nenhum produto encontrado)
style.textContent = `
        .no-results-message {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            background-color: #f9f9f9;
            border-radius: 1rem;
            margin-top: 2rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            transform: translateY(1dvh);
            transition: all 0.5s ease;
        }

        .no-results-message.show {
            opacity: 1;
            transform: scale(1.0);
        }

        .no-results-message:hover {
            transform: translateY(-1dvh);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
        }

        .produto { 
          transform: scale(0.95);
          transition: all .8s ease;
        }

        .produto.show {
          transform: scale(1.0);
          opacity: 1;
        }
    `;
document.head.appendChild(style); // criando um style no head


// ================= SIDEBARS =================
const btnAbrir = document.getElementById("open-filtrar");
const sidebar = document.getElementById("aba-filtrar");
const ordenarSidebar = document.getElementById("aba-ordenar");
const overlay = document.getElementById("escurecer-filtrar");
const btnFechar = document.querySelector("#aba-filtrar .titulo-filtrar i");
const limparFiltros = document.getElementById("limpar-filtro");
const btnConfirmarFiltro = document.getElementById("filtrar");
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
container.querySelectorAll('.produto').forEach(el => el.remove()) // limpa antes de renderizar
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

    

    limparFiltros.addEventListener("click", function () {

      // Desmarcar os filtros
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });

      tiposSelecionados = [];

      // Restaurar produtos
      produtosFiltrados = produtos;

      renderizarProdutos(produtosFiltrados);

    });

    btnConfirmarFiltro.addEventListener("click", () => {
      aplicarFiltros();
      closeAllSidebars();
    });

    function aplicarFiltros() {

      let produtosFiltrados = [...produtos];

      // Tipo
      const tiposSelecionados = [];

      if (document.getElementById("checkbox-facial").checked) tiposSelecionados.push("Facial"); /* adiciona a Array dos selecionados */
      if (document.getElementById("checkbox-olhos").checked) tiposSelecionados.push("Ocular");
      if (document.getElementById("checkbox-corpo").checked) tiposSelecionados.push("Corporal");
      if (document.getElementById("checkbox-respiratoria").checked) tiposSelecionados.push("Respiratório");
      if (document.getElementById("checkbox-auditiva").checked) tiposSelecionados.push("Auditivo");
      if (document.getElementById("checkbox-maos").checked) tiposSelecionados.push("Manual");
      if (document.getElementById("checkbox-pes").checked) tiposSelecionados.push("Pés e Pernas");
      if (document.getElementById("checkbox-cabeca").checked) tiposSelecionados.push("Cabeça");

      if (tiposSelecionados.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(prod =>
          tiposSelecionados.includes(prod.tipo)
        );
      }

      // Marca
      const marcasSelecionadas = [];

      if (document.getElementById("checkbox-3m").checked) marcasSelecionadas.push("3M");
      if (document.getElementById("checkbox-montana").checked) marcasSelecionadas.push("Montana");
      if (document.getElementById("checkbox-softworks").checked) marcasSelecionadas.push("Soft Works");
      if (document.getElementById("checkbox-volk").checked) marcasSelecionadas.push("Volk");
      if (document.getElementById("checkbox-apaseg").checked) marcasSelecionadas.push("APASEG");

      if (marcasSelecionadas.length > 0) {
        produtosFiltrados = produtosFiltrados.filter(prod =>
          marcasSelecionadas.includes(prod.marca)
        );
      }

      // Preço
      if (document.getElementById("checkbox-preco-200-249").checked) {
        produtosFiltrados = produtosFiltrados.filter(prod => prod.preco >= 200 && prod.preco <= 249.99);
      }

      if (document.getElementById("checkbox-preco-250-299").checked) {
        produtosFiltrados = produtosFiltrados.filter(prod => prod.preco >= 250 && prod.preco <= 299.99);
      }

      if (document.getElementById("checkbox-preco-300-349").checked) {
        produtosFiltrados = produtosFiltrados.filter(prod => prod.preco >= 300 && prod.preco <= 349.99);
      }

      if (document.getElementById("checkbox-preco-350-400").checked) {
        produtosFiltrados = produtosFiltrados.filter(prod => prod.preco >= 350 && prod.preco <= 400);
      }

      renderizarListaFiltrada(produtosFiltrados);

    }

    function renderizarListaFiltrada(lista) {
      container.querySelectorAll('.produto').forEach(el => el.remove());

      lista.forEach(produto => {
        const bloco = document.createElement("div");
        bloco.className = "produto";

        bloco.innerHTML = `
        <a href='/produtos/${produto.tipo}/${produto.id}'>
          <div class="one-produto">
            <img src="/uploads/imagens/${produto.img}" alt="" />
            <h5>${produto.nome}</h5>
            <p>
              CA: ${produto.ca} | 
              <span>${produto.marca}</span> |
              <span>${produto.tipo}</span>
            </p>
            <h4>R$${produto.preco}</h4>
          </div>
        </a>
    `;

        container.appendChild(bloco);
        setTimeout(() => bloco.classList.add("show"), 10);
      });

      document.getElementById("quantidade-produtos").innerText = lista.length;
    }

    const produtos = data.dados // cria uma variavel chamada produtos pegando os dados da array data
    const searchInput = document.getElementById("search-bar");
    renderizarProdutos() // função para puxar todos os produtos ja formatados para pagina produto
    contarProdutos()

    function contarProdutos() {
      const searchTerm = searchInput.value.toLowerCase().trim(); // pega o valor que esta sendo escrito na barra de pesquisa e formata para comparação
      const produtosFilter = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm)) // filtra produtos por nome
      const quantidadeProd = document.getElementById('quantidade-produtos') // pega o elemento pelo ID que serve para aparecer a quantidade de items na pagina
      quantidadeProd.innerHTML = (produtosFilter.length) // faz uma contagem dos registros do filter

      if (produtosFilter.length === 0) { // caso o contador estiver em zero ele cria uma mensagem de nenhum produto encontrado
        const oldMessage = document.getElementById('no-results-message')
        if (oldMessage) { // se existir uma mensagem de aviso, exclua 
          oldMessage.remove()
        }
        const message = document.createElement("div"); // criando a mensagem de aviso
        message.id = "no-results-message";
        message.className = "no-results-message";
        message.innerHTML = `
                <i class="fi fi-rr-search" style="font-size: 3rem; color: var(--azul-crepusculo); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--cinza-escuro); margin-bottom: 0.5rem; font-weight: 700;">
                    Nenhum produto encontrado
                </h3>
                <p style="color: var(--azul-crepusculo);">
                    Não encontramos produtos com o termo "<strong>${searchInput.value}</strong>"
                </p>
            `;
        container.appendChild(message); // adiciona a mensagem dentro do container

        setTimeout(() => {
          message.classList.add("show");
        }, 10);

      }

      if (produtosFilter.length > 0) {
        container.querySelectorAll('.no-results-message').forEach(el => el.remove())
      }
    }

    function renderizarProdutos() { // função para puxar todos os produtos ja formatados para pagina produto
      container.querySelectorAll('.produto').forEach(el => el.remove()) // limpa antes de renderizar
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
        setTimeout(() => {
          bloco.classList.add("show");
        }, 10);
      })
    }

    function filtrarProduto() {

      container.querySelectorAll('.produto').forEach(el => el.remove()) // apagar os produtos do container

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
        setTimeout(() => {
          bloco.classList.add("show");
        }, 10);
      })
    }
    searchInput.addEventListener('input', contarProdutos) // atualiza o contador ao escrever na barra de tarefas
    searchInput.addEventListener('input', filtrarProduto) // atualiza as informações ao escrever na barra de pesquisa
  })
