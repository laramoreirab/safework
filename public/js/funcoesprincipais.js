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
