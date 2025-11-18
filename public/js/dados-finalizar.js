const inputTelefone = document.getElementById('telefone-empresa');
const inputCNPJ = document.getElementById('CNPJ');

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

inputTelefone.addEventListener('input', function(e) {
    e.target.value = mascararTelefone(e.target.value);
});

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

inputCNPJ.addEventListener('input', function(e) {
    e.target.value = mascararCNPJ(e.target.value);
});
