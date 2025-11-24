const form = document.getElementById('form_cadastro')
form.addEventListener('submit', async(e) =>{
    e.preventDefault();

    const nomeEmpresa = document.getElementById('nome_cadastro').value
    const emailEmpresa = document.getElementById('email_cadastro').value
    const telEmpresa = document.getElementById('tel_cadastro').value
    const senhaEmpresa = document.getElementById('senha_cadastro').value
    
try{
    const res = await fetch('http://localhost:3000/cadastro', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nomeEmpresa,emailEmpresa,telEmpresa,senhaEmpresa})
    })

    const data = await res.json()

    if(data.sucesso){
        //se o registro der certo ele redireciona o usuário até o index
         window.location.href = '../views/login.html'
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