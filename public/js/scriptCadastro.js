const form = document.getElementById('form_cadastro')
form.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const nome = document.getElementById('nome_cadastro').value;
    const email = document.getElementById('email_cadastro').value;
    const telefone = document.getElementById('tel_cadastro').value;
    const senha = document.getElementById('senha_cadastro').value;
    
try{
    const res = await fetch('http://localhost:3000/auth/registrar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome, email, telefone, senha })
    })

    const data = await res.json()

    if(data.sucesso){
        //se o registro der certo ele redireciona o usuário até o index
         window.location.href = '/login'
    }
    else{
        //registro falhou
        alert(data.mensagem)
    }
    } catch (error){
    console.error('Erro na requisição', error);
    alert('Erro de conexão com o servidor');
    }
})