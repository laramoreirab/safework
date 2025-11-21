const form = document.getElementById('form_cadastro')
form.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const nomeEmpresa = document.getElementById('nome_cadastro').value
    const emailEmpresa = document.getElementById('email_cadastro').value
    const senhaEmpresa = document.getElementById('senha_cadastro').value

    const res = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
        body: JSON.stringify()
    })
})