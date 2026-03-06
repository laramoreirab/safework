create table if not exists dados_pedido(
	id int auto_increment primary key,
    pedidoId int not null,
	-- dados da página entrega
    endereco varchar(300) not null,
    cpf_representante varchar(11) not null,
    nome_representante varchar(120),
    telefone_representante varchar(11) not null,
    portaria varchar(20),
    -- dados de pagamento 
    metodo_pagamento ENUM('credito', 'pix', 'boleto') not null,
    numero_cartao varchar(19),
    nome_titular varchar(255),
    validade char(5),
    cvv char(3),
    cpf_titular varchar(11),
    
    data_criacao datetime default current_timestamp,
    
    foreign key (pedidoId) references pedidos(id) on delete cascade
);