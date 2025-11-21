document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
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
        }
        
        .no-results-message:hover {
            transform: translateY(-1dvh);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5);
        }

        .no-results-message:active {
            transform: translateY(0.5dvh);
        }
    `;
  document.head.appendChild(style);

  const searchInput = document.getElementById("search-bar");
  const productList = document.querySelector("main");
  const quantidadeProdutos = document.getElementById("quantidade-produtos");

  const allProducts = Array.from(productList.querySelectorAll("a"));

  updateProductCount(allProducts.length);

  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    let visibleCount = 0;

    allProducts.forEach((productLink) => {
      const product = productLink.querySelector(".one-produto");

      const productName = product.querySelector("h5").textContent.toLowerCase();

      if (productName.includes(searchTerm)) {
        productLink.style.display = "block";
        visibleCount++;
      } else {
        productLink.style.display = "none";
      }
    });

    updateProductCount(visibleCount);

    showNoResultsMessage(visibleCount, searchTerm);
  }

  function updateProductCount(count) {
    quantidadeProdutos.textContent = count;
  }

  function showNoResultsMessage(count, searchTerm) {
    const existingMessage = document.getElementById("no-results-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    if (count === 0 && searchTerm !== "") {
      const message = document.createElement("div");
      message.id = "no-results-message";
      message.className = "no-results-message";
      message.innerHTML = `
                <i class="fi fi-rr-search" style="font-size: 3rem; color: var(--azul-crepusculo); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--cinza-escuro); margin-bottom: 0.5rem; font-weight: 700;">
                    Nenhum produto encontrado
                </h3>
                <p style="color: var(--azul-crepusculo);">
                    Não encontramos produtos com o termo "<strong>${searchTerm}</strong>"
                </p>
            `;
      productList.appendChild(message);
    }
  }

  searchInput.addEventListener("keyup", filterProducts);

  searchInput.addEventListener("input", filterProducts);
});

// ================= SIDEBARS =================
const btnAbrir = document.getElementById("open-filtrar");
const sidebar = document.getElementById("aba-filtrar");
const ordenarSidebar = document.getElementById("aba-ordenar");
const overlay = document.getElementById("escurecer-filtrar");
const btnFechar = document.querySelector("#aba-filtrar .titulo-filtrar i");
const btnFecharOrdenar = document.querySelector("#aba-ordenar .titulo-filtrar i");
const btnAbrirOrdenar = document.querySelector(".buttons-info .one-button:first-child");

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