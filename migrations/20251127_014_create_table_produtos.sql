use safework

create table produtos (
id int not null primary key,
nome varchar(255) not null,
preco int not null,
img varchar(255),
ca int not null,
marca varchar(255) not null,
tipo varchar(255) not null,
avaliacoes int not null,
descricao varchar(999) not null
);