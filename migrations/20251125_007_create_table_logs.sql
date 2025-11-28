use safework;

create table if not exists logs (
	id int primary key auto_increment,
    rota varchar(255) not null,
    metodo varchar(10) not null,
    ip_address varchar(100),
    user_agent varchar(100),
    dados_requisicao varchar(100),
    tempo_resposta_ms int,
    usuario_id int,
    status_code int,
    dados_resposta varchar(100)
);
