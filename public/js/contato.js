const form = document.getElementById('form-contato') // id do formulário de contato

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    // id de cada item do formulário de contato
    const nome = document.getElementById('nome-empresa').value // pega o que está escrito em nome
    const email = document.getElementById('email-empresa').value  // pega o que está escrito em email
    const telefone = document.getElementById('telefone-empresa').value // pega o que está escrito em telefone
    const mensagem = document.getElementById('mensagem-empresa').value // pega o que está escrito em mensagem

    try {

        const response = await fetch('/api/contato', { // lista todos os contatos
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                mensagem: mensagem
            })
        })

        const data = await response.json()

        if(response.ok && data.sucesso){ // compara se a informação é verdadeira se sim
            alert('Sua mensagem foi enviada com sucesso!') // envia a mensagem de bem sucedido 
        } else { // senão
            alert(`${data.mensagem}`) // envia um alerta com o erro
        }

    } catch (err) {
        console.error('nao foi possivel enviar o formulário:', err)
    }

})
