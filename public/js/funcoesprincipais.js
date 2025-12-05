document.addEventListener("DOMContentLoaded", function () {
  // Toggle submenu
  const toggles = document.querySelectorAll(".toggle-produtos");
  const submenu = document.querySelectorAll(".submenu");
  

  toggles.forEach(t =>{
    t.addEventListener("click", function (e) {
    e.preventDefault();
    submenu.forEach(s =>{
      s.classList.toggle("show");
    })
    console.log("Classlist mudou");
  });
  })

  // Quantidade por tamanho
  document.querySelectorAll(".linha_informacoes").forEach((linha) => {
    const diminuirBtn = linha.querySelector(".diminuir-btn");
    const aumentarBtn = linha.querySelector(".aumentar-btn");
    const quantidadeInput = linha.querySelector(".quantidade-input");

    if (diminuirBtn && aumentarBtn && quantidadeInput) {
      aumentarBtn.addEventListener("click", () => {
        let valor = parseInt(quantidadeInput.value);
        if (valor < parseInt(quantidadeInput.max)) {
          quantidadeInput.value = valor + 1;
        }
      });

      diminuirBtn.addEventListener("click", () => {
        let valor = parseInt(quantidadeInput.value);
        if (valor > parseInt(quantidadeInput.min)) {
          quantidadeInput.value = valor - 1;
        }
      });
    }
  });

  const btnOpenCarrinho = document.getElementById("open-carrinho");
  const abaCarrinho = document.getElementById("aba-carrinho");
  const btnCloseCarrinho = abaCarrinho.querySelector(".titulo-filtrar i"); // Botão de fechar do carrinho
  const overlay = document.getElementById("escurecer-filtrar");

  // Abrir a aba do carrinho
  btnOpenCarrinho.addEventListener("click", (e) => {
    e.stopPropagation();
    abaCarrinho.classList.add("active");
    overlay.classList.add("active");
  });

  // Fechar a aba do carrinho
  btnCloseCarrinho.addEventListener("click", () => {
    abaCarrinho.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Fechar ao clicar fora (incluindo overlay)
  overlay.addEventListener("click", () => {
    abaCarrinho.classList.remove("active");
    overlay.classList.remove("active");
  });

  // Impedir clique dentro da aba de fechar
  abaCarrinho.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
