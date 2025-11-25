document.addEventListener("DOMContentLoaded", function () {
  // Toggle submenu
  const toggle = document.querySelector(".toggle-produtos");
  const submenu = document.querySelector(".submenu");

  if (toggle && submenu) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      submenu.classList.toggle("show");
    });
  }

  // Quantidade por tamanho
  document.querySelectorAll('.linha_informacoes').forEach((linha) => {
    const diminuirBtn = linha.querySelector('.diminuir-btn');
    const aumentarBtn = linha.querySelector('.aumentar-btn');
    const quantidadeInput = linha.querySelector('.quantidade-input');

    if (diminuirBtn && aumentarBtn && quantidadeInput) {
      aumentarBtn.addEventListener('click', () => {
        let valor = parseInt(quantidadeInput.value);
        if (valor < parseInt(quantidadeInput.max)) {
          quantidadeInput.value = valor + 1;
        }
      });

      diminuirBtn.addEventListener('click', () => {
        let valor = parseInt(quantidadeInput.value);
        if (valor > parseInt(quantidadeInput.min)) {
          quantidadeInput.value = valor - 1;
        }
      });
    }
  });
});

const btnOpen = document.getElementById("open-carrinho");
const aba = document.getElementById("aba-carrinho");
const btnClose = document.getElementById("btnFechar-filtrar");
const overlay = document.getElementById("escurecer-filtrar");

// Abrir a aba + overlay
btnOpen.addEventListener("click", (e) => {
    e.stopPropagation();
    aba.classList.add("active");
    overlay.classList.add("active");
});

// Fechar ao clicar no X
btnClose.addEventListener("click", () => {
    aba.classList.remove("active");
    overlay.classList.remove("active");
});

// Fechar ao clicar fora (incluindo overlay)
document.addEventListener("click", (e) => {
    const clicouFora =
        !aba.contains(e.target) &&
        !btnOpen.contains(e.target);

    if (clicouFora) {
        aba.classList.remove("active");
        overlay.classList.remove("active");
    }
});

// Clicar no overlay fecha
overlay.addEventListener("click", () => {
    aba.classList.remove("active");
    overlay.classList.remove("active");
});

// Impedir clique dentro da aba de fechar
aba.addEventListener("click", (e) => {
    e.stopPropagation();
});
