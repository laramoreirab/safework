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

// Fechar modal de sair da conta ao clicar em "Não"
if (document.getElementById("nao-sair")) {
  document.getElementById("nao-sair").addEventListener("click", function () {
    const modalSairConta = bootstrap.Modal.getInstance(
      document.getElementById("modalSairConta")
    );
    modalSairConta.hide();
  });
}

// Fechar modal de alterar nome ao clicar em "Cancelar" ou no botão "X"
const modalAlterarNome = document.getElementById("modalAlterarNome");
if (modalAlterarNome) {
  const cancelarButton = modalAlterarNome.querySelector(
    ".buttons-modal button:first-child"
  );
  const fecharButton = modalAlterarNome.querySelector(".tirar-transparent");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarNome);
      modalInstance.hide();
    });
  }

  if (fecharButton) {
    fecharButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarNome);
      modalInstance.hide();
    });
  }
}

// Fechar modal de alterar email ao clicar em "Cancelar" ou no botão "X"
const modalAlterarEmail = document.getElementById("modalAlterarEmail");
if (modalAlterarEmail) {
  const cancelarButton = modalAlterarEmail.querySelector(
    ".buttons-modal button:first-child"
  );
  const fecharButton = modalAlterarEmail.querySelector(".tirar-transparent");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarEmail);
      modalInstance.hide();
    });
  }

  if (fecharButton) {
    fecharButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarEmail);
      modalInstance.hide();
    });
  }
}

// Fechar modal de alterar número ao clicar em "Cancelar" ou no botão "X"
const modalAlterarNumero = document.getElementById("modalAlterarNumero");
if (modalAlterarNumero) {
  const cancelarButton = modalAlterarNumero.querySelector(
    ".buttons-modal button:first-child"
  );
  const fecharButton = modalAlterarNumero.querySelector(".tirar-transparent");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarNumero);
      modalInstance.hide();
    });
  }

  if (fecharButton) {
    fecharButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarNumero);
      modalInstance.hide();
    });
  }
}

// Fechar modal de alterar CNPJ ao clicar em "Cancelar" ou no botão "X"
const modalAlterarCnpj = document.getElementById("modalAlterarCnpj");
if (modalAlterarCnpj) {
  const cancelarButton = modalAlterarCnpj.querySelector(
    ".buttons-modal button:first-child"
  );
  const fecharButton = modalAlterarCnpj.querySelector(".tirar-transparent");

  if (cancelarButton) {
    cancelarButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarCnpj);
      modalInstance.hide();
    });
  }

  if (fecharButton) {
    fecharButton.addEventListener("click", () => {
      const modalInstance = bootstrap.Modal.getInstance(modalAlterarCnpj);
      modalInstance.hide();
    });
  }
}

// Fechar modal ao clicar no botão "Cancelar" ou no botão "X" (fechar)
function adicionarEventosFecharModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const cancelarButton = modalElement.querySelector(".btn-secondary");
    const fecharButton = modalElement.querySelector(".btn-close");

    if (cancelarButton) {
      cancelarButton.addEventListener("click", () => {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      });
    }

    if (fecharButton) {
      fecharButton.addEventListener("click", () => {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      });
    }
  }
}

// Adiciona eventos para os modais de alteração
adicionarEventosFecharModal("modalAlterarEmail");
adicionarEventosFecharModal("modalAlterarNumero");
adicionarEventosFecharModal("modalAlterarCnpj");
