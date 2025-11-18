const inputTelefone = document.getElementById('telefone-empresa');
const inputCNPJ = document.getElementById('CNPJ');
const inputCPF = document.getElementById('CPF');

// Máscara de Telefone
function mascararTelefone(valor) {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length <= 2) {
        return `(${numeros}`;
    } else if (numeros.length <= 6) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 10) {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else {
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }
}

if (inputTelefone) {
    inputTelefone.addEventListener('input', function(e) {
        e.target.value = mascararTelefone(e.target.value);
    });
}

// Máscara de CNPJ
function mascararCNPJ(valor) {
    const numeros = valor.replace(/\D/g, '');

    if (numeros.length <= 2) {
        return numeros;
    } else if (numeros.length <= 5) {
        return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
    } else if (numeros.length <= 8) {
        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
    } else if (numeros.length <= 12) {
        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
    } else {
        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`;
    }
}

if (inputCNPJ) {
    inputCNPJ.addEventListener('input', function(e) {
        e.target.value = mascararCNPJ(e.target.value);
    });
}

// Máscara de CPF
function mascararCPF(valor) {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length <= 3) {
        return numeros;
    } else if (numeros.length <= 6) {
        return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    } else if (numeros.length <= 9) {
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    } else {
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
    }
}

if (inputCPF) {
    inputCPF.addEventListener('input', function(e) {
        e.target.value = mascararCPF(e.target.value);
    });
}

// Validação visual dos inputs
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && this.checkValidity()) {
            this.classList.add('valid');
            this.classList.remove('invalid');
        } else if (this.value) {
            this.classList.add('invalid');
            this.classList.remove('valid');
        }
    });
});