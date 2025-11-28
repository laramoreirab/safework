use safework;

create table itens_pedidos(
	id int auto_increment primary key,
    pedido_id int not null,
    produto_id int not null, -- vem da tabela produtos
    quantidade int not null,
    data_compra datetime,
    tamanho varchar(4),
    preco_unitario decimal(10, 2),
    
    foreign key (pedido_id) references pedidos(id)
);