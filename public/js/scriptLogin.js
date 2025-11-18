const form = document.getElementById('loginForm')
form.addEventListener('submit', async(e) => {
    e.preventDefault();


    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
try{
    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha}),
        credentials: "include" //autorizando o envio/recebimento de cookies
    })

    const data = await res.json()

    if(data.sucesso){
        //se o login der certo ele redireciona o usuário até o index
         window.location.href = '../views/index.html'
    }
    else{
        //login falhou
        alert(data.mensagem)
    }
} catch (error){
    console.error('Erro na requisição', error);
    alert('Erro de conexão com o servidor');
}
})