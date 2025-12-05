use safework;

create table pedidos (
	id int auto_increment primary key,
    usuario_id int not null,
    total decimal(10,2),
    status ENUM('carrinho', 'aguardando_pagamento', 'pago', 'enviado', 'finalizado') default 'carrinho',
    data_criacao datetime default current_timestamp,
    
    foreign key (usuario_id) references empresas(id)
);