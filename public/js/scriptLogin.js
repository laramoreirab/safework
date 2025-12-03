const form = document.getElementById('loginForm')
form.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
try{
        const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, senha}),
        credentials: "include"
});

    const data = await res.json()

    if(data.sucesso){
        //se o login der certo ele redireciona o usuário usando a url de redirecionamento do backend
        const redirectUrl = data.dados.redirectUrl || '/';
         // Redirecionar após pequeno delay
        setTimeout(() => {
             window.location.href = redirectUrl;
        }, 500);
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