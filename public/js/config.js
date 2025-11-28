// Função auxiliar para abrir modal com escurecer-filtrar
function abrirModalComEscurecer(modalId) {
  document.getElementById("escurecer-filtrar").style.display = "block";
  document.getElementById("escurecer-filtrar").style.zIndex = "999";
  new bootstrap.Modal(document.getElementById(modalId)).show();
}

// Função auxiliar para fechar modal e escurecer-filtrar
function fecharModalComEscurecer() {
  document.getElementById("escurecer-filtrar").style.display = "none";
}

// Event listeners para abrir modais (só adiciona se o elemento existe)
if (document.getElementById("openSairConta")) {
  document
    .getElementById("openSairConta")
    .addEventListener("click", function () {
      abrirModalComEscurecer("modalSairConta");
    });
}

if (document.getElementById("alterar-nome")) {
  document
    .getElementById("alterar-nome")
    .addEventListener("click", function () {
      abrirModalComEscurecer("modalAlterarNome");
    });
}

if (document.getElementById("alterar-email")) {
  document
    .getElementById("alterar-email")
    .addEventListener("click", function () {
      abrirModalComEscurecer("modalAlterarEmail");
    });
}

if (document.getElementById("alterar-numero")) {
  document
    .getElementById("alterar-numero")
    .addEventListener("click", function () {
      abrirModalComEscurecer("modalAlterarNumero");
    });
}

if (document.getElementById("alterar-cnpj")) {
  document
    .getElementById("alterar-cnpj")
    .addEventListener("click", function () {
      abrirModalComEscurecer("modalAlterarCnpj");
    });
}

// Fechar escurecer-filtrar quando modal for fechado (só adiciona se o elemento existe)
if (document.getElementById("modalSairConta")) {
  document
    .getElementById("modalSairConta")
    .addEventListener("hidden.bs.modal", fecharModalComEscurecer);
}

if (document.getElementById("modalAlterarNome")) {
  document
    .getElementById("modalAlterarNome")
    .addEventListener("hidden.bs.modal", fecharModalComEscurecer);
}

if (document.getElementById("modalAlterarEmail")) {
  document
    .getElementById("modalAlterarEmail")
    .addEventListener("hidden.bs.modal", fecharModalComEscurecer);
}

if (document.getElementById("modalAlterarNumero")) {
  document
    .getElementById("modalAlterarNumero")
    .addEventListener("hidden.bs.modal", fecharModalComEscurecer);
}

if (document.getElementById("modalAlterarCnpj")) {
  document
    .getElementById("modalAlterarCnpj")
    .addEventListener("hidden.bs.modal", fecharModalComEscurecer);
}
