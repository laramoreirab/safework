   
    // 🛒 Lista simulada de 20 produtos
    import ProdutoController from '../controllers/produtoController.js'

    const produtos = [
  {
    id: 1,
    titulo: "Camiseta Básica",
    descricao: "Camiseta 100% algodão, confortável para o dia a dia.",
    imagem: "https://via.placeholder.com/150?text=Camiseta",
    preco: 49.90
  }]

    const limitePorPagina = 10; // Quantos produtos por página
    const totalPaginas = Math.ceil(produtos.length / limitePorPagina);

    // Função que retorna os produtos de uma página específica
    function getProdutosPorPagina(pagina) {
      const inicio = (pagina - 1) * limitePorPagina;
      const fim = inicio + limitePorPagina;
      return produtos.slice(inicio, fim);
    }

    // Função para renderizar os produtos na tela
    function renderPagina(pagina) {
      const container = document.getElementById("produtosDaPagina");
      container.innerHTML = ""; // limpa antes de renderizar

      const produtosPagina = getProdutosPorPagina(pagina);

      produtosPagina.forEach(produto => {
        const bloco = document.createElement("div");
        bloco.className = "produto";
        bloco.innerHTML = `
        <a href="">
          <div class="one-produto">
            <img src="/img/abafador.svg" alt="" />
            <h5>${produto.titulo}</h5>
            <p>
              CA: 54389 | <span id="marca-produtos">3M</span> |
              <span id="tipo-produtos">Proteção da Cabeça</span>
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
        </a>
        `;
        
        container.appendChild(bloco);
      });
    }

    // Função para criar os botões de paginação
    function criarPaginacao() {
      const paginacao = document.getElementById("paginacao");
      paginacao.innerHTML = '';

      for (let i = 1; i <= totalPaginas; i++) {
        const botao = document.createElement("button");
        botao.textContent = `Página ${i}`;
        botao.addEventListener("click", () => renderPagina(i));
        paginacao.appendChild(botao);
      }
    }

    // Inicializa a página
    criarPaginacao();
    renderPagina(1); // mostra a primeira página ao carregar